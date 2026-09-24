import { NextRequest, NextResponse } from "next/server"
import { META_PIXEL_ID, hashSha256 } from "@/lib/meta-pixel"
import { META_ATTR_PREFIX } from "@/lib/attribution-attrs"
import { SEND_ORDER_PII_WITHOUT_CONSENT } from "@/lib/consent-mode"
import { shouldSendCapi, forceTestEventCode } from "@/lib/env-gating"
import {
  normalizeCity,
  normalizeCountry,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  normalizeZip,
} from "@/lib/meta-user-data"

/**
 * Meta Conversions API — recibe webhooks `orders/create` de Shopify y
 * reenvía el evento **Purchase** a Meta con `event_id = order.id`.
 *
 * Dedup con la app de Meta en Shopify: la app envía Purchase con el mismo
 * order_id como event_id. Meta deduplica por (pixel_id, event_id).
 *
 * Requiere:
 *   - META_CAPI_ACCESS_TOKEN   Token largo de Events Manager
 *   - SHOPIFY_WEBHOOK_SECRET   Secret HMAC del webhook orders/create
 *                              (OBLIGATORIO — sin él respondemos 501; con
 *                              él verificamos la firma o respondemos 401).
 *   - META_CAPI_TEST_CODE      (opcional) Test event code para validar.
 */

type ShopifyLineItem = {
  variant_id: number | string
  product_id: number | string
  sku?: string
  title?: string
  quantity: number
  price: string
}

type ShopifyAddress = {
  first_name?: string
  last_name?: string
  phone?: string
  city?: string
  zip?: string
  country_code?: string
}

type ShopifyOrder = {
  id: number | string
  name?: string
  email?: string
  phone?: string
  currency?: string
  total_price?: string
  line_items: ShopifyLineItem[]
  customer?: {
    email?: string
    phone?: string
    first_name?: string
    last_name?: string
  }
  shipping_address?: ShopifyAddress
  billing_address?: ShopifyAddress
  /**
   * Atributos que set-eamos en cart.attributes desde el navegador o el
   * server (round-4 p3). Shopify los expone como `note_attributes` en
   * el webhook orders/create.
   */
  note_attributes?: { name: string; value: string }[]
}

/**
 * Devuelve el primer valor no-vacío (tras trim) de la cadena de fallbacks.
 * Corta el "todos undefined" del típico `a?.b ?? c?.d ?? ...` cuando lo
 * queremos con más de dos niveles.
 */
function firstNonEmpty(...values: (string | undefined | null)[]): string | undefined {
  for (const v of values) {
    if (v == null) continue
    const t = String(v).trim()
    if (t) return t
  }
  return undefined
}

/**
 * event_id = order.id (numérico, sin prefijo). Formato que usa la app de
 * Meta en Shopify por defecto — así los dos Purchases (browser vía app y
 * server vía webhook) se deduplican.
 */
function eventIdFromOrder(order: ShopifyOrder): string {
  return String(order.id)
}

function attrValue(order: ShopifyOrder, key: string): string | undefined {
  const rec = order.note_attributes?.find((a) => a.name === key)
  return rec?.value?.trim() || undefined
}

/**
 * Mínimo user_data para pedidos SIN consent marketing. Meta CAPI rechaza
 * un evento con user_data vacío (error 400 subcode 2804050). Enviamos
 * sólo campos que no son PII de matching cross-eventos:
 *   - external_id (hash del order.id): identificador único de este pedido,
 *     no sirve como llave de matching persistente porque cambia por orden.
 *   - country: geografía agregada, no personal.
 * Si el pedido no trae shipping/billing (raro), sólo va external_id.
 */
async function buildMinimalUserData(order: ShopifyOrder) {
  const ud: Record<string, string | string[]> = {
    external_id: [await hashSha256(String(order.id))],
  }
  const country = normalizeCountry(
    firstNonEmpty(
      order.shipping_address?.country_code,
      order.billing_address?.country_code,
    ),
  )
  if (country) ud.country = [await hashSha256(country)]
  return ud
}

/**
 * user_data para Meta CAPI. Normaliza cada campo según la spec de Meta
 * (`@/lib/meta-user-data`), skip si vacío tras normalización.
 *
 * Fallback chains (round-6 p4):
 *   phone → order.phone → shipping.phone → billing.phone → customer.phone
 *   name  → shipping → billing
 *   city  → shipping → billing
 * (Un pedido puede llegar sin customer expandido si el checkout fue guest,
 *  o sin shipping si es un producto digital. Cubrimos ambos casos.)
 * fbp/fbc/UA/IP se pasan en CLARO (Meta no los hashea).
 */
async function buildUserData(order: ShopifyOrder) {
  const ud: Record<string, string | string[]> = {}

  const email = normalizeEmail(order.customer?.email ?? order.email)
  if (email) ud.em = [await hashSha256(email)]

  const phoneRaw = firstNonEmpty(
    order.phone,
    order.shipping_address?.phone,
    order.billing_address?.phone,
    order.customer?.phone,
  )
  const phone = normalizePhone(phoneRaw)
  if (phone) ud.ph = [await hashSha256(phone)]

  const firstName = normalizeName(
    firstNonEmpty(
      order.shipping_address?.first_name,
      order.billing_address?.first_name,
    ),
  )
  if (firstName) ud.fn = [await hashSha256(firstName)]

  const lastName = normalizeName(
    firstNonEmpty(
      order.shipping_address?.last_name,
      order.billing_address?.last_name,
    ),
  )
  if (lastName) ud.ln = [await hashSha256(lastName)]

  const city = normalizeCity(
    firstNonEmpty(order.shipping_address?.city, order.billing_address?.city),
  )
  if (city) ud.ct = [await hashSha256(city)]

  const zip = normalizeZip(
    firstNonEmpty(order.shipping_address?.zip, order.billing_address?.zip),
  )
  if (zip) ud.zp = [await hashSha256(zip)]

  const country = normalizeCountry(
    firstNonEmpty(
      order.shipping_address?.country_code,
      order.billing_address?.country_code,
    ),
  )
  if (country) ud.country = [await hashSha256(country)]

  // Datos de matching de sesión guardados como cart attributes (round-4 p3).
  // Estos NO se hashean — Meta los espera en claro.
  const fbp = attrValue(order, `${META_ATTR_PREFIX}fbp`)
  if (fbp) ud.fbp = fbp
  const fbc = attrValue(order, `${META_ATTR_PREFIX}fbc`)
  if (fbc) ud.fbc = fbc
  const ua = attrValue(order, `${META_ATTR_PREFIX}user_agent`)
  if (ua) ud.client_user_agent = ua
  const ip = attrValue(order, `${META_ATTR_PREFIX}client_ip_address`)
  if (ip) ud.client_ip_address = ip

  return ud
}

/**
 * Verifica la firma HMAC-SHA256 del webhook de Shopify.
 * Devuelve true sólo si el header coincide con el body firmado con el secret.
 * Comparación en tiempo constante para evitar timing attacks.
 */
async function verifyShopifyHmac(
  rawBody: string,
  headerHmac: string | null,
  secret: string,
): Promise<boolean> {
  if (!headerHmac) return false
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    )
    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(rawBody),
    )
    const expected = btoa(String.fromCharCode(...new Uint8Array(sig)))

    if (expected.length !== headerHmac.length) return false
    let diff = 0
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ headerHmac.charCodeAt(i)
    }
    return diff === 0
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET

  if (!accessToken || !webhookSecret) {
    return NextResponse.json(
      { error: "meta-capi not configured (missing token or webhook secret)" },
      { status: 501 },
    )
  }

  // Lee el body como string para poder verificar HMAC antes de parsear.
  const rawBody = await req.text()
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256")
  const validSignature = await verifyShopifyHmac(rawBody, hmacHeader, webhookSecret)
  if (!validSignature) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 })
  }

  let order: ShopifyOrder
  try {
    order = JSON.parse(rawBody) as ShopifyOrder
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const eventId = eventIdFromOrder(order)

  // Consent gating (round-5 p3): sólo adjuntamos user_data con PII si
  // (a) el pedido lleva meta_consent=true en note_attributes, o
  // (b) el sitio permite explícitamente enviar PII sin consent
  //     (SEND_ORDER_PII_WITHOUT_CONSENT=true — decisión legal, no default).
  const consentAttr = attrValue(order, `${META_ATTR_PREFIX}consent`)
  const hasMarketingConsent = consentAttr === "true"
  const includePii = SEND_ORDER_PII_WITHOUT_CONSENT || hasMarketingConsent

  // Hotfix: Meta CAPI exige al menos UN parámetro en user_data — si va
  // vacío devuelve error 400 "No agregaste suficientes datos" (subcode
  // 2804050). Cuando no hay consent para PII, adjuntamos el mínimo no-PII
  // que Meta acepta:
  //   - external_id (hash del order.id): identificador de pedido, no
  //     persistente cross-customer, no viola opt-out.
  //   - country: geografía agregada, no PII.
  const userData = includePii
    ? await buildUserData(order)
    : await buildMinimalUserData(order)
  if (!includePii) {
    console.info(
      "[meta-capi] Purchase sin PII — meta_consent no era true",
      { order_id: order.id, meta_consent: consentAttr ?? "(missing)" },
    )
  }

  // Shopify total_price incluye impuestos + envío por defecto en tiendas
  // configuradas para "incluir impuestos" (nuestro caso: precio con IVA).
  // Currency siempre MXN para consistencia con el pixel del navegador.
  const value = parseFloat(order.total_price ?? "0")
  const currency = "MXN"

  // Alerta suave: un value < 100 MXN sugiere que la tienda quedó configurada
  // en modo "los precios NO incluyen impuestos" o que Shopify mandó el monto
  // en USD. No bloqueamos el envío — Meta acepta el evento; nosotros dejamos
  // huella en logs para poder auditar en Vercel Logs.
  if (value < 100) {
    console.warn(
      "[meta-capi] Purchase value sospechosamente bajo",
      { order_id: order.id, value, currency, total_price: order.total_price },
    )
  }

  // content_ids = variant_id de Shopify (numérico), mismo valor que emite
  // el pixel del navegador vía `extractShopifyNumericId(product.variantId)`.
  const contents = order.line_items.map((li) => ({
    id: String(li.variant_id),
    quantity: li.quantity,
    item_price: parseFloat(li.price),
  }))

  const contentIds = order.line_items.map((li) => String(li.variant_id))

  // Gate por entorno (round-5 p4): preview no debe enviar a producción de
  // Meta salvo que el operador haya definido explícitamente un test code.
  if (!shouldSendCapi()) {
    console.info("[meta-capi] preview/dev sin META_CAPI_TEST_CODE — Purchase no reenviado", {
      order_id: order.id,
    })
    return NextResponse.json({ ok: true, skipped: "non-prod without test code" })
  }

  const useTestCode = forceTestEventCode() || Boolean(process.env.META_CAPI_TEST_CODE)

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: "https://adimex.io/",
        user_data: userData,
        custom_data: {
          currency,
          value,
          content_ids: contentIds,
          content_type: "product",
          contents,
          num_items: order.line_items.reduce((n, i) => n + i.quantity, 0),
          order_id: String(order.id),
        },
      },
    ],
    ...(useTestCode && process.env.META_CAPI_TEST_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_CODE }
      : {}),
  }

  const url = `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${accessToken}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const body = await res.json()
    if (!res.ok) {
      console.error("[meta-capi] error", res.status, body)
      return NextResponse.json(
        { ok: false, meta: body },
        { status: res.status }
      )
    }
    return NextResponse.json({ ok: true, meta: body })
  } catch (err) {
    console.error("[meta-capi] fetch failed", err)
    return NextResponse.json(
      { ok: false, error: "fetch failed" },
      { status: 500 }
    )
  }
}
