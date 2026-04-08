import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { client } from "@/sanity/client"
import { postsQuery } from "@/sanity/queries"
import { Header } from "@/components/ui/header-04"

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  category?: string
  author?: string
  publishedAt?: string
  mainImage?: { asset: { _id: string; url: string }; alt?: string }
}

export const revalidate = 60

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(postsQuery)

  const hero = posts[0] ?? null
  const rest = posts.slice(1)

  return (
    <>
    <Header />
    <main className="min-h-screen bg-[#07080c] pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Page label */}
        <p
          className="text-[10px] tracking-widest text-white/20 uppercase mb-10"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          ADIMEX / Blog
        </p>

        {posts.length === 0 ? (
          <div className="border border-white/10 flex flex-col items-center justify-center py-40 gap-3">
            <p className="text-white/20 text-sm" style={{ fontFamily: "var(--font-geist-mono)" }}>
              No hay artículos publicados todavía.
            </p>
            <Link
              href="/studio"
              className="text-[10px] text-[#017bfd] hover:underline"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Agregar contenido en /studio →
            </Link>
          </div>
        ) : (
          <>
            {/* ── Hero post ─────────────────────────────────────────── */}
            {hero && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 mb-16">
                {/* Image */}
                <div className="aspect-video md:aspect-auto bg-[#111214] overflow-hidden">
                  {hero.mainImage?.asset?.url ? (
                    <Image
                      src={hero.mainImage.asset.url}
                      alt={hero.mainImage.alt ?? hero.title}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full min-h-[280px] bg-[#111214]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center gap-5 p-10 border-t md:border-t-0 md:border-l border-white/10">
                  {hero.category && (
                    <span
                      className="text-[10px] tracking-widest text-[#017bfd] uppercase"
                      style={{ fontFamily: "var(--font-geist-mono)" }}
                    >
                      {hero.category}
                    </span>
                  )}
                  <h1
                    className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {hero.title}
                  </h1>
                  <p
                    className="text-sm text-white/50 leading-relaxed"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {hero.excerpt}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <Link
                      href={`/blog/${hero.slug.current}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#017bfd] hover:bg-[#0066d6] text-white transition-colors"
                      style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                      Continúa leyendo
                      <ArrowRight size={13} />
                    </Link>
                    {hero.author && (
                      <span
                        className="text-xs text-white/30"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        Por {hero.author}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Latest posts grid ──────────────────────────────────── */}
            {rest.length > 0 && (
              <>
                <h2
                  className="text-sm font-semibold text-[#017bfd] mb-6"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  Últimos Artículos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
                  {rest.map((post) => (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug.current}`}
                      className="group flex flex-col bg-[#07080c] hover:bg-white/3 transition-colors p-6 gap-3"
                    >
                      {/* Image thumbnail */}
                      {post.mainImage?.asset?.url && (
                        <div className="w-full aspect-video bg-[#111214] overflow-hidden mb-1">
                          <Image
                            src={post.mainImage.asset.url}
                            alt={post.mainImage.alt ?? post.title}
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

                      <h3
                        className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-snug"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                      >
                        {post.title}
                      </h3>

                      {post.author && (
                        <p
                          className="text-xs text-white/30 mt-auto pt-2"
                          style={{ fontFamily: "var(--font-geist-mono)" }}
                        >
                          Por {post.author}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
    </>
  )
}
