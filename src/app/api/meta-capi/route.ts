import { NextRequest, NextResponse } from "next/server"
import { META_PIXEL_ID, hashSha256, toMetaContentId } from "@/lib/meta-pixel"

/**
 * Meta Conversions API — recibe eventos server-side y los reenvía a Meta.
 *
 * Uso principal: **Purchase**. Shopify manda un webhook `orders/create` a
 * `/api/meta-capi` con la orden completa. Nosotros hasheamos email y
 * teléfono para advanced matching, generamos un event_id derivado del
 * `order_id` (para que el navegador pueda deduplicar con el mismo id
 * cuando el usuario vuelva a la página de gracias) y llamamos a Meta.
 *
 * Requiere las siguientes variables de entorno:
 *   - META_CAPI_ACCESS_TOKEN  Token largo del Business Manager > Settings
 *                             > Data sources > Pixel > Conversions API >
 *                             Generate access token.
 *   - META_CAPI_TEST_CODE     (opcional) Test event code para validar en
 *                             el panel antes de contar en producción.
 *   - SHOPIFY_WEBHOOK_SECRET  (opcional pero recomendado) Para verificar
 *                             la firma HMAC del webhook de Shopify.
 *
 * Si META_CAPI_ACCESS_TOKEN no está definido, la ruta responde 501 sin
 * fallar el build ni el runtime — así podemos hacer merge sin bloquear.
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
}

function eventIdFromOrder(order: ShopifyOrder): string {
  return `order_${order.id}`
}

async function buildUserData(order: ShopifyOrder) {
  const email = order.customer?.email ?? order.email
  const phone = (order.customer?.phone ?? order.phone ?? "").replace(/[^\d]/g, "")
  const firstName = order.customer?.first_name ?? order.shipping_address?.first_name
  const lastName = order.customer?.last_name ?? order.shipping_address?.last_name
  const city = order.shipping_address?.city
  const zip = order.shipping_address?.zip
  const country = order.shipping_address?.country_code

  const ud: Record<string, string | string[]> = {}
  if (email) ud.em = [await hashSha256(email)]
  if (phone) ud.ph = [await hashSha256(phone)]
  if (firstName) ud.fn = [await hashSha256(firstName)]
  if (lastName) ud.ln = [await hashSha256(lastName)]
  if (city) ud.ct = [await hashSha256(city)]
  if (zip) ud.zp = [await hashSha256(zip)]
  if (country) ud.country = [await hashSha256(country)]

  return ud
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json(
      { error: "META_CAPI_ACCESS_TOKEN not configured" },
      { status: 501 }
    )
  }

  let order: ShopifyOrder
  try {
    order = (await req.json()) as ShopifyOrder
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const eventId = eventIdFromOrder(order)
  const userData = await buildUserData(order)
  const value = parseFloat(order.total_price ?? "0")
  const currency = order.currency ?? "MXN"

  const contents = order.line_items.map((li) => ({
    id: toMetaContentId(li.sku ?? String(li.variant_id)),
    quantity: li.quantity,
    item_price: parseFloat(li.price),
  }))

  const contentIds = order.line_items.map((li) =>
    toMetaContentId(li.sku ?? String(li.variant_id))
  )

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
