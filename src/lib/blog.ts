import { cache } from "react"
import { client } from "@/sanity/client"
import { postsQuery, postBySlugQuery } from "@/sanity/queries"
import type { PortableTextBlock } from "@portabletext/types"
import { staticPosts, getStaticPost } from "@/content/blog"
import type { BlogCluster, BlogFAQ, BlogPost } from "@/content/blog/types"

/**
 * Card representa una tarjeta en el listado del blog. Es la superficie común
 * entre posts estáticos y posts de Sanity — así el listado renderiza igual
 * ambas fuentes.
 */
export type BlogCard = {
  source: "static" | "sanity"
  slug: string
  title: string
  excerpt: string
  category?: string
  cluster?: BlogCluster
  author?: string
  publishedAt?: string
  cover?: { src: string; alt: string }
}

type SanityPostListItem = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  category?: string
  cluster?: BlogCluster
  author?: string
  publishedAt?: string
  mainImage?: { asset: { _id: string; url: string }; alt?: string }
}

type SanityPostDetail = SanityPostListItem & {
  body?: PortableTextBlock[]
  focusKeyword?: string
  relatedProductSlugs?: string[]
  whatsappContext?: string
  faq?: BlogFAQ[]
}

export type FullSanityPost = {
  source: "sanity"
  slug: string
  title: string
  excerpt: string
  category?: string
  cluster?: BlogCluster
  author?: string
  publishedAt?: string
  cover?: { src: string; alt: string }
  body?: PortableTextBlock[]
  focusKeyword?: string
  relatedProductSlugs?: string[]
  whatsappContext?: string
  faq?: BlogFAQ[]
}

/** Post estático "en formato tarjeta" para el listado. */
function staticToCard(p: BlogPost): BlogCard {
  return {
    source: "static",
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    cluster: p.cluster,
    author: p.author,
    publishedAt: p.publishedAt,
    cover: p.cover,
  }
}

function sanityToCard(p: SanityPostListItem): BlogCard {
  return {
    source: "sanity",
    slug: p.slug.current,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    cluster: p.cluster,
    author: p.author,
    publishedAt: p.publishedAt,
    cover: p.mainImage?.asset?.url
      ? { src: p.mainImage.asset.url, alt: p.mainImage.alt ?? p.title }
      : undefined,
  }
}

/**
 * Trae todos los posts (estáticos + Sanity) ordenados por fecha desc.
 * Cachea la respuesta de Sanity dentro del árbol de render de una request.
 */
export const getAllPosts = cache(async (): Promise<BlogCard[]> => {
  let sanity: SanityPostListItem[] = []
  try {
    sanity = await client.fetch<SanityPostListItem[]>(postsQuery)
  } catch (e) {
    console.warn("[blog] Sanity fetch failed, only static posts will render", e)
  }

  const all: BlogCard[] = [
    ...staticPosts.map(staticToCard),
    ...sanity.map(sanityToCard),
  ]

  return all.sort((a, b) => {
    const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return bt - at
  })
})

/**
 * Trae un post por slug. Prioriza estático si existe con ese slug.
 * Si es Sanity, devuelve la versión completa con body, faq, etc.
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPost | FullSanityPost | null> {
  const staticMatch = getStaticPost(slug)
  if (staticMatch) return staticMatch

  try {
    const sanity = await client.fetch<SanityPostDetail | null>(
      postBySlugQuery,
      { slug }
    )
    if (!sanity) return null
    return {
      source: "sanity",
      slug: sanity.slug.current,
      title: sanity.title,
      excerpt: sanity.excerpt,
      category: sanity.category,
      cluster: sanity.cluster,
      author: sanity.author,
      publishedAt: sanity.publishedAt,
      cover: sanity.mainImage?.asset?.url
        ? {
            src: sanity.mainImage.asset.url,
            alt: sanity.mainImage.alt ?? sanity.title,
          }
        : undefined,
      body: sanity.body,
      focusKeyword: sanity.focusKeyword,
      relatedProductSlugs: sanity.relatedProductSlugs,
      whatsappContext: sanity.whatsappContext,
      faq: sanity.faq,
    }
  } catch (e) {
    console.warn("[blog] Sanity fetch failed for slug", slug, e)
    return null
  }
}

/** Slugs de todos los posts — para generateStaticParams. */
export async function getAllSlugs(): Promise<string[]> {
  const all = await getAllPosts()
  return all.map((p) => p.slug)
}

/** Retorna otros posts del mismo cluster (excluye el actual). */
export async function getRelatedPosts(
  slug: string,
  cluster: BlogCluster | undefined,
  explicitSlugs?: string[],
  limit = 3
): Promise<BlogCard[]> {
  const all = await getAllPosts()

  if (explicitSlugs && explicitSlugs.length > 0) {
    const explicit = explicitSlugs
      .map((s) => all.find((p) => p.slug === s))
      .filter((p): p is BlogCard => Boolean(p) && p!.slug !== slug)
    if (explicit.length >= limit) return explicit.slice(0, limit)
    const rest = all.filter(
      (p) => p.slug !== slug && !explicit.find((e) => e.slug === p.slug)
    )
    return [...explicit, ...rest].slice(0, limit)
  }

  if (cluster) {
    const sameCluster = all.filter(
      (p) => p.slug !== slug && p.cluster === cluster
    )
    if (sameCluster.length >= limit) return sameCluster.slice(0, limit)
    const rest = all.filter(
      (p) => p.slug !== slug && !sameCluster.find((e) => e.slug === p.slug)
    )
    return [...sameCluster, ...rest].slice(0, limit)
  }

  return all.filter((p) => p.slug !== slug).slice(0, limit)
}

export type { BlogPost, BlogCluster, BlogFAQ }
