import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { PortableText } from "next-sanity"
import type { PortableTextBlock } from "@portabletext/types"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import {
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
  type FullSanityPost,
} from "@/lib/blog"
import type { BlogPost } from "@/content/blog/types"
import Breadcrumbs, {
  BreadcrumbSchema,
} from "@/components/blog/breadcrumb"
import ArticleSchema from "@/components/blog/article-schema"
import FAQBlock, { FAQSchema } from "@/components/blog/faq"
import RelatedArticles from "@/components/blog/related-articles"
import BlogWhatsAppCTA from "@/components/blog/whatsapp-cta"
import BlogProductCard from "@/components/blog/product-card"

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const url = `https://adimex.io/blog/${slug}`
  const isStatic = "Body" in post
  const cover = post.cover?.src
  const description = post.excerpt

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      ...(cover ? { images: [{ url: cover, alt: post.cover?.alt ?? post.title }] } : {}),
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(cover ? { images: [cover] } : {}),
    },
    ...(isStatic && (post as BlogPost).focusKeyword
      ? { keywords: (post as BlogPost).focusKeyword }
      : {}),
  }
}

function isStaticPost(
  p: BlogPost | FullSanityPost
): p is BlogPost {
  return (p as BlogPost).Body !== undefined
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const canonical = `https://adimex.io/blog/${slug}`
  const isStatic = isStaticPost(post)

  const cluster = post.cluster
  const explicitRelated = isStatic
    ? (post as BlogPost).relatedPostSlugs
    : undefined
  const relatedProductSlugs = isStatic
    ? (post as BlogPost).relatedProductSlugs
    : (post as FullSanityPost).relatedProductSlugs
  const faq = isStatic ? (post as BlogPost).faq : (post as FullSanityPost).faq
  const waContext = isStatic
    ? (post as BlogPost).whatsappContext
    : (post as FullSanityPost).whatsappContext

  const related = await getRelatedPosts(slug, cluster, explicitRelated, 3)

  const breadcrumbs = [
    { name: "Inicio", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${slug}` },
  ]

  return (
    <>
      <Header />

      {/* Structured data */}
      {isStatic && (
        <ArticleSchema post={post as BlogPost} url={canonical} />
      )}
      <BreadcrumbSchema items={breadcrumbs} />
      {faq && faq.length > 0 && <FAQSchema items={faq} />}

      <main className="min-h-screen bg-[#07080c] pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb + back */}
          <div className="flex items-center justify-between">
            <Breadcrumbs items={breadcrumbs} />
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors"
            >
              <ArrowLeft size={12} /> Blog
            </Link>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mt-8 mb-5 flex-wrap">
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
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {isStatic && (post as BlogPost).readingMinutes && (
              <span
                className="text-[10px] text-white/20"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {(post as BlogPost).readingMinutes} min de lectura
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-base text-white/50 leading-relaxed mb-10 pb-10 border-b border-white/10">
            {isStatic ? (post as BlogPost).description : post.excerpt}
          </p>

          {/* Cover image */}
          {post.cover?.src && (
            <div className="w-full aspect-video bg-[#111214] overflow-hidden mb-12">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                width={900}
                height={506}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          {/* Body */}
          {isStatic ? (
            <article>
              {(post as BlogPost).Body()}
            </article>
          ) : (
            (post as FullSanityPost).body && (
              <div
                className="prose prose-sm prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-p:text-white/60 prose-p:leading-relaxed
                  prose-a:text-[#017bfd] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-code:text-[#017bfd] prose-code:text-xs
                  prose-li:text-white/60"
              >
                <PortableText
                  value={(post as FullSanityPost).body as PortableTextBlock[]}
                />

                {/* Auto-embed first related product for Sanity posts */}
                {relatedProductSlugs && relatedProductSlugs.length > 0 && (
                  <div className="not-prose">
                    <BlogProductCard
                      slug={relatedProductSlugs[0]}
                      variant="quote"
                      waContext={waContext}
                    />
                  </div>
                )}

                {/* Auto WhatsApp CTA for Sanity posts */}
                {waContext && (
                  <div className="not-prose">
                    <BlogWhatsAppCTA message={waContext} />
                  </div>
                )}
              </div>
            )
          )}

          {/* FAQ */}
          {faq && faq.length > 0 && <FAQBlock items={faq} />}

          {/* Related */}
          {cluster && (
            <RelatedArticles
              cluster={cluster}
              items={related.map((r) => ({
                slug: r.slug,
                title: r.title,
                excerpt: r.excerpt,
                category: r.category,
              }))}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
