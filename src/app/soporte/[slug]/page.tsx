"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { use, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft, Download, FileText, ChevronDown,
  Play, Clock, BookOpen, Lock, ArrowRight, Package,
} from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import {
  getSoporteBySlug, soporteData,
  downloadCategoryLabel, downloadCategoryColor,
  type DownloadCategory,
} from "@/data/soporte"
import { cn } from "@/lib/utils"

const levelColor: Record<string, string> = {
  "Básico":     "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Intermedio": "text-amber-700  bg-amber-50  border-amber-200",
  "Avanzado":   "text-red-700    bg-red-50    border-red-200",
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="border-b border-black/8 last:border-0"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm text-[#07080c]/70 group-hover:text-[#07080c] transition-colors leading-snug pr-2">
          {question}
        </span>
        <ChevronDown
          size={15}
          className={cn("text-[#07080c]/25 shrink-0 mt-0.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[#07080c]/55 leading-relaxed pb-5 border-l-2 border-[#017bfd] pl-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SoporteProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const data = getSoporteBySlug(slug)
  if (!data) notFound()

  const cats = Array.from(new Set(data.downloads.map((d) => d.category))) as DownloadCategory[]
  const related = soporteData.filter((s) => s.productSlug !== slug).slice(0, 3)

  const [activeTab, setActiveTab] = useState<"descargas" | "faqs" | "tutoriales">("descargas")

  return (
    <div data-theme="light" className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />

      {/* ── Breadcrumb ── */}
      <div className="pt-14 border-b border-black/8 bg-[#f7f8f9]">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-[11px] font-mono text-[#07080c]/30">
          <Link href="/soporte" className="hover:text-[#07080c]/60 transition-colors">Soporte</Link>
          <span>/</span>
          <span className="text-[#07080c]/55">{data.productName}</span>
        </div>
      </div>

      {/* ── Header ── */}
      <section className="border-b border-black/8">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#017bfd] uppercase">
              {data.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#07080c] tracking-tight">
              {data.productName}
            </h1>
            <div className="flex items-center gap-4 text-[11px] font-mono text-[#07080c]/30">
              <span className="flex items-center gap-1.5"><Download size={11} />{data.downloads.length} archivos</span>
              <span className="flex items-center gap-1.5"><BookOpen size={11} />{data.faqs.length} preguntas</span>
              <span className="flex items-center gap-1.5"><Play size={11} />{data.tutorials.length} tutoriales</span>
            </div>
          </div>
          <Link
            href={`/productos/${slug}`}
            className="inline-flex items-center gap-2 text-xs text-[#07080c]/40 border border-black/10 px-4 py-2 hover:border-black/25 hover:text-[#07080c]/70 transition-colors shrink-0"
          >
            <Package size={12} /> Ver producto
          </Link>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-0 border-t border-black/8">
          {(["descargas", "faqs", "tutoriales"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-3.5 text-xs font-mono tracking-wide transition-colors border-b-2 capitalize",
                activeTab === tab
                  ? "text-[#07080c] border-[#017bfd]"
                  : "text-[#07080c]/35 border-transparent hover:text-[#07080c]/60"
              )}
            >
              {tab === "descargas" ? `Descargas (${data.downloads.length})` :
               tab === "faqs"     ? `FAQs (${data.faqs.length})` :
                                    `Tutoriales (${data.tutorials.length})`}
            </button>
          ))}
        </div>
      </section>

      {/* ── Content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <AnimatePresence mode="wait">

          {/* DESCARGAS */}
          {activeTab === "descargas" && (
            <motion.div
              key="descargas"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-10"
            >
              {cats.map((cat) => (
                <div key={cat}>
                  <p className="text-[10px] font-mono tracking-[0.2em] text-[#07080c]/30 uppercase mb-4">
                    {downloadCategoryLabel[cat]}
                  </p>
                  <div className="flex flex-col border border-black/8 divide-y divide-black/8">
                    {data.downloads.filter((d) => d.category === cat).map((file) => (
                      <div key={file.name} className="flex items-center gap-5 px-5 py-4 group hover:bg-[#f7f8f9] transition-colors">
                        <FileText size={15} className="text-[#07080c]/20 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#07080c]/80 group-hover:text-[#07080c] transition-colors truncate">
                            {file.name}
                          </p>
                          <p className="text-[11px] font-mono text-[#07080c]/35 mt-0.5 truncate">
                            {file.description}
                          </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 shrink-0">
                          <span className={cn("text-[10px] font-mono px-2 py-0.5 border", downloadCategoryColor[cat])}>
                            {downloadCategoryLabel[cat]}
                          </span>
                          {file.version && (
                            <span className="text-[10px] font-mono text-[#07080c]/25 border border-black/8 px-2 py-0.5">
                              {file.version}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-[#07080c]/25">{file.size}</span>
                        </div>
                        <a
                          href={file.href}
                          className="flex items-center gap-1.5 text-xs text-[#017bfd] hover:text-white border border-[#017bfd]/30 hover:border-[#017bfd] hover:bg-[#017bfd] px-3 py-1.5 transition-colors shrink-0"
                        >
                          <Download size={11} />
                          <span className="hidden sm:inline">Descargar</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* FAQs */}
          {activeTab === "faqs" && (
            <motion.div
              key="faqs"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-3xl">
                <p className="text-[11px] font-mono tracking-[0.2em] text-[#07080c]/30 uppercase mb-6">
                  Preguntas frecuentes — {data.productName}
                </p>
                <div className="border border-black/8 divide-y divide-black/8 px-6">
                  {data.faqs.map((faq, i) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-4 border border-black/8 bg-[#f7f8f9] px-6 py-5">
                  <BookOpen size={16} className="text-[#07080c]/25 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#07080c]/70">¿No encontraste tu respuesta?</p>
                    <p className="text-[11px] font-mono text-[#07080c]/35 mt-0.5">Nuestro equipo técnico puede ayudarte.</p>
                  </div>
                  <Link href="#" className="text-xs text-[#017bfd] hover:underline underline-offset-4 shrink-0 flex items-center gap-1">
                    Contactar <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* TUTORIALES */}
          {activeTab === "tutoriales" && (
            <motion.div
              key="tutoriales"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <p className="text-[11px] font-mono tracking-[0.2em] text-[#07080c]/30 uppercase">
                Videotutoriales — {data.productName}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {data.tutorials.map((tut, i) => {
                  const isAvailable = !!tut.videoId
                  return (
                    <motion.div
                      key={tut.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      className="border border-black/8 flex flex-col group hover:border-black/15 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-[#f0f1f3] flex items-center justify-center overflow-hidden">
                        {isAvailable ? (
                          <a
                            href={`https://youtube.com/watch?v=${tut.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center hover:bg-black/5 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#017bfd] flex items-center justify-center shadow-md">
                              <Play size={18} className="text-white ml-0.5" />
                            </div>
                          </a>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Lock size={18} className="text-[#07080c]/20" />
                            <p className="text-[11px] font-mono text-[#07080c]/25">Próximamente</p>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[10px] font-mono px-2 py-0.5 border", levelColor[tut.level])}>
                            {tut.level}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-mono text-[#07080c]/30">
                            <Clock size={10} /> {tut.duration}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[#07080c]/80 group-hover:text-[#07080c] transition-colors leading-snug">
                          {tut.title}
                        </p>
                        <p className="text-xs text-[#07080c]/40 leading-relaxed mt-auto">
                          {tut.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="border border-black/8 bg-[#f7f8f9] px-6 py-5 flex items-start gap-4">
                <Play size={14} className="text-[#017bfd] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#07080c]/70">Más tutoriales en camino</p>
                  <p className="text-[11px] font-mono text-[#07080c]/35 mt-1 leading-relaxed">
                    Estamos produciendo contenido adicional. Suscríbete al boletín ADIMEX para ser el primero en enterarte.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Other products ── */}
      <section className="border-t border-black/8 bg-[#f7f8f9]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-[11px] font-mono tracking-[0.2em] text-[#07080c]/30 uppercase mb-6">
            Otros productos
          </p>
          <div className="flex flex-col border border-black/8 divide-y divide-black/8">
            {related.map((item) => (
              <Link
                key={item.productSlug}
                href={`/soporte/${item.productSlug}`}
                className="group bg-white flex items-center gap-5 px-5 py-4 hover:bg-[#f7f8f9] transition-colors"
              >
                <span className="text-[10px] font-mono text-[#017bfd] bg-[#017bfd]/8 border border-[#017bfd]/20 px-2.5 py-1 shrink-0 hidden sm:block w-24 text-center">
                  {item.category}
                </span>
                <p className="text-sm text-[#07080c]/60 group-hover:text-[#07080c] transition-colors flex-1">{item.productName}</p>
                <span className="text-[11px] font-mono text-[#07080c]/25">{item.downloads.length} archivos</span>
                <ArrowRight size={13} className="text-[#07080c]/15 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back ── */}
      <div className="border-t border-black/8">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <Link href="/soporte" className="inline-flex items-center gap-2 text-xs font-mono text-[#07080c]/30 hover:text-[#07080c]/60 transition-colors">
            <ArrowLeft size={12} /> Centro de soporte
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
