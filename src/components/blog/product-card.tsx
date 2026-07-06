import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingCart, MessageCircle } from "lucide-react"
import { getProductBySlug } from "@/lib/products"
import { WHATSAPP_NUMBER } from "@/lib/contact"

/**
 * Tarjeta de producto embebida dentro de un artículo del blog.
 * Es el puente principal a la conversión: precio, disponibilidad y CTA
 * directo a la ficha (ancla #comprar) o a WhatsApp con contexto.
 */
export default async function BlogProductCard({
  slug,
  variant = "buy",
  waContext,
}: {
  slug: string
  /** "buy" muestra CTA de compra, "quote" muestra CTA de WhatsApp. */
  variant?: "buy" | "quote"
  /** Texto precargado que acompaña al link de WhatsApp. */
  waContext?: string
}) {
  const product = await getProductBySlug(slug)
  if (!product) return null

  const priceMXN =
    product.price && product.currencyCode
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          minimumFractionDigits: 0,
        }).format(
          parseFloat(product.price) * (product.currencyCode !== "MXN" ? 18 : 1)
        )
      : null

  const waMsg = waContext
    ? `Hola, ${waContext} Vi el ${product.name} en su blog.`
    : `Hola, me interesa cotizar el ${product.name}.`
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`

  const showBuy = variant === "buy" && product.variantId && product.price
  const productHref = `/productos/${product.slug}${showBuy ? "#comprar" : ""}`

  return (
    <aside className="my-10 border border-white/10 bg-white/[0.02] flex flex-col md:flex-row overflow-hidden">
      <div className="relative aspect-video md:aspect-square md:w-56 shrink-0 bg-[#f7f8fa] border-b md:border-b-0 md:border-r border-white/10">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain object-center p-5"
          sizes="(max-width: 768px) 100vw, 224px"
        />
      </div>
      <div className="flex-1 p-6 flex flex-col gap-3">
        <span
          className="text-[10px] tracking-widest uppercase text-[#017bfd]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {product.categoryLabel} · {product.series}
        </span>
        <h3 className="text-lg font-semibold text-white leading-tight tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
          {product.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-2">
          {priceMXN && showBuy && (
            <p className="text-lg font-semibold text-white">
              {priceMXN}
              <span className="text-xs text-white/40 font-normal ml-2">
                IVA incluido
              </span>
            </p>
          )}
          {product.availableForSale && showBuy && (
            <span className="text-[10px] tracking-widest uppercase text-emerald-300/90">
              En stock
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          {showBuy ? (
            <Link
              href={productHref}
              className="inline-flex items-center gap-2 h-10 px-4 bg-[#017bfd] hover:bg-[#0066d6] text-white text-xs font-semibold transition-colors"
            >
              <ShoppingCart size={14} />
              Comprar en línea
            </Link>
          ) : (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-10 px-4 bg-[#017bfd] hover:bg-[#0066d6] text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle size={14} />
              Cotizar por WhatsApp
            </a>
          )}
          <Link
            href={productHref}
            className="inline-flex items-center gap-1.5 h-10 px-4 border border-white/15 text-white/80 hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Ver ficha completa
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </aside>
  )
}
