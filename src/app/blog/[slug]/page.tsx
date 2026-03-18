import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { client } from "@/sanity/client"
import { postBySlugQuery, postsQuery } from "@/sanity/queries"
import { PortableText } from "next-sanity"
import { Header } from "@/components/ui/header-04"

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  category?: string
  publishedAt?: string
  mainImage?: { asset: { _id: string; url: string }; alt?: string }
  body?: unknown[]
}

export const revalidate = 60

export async function generateStaticParams() {
  const posts: Post[] = await client.fetch(postsQuery)
  return posts.map((p) => ({ slug: p.slug.current }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post: Post | null = await client.fetch(postBySlugQuery, { slug })

  if (!post) notFound()

  return (
    <>
    <Header />
    <main className="min-h-screen bg-[#07080c] pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors mb-10"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <ArrowLeft size={12} /> Blog
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-5">
          {post.category && (
            <span
              className="text-[10px] tracking-widest text-[#017bfd] uppercase"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {post.category}
            </span>
          )}
          {post.publishedAt && (
            <span
              className="text-[10px] text-white/20"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {new Date(post.publishedAt).toLocaleDateString("es-MX", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          )}
        </div>

        <h1
          className="text-3xl font-bold text-white tracking-tight leading-tight mb-4"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {post.title}
        </h1>

        <p
          className="text-sm text-white/40 leading-relaxed mb-10 border-b border-white/10 pb-10"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {post.excerpt}
        </p>

        {/* Cover image */}
        {post.mainImage?.asset?.url && (
          <div className="w-full aspect-video bg-[#111214] overflow-hidden mb-10">
            <Image
              src={post.mainImage.asset.url}
              alt={post.mainImage.alt ?? post.title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Body */}
        {post.body && (
          <div
            className="prose prose-sm prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-white/60 prose-p:leading-relaxed
              prose-a:text-[#017bfd] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-code:text-[#017bfd] prose-code:text-xs
              prose-li:text-white/60"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <PortableText value={post.body} />
          </div>
        )}

      </div>
    </main>
    </>
  )
}
