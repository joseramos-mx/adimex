import { shopifyClient } from '@/lib/shopify'
import { NextResponse } from 'next/server'

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
            price { amount currencyCode }
            product { title featuredImage { url altText } }
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

const CART_CREATE = `
  mutation cartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`

const CART_QUERY = `
  query getCart($cartId: ID!) {
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

/** GET /api/cart?id=gid://shopify/Cart/xxx */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cartId = searchParams.get('id')
  if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 })

  const { data } = await shopifyClient.request(CART_QUERY, { variables: { cartId } })
  if (!data?.cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 })

  return NextResponse.json(normalizeCart(data.cart))
}

/** POST /api/cart  — body: { variantId, cartId?, quantity? }
 *  Creates a new cart if no cartId, otherwise adds a line to the existing one. */
export async function POST(req: Request) {
  const { variantId, cartId, quantity = 1 } = await req.json()
  if (!variantId) return NextResponse.json({ error: 'variantId required' }, { status: 400 })

  if (cartId) {
    const { data, errors } = await shopifyClient.request(CART_LINES_ADD, {
      variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    })
    if (errors || !data?.cartLinesAdd?.cart)
      return NextResponse.json({ error: 'No se pudo agregar al carrito' }, { status: 500 })
    return NextResponse.json(normalizeCart(data.cartLinesAdd.cart))
  }

  const { data, errors } = await shopifyClient.request(CART_CREATE, {
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
  })
  if (errors || !data?.cartCreate?.cart)
    return NextResponse.json({ error: 'No se pudo crear el carrito' }, { status: 500 })
  return NextResponse.json(normalizeCart(data.cartCreate.cart))
}

/** PATCH /api/cart  — body: { cartId, lineId, quantity } */
export async function PATCH(req: Request) {
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
  const { cartId, lineId } = await req.json()
  if (!cartId || !lineId) return NextResponse.json({ error: 'cartId and lineId required' }, { status: 400 })

  const { data, errors } = await shopifyClient.request(CART_LINES_REMOVE, {
    variables: { cartId, lineIds: [lineId] },
  })
  if (errors || !data?.cartLinesRemove?.cart)
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 })
  return NextResponse.json(normalizeCart(data.cartLinesRemove.cart))
}
