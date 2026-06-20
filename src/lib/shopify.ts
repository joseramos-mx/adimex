import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
const publicToken  = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const domain       = process.env.SHOPIFY_STORE_DOMAIN

function createClient() {
  if (!domain || (!privateToken && !publicToken)) {
    console.warn('[Shopify] Missing env vars — falling back to static data. Create .env.local with SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PRIVATE_TOKEN.')
    return null
  }
  try {
    return createStorefrontApiClient({
      storeDomain: `https://${domain}`,
      apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? '2026-04',
      ...(privateToken
        ? { privateAccessToken: privateToken }
        : { publicAccessToken: publicToken! }),
    })
  } catch (err) {
    console.warn('[Shopify] Client init failed — falling back to static data:', err)
    return null
  }
}

export const shopifyClient = createClient()
