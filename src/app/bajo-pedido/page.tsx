import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { getProducts, categoryMeta, type ProductCategory } from "@/lib/products"
import { WHATSAPP_NUMBER } from "@/lib/contact"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata = {
  title: "Equipo bajo pedido",
  description:
    "Catálogo FLEXEM disponible bajo pedido: servomotores, IoT gateways, SCADA y cloud. Cotización con precio y disponibilidad en 24-48 h.",
  alternates: { canonical: "https://adimex.io/bajo-pedido" },
}

const BAJO_PEDIDO_LINES: { anchor: string; category: ProductCategory; blurb: string }[] = [
  {
    anchor: "servomotores",
    category: "servo",
    // TODO(REDACTAR): 2-3 líneas sobre la oferta de servomotores FLEXEM
    // (potencias, aplicaciones, tiempo típico de entrega).
    blurb:
      "[[PLACEHOLDER — describir familia de servomotores FLEXEM disponibles y tiempo de entrega]]",
  },
  {
    anchor: "iot-gateways",
    category: "iot-gateway",
    blurb:
      "[[PLACEHOLDER — describir familia de gateways IoT FLEXEM y protocolos soportados]]",
  },
  {
    anchor: "scada",
    category: "scada",
    blurb:
      "[[PLACEHOLDER — describir opciones SCADA / FlexSCADA y modalidad de licenciamiento]]",
  },
  {
    anchor: "cloud",
    category: "cloud",
    blurb:
      "[[PLACEHOLDER — describir plataforma cloud FLEXEM y planes disponibles]]",
  },
]

export default async function BajoPedidoPage() {
  const all = await getProducts({})
  const byCategory = BAJO_PEDIDO_LINES.map((line) => ({
    ...line,
    products: all.filter((p) => p.category === line.category && !p.shopifyHandle),
  })).filter((line) => line.products.length > 0)

  const waMsg =
    "Hola, quiero cotizar equipo bajo pedido de FLEXEM. Vi la línea en su sitio."
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`

  return (
    <div
      className="flex flex-col min-h-screen bg-white"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <BreadcrumbSchema
        items={[
          { name: "Inicio", href: "/" },
          { name: "Equipo bajo pedido", href: "/bajo-pedido" },
        ]}
      />
      <Header />

      <main data-theme="light" className="flex-1 max-w-6xl mx-auto w-full px-6 pt-24 pb-20">
        {/* Hero */}
        <section className="border-b border-black/10 pb-8 mb-10">
          <p className="text-[10px] tracking-widest text-[#017bfd] uppercase font-mono mb-2">
            Catálogo bajo pedido
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#07080c] tracking-tight max-w-2xl">
            Equipo bajo pedido
          </h1>
          <p className="mt-3 text-sm text-[#494F5F] leading-relaxed max-w-2xl">
            {/* PLACEHOLDER — párrafo introductorio: qué encuentras aquí y por qué
                está separado del catálogo con stock */}
            [[PLACEHOLDER — introducción a la sección bajo pedido: cotización 24-48 h,
            fabricación FLEXEM, pago 50/50]]
          </p>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 min-h-11 px-5 bg-[#017bfd] hover:bg-[#0066d6] text-white text-sm font-semibold transition-colors"
          >
            <MessageCircle size={15} />
            Cotizar por WhatsApp
          </a>
        </section>

        {/* Líneas */}
        <section className="flex flex-col gap-14">
          {byCategory.map((line) => (
            <div key={line.anchor} id={line.anchor} className="scroll-mt-24">
              <div className="flex items-baseline justify-between border-b border-black/10 pb-3 mb-6">
                <h2 className="text-xl font-semibold text-[#07080c]">
                  {categoryMeta[line.category].label}
                </h2>
                <span className="text-[11px] text-gray-400 font-mono">
                  {line.products.length} modelo{line.products.length !== 1 ? "s" : ""}
                </span>
              </div>

              <p className="text-sm text-[#494F5F] leading-relaxed max-w-2xl mb-6">
                {line.blurb}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {line.products.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/productos/${p.slug}`}
                      className="group flex items-center justify-between gap-3 border border-black/8 hover:border-[#017bfd]/40 bg-white px-4 py-3 transition-colors min-h-11"
                    >
                      <span className="text-sm text-[#07080c] group-hover:text-[#017bfd] transition-colors">
                        {p.name}
                      </span>
                      <ArrowRight
                        size={12}
                        className="text-gray-400 group-hover:text-[#017bfd] group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}
