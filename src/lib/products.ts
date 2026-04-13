import { cache } from 'react'
import { shopifyClient } from './shopify'
import { products as staticProducts } from '@/data/products'
import type { Product, ProductCategory } from '@/data/products'

// ─── Re-exports ───────────────────────────────────────────────────────────────
export type { ProductCategory } from '@/data/products'
export { products } from '@/data/products'

export type SortOption = 'default' | 'name-asc' | 'name-desc'

// ─── Category config ──────────────────────────────────────────────────────────
export const categoryOrder: ProductCategory[] = [
  'servo',
  'plc',
  'hmi',
  'iot-gateway',
  'scada',
  'cloud',
]

export const categoryMeta: Record<ProductCategory, { label: string }> = {
  servo:       { label: 'Servomotores' },
  plc:         { label: 'PLCs' },
  hmi:         { label: 'HMI' },
  'iot-gateway': { label: 'IoT Gateways' },
  scada:       { label: 'SCADA' },
  cloud:       { label: 'Cloud' },
}

// ─── Shopify GraphQL query ────────────────────────────────────────────────────
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "tagline" }
            { namespace: "custom", key: "features" }
            { namespace: "custom", key: "applications" }
            { namespace: "custom", key: "specs" }
          ]) {
            key
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

type ShopifyNode = {
  id: string
  title: string
  handle: string
  description: string
  productType: string
  tags: string[]
  images: { edges: { node: { url: string; altText: string | null } }[] }
  variants: {
    edges: {
      node: {
        id: string
        availableForSale: boolean
        quantityAvailable: number
        price: { amount: string; currencyCode: string }
      }
    }[]
  }
  metafields: ({ key: string; value: string } | null)[]
}

// ─── Shopify → Product mapping ────────────────────────────────────────────────
// Priority order:
//   1. Static product whose shopifyHandle matches → use rich static data
//   2. Static product whose slug matches the Shopify handle → use rich static data
//   3. Build a Product from Shopify data + metafields
function mapShopifyProduct(node: ShopifyNode): Product {
  // Try to find a static match
  const staticMatch =
    staticProducts.find((p) => p.shopifyHandle === node.handle) ??
    staticProducts.find((p) => p.slug === node.handle)

  if (staticMatch) return staticMatch

  // Parse metafields into a map
  const meta: Record<string, string> = {}
  for (const mf of node.metafields ?? []) {
    if (mf) meta[mf.key] = mf.value
  }

  // features & applications: Shopify List returns JSON array string e.g. ["item1","item2"]
  const parseList = (raw: string | undefined): string[] => {
    if (!raw) return []
    try { return JSON.parse(raw) } catch { return [] }
  }

  // specs: JSON array of {label, value}
  const parseSpecs = (raw: string | undefined): Product['specs'] => {
    if (!raw) return []
    try { return JSON.parse(raw) } catch { return [] }
  }

  // Derive category from tags (e.g. tag "servo" or "category:plc")
  const TAG_CATEGORIES: ProductCategory[] = ['servo', 'plc', 'hmi', 'iot-gateway', 'scada', 'cloud']
  const categoryTag = node.tags.find((t) =>
    TAG_CATEGORIES.includes(t as ProductCategory) ||
    TAG_CATEGORIES.includes(t.replace('category:', '') as ProductCategory)
  )
  const category = (
    categoryTag?.replace('category:', '') as ProductCategory | undefined
  ) ?? 'plc'

  const image =
    node.images.edges[0]?.node.url ??
    'https://via.placeholder.com/600x400?text=Sin+imagen'

  const tagline = meta.tagline || node.description.split('.')[0]?.trim() || node.title

  const variant = node.variants?.edges[0]?.node

  return {
    slug: node.handle,
    name: node.title,
    series: node.productType ?? '',
    category,
    categoryLabel: categoryMeta[category].label,
    subcategory: (node.productType as Product['subcategory']) ?? 'Controladores PLC',
    tagline,
    description: node.description,
    image,
    features: parseList(meta.features),
    specs: parseSpecs(meta.specs),
    applications: parseList(meta.applications),
    externalUrl: '',
    shopifyHandle: node.handle,
    variantId: variant?.id,
    price: variant?.price.amount,
    currencyCode: variant?.price.currencyCode,
    availableForSale: variant?.availableForSale,
    quantityAvailable: variant?.quantityAvailable,
  }
}

// ─── Internal cached fetch ────────────────────────────────────────────────────
// `cache()` memoizes across the React render tree for a single request,
// so multiple page/component calls hit Shopify only once per request.
const fetchAllShopifyProducts = cache(async (): Promise<Product[]> => {
  try {
    const allNodes: ShopifyNode[] = []
    let hasNextPage = true
    let after: string | undefined

    while (hasNextPage) {
      const variables: Record<string, unknown> = { first: 50 }
      if (after) variables.after = after

      const { data, errors } = await shopifyClient.request(PRODUCTS_QUERY, { variables })

      // The client may return errors as {} (empty object) — only treat as real error
      // if it has a message or graphQLErrors array.
      const hasError =
        errors &&
        (typeof (errors as { message?: string }).message === 'string' ||
          Array.isArray((errors as { graphQLErrors?: unknown[] }).graphQLErrors))

      if (hasError) {
        console.error('[Shopify] GraphQL error:', JSON.stringify(errors, null, 2))
        break
      }

      if (!data?.products) {
        console.warn('[Shopify] data.products is missing. Full response data:', JSON.stringify(data, null, 2))
        console.warn('[Shopify] Check: (1) Headless app has "unauthenticated_read_product_listings" scope, (2) products are published to the Headless sales channel')
        break
      }

      for (const edge of data.products.edges) {
        allNodes.push(edge.node)
      }

      hasNextPage = data.products.pageInfo.hasNextPage
      after = data.products.pageInfo.endCursor ?? undefined
    }

    if (allNodes.length === 0) return staticProducts

    return allNodes.map(mapShopifyProduct)
  } catch (err) {
    console.error('[Shopify] fetchAllProducts failed, using static data:', err)
    return staticProducts
  }
})

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getProducts(opts: {
  category?: ProductCategory
  subcategory?: string
  sort?: SortOption
}): Promise<Product[]> {
  let products = await fetchAllShopifyProducts()

  if (opts.category) {
    products = products.filter((p) => p.category === opts.category)
  }
  if (opts.subcategory) {
    products = products.filter((p) => p.subcategory === opts.subcategory)
  }

  if (opts.sort === 'name-asc') {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  } else if (opts.sort === 'name-desc') {
    products = [...products].sort((a, b) => b.name.localeCompare(a.name, 'es'))
  } else {
    // Default: respect categoryOrder
    products = [...products].sort(
      (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    )
  }

  return products
}

export async function getProductCounts(): Promise<Record<ProductCategory, number>> {
  const all = await fetchAllShopifyProducts()
  const counts: Record<ProductCategory, number> = {
    servo: 0, plc: 0, hmi: 0, 'iot-gateway': 0, scada: 0, cloud: 0,
  }
  for (const p of all) {
    if (p.category in counts) counts[p.category]++
  }
  return counts
}

export async function getSubcategoriesForCategory(
  category: ProductCategory
): Promise<string[]> {
  const all = await fetchAllShopifyProducts()
  return [
    ...new Set(
      all.filter((p) => p.category === category).map((p) => p.subcategory)
    ),
  ]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await fetchAllShopifyProducts()
  return all.find((p) => p.slug === slug) ?? null
}
