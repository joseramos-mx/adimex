import type { BlogPost } from "@/content/blog/types"

/**
 * Genera schema.org/Article para un post. Es el reemplazo de BlogPosting
 * más adecuado para artículos evergreen técnicos.
 */
export default function ArticleSchema({
  post,
  url,
}: {
  post: BlogPost
  url: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author || "ADIMEX",
      url: "https://adimex.io",
    },
    publisher: {
      "@type": "Organization",
      name: "ADIMEX",
      logo: {
        "@type": "ImageObject",
        url: "https://adimex.io/logo.svg",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "es-MX",
    ...(post.cover
      ? {
          image: [
            post.cover.src.startsWith("http")
              ? post.cover.src
              : `https://adimex.io${post.cover.src}`,
          ],
        }
      : {}),
    keywords: post.focusKeyword,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
