import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header-04"
import { getAllPosts, type BlogCard } from "@/lib/blog"
import { clusterMeta, type BlogCluster } from "@/content/blog/types"

export const revalidate = 60

export const metadata: Metadata = {
  title:
    "Blog ADIMEX — Automatización industrial FLEXEM en México",
  description:
    "Guías de compra, comparativas, tutoriales y soluciones por máquina para integradores, OEM y responsables de planta en México. Distribuidor autorizado FLEXEM.",
  alternates: { canonical: "https://adimex.io/blog" },
  openGraph: {
    title: "Blog ADIMEX — Automatización industrial FLEXEM",
    description:
      "Guías, comparativas y tutoriales para automatización industrial en México.",
    url: "https://adimex.io/blog",
    type: "website",
  },
}

const CLUSTER_ORDER: BlogCluster[] = [
  "transaccional",
  "comparativas",
  "maquina",
  "soporte",
  "educacional",
]

export default async function BlogPage() {
  const posts = await getAllPosts()
  const hero = posts[0] ?? null
  const rest = posts.slice(1)

  // Group by cluster for the topical index
  const byCluster: Record<BlogCluster, BlogCard[]> = {
    transaccional: [],
    comparativas: [],
    maquina: [],
    soporte: [],
    educacional: [],
  }
  for (const p of posts) {
    if (p.cluster && byCluster[p.cluster]) byCluster[p.cluster].push(p)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#07080c] pt-24 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-[10px] tracking-widest text-white/20 uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            ADIMEX / Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
            Automatización industrial FLEXEM en México
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-2xl mb-12">
            Guías de compra, comparativas honestas, tutoriales de Flexem Studio y
            soluciones por tipo de máquina — pensado para integradores, OEM y
            responsables de planta.
          </p>

          {posts.length === 0 ? (
            <div className="border border-white/10 flex flex-col items-center justify-center py-40 gap-3">
              <p className="text-white/20 text-sm">
                No hay artículos publicados todavía.
              </p>
            </div>
          ) : (
            <>
              {hero && <HeroCard post={hero} />}

              {rest.length > 0 && (
                <>
                  <h2
                    className="text-sm font-semibold text-[#017bfd] mb-6 mt-16"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Últimos artículos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
                    {rest.slice(0, 6).map((post) => (
                      <PostThumb key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}

              <section className="mt-20">
                <h2 className="text-sm font-semibold text-[#017bfd] mb-6">
                  Explora por cluster
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                  {CLUSTER_ORDER.filter((c) => byCluster[c].length > 0).map(
                    (c) => (
                      <ClusterBlock
                        key={c}
                        cluster={c}
                        posts={byCluster[c]}
                      />
                    )
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  )
}

function HeroCard({ post }: { post: BlogCard }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10">
      <div className="aspect-video md:aspect-auto bg-[#111214] overflow-hidden">
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={800}
            height={500}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-[#0e1220] via-[#111420] to-[#0a0c14]" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-5 p-10 border-t md:border-t-0 md:border-l border-white/10">
        {post.category && (
          <span
            className="text-[10px] tracking-widest text-[#017bfd] uppercase"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {post.category}
          </span>
        )}
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-white/50 leading-relaxed">{post.excerpt}</p>
        <div className="flex items-center gap-4 pt-2">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#017bfd] hover:bg-[#0066d6] text-white transition-colors"
          >
            Continúa leyendo
            <ArrowRight size={13} />
          </Link>
          {post.author && (
            <span
              className="text-xs text-white/30"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Por {post.author}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function PostThumb({ post }: { post: BlogCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-[#07080c] hover:bg-white/[0.02] transition-colors p-6 gap-3"
    >
      {post.cover && (
        <div className="w-full aspect-video bg-[#111214] overflow-hidden mb-1">
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}
      {post.category && (
        <span
          className="text-[10px] tracking-widest text-[#017bfd] uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {post.category}
        </span>
      )}
      <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-snug">
        {post.title}
      </h3>
      <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
      {post.author && (
        <p
          className="text-xs text-white/30 mt-auto pt-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Por {post.author}
        </p>
      )}
    </Link>
  )
}

function ClusterBlock({
  cluster,
  posts,
}: {
  cluster: BlogCluster
  posts: BlogCard[]
}) {
  const meta = clusterMeta[cluster]
  return (
    <div className="bg-[#07080c] p-8 flex flex-col gap-4">
      <div>
        <p
          className="text-[10px] tracking-widest text-[#017bfd] uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Cluster
        </p>
        <h3 className="text-lg font-semibold text-white mt-1">{meta.label}</h3>
        <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
          {meta.description}
        </p>
      </div>
      <ul className="space-y-2 mt-2">
        {posts.slice(0, 5).map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="text-sm text-white/70 hover:text-white transition-colors flex items-start gap-2 leading-snug"
            >
              <span className="text-[#017bfd] shrink-0 mt-0.5">→</span>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
