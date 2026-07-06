import Link from "next/link"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"

/**
 * Layout compartido para páginas legales.
 * - Sidebar con TOC de las tres piezas legales.
 * - Estilo oscuro consistente con el blog.
 */

const legalNav = [
  {
    href: "/legal/aviso-de-privacidad",
    label: "Aviso de Privacidad",
    description: "Cómo tratamos tus datos personales (LFPDPPP).",
  },
  {
    href: "/legal/terminos-y-condiciones",
    label: "Términos y Condiciones",
    description: "Reglas de uso del sitio, compra y garantía.",
  },
  {
    href: "/legal/politica-de-cookies",
    label: "Política de Cookies",
    description: "Qué cookies usamos y cómo desactivarlas.",
  },
]

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#07080c] pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-[10px] tracking-widest text-white/20 uppercase mb-4"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            ADIMEX / Legal
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 mt-4">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <p
                className="text-[10px] tracking-widest text-white/40 uppercase mb-4"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Documentos
              </p>
              <nav className="flex flex-col gap-1">
                {legalNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col gap-1 px-3 py-3 border-l border-white/10 hover:border-[#017bfd] hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm text-white/80 group-hover:text-white">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-white/40 leading-snug">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 border border-white/10 p-4">
                <p
                  className="text-[10px] tracking-widest text-[#017bfd] uppercase mb-2"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  Contacto legal
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Para ejercer derechos ARCO, revocar consentimientos o
                  solicitar aclaraciones: escríbenos a
                  <br />
                  <a
                    href="mailto:contacto@adimex.io"
                    className="text-[#017bfd] hover:underline break-all"
                  >
                    contacto@adimex.io
                  </a>
                </p>
              </div>
            </aside>

            {/* Content */}
            <article
              className="prose prose-sm prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-white/60 prose-p:leading-relaxed
                prose-a:text-[#017bfd] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-li:text-white/60
                prose-h1:text-3xl prose-h1:text-white prose-h1:mb-2
                prose-h2:text-lg prose-h2:text-white prose-h2:mt-10 prose-h2:mb-3
                prose-h3:text-base prose-h3:text-white prose-h3:mt-6
                prose-hr:border-white/10
                prose-code:text-[#017bfd] prose-code:text-xs prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {children}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
