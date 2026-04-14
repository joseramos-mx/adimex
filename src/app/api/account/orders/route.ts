import { NextRequest, NextResponse } from 'next/server'

const SHOP_ID    = process.env.SHOPIFY_SHOP_ID!
const API_VERSION = '2024-07'
const ENDPOINT   = `https://shopify.com/${SHOP_ID}/account/customer/api/${API_VERSION}/graphql.json`

const ORDERS_QUERY = `
  query CustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice { amount currencyCode }
            lineItems(first: 3) {
              edges {
                node {
                  title
                  quantity
                  image { url altText }
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('sh_access_token')?.value
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: ORDERS_QUERY, variables: { first: 10 } }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  const { data, errors } = await res.json()

  if (errors) {
    console.error('[Orders]', errors)
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 })
  }

  const orders = data?.customer?.orders?.edges?.map(({ node }: any) => ({
    id:               node.id,
    name:             node.name,
    processedAt:      node.processedAt,
    financialStatus:  node.financialStatus,
    fulfillmentStatus: node.fulfillmentStatus,
    totalPrice:       node.currentTotalPrice.amount,
    currencyCode:     node.currentTotalPrice.currencyCode,
    lineItems:        node.lineItems.edges.map(({ node: li }: any) => ({
      title:    li.title,
      quantity: li.quantity,
      image:    li.image?.url ?? null,
    })),
  })) ?? []

  return NextResponse.json({ orders })
}
