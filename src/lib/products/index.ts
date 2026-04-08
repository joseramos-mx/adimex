/**
 * Product data abstraction layer.
 *
 * All product reads in the app go through this module — never import from
 * src/data/products.ts directly in pages/components.
 *
 * When Shopify is integrated:
 *   1. Add a `shopify.ts` file in this directory with the same function signatures
 *   2. Swap the import below from `./static` to `./shopify`
 *   3. The rest of the app requires zero changes
 *
 * Shopify mapping notes:
 *   - `Product.slug`         → Shopify product handle
 *   - `Product.category`     → Shopify product type (productType)
 *   - `Product.subcategory`  → Shopify tag (e.g. "subcategory:Accionamientos servo")
 *   - `Product.specs`        → Shopify metafields (namespace: "specs")
 *   - `Product.features`     → Shopify metafield (namespace: "details", key: "features")
 *   - `Product.externalUrl`  → Shopify metafield (namespace: "details", key: "external_url")
 */

import {
  products as staticProducts,
  getProductBySlug as staticGetBySlug,
  categoryMeta,
  categoryOrder,
  type Product,
  type ProductCategory,
  type ProductSubcategory,
} from "@/data/products"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortOption = "default" | "name-asc" | "name-desc"

export interface ProductFilters {
  category?: ProductCategory
  subcategory?: string
  sort?: SortOption
}

// ─── Data access functions ─────────────────────────────────────────────────────
// These are the ONLY functions pages/components should call.

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  // TODO (Phase 2): replace with Shopify storefront API call
  let result = [...staticProducts]

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.subcategory) {
    result = result.filter((p) => p.subcategory === filters.subcategory)
  }

  if (filters.sort === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name, "es"))
  } else if (filters.sort === "name-desc") {
    result.sort((a, b) => b.name.localeCompare(a.name, "es"))
  }
  // default: original order (by category groups)

  return result
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // TODO (Phase 2): replace with Shopify storefront API call
  return staticGetBySlug(slug)
}

export async function getSubcategoriesForCategory(
  category: ProductCategory
): Promise<ProductSubcategory[]> {
  const inCategory = staticProducts.filter((p) => p.category === category)
  const unique = [...new Set(inCategory.map((p) => p.subcategory))]
  return unique
}

export async function getProductCounts(): Promise<Record<ProductCategory, number>> {
  const counts = {} as Record<ProductCategory, number>
  for (const cat of categoryOrder) {
    counts[cat] = staticProducts.filter((p) => p.category === cat).length
  }
  return counts
}

// Re-export metadata helpers so consumers don't need to import from data layer
export { categoryMeta, categoryOrder, type Product, type ProductCategory, type ProductSubcategory }
