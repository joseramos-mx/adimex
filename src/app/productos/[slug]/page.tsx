import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { products } from "@/data/products"
import { getProductBySlug, categoryMeta } from "@/lib/products"
import { Button } from "@/components/ui/button"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | ADIMEX`,
    description: product.tagline,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 2)
  const meta = categoryMeta[product.category]

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />

      {/* Breadcrumb */}
      <div data-theme="light" className="pt-20 px-6 border-b border-black/5 bg-white">
        <div className="max-w-5xl mx-auto py-3 flex items-center gap-2 text-[11px] font-mono text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-gray-600 transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-[#07080c]">{product.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section data-theme="light" className="border-b border-black/5 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="flex flex-col gap-5">
            <span className="text-[9px] tracking-widest uppercase text-[#017bfd] bg-[#017bfd]/10 border border-[#017bfd]/20 px-2 py-0.5 font-mono w-fit">
              {meta.label}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight">
              {product.name}
            </h1>
            <p className="text-base text-[#494F5F] leading-relaxed">{product.tagline}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0">
                <Link href="#">Solicitar cotización</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 text-xs border-black/15 bg-white text-[#07080c] hover:bg-gray-50"
              >
                <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <span>Ver en FLEXEM</span>
                  <ExternalLink size={11} />
                </a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <main data-theme="light" className="flex-1 max-w-5xl mx-auto w-full px-6 py-14 space-y-14">

        {/* Description */}
        <section>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-4">Descripción</p>
          <p className="text-sm text-[#494F5F] leading-relaxed max-w-2xl">{product.description}</p>
        </section>

        {/* Features */}
        <section>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-6">Características principales</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.features.map((feat) => (
              <div key={feat} className="flex items-start gap-3 p-4 bg-gray-50 border border-black/5">
                <CheckCircle2 size={14} className="text-[#017bfd] mt-0.5 shrink-0" />
                <p className="text-xs text-[#494F5F] leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs */}
        <section>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-6">Especificaciones técnicas</p>
          <div className="border border-black/5 divide-y divide-black/5">
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`grid grid-cols-2 px-5 py-3 text-xs gap-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <span className="text-gray-400 font-mono">{spec.label}</span>
                <span className="text-[#07080c]">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Applications */}
        <section>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-6">Aplicaciones</p>
          <div className="flex flex-wrap gap-2">
            {product.applications.map((app) => (
              <span
                key={app}
                className="text-[11px] text-[#494F5F] border border-black/10 px-3 py-1.5 hover:border-[#017bfd]/40 hover:text-[#017bfd] transition-colors"
              >
                {app}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border border-black/5 bg-gray-50 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[#07080c]">¿Listo para implementar {product.name}?</p>
            <p className="text-xs text-gray-500 mt-1">Nuestro equipo técnico puede ayudarte a seleccionar la configuración correcta.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 shrink-0">
              <Link href="#">Agendar demo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-9 text-xs border-black/15 bg-white text-[#07080c] hover:bg-gray-100 shrink-0"
            >
              <Link href="/productos" className="flex items-center gap-1.5">
                <ArrowLeft size={11} />
                <span>Ver todos</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-6">Productos relacionados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/productos/${rel.slug}`}
                  className="group flex items-center gap-4 p-4 bg-white border border-black/8 hover:border-[#017bfd]/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="relative w-16 h-16 shrink-0 bg-gray-100 overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#07080c] group-hover:text-[#017bfd] transition-colors truncate">
                      {rel.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{rel.tagline}</p>
                  </div>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  )
}
