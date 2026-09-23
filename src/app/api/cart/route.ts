import { shopifyClient } from '@/lib/shopify'
import { NextRequest, NextResponse } from 'next/server'
import { META_ATTR_PREFIX } from '@/lib/attribution-attrs'

// ─── Fragments ────────────────────────────────────────────────────────────────

const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            sku
            price { amount currencyCode }
            product { handle title featuredImage { url altText } }
          }
        }
      }
    }
  }
  cost {
    totalAmount { amount currencyCode }
  }
`

// ─── Mutations ────────────────────────────────────────────────────────────────
// All cart operations run under @inContext(country: MX) so Shopify Markets
// resolves prices in MXN and the checkout opens with the Mexican tax rules
// configured in the admin (16% IVA over the MXN base price).

const CART_CREATE = `
  mutation cartCreate($lines: [CartLineInput!]!, $attributes: [AttributeInput!]) @inContext(country: MX, language: ES) {
    cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: MX }, attributes: $attributes }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: MX, language: ES) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: MX, language: ES) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: MX, language: ES) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_QUERY = `
  query getCart($cartId: ID!) @inContext(country: MX, language: ES) {
    cart(id: $cartId) { ${CART_FIELDS} }
  }
`

// ─── Normalizer ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCart(cart: any) {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: cart.lines.edges.map(({ node }: any) => ({
      id: node.id,
      variantId: node.merchandise.id,
      sku: node.merchandise.sku ?? null,
      productHandle: node.merchandise.product.handle ?? null,
      productName: node.merchandise.product.title,
      price: node.merchandise.price.amount,
      currencyCode: node.merchandise.price.currencyCode,
      quantity: node.quantity,
      image: node.merchandise.product.featuredImage?.url ?? null,
    })),
    totalAmount: cart.cost.totalAmount.amount,
    totalCurrencyCode: cart.cost.totalAmount.currencyCode,
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

const noClient = () => NextResponse.json({ error: 'Shopify no configurado' }, { status: 503 })

/** GET /api/cart?id=gid://shopify/Cart/xxx */
export async function GET(req: Request) {
  if (!shopifyClient) return noClient()
  const { searchParams } = new URL(req.url)
  const cartId = searchParams.get('id')
  if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 })

  const { data } = await shopifyClient.request(CART_QUERY, { variables: { cartId } })
  if (!data?.cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 })

  return NextResponse.json(normalizeCart(data.cart))
}

function clientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? undefined
}

function marketingConsentFromCookie(req: NextRequest): boolean {
  const raw = req.cookies.get('adimex_consent')?.value
  if (!raw) return false
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { marketing?: boolean }
    return Boolean(parsed.marketing)
  } catch {
    return false
  }
}

type Attr = { key: string; value: string }

function sanitizeClientAttrs(attrs: unknown, marketing: boolean): Attr[] {
  if (!Array.isArray(attrs)) return []
  const out: Attr[] = []
  for (const a of attrs) {
    if (!a || typeof a !== 'object') continue
    const key = String((a as { key?: unknown }).key ?? '').trim()
    const value = String((a as { value?: unknown }).value ?? '').slice(0, 500)
    if (!key || !value) continue
    // Cortamos identificadores de matching si el consent bajó entre el
    // gathering en el navegador y el POST (defensa en profundidad).
    if (
      !marketing &&
      (key === `${META_ATTR_PREFIX}fbp` ||
        key === `${META_ATTR_PREFIX}fbc` ||
        key === `${META_ATTR_PREFIX}user_agent`)
    ) {
      continue
    }
    // Whitelist para no permitir inyectar campos arbitrarios en el pedido.
    const allowed = new Set([
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'landing_url',
      `${META_ATTR_PREFIX}fbp`,
      `${META_ATTR_PREFIX}fbc`,
      `${META_ATTR_PREFIX}user_agent`,
    ])
    if (!allowed.has(key)) continue
    out.push({ key, value })
  }
  return out
}

/** POST /api/cart  — body: { variantId, cartId?, quantity?, attributes? }
 *  Creates a new cart if no cartId, otherwise adds a line to the existing one. */
export async function POST(req: NextRequest) {
  if (!shopifyClient) return noClient()
  const { variantId, cartId, quantity = 1, attributes: rawAttrs } = await req.json()
  if (!variantId) return NextResponse.json({ error: 'variantId required' }, { status: 400 })

  if (cartId) {
    const { data, errors } = await shopifyClient.request(CART_LINES_ADD, {
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    })
    if (errors || !data?.cartLinesAdd?.cart)
      return NextResponse.json({ error: 'No se pudo agregar al carrito' }, { status: 500 })
    return NextResponse.json(normalizeCart(data.cartLinesAdd.cart))
  }

  // cartCreate: agregamos atributos de atribución. El servidor añade la IP
  // del cliente sólo si hay consent.marketing (round-4 p3).
  const marketing = marketingConsentFromCookie(req)
  const attributes = sanitizeClientAttrs(rawAttrs, marketing)
  if (marketing) {
    const ip = clientIp(req)
    if (ip) attributes.push({ key: `${META_ATTR_PREFIX}client_ip_address`, value: ip })
  }

  const { data, errors } = await shopifyClient.request(CART_CREATE, {
    variables: {
      lines: [{ merchandiseId: variantId, quantity }],
      attributes: attributes.length > 0 ? attributes : null,
    },
  })
  if (errors || !data?.cartCreate?.cart)
    return NextResponse.json({ error: 'No se pudo crear el carrito' }, { status: 500 })
  return NextResponse.json(normalizeCart(data.cartCreate.cart))
}

/** PATCH /api/cart  — body: { cartId, lineId, quantity } */
export async function PATCH(req: Request) {
  if (!shopifyClient) return noClient()
  const { cartId, lineId, quantity } = await req.json()
  if (!cartId || !lineId) return NextResponse.json({ error: 'cartId and lineId required' }, { status: 400 })

  const { data, errors } = await shopifyClient.request(CART_LINES_UPDATE, {
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  })
  if (errors || !data?.cartLinesUpdate?.cart)
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 })
  return NextResponse.json(normalizeCart(data.cartLinesUpdate.cart))
}

/** DELETE /api/cart  — body: { cartId, lineId } */
export async function DELETE(req: Request) {
  if (!shopifyClient) return noClient()
  const { cartId, lineId } = await req.json()
  if (!cartId || !lineId) return NextResponse.json({ error: 'cartId and lineId required' }, { status: 400 })

  const { data, errors } = await shopifyClient.request(CART_LINES_REMOVE, {
    variables: { cartId, lineIds: [lineId] },
  })
  if (errors || !data?.cartLinesRemove?.cart)
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
  return NextResponse.json(normalizeCart(data.cartLinesRemove.cart))
}
