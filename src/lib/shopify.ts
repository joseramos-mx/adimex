import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
const publicToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!privateToken && !publicToken) {
  console.warn('[Shopify] No access token found. Set SHOPIFY_STOREFRONT_PRIVATE_TOKEN in .env.local')
}

export const shopifyClient = createStorefrontApiClient({
  storeDomain: `https://${process.env.SHOPIFY_STORE_DOMAIN}`,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? '2026-04',
  // Prefer the private token for server-side requests (more reliable, no CORS issues)
  // Fall back to the public token if private is not set
  ...(privateToken
    ? { privateAccessToken: privateToken }
    : { publicAccessToken: publicToken! }),
})
