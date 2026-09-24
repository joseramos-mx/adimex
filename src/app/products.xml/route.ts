import { NextResponse } from "next/server"
import { getProducts } from "@/lib/products"
import { mxnWithIva } from "@/lib/pricing"
import { extractShopifyNumericId } from "@/lib/shopify-id"

/**
 * Feed de productos para Google Merchant Center y Meta Commerce Manager.
 *
 * Formato: RSS 2.0 con namespace `http://base.google.com/ns/1.0` (spec Google
 * Merchant, aceptado también por Meta). Único origen de verdad para el
 * catálogo — evita el `<shop>.myshopify.com/products/<handle>` que sale de
 * las apps nativas de Shopify.
 *
 * Sólo productos **comprables** (con `variantId` + `price` de Shopify).
 * `<g:id>` = variant ID numérico, mismo valor que envía `ViewContent` desde
 * el navegador (ver [src/lib/shopify-id.ts](../../lib/shopify-id.ts)).
 *
 * Regenera cada hora (`revalidate = 3600`).
 */

export const revalidate = 3600
export const dynamic = "force-static"

// TODO: confirmar costo real de envío nacional con el cliente y activar.
// const G_SHIPPING = "MX::Estandar:0.00 MXN"

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function stripHtml(html: string): string {
  // Google Merchant acepta texto plano; strip tags básico + colapsa espacios.
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + "…"
}

export async function GET() {
  const all = await getProducts({})

  // Sólo productos comprables — el resto vive en /bajo-pedido, no en catalog.
  const buyable = all.filter(
    (p) =>
      p.variantId &&
      p.price &&
      p.currencyCode?.toUpperCase() === "MXN",
  )

  const entries = buyable
    .map((p) => {
      const id = extractShopifyNumericId(p.variantId!)
      const price = mxnWithIva(p.price!).toFixed(2)
      const link = `https://adimex.io/productos/${p.slug}`
      const description = clamp(stripHtml(p.description || p.tagline), 5000)
      const availability = p.availableForSale ? "in_stock" : "out_of_stock"
      const mpn = p.mpn ?? p.series ?? p.slug

      return `    <item>
      <g:id>${xmlEscape(id)}</g:id>
      <g:title>${xmlEscape(p.name)}</g:title>
      <g:description>${xmlEscape(description)}</g:description>
      <g:link>${xmlEscape(link)}</g:link>
      <g:image_link>${xmlEscape(p.image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price} MXN</g:price>
      <g:brand>FLEXEM</g:brand>
      <g:condition>new</g:condition>
      <g:mpn>${xmlEscape(mpn)}</g:mpn>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ADIMEX — Catálogo FLEXEM</title>
    <link>https://adimex.io/productos</link>
    <description>Catálogo de PLCs, HMI y accesorios FLEXEM con envío nacional desde México.</description>
${entries}
  </channel>
</rss>
`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
