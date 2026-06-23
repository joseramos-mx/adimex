import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  MessageCircle,
} from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { getProductBySlug, categoryMeta, getProducts } from "@/lib/products"
import { Button } from "@/components/ui/button"
import AddToCart from "@/components/add-to-cart"
import ProductTabs from "@/components/product-tabs"
import { WHATSAPP_NUMBER } from "@/lib/contact"

const TRUST = [
  { Icon: Truck,       title: "Envío nacional",   sub: "3-5 días hábiles" },
  { Icon: ShieldCheck, title: "Garantía",          sub: "Del fabricante FLEXEM" },
  { Icon: Headphones,  title: "Soporte técnico",   sub: "En español" },
  { Icon: RotateCcw,   title: "Devoluciones",      sub: "30 días sin cargo" },
]

export async function generateStaticParams() {
  const all = await getProducts({})
  return all.map((p) => ({ slug: p.slug }))
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

  const allProducts = await getProducts({ category: product.category })
  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3)
  const meta = categoryMeta[product.category]

  const waQuote = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa cotizar el ${product.name}.`
  )}`
  const waDemo = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, quiero agendar una demo del ${product.name}.`
  )}`

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />

      {/* Breadcrumb */}
      <div data-theme="light" className="pt-20 px-6 border-b border-black/5 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto py-3 flex items-center gap-2 text-[11px] font-mono text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-gray-600 transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-[#07080c] truncate max-w-50">{product.name}</span>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section data-theme="light" className="bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* Left — product image */}
            <div className="relative aspect-square bg-[#f7f8fa] border border-black/5 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-contain object-center p-10"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Right — purchase panel (sticky on lg) */}
            <div id="comprar" className="lg:sticky lg:top-24 flex flex-col gap-5 scroll-mt-24">

              {/* Badges row */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-[9px] tracking-widest uppercase text-[#017bfd] bg-[#017bfd]/8 border border-[#017bfd]/20 px-2 py-0.5 font-mono">
                  {meta.label}
                </span>
                {product.series && (
                  <span className="text-[9px] tracking-widest uppercase text-gray-400 border border-black/10 px-2 py-0.5 font-mono">
                    {product.series}
                  </span>
                )}
                {product.availableForSale && (
                  <span className="text-[9px] tracking-widest uppercase text-green-600 bg-green-50 border border-green-200/60 px-2 py-0.5 font-mono">
                    En stock
                  </span>
                )}
              </div>

              {/* Title + tagline */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-semibold text-[#07080c] leading-tight tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-[#494F5F] leading-relaxed mt-2">{product.tagline}</p>
              </div>

              <div className="h-px bg-black/6" />

              {/* AddToCart or quote */}
              {product.variantId && product.price ? (
                <AddToCart
                  variantId={product.variantId}
                  price={product.price}
                  currencyCode={product.currencyCode ?? "MXN"}
                  availableForSale={product.availableForSale ?? false}
                  quantityAvailable={product.quantityAvailable ?? 0}
                  productName={product.name}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-gray-400">Precio a consultar · Contacta a un asesor ADIMEX</p>
                  <a
                    href={waQuote}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-[#017bfd] hover:bg-[#0066d6] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle size={15} />
                    Solicitar cotización
                  </a>
                  <Link
                    href={`/soporte/${product.slug}`}
                    className="w-full h-12 border border-black/15 text-sm font-medium flex items-center justify-center gap-1.5 text-[#07080c] hover:bg-gray-50 transition-colors"
                  >
                    Ver documentación
                    <ExternalLink size={11} />
                  </Link>
                </div>
              )}

              <div className="h-px bg-black/6" />

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {TRUST.map(({ Icon, title, sub }) => (
                  <div key={title} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#017bfd]/6 shrink-0">
                      <Icon size={14} className="text-[#017bfd]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#07080c] leading-none">{title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* External link */}
              {product.externalUrl && (
                <a
                  href={product.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#017bfd] font-mono transition-colors w-fit"
                >
                  <ExternalLink size={10} />
                  Ver en FLEXEM.com
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content tabs + bottom sections ───────────────────── */}
      <main data-theme="light" className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        <ProductTabs
          description={product.description}
          features={product.features}
          specs={product.specs}
          applications={product.applications}
        />

        {/* CTA strip */}
        <div className="mt-10 border border-black/5 bg-[#fafafa] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[#07080c]">¿Listo para implementar {product.name}?</p>
            <p className="text-xs text-gray-500 mt-1">
              Nuestro equipo técnico te ayuda a seleccionar la configuración correcta.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={waDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <MessageCircle size={13} />
              Agendar demo
            </a>
            <Button
              asChild
              variant="outline"
              className="h-9 text-xs border-black/15 bg-white text-[#07080c] hover:bg-gray-100 shrink-0"
            >
              <Link href="/productos" className="flex items-center gap-1.5">
                <ArrowLeft size={11} />
                Ver todos
              </Link>
            </Button>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-14">
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-6">
              También te puede interesar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/productos/${rel.slug}`}
                  className="group flex flex-col bg-white border border-black/8 hover:border-[#017bfd]/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-video bg-[#f7f8fa] overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-1.5">
                    <span className="text-[8px] tracking-widest uppercase text-[#017bfd] font-mono">
                      {categoryMeta[rel.category].label}
                    </span>
                    <p className="text-xs font-semibold text-[#07080c] group-hover:text-[#017bfd] transition-colors line-clamp-2">
                      {rel.name}
                    </p>
                    <p className="text-[11px] text-gray-400 line-clamp-2">{rel.tagline}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      {rel.price && (
                        <span className="text-xs font-mono font-semibold text-[#07080c]">
                          {new Intl.NumberFormat("es-MX", {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 0,
                          }).format(
                            parseFloat(rel.price) * (rel.currencyCode !== "MXN" ? 18 : 1)
                          )}
                        </span>
                      )}
                      <ArrowRight
                        size={12}
                        className="text-gray-300 group-hover:text-[#017bfd] group-hover:translate-x-0.5 transition-all ml-auto"
                      />
                    </div>
                  </div>
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
