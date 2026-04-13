"use client"

import Link from "next/link"
import { motion } from "motion/react"
import {
  Search, FileText, Download, BookOpen,
  Video, MessageCircle, ArrowRight, ChevronRight,
} from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { soporteData } from "@/data/soporte"

const quickLinks = [
  { icon: FileText,      label: "Manuales",        desc: "Documentación técnica completa",   href: "#productos" },
  { icon: Download,      label: "Software",         desc: "IDEs, drivers y herramientas",     href: "#productos" },
  { icon: Video,         label: "Videotutoriales",  desc: "Guías paso a paso en video",       href: "#productos" },
  { icon: BookOpen,      label: "Centro de ayuda",  desc: "FAQs y resolución de problemas",   href: "#productos" },
  { icon: MessageCircle, label: "Soporte técnico",  desc: "Habla con un ingeniero ADIMEX",    href: "#contacto"  },
]

export default function SoportePage() {
  return (
    <div data-theme="light" className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />

      {/* ── Hero ── */}
      <section className="pt-14 border-b border-black/8 bg-[#f7f8f9]">
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center text-center gap-6">
          <motion.p
            className="text-[11px] font-mono tracking-[0.2em] text-[#017bfd] uppercase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            Centro de soporte
          </motion.p>
          <motion.h1
            className="text-3xl lg:text-5xl font-semibold text-[#07080c] tracking-tight leading-tight"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          >
            ¿En qué podemos ayudarte?
          </motion.h1>
          <motion.p
            className="text-sm text-[#07080c]/45 max-w-md leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.14 }}
          >
            Manuales, software, tutoriales y soporte directo para todos los productos ADIMEX.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="w-full max-w-xl flex items-center gap-3 border border-black/12 bg-white px-4 py-3 mt-2 focus-within:border-[#017bfd]/50 transition-colors shadow-sm"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Search size={15} className="text-[#07080c]/30 shrink-0" />
            <input
              type="text"
              placeholder="Buscar producto, manual o pregunta frecuente..."
              className="flex-1 bg-transparent text-sm text-[#07080c] placeholder-[#07080c]/30 outline-none"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="border-b border-black/8">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-black/8">
            {quickLinks.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                className="group bg-white flex flex-col gap-2 p-5 hover:bg-[#f7f8f9] transition-colors"
              >
                <item.icon size={16} className="text-[#017bfd]" />
                <p className="text-xs font-medium text-[#07080c]/80 group-hover:text-[#07080c] transition-colors">{item.label}</p>
                <p className="text-[11px] font-mono text-[#07080c]/35 leading-snug">{item.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products hub ── */}
      <main id="productos" className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">

        <div className="flex items-baseline justify-between mb-10">
          <div>
            <p className="text-[11px] font-mono tracking-[0.2em] text-[#07080c]/30 uppercase mb-2">Por producto</p>
            <h2 className="text-xl font-semibold text-[#07080c]">Selecciona tu producto</h2>
          </div>
          <span className="text-[11px] font-mono text-[#07080c]/25">{soporteData.length} productos</span>
        </div>

        <div className="flex flex-col border border-black/8 divide-y divide-black/8">
          {soporteData.map((item, i) => (
            <motion.div
              key={item.productSlug}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/soporte/${item.productSlug}`}
                className="group flex items-center gap-6 px-6 py-5 hover:bg-[#f7f8f9] transition-colors"
              >
                <span className="hidden sm:block text-[10px] font-mono text-[#017bfd] bg-[#017bfd]/8 border border-[#017bfd]/20 px-2.5 py-1 shrink-0 w-28 text-center">
                  {item.category}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#07080c]/80 group-hover:text-[#07080c] transition-colors">
                    {item.productName}
                  </p>
                  <p className="text-[11px] font-mono text-[#07080c]/30 mt-0.5">
                    {item.downloads.length} archivos · {item.faqs.length} FAQs · {item.tutorials.length} tutoriales
                  </p>
                </div>

                <div className="hidden lg:flex items-center gap-2">
                  {(["manual", "software", "ficha", "certificado"] as const).map((cat) => {
                    const count = item.downloads.filter((d) => d.category === cat).length
                    if (!count) return null
                    const labels: Record<string, string> = { manual: "Manuales", software: "Software", ficha: "Fichas", certificado: "Certs." }
                    return (
                      <span key={cat} className="text-[10px] font-mono text-[#07080c]/35 border border-black/8 px-2 py-0.5">
                        {count} {labels[cat]}
                      </span>
                    )
                  })}
                </div>

                <ChevronRight size={14} className="text-[#07080c]/20 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ── Contact support ── */}
      <section id="contacto" className="border-t border-black/8 bg-[#f7f8f9]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-2 gap-px bg-black/8">

            <div className="bg-white p-8 flex flex-col gap-4">
              <MessageCircle size={20} className="text-[#017bfd]" />
              <h3 className="text-base font-semibold text-[#07080c]">¿No encontraste lo que buscas?</h3>
              <p className="text-sm text-[#07080c]/45 leading-relaxed">
                Nuestro equipo técnico está disponible de lunes a viernes de 8:00 a 18:00 (CST).
              </p>
              <Link href="#" className="mt-2 inline-flex items-center gap-2 text-xs text-[#017bfd] hover:underline underline-offset-4">
                Abrir ticket de soporte <ArrowRight size={12} />
              </Link>
            </div>

            <div className="bg-white p-8 flex flex-col gap-4">
              <BookOpen size={20} className="text-[#07080c]/25" />
              <h3 className="text-base font-semibold text-[#07080c]">Soporte de emergencia</h3>
              <p className="text-sm text-[#07080c]/45 leading-relaxed">
                Para paros de producción críticos, contáctanos directamente por WhatsApp o teléfono.
              </p>
              <Link href="#" className="mt-2 inline-flex items-center gap-2 text-xs text-[#07080c]/50 hover:text-[#07080c] transition-colors">
                Ver números de contacto <ArrowRight size={12} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
