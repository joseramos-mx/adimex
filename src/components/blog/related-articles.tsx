import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { clusterMeta, type BlogCluster } from "@/content/blog/types"

export type RelatedItem = {
  slug: string
  title: string
  excerpt: string
  category?: string
}

/**
 * Bloque de "artículos relacionados" que se muestra al pie de cada post.
 * Toma los slugs declarados manualmente en el post o cae en fallback al cluster.
 */
export default function RelatedArticles({
  items,
  cluster,
}: {
  items: RelatedItem[]
  cluster: BlogCluster
}) {
  if (items.length === 0) return null
  const meta = clusterMeta[cluster]

  return (
    <section className="mt-16 pt-10 border-t border-white/10">
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
        <div>
          <p
            className="text-[10px] tracking-widest text-[#017bfd] uppercase"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Cluster · {meta.label}
          </p>
          <h3 className="text-lg font-semibold text-white mt-1">
            Sigue leyendo
          </h3>
        </div>
        <Link
          href="/blog"
          className="text-xs text-white/40 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          Ver todos los artículos
          <ArrowRight size={11} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {items.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-[#07080c] hover:bg-white/[0.02] transition-colors p-5 gap-2"
          >
            {post.category && (
              <span
                className="text-[10px] tracking-widest text-[#017bfd] uppercase"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {post.category}
              </span>
            )}
            <h4 className="text-sm font-semibold text-white/85 group-hover:text-white leading-snug">
              {post.title}
            </h4>
            <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
