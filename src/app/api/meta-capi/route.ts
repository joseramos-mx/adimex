import { NextRequest, NextResponse } from "next/server"
import { META_PIXEL_ID, hashSha256 } from "@/lib/meta-pixel"
import { META_ATTR_PREFIX } from "@/lib/attribution-attrs"

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
  shipping_address?: {
    first_name?: string
    last_name?: string
    city?: string
    zip?: string
    country_code?: string
  }
  /**
   * Atributos que set-eamos en cart.attributes desde el navegador o el
   * server (round-4 p3). Shopify los expone como `note_attributes` en
   * el webhook orders/create.
   */
  note_attributes?: { name: string; value: string }[]
}

/**
 * event_id = order.id (numérico, sin prefijo). Formato que usa la app de
 * Meta en Shopify por defecto — así los dos Purchases (browser vía app y
 * server vía webhook) se deduplican.
 */
function eventIdFromOrder(order: ShopifyOrder): string {
  return String(order.id)
}

/**
 * Normalización de campos advanced-matching per Meta spec:
 *   em, fn, ln, ct → lowercase + trim
 *   zp             → lowercase + trim (Meta acepta el CP tal cual)
 *   ph             → sólo dígitos (con código de país, sin +)
 *   country        → 2 letras ISO en minúsculas
 * Cualquier campo vacío se omite (nunca hashear string vacío).
 */
function normalizePhone(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/[^\d]/g, "")
  // Shopify a veces manda "521..." (LADA MX), otras "52...". Meta acepta
  // ambos con tal de que empiece por código de país.
  return digits
}

function attrValue(order: ShopifyOrder, key: string): string | undefined {
  const rec = order.note_attributes?.find((a) => a.name === key)
  return rec?.value?.trim() || undefined
}

async function buildUserData(order: ShopifyOrder) {
  const ud: Record<string, string | string[]> = {}

  const email = (order.customer?.email ?? order.email ?? "").trim()
  if (email) ud.em = [await hashSha256(email)]

  const phone = normalizePhone(order.customer?.phone ?? order.phone)
  if (phone) ud.ph = [await hashSha256(phone)]

  const firstName = (order.customer?.first_name ?? order.shipping_address?.first_name ?? "").trim()
  if (firstName) ud.fn = [await hashSha256(firstName)]

  const lastName = (order.customer?.last_name ?? order.shipping_address?.last_name ?? "").trim()
  if (lastName) ud.ln = [await hashSha256(lastName)]

  const city = (order.shipping_address?.city ?? "").trim()
  if (city) ud.ct = [await hashSha256(city)]

  const zip = (order.shipping_address?.zip ?? "").trim()
  if (zip) ud.zp = [await hashSha256(zip)]

  const country = (order.shipping_address?.country_code ?? "").trim()
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
  const userData = await buildUserData(order)
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
    ...(process.env.META_CAPI_TEST_CODE
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
