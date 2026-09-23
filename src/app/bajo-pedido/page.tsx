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
    blurb:
      "Servos y drivers FLEXEM para control de movimiento. Dinos la carga y la aplicación y te recomendamos el modelo.",
  },
  {
    anchor: "iot-gateways",
    category: "iot-gateway",
    blurb:
      "Para llevar los datos de tus máquinas a la nube o a tu SCADA sin cambiar tu PLC actual.",
  },
  {
    anchor: "scada",
    category: "scada",
    blurb:
      "FlexSCADA para supervisar tu proceso desde una sola pantalla. Lo platicamos contigo antes de cotizar.",
  },
  {
    anchor: "cloud",
    category: "cloud",
    blurb:
      "FlexCloud para monitoreo remoto de equipos FLEXEM. Te decimos si tu instalación lo necesita o no.",
  },
]

const HOW_STEPS = [
  "Nos dices el modelo o, si no lo sabes, la aplicación.",
  "Te mandamos precio con IVA y fecha estimada de entrega.",
  "Pagas con un link seguro de Shopify y te facturamos CFDI 4.0.",
]

function waForFamily(label: string): string {
  const msg = `Hola, quiero precio bajo pedido de ${label}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default async function BajoPedidoPage() {
  const all = await getProducts({})
  const byCategory = BAJO_PEDIDO_LINES.map((line) => ({
    ...line,
    products: all.filter((p) => p.category === line.category && !p.shopifyHandle),
  })).filter((line) => line.products.length > 0)

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
            En la tienda en línea están los equipos que tenemos en stock en
            México. El resto de la línea FLEXEM te lo traemos bajo pedido:
            antes de que pagues, te confirmamos por escrito el precio con IVA
            y la fecha de entrega.
          </p>
        </section>

        {/* Líneas */}
        <section className="flex flex-col gap-14">
          {byCategory.map((line) => {
            const label = categoryMeta[line.category].label
            return (
              <div key={line.anchor} id={line.anchor} className="scroll-mt-24">
                <div className="flex items-baseline justify-between border-b border-black/10 pb-3 mb-6">
                  <h2 className="text-xl font-semibold text-[#07080c]">{label}</h2>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {line.products.length} modelo{line.products.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-sm text-[#494F5F] leading-relaxed max-w-2xl mb-6">
                  {line.blurb}
                </p>

                <a
                  href={waForFamily(label)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-surface={`bajo-pedido:${line.anchor}`}
                  className="mb-6 inline-flex items-center gap-2 min-h-11 px-4 bg-[#017bfd] hover:bg-[#0066d6] text-white text-sm font-semibold transition-colors"
                >
                  <MessageCircle size={14} />
                  Pedir precio de {label} por WhatsApp
                </a>

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
            )
          })}
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="mt-16 border-t border-black/10 pt-10 scroll-mt-24">
          <h2 className="text-xl font-semibold text-[#07080c] mb-6">Cómo funciona</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 border border-black/10 bg-[#fafafa] p-5"
              >
                <span className="text-[10px] tracking-widest font-mono text-[#017bfd]">
                  Paso {i + 1}
                </span>
                <p className="text-sm text-[#07080c] leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  )
}
