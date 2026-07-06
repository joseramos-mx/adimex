import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts } from "@/lib/blog"

export default async function Articles() {
  const all = await getAllPosts()
  const posts = all.slice(0, 3)

  return (
    <section className="w-full bg-[#07080c] py-20 px-6">
      <h2
        className="text-white text-center text-3xl font-bold mb-12"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        Artículos y recursos de automatización industrial
      </h2>

      <div className="max-w-6xl mx-auto border border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {posts.length > 0 ? posts.map((post) => (
          <div key={post.slug} className="flex flex-col p-0">
            <div className="w-full aspect-4/3 bg-[#111214] flex items-center justify-center overflow-hidden">
              {post.cover?.src ? (
                <Image
                  src={post.cover.src}
                  alt={post.cover.alt}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#111214]" />
              )}
            </div>

            <div className="flex flex-col gap-3 p-6 flex-1">
              {post.category && (
                <p
                  className="text-[10px] tracking-widest text-white/30 uppercase"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {post.category}
                </p>
              )}
              <h3
                className="text-[#a7a9ac] font-bold text-lg leading-snug"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {post.title}
              </h3>
              <p
                className="text-sm leading-relaxed text-[#a7a9ac] line-clamp-3"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {post.excerpt}
              </p>

              <div className="flex items-center mt-auto pt-4">
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-0 group">
                  <span className="bg-[#017bfd] p-2 flex items-center justify-center">
                    <ArrowUpRight size={16} className="text-white" />
                  </span>
                  <span
                    className="px-4 py-2 text-[#07080c] text-xs bg-white hover:bg-[#017bfd] hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    Leer más
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )) : (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col p-0">
              <div className="w-full aspect-4/3 bg-[#111214]" />
              <div className="flex flex-col gap-3 p-6 flex-1">
                <div className="h-2 w-16 bg-white/10 rounded" />
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/5 rounded" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
