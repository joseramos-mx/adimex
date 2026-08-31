#!/usr/bin/env node
/**
 * store-fixer · Aplica los fixes SEO de la auditoría a los 3 SKUs comprables.
 *
 * Requiere:
 *   SHOPIFY_STORE_DOMAIN          xxx.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN    shpat_... (o shpca_...)
 *
 * Antes de cada escritura consulta el estado actual y lo guarda en un
 * rollback manifest local. El manifest se puede pasar a
 * shopify-seo-rollback.mjs para revertir.
 *
 * Uso:
 *   $env:SHOPIFY_ADMIN_ACCESS_TOKEN = "shpat_..."
 *   $env:SHOPIFY_STORE_DOMAIN = "xxx.myshopify.com"
 *   node scripts/shopify-seo-fixes.mjs
 */

import fs from "node:fs"
import path from "node:path"

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2026-07"

if (!STORE_DOMAIN || !TOKEN) {
  console.error(
    "Missing env vars. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN before running."
  )
  process.exit(1)
}

const ENDPOINT = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`

/**
 * Plan de fixes por producto.
 *   handle       Shopify product handle
 *   seo.title    <60 chars, formato "Nombre - Atributo | Marca"
 *   seo.description  120-155 chars con beneficio + categoría
 *   vendor       Normaliza a FLEXEM (el fabricante real)
 *   tags         Se agregan a los existentes, no reemplazan
 *   imageAlt     Descripción de la 1ra imagen; producto + rasgo distintivo
 */
const PLAN = [
  {
    handle: "plc-fl721-0808p-d",
    seo: {
      title: "PLC Flexem FL7 CODESYS 32 ejes · $3,445 MXN",
      description:
        "Distribuidor autorizado FLEXEM en México. PLC CODESYS con control de movimiento hasta 32 ejes. Envío 3-5 días con garantía del fabricante.",
    },
    vendor: "FLEXEM",
    tags: [
      "plc",
      "codesys",
      "control-de-movimiento",
      "flexem",
      "distribuidor-flexem-mexico",
      "automatizacion-industrial",
    ],
    imageAlt:
      "PLC Flexem FL721-0808P-D CODESYS con 8 entradas y 8 salidas PNP, comunicación Modbus TCP/RTU, montado en riel DIN",
  },
  {
    handle: "hmi-flexem-f007n",
    seo: {
      title: "HMI Flexem F007N 7\" capacitiva · $7,308 MXN",
      description:
        "Pantalla táctil industrial multi-touch 1024×600, Modbus RTU/TCP. Envío 3-5 días desde CDMX con garantía FLEXEM en México.",
    },
    vendor: "FLEXEM",
    tags: [
      "hmi",
      "capacitiva",
      "7-pulgadas",
      "flexem",
      "distribuidor-flexem-mexico",
      "automatizacion-industrial",
    ],
    imageAlt:
      "HMI Flexem F007N pantalla táctil capacitiva multi-touch de 7 pulgadas con marco negro, resolución 1024x600, para automatización industrial",
  },
  {
    handle: "productos-hmi-f110",
    seo: {
      title: "HMI Flexem F110 10.1\" IoT + BT · $9,103 MXN",
      description:
        "HMI capacitiva de 10 pulgadas con IoT y Bluetooth integrados. Distribuidor autorizado FLEXEM en México, envío nacional 3-5 días.",
    },
    vendor: "FLEXEM",
    tags: [
      "hmi",
      "capacitiva",
      "10-pulgadas",
      "iot",
      "bluetooth",
      "flexem",
      "distribuidor-flexem-mexico",
    ],
    imageAlt:
      "HMI Flexem F110 pantalla capacitiva de 10.1 pulgadas con IoT y Bluetooth integrados, resolución 800x1280, para tableros industriales",
  },
]

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status}: ${body}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`)
  }
  return json.data
}

const PRODUCT_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      vendor
      tags
      seo { title description }
      media(first: 20) {
        edges {
          node {
            ... on MediaImage {
              id
              alt
            }
          }
        }
      }
    }
  }
`

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

function log(msg, color = "\x1b[0m") {
  process.stdout.write(`${color}${msg}\x1b[0m\n`)
}
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const RED = "\x1b[31m"
const CYAN = "\x1b[36m"

async function main() {
  log(`\nStore: ${STORE_DOMAIN}`, CYAN)
  log(`API version: ${API_VERSION}`, CYAN)
  log(`Products in plan: ${PLAN.length}\n`, CYAN)

  const rollback = {
    timestamp: new Date().toISOString(),
    store: STORE_DOMAIN,
    apiVersion: API_VERSION,
    products: [],
  }

  let ok = 0
  let failed = 0

  for (const spec of PLAN) {
    log(`── ${spec.handle} ────────────────────────`, CYAN)

    let current
    try {
      const data = await gql(PRODUCT_QUERY, { handle: spec.handle })
      current = data.productByHandle
    } catch (err) {
      log(`  ✗ read failed: ${err.message}`, RED)
      failed++
      continue
    }

    if (!current) {
      log(`  ✗ product not found in Shopify: handle "${spec.handle}"`, RED)
      failed++
      continue
    }

    log(`  found: ${current.title}`)

    // Save rollback BEFORE any write
    rollback.products.push({
      handle: spec.handle,
      id: current.id,
      before: {
        seo: current.seo,
        vendor: current.vendor,
        tags: current.tags,
        media: current.media.edges
          .map((e) => e.node)
          .filter((n) => n && n.id)
          .map((n) => ({ id: n.id, alt: n.alt })),
      },
      requested: {
        seo: spec.seo,
        vendor: spec.vendor,
        // Los tags se mergean con los existentes en runtime, guardamos ambos
        tagsRequested: spec.tags,
        imageAlt: spec.imageAlt,
      },
    })
    log(`  ✓ rollback snapshot saved`)

    // Merge tags — no reemplazar los existentes
    const mergedTags = [
      ...new Set([...(current.tags || []), ...spec.tags]),
    ].sort()

    // Update SEO + vendor + tags
    try {
      const data = await gql(PRODUCT_UPDATE, {
        input: {
          id: current.id,
          seo: spec.seo,
          vendor: spec.vendor,
          tags: mergedTags,
        },
      })
      const errs = data.productUpdate.userErrors
      if (errs && errs.length) {
        log(`  ✗ productUpdate errors: ${JSON.stringify(errs)}`, RED)
        failed++
        continue
      }
      log(`  ✓ SEO + vendor + tags updated`, GREEN)
    } catch (err) {
      log(`  ✗ productUpdate failed: ${err.message}`, RED)
      failed++
      continue
    }

    // Update first image alt
    const firstImage = current.media.edges
      .map((e) => e.node)
      .find((n) => n && n.id)
    if (firstImage?.id) {
      try {
        const data = await gql(FILE_UPDATE, {
          files: [{ id: firstImage.id, alt: spec.imageAlt }],
        })
        const errs = data.fileUpdate.userErrors
        if (errs && errs.length) {
          log(`  ⚠ fileUpdate errors: ${JSON.stringify(errs)}`, YELLOW)
        } else {
          log(`  ✓ first image alt updated`, GREEN)
        }
      } catch (err) {
        log(`  ⚠ fileUpdate failed: ${err.message}`, YELLOW)
      }
    } else {
      log(`  ⚠ no image found — alt skipped`, YELLOW)
    }

    ok++
  }

  // Save rollback manifest
  const rollbackDir = path.join(process.cwd(), "shopify-rollback")
  fs.mkdirSync(rollbackDir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const filename = `store-fixer-rollback-${STORE_DOMAIN}-${stamp}.json`
  const fullPath = path.join(rollbackDir, filename)
  fs.writeFileSync(fullPath, JSON.stringify(rollback, null, 2))

  log(`\n─────────────────────────────────────────`, CYAN)
  log(`Applied: ${ok} / ${PLAN.length}`, ok === PLAN.length ? GREEN : YELLOW)
  if (failed > 0) log(`Failed:  ${failed}`, RED)
  log(`Rollback manifest: shopify-rollback/${filename}`, CYAN)
  log(``, CYAN)
  log(`To revert:`, CYAN)
  log(`  node scripts/shopify-seo-rollback.mjs "shopify-rollback/${filename}"`, CYAN)
}

main().catch((err) => {
  log(`\nFatal: ${err.message}`, RED)
  process.exit(1)
})
