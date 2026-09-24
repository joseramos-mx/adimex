/**
 * Extrae el ID numérico de una Global ID (GID) de Shopify.
 *
 *   gid://shopify/ProductVariant/43162651590865 → "43162651590865"
 *   gid://shopify/Product/8123456789012          → "8123456789012"
 *
 * Devuelve el input tal cual si no encuentra el formato esperado — sirve
 * como fallback para SKUs que ya vienen numéricos, o para no romper si
 * Shopify cambia el schema.
 *
 * Meta Catalog usa el variant ID (no el product ID) como `content_id`
 * cuando la tienda tiene variantes distintas. Nuestro catálogo publica
 * un solo variante por producto, así que ambos ID podrían servir; usamos
 * variant ID por consistencia con la app de Meta en Shopify.
 */
export function extractShopifyNumericId(gid: string | undefined | null): string {
  if (!gid) return ""
  const m = /\/(\d+)$/.exec(gid)
  return m ? m[1]! : gid
}
