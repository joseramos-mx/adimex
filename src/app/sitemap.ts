import { MetadataRoute } from "next"
import { casos } from "@/data/casos"
import { products as staticProducts } from "@/data/products"
import { staticPosts } from "@/content/blog"

export const revalidate = 3600 // regenerate hourly

/**
 * Sitemap unificado para adimex.io — incluye home, productos (todos), casos
 * publicados, blog (estáticos + Sanity si están disponibles) y páginas
 * institucionales. Sanity posts se resuelven en runtime; si el fetch falla,
 * el sitemap sigue válido con los estáticos.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Productos ─────────────────────────────────────────────────────────────
  const productUrls: MetadataRoute.Sitemap = staticProducts.map((p) => ({
    url: `https://adimex.io/productos/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.shopifyHandle ? 0.9 : 0.7,
  }))

  // ── Casos ─────────────────────────────────────────────────────────────────
  const casoUrls: MetadataRoute.Sitemap = casos
    .filter((c) => !c.placeholder)
    .map((c) => ({
      url: `https://adimex.io/casos/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }))

  // ── Blog (estáticos + Sanity) ────────────────────────────────────────────
  const staticBlogUrls: MetadataRoute.Sitemap = staticPosts.map((p) => ({
    url: `https://adimex.io/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }))

  let sanityBlogUrls: MetadataRoute.Sitemap = []
  try {
    const { client } = await import("@/sanity/client")
    const { postsQuery } = await import("@/sanity/queries")
    const sanityPosts = await client.fetch<
      { slug: { current: string }; publishedAt?: string }[]
    >(postsQuery)
    sanityBlogUrls = sanityPosts.map((p) => ({
      url: `https://adimex.io/blog/${p.slug.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  } catch {
    // Sanity down or no dataset — skip silently, sitemap still valid.
  }

  // Dedupe: static slug wins over Sanity slug
  const staticSlugs = new Set(staticPosts.map((p) => p.slug))
  sanityBlogUrls = sanityBlogUrls.filter(
    (u) => !staticSlugs.has(u.url.split("/blog/")[1])
  )

  return [
    {
      url: "https://adimex.io",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://adimex.io/productos",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productUrls,
    {
      url: "https://adimex.io/blog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...staticBlogUrls,
    ...sanityBlogUrls,
    {
      url: "https://adimex.io/casos",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...casoUrls,
    {
      url: "https://adimex.io/soporte",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://adimex.io/nosotros",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // ── Legal ───────────────────────────────────────────────────────────────
    {
      url: "https://adimex.io/legal",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://adimex.io/legal/aviso-de-privacidad",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://adimex.io/legal/terminos-y-condiciones",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://adimex.io/legal/politica-de-cookies",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
