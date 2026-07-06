import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata: Metadata = {
  title: "Documentos legales",
  description:
    "Aviso de Privacidad, Términos y Condiciones y Política de Cookies del sitio ADIMEX — distribuidor autorizado FLEXEM en México.",
  alternates: { canonical: "https://adimex.io/legal" },
}

const docs = [
  {
    href: "/legal/aviso-de-privacidad",
    title: "Aviso de Privacidad",
    description:
      "Cómo tratamos tus datos personales conforme a la LFPDPPP. Derechos ARCO, transferencias y contacto con el responsable.",
  },
  {
    href: "/legal/terminos-y-condiciones",
    title: "Términos y Condiciones",
    description:
      "Reglas de uso del sitio, proceso de compra, envíos, devoluciones, garantía FLEXEM y jurisdicción aplicable.",
  },
  {
    href: "/legal/politica-de-cookies",
    title: "Política de Cookies",
    description:
      "Qué cookies usamos, por qué, cuánto duran y cómo desactivarlas desde tu navegador.",
  },
]

export default function LegalIndexPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Inicio", href: "/" },
          { name: "Legal", href: "/legal" },
        ]}
      />

      <h1>Documentos legales</h1>
      <p>
        Reunimos aquí los documentos que rigen el uso de{" "}
        <a href="https://adimex.io">adimex.io</a> y la relación comercial
        con ADIMEX como distribuidor autorizado FLEXEM en México. Los tres
        se actualizan cuando cambia algún tratamiento de datos, cláusula
        comercial o integración de terceros.
      </p>

      <div className="not-prose mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8 border border-black/8">
        {docs.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="group flex flex-col gap-3 bg-white hover:bg-gray-50 transition-colors p-6"
          >
            <p
              className="text-[10px] tracking-widest text-[#017bfd] uppercase"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Documento
            </p>
            <h3 className="text-base font-semibold text-[#07080c] leading-snug">
              {doc.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {doc.description}
            </p>
            <span className="mt-auto inline-flex items-center gap-1 text-xs text-gray-600 group-hover:text-[#017bfd] transition-colors pt-3">
              Leer documento
              <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
