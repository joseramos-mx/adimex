import { shopifyClient } from "@/lib/shopify"
import { NextRequest, NextResponse } from "next/server"
import {
  META_ATTR_PREFIX,
  mergeCartAttrs,
  sanitizeCartAttrs,
  type CartAttribute,
} from "@/lib/attribution-attrs"

/**
 * PATCH /api/cart/attributes  — body: { cartId, attributes }
 *
 * Reemplaza el set completo de atributos del carrito, pero primero hace un
 * MERGE con los que ya existen. Los UTM originales de la sesión NO se pierden
 * si el cliente sólo manda fbp/fbc/consent.
 *
 * Se usa desde el cliente en dos momentos (round-5 p1):
 *   1. Cuando el usuario acepta marketing en el banner — para adjuntar
 *      fbp/fbc/user_agent al carrito que ya existía.
 *   2. Justo antes de redirigir al checkout de Shopify — para refrescar
 *      cualquier atributo que haya cambiado durante la sesión.
 *
 * El servidor también añade `meta_client_ip_address` si hay consent
 * marketing, igual que en cartCreate.
 */

const CART_ATTRIBUTES_QUERY = `
  query cartAttrs($cartId: ID!) @inContext(country: MX, language: ES) {
    cart(id: $cartId) {
      id
      attributes { key value }
    }
  }
`

const CART_ATTRIBUTES_UPDATE = `
  mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) @inContext(country: MX, language: ES) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        attributes { key value }
      }
      userErrors { field message }
    }
  }
`

function clientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]!.trim()
  return req.headers.get("x-real-ip") ?? undefined
}

function marketingConsentFromCookie(req: NextRequest): boolean {
  const raw = req.cookies.get("adimex_consent")?.value
  if (!raw) return false
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { marketing?: boolean }
    return Boolean(parsed.marketing)
  } catch {
    return false
  }
}

const noClient = () =>
  NextResponse.json({ error: "Shopify no configurado" }, { status: 503 })

export async function PATCH(req: NextRequest) {
  if (!shopifyClient) return noClient()

  const { cartId, attributes: rawAttrs } = (await req.json()) as {
    cartId?: string
    attributes?: unknown
  }
  if (!cartId) {
    return NextResponse.json({ error: "cartId required" }, { status: 400 })
  }

  const marketing = marketingConsentFromCookie(req)
  const incoming = sanitizeCartAttrs(rawAttrs, marketing)
  if (marketing) {
    const ip = clientIp(req)
    if (ip) incoming.push({ key: `${META_ATTR_PREFIX}client_ip_address`, value: ip })
  }

  // Fetch de los atributos actuales para no perder los originales.
  const { data: currentData } = await shopifyClient.request(CART_ATTRIBUTES_QUERY, {
    variables: { cartId },
  })
  if (!currentData?.cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 })
  }
  const existing: CartAttribute[] = (currentData.cart.attributes ?? []).map(
    (a: { key: string; value: string }) => ({ key: a.key, value: a.value }),
  )

  const merged = mergeCartAttrs(existing, incoming)

  const { data, errors } = await shopifyClient.request(CART_ATTRIBUTES_UPDATE, {
    variables: { cartId, attributes: merged },
  })
  if (errors || !data?.cartAttributesUpdate?.cart) {
    return NextResponse.json(
      { error: "No se pudieron actualizar los atributos" },
      { status: 500 },
    )
  }
  const userErrors = data.cartAttributesUpdate.userErrors ?? []
  if (userErrors.length > 0) {
    console.warn("[cart/attributes] userErrors", userErrors)
  }
  return NextResponse.json({
    id: data.cartAttributesUpdate.cart.id,
    attributes: data.cartAttributesUpdate.cart.attributes,
  })
}
