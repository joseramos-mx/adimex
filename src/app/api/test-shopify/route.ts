import { NextResponse } from "next/server"

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? ''
  const publicToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? ''
  const url = `https://${domain}/api/2025-10/graphql.json`
  const query = `{ shop { name } products(first: 3) { edges { node { id title handle } } } }`

  const [privRes, pubRes] = await Promise.all([
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Shopify-Storefront-Private-Token': privateToken },
      body: JSON.stringify({ query }),
    }),
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': publicToken },
      body: JSON.stringify({ query }),
    }),
  ])

  return NextResponse.json({
    url,
    private: { status: privRes.status, body: await privRes.json() },
    public: { status: pubRes.status, body: await pubRes.json() },
  })
}
