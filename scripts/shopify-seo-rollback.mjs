#!/usr/bin/env node
/**
 * store-fixer · Revierte los cambios usando un rollback manifest.
 *
 * Uso:
 *   node scripts/shopify-seo-rollback.mjs shopify-rollback/store-fixer-rollback-*.json
 *
 * Requiere las mismas env vars que el script principal.
 */

import fs from "node:fs"

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-07"

const [manifestPath] = process.argv.slice(2)
if (!manifestPath) {
  console.error("Usage: node scripts/shopify-seo-rollback.mjs <manifest.json>")
  process.exit(1)
}
if (!STORE_DOMAIN || !TOKEN) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN.")
  process.exit(1)
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
if (manifest.store !== STORE_DOMAIN) {
  console.error(
    `Manifest is for store "${manifest.store}" but env is "${STORE_DOMAIN}". Aborting.`
  )
  process.exit(1)
}

const ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

const PRODUCT_UPDATE = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id }
      userErrors { field message }
    }
  }
`

const FILE_UPDATE = `
  mutation fileUpdate($files: [FileUpdateInput!]!) {
    fileUpdate(files: $files) {
      files { ... on MediaImage { id alt } }
      userErrors { field message }
    }
  }
`

async function main() {
  console.log(`\nReverting ${manifest.products.length} products in ${STORE_DOMAIN}\n`)

  for (const item of manifest.products) {
    console.log(`── ${item.handle} ────────────────────────`)
    const b = item.before
    try {
      const data = await gql(PRODUCT_UPDATE, {
        input: {
          id: item.id,
          seo: b.seo ?? { title: null, description: null },
          vendor: b.vendor ?? null,
          tags: b.tags ?? [],
        },
      })
      const errs = data.productUpdate.userErrors
      if (errs && errs.length) {
        console.error(`  ✗ ${JSON.stringify(errs)}`)
        continue
      }
      console.log(`  ✓ SEO + vendor + tags reverted`)
    } catch (err) {
      console.error(`  ✗ productUpdate failed: ${err.message}`)
    }

    // Revert media alts
    for (const m of b.media ?? []) {
      try {
        await gql(FILE_UPDATE, {
          files: [{ id: m.id, alt: m.alt ?? "" }],
        })
      } catch (err) {
        console.error(`  ⚠ media revert failed for ${m.id}: ${err.message}`)
      }
    }
    console.log(`  ✓ media alts reverted`)
  }
  console.log("\nRollback complete.")
}

main().catch((err) => {
  console.error("Fatal:", err.message)
  process.exit(1)
})
