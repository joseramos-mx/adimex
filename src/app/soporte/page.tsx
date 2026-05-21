"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { motion } from "motion/react"
import {
  Search, FileText, Download, BookOpen,
  Cpu, MessageCircle, ArrowRight, ChevronRight, X, Play,
} from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { soporteData } from "@/data/soporte"
import { cn } from "@/lib/utils"

type QuickLink =
  | { icon: typeof FileText; label: string; desc: string; query: string }
  | { icon: typeof FileText; label: string; desc: string; href: string }

const quickLinks: QuickLink[] = [
  { icon: FileText,      label: "Brochures",        desc: "Catálogos y fichas técnicas",        query: "brochure" },
  { icon: Download,      label: "Dimensiones / CAD", desc: "Planos 2D y archivos DWG",          query: "dimensional" },
  { icon: Cpu,           label: "Compatibilidad",   desc: "Integración con tu PLC actual",      query: "funciona" },
  { icon: BookOpen,      label: "Garantía y envío", desc: "Tiempos, garantías y devoluciones",  query: "garantia" },
  { icon: MessageCircle, label: "Soporte técnico",  desc: "Habla con un ingeniero ADIMEX",      href: "#contacto"  },
]

// ─── Search helpers ─────────────────────────────────────────────────────────

// Spanish stop words ignored when matching tokens
const STOP_WORDS = new Set([
  "a", "al", "como", "con", "de", "del", "el", "en", "es", "la", "las", "le",
  "les", "lo", "los", "me", "mi", "o", "para", "por", "que", "se", "su", "sus",
  "te", "tu", "un", "una", "y",
])

// Strip diacritics and lowercase for matching: "Querétaro" → "queretaro"
const normalize = (s: string): string =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")

const tokenize = (q: string): string[] =>
  normalize(q)
    .split(/[\s,.()/-]+/)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t))

type SearchResult = {
  type: "producto" | "descarga" | "faq" | "tutorial"
  title: string
  snippet: string
  productName: string
  href: string
  /** When true, href is an external file URL — open in new tab, force download */
  external?: boolean
  score: number
}

const typeColors: Record<SearchResult["type"], string> = {
  producto: "text-[#017bfd] bg-[#017bfd]/8 border-[#017bfd]/20",
  descarga: "text-violet-700 bg-violet-50 border-violet-200",
  faq:      "text-emerald-700 bg-emerald-50 border-emerald-200",
  tutorial: "text-amber-700 bg-amber-50 border-amber-200",
}

const typeIcon: Record<SearchResult["type"], typeof FileText> = {
  producto: ChevronRight,
  descarga: Download,
  faq:      BookOpen,
  tutorial: Play,
}

function search(query: string): SearchResult[] | null {
  const tokens = tokenize(query)
  if (tokens.length === 0) return null

  const hits = (haystack: string): number => {
    const h = normalize(haystack)
    return tokens.filter((t) => h.includes(t)).length
  }
  const matchesAll = (haystack: string): boolean => hits(haystack) === tokens.length

  const results: SearchResult[] = []

  for (const item of soporteData) {
    const productCtx = `${item.productName} ${item.category} ${item.productSlug}`
    const productHits = hits(productCtx)

    // ─ Product itself ──────────────────────────────────────────────────────
    if (matchesAll(productCtx)) {
      results.push({
        type: "producto",
        title: item.productName,
        snippet: `${item.category} · ${item.downloads.length} archivos · ${item.faqs.length} FAQs · ${item.tutorials.length} tutoriales`,
        productName: item.productName,
        href: `/soporte/${item.productSlug}`,
        score: productHits * 100,
      })
    }

    // ─ Downloads ───────────────────────────────────────────────────────────
    for (const d of item.downloads) {
      const own = `${d.name} ${d.description} ${d.category}`
      if (matchesAll(`${own} ${productCtx}`)) {
        // Link directly to the file if available; otherwise to product page
        const isReal = Boolean(d.href) && d.href !== "#"
        results.push({
          type: "descarga",
          title: d.name,
          snippet: d.description,
          productName: item.productName,
          href: isReal ? d.href : `/soporte/${item.productSlug}#descargas`,
          external: isReal,
          score: hits(own) * 10 + productHits * 2,
        })
      }
    }

    // ─ FAQs ────────────────────────────────────────────────────────────────
    for (const f of item.faqs) {
      const own = `${f.question} ${f.answer}`
      if (matchesAll(`${own} ${productCtx}`)) {
        results.push({
          type: "faq",
          title: f.question,
          snippet: f.answer.length > 140 ? f.answer.slice(0, 140) + "…" : f.answer,
          productName: item.productName,
          href: `/soporte/${item.productSlug}#faqs`,
          score: hits(own) * 5 + productHits * 2,
        })
      }
    }

    // ─ Tutorials ───────────────────────────────────────────────────────────
    for (const t of item.tutorials) {
      const own = `${t.title} ${t.description}`
      if (matchesAll(`${own} ${productCtx}`)) {
        results.push({
          type: "tutorial",
          title: t.title,
          snippet: t.description,
          productName: item.productName,
          href: `/soporte/${item.productSlug}#tutoriales`,
          score: hits(own) * 5 + productHits * 2,
        })
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 20)
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SoportePage() {
  const [query, setQuery] = useState("")
  const results = useMemo(() => search(query), [query])
  const isSearching = results !== null

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto, manual o pregunta frecuente..."
              className="flex-1 bg-transparent text-sm text-[#07080c] placeholder-[#07080c]/30 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[#07080c]/30 hover:text-[#07080c]/60 transition-colors shrink-0"
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>

          {isSearching && (
            <p className="text-[11px] font-mono text-[#07080c]/35">
              {results!.length} resultado{results!.length !== 1 ? "s" : ""} para &ldquo;{query.trim()}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* ── Conditional content ── */}
      {isSearching ? (
        /* ── SEARCH RESULTS ──────────────────────────────────────────────── */
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
          {results!.length === 0 ? (
            <div className="border border-black/8 bg-[#f7f8f9] px-6 py-12 flex flex-col items-center text-center">
              <Search size={20} className="text-[#07080c]/20 mb-3" />
              <p className="text-sm font-medium text-[#07080c]/70">
                No encontramos nada para &ldquo;{query.trim()}&rdquo;
              </p>
              <p className="text-[12px] text-[#07080c]/40 mt-2 max-w-md leading-relaxed">
                Intenta con menos palabras o términos más generales (ej. &ldquo;FL7&rdquo;, &ldquo;dimensiones&rdquo;, &ldquo;manual servo&rdquo;).
              </p>
              <Link href="#contacto" className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#017bfd] hover:underline underline-offset-4">
                Contactar a un ingeniero <ArrowRight size={11} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col border border-black/8 divide-y divide-black/8">
              {results!.map((r, i) => {
                const Icon = typeIcon[r.type]
                const className = "group flex items-start gap-5 px-5 py-4 hover:bg-[#f7f8f9] transition-colors"
                const content = (
                  <>
                    <span className={cn(
                      "text-[10px] font-mono px-2.5 py-1 shrink-0 border w-24 text-center capitalize hidden sm:flex items-center justify-center gap-1",
                      typeColors[r.type],
                    )}>
                      <Icon size={10} />
                      {r.type}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#07080c]/80 group-hover:text-[#07080c] transition-colors leading-snug">
                        {r.title}
                      </p>
                      <p className="text-[11px] font-mono text-[#017bfd]/70 mt-1">
                        {r.productName}
                        {r.external && <span className="text-[#07080c]/30"> · descarga directa</span>}
                      </p>
                      {r.snippet && (
                        <p className="text-xs text-[#07080c]/50 mt-2 leading-relaxed line-clamp-2">
                          {r.snippet}
                        </p>
                      )}
                    </div>

                    {r.external ? (
                      <Download size={14} className="text-[#07080c]/20 group-hover:text-[#017bfd] transition-colors shrink-0 mt-1" />
                    ) : (
                      <ChevronRight size={14} className="text-[#07080c]/20 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    )}
                  </>
                )

                return r.external ? (
                  <a
                    key={`${r.type}-${r.title}-${i}`}
                    href={r.href}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={`${r.type}-${r.title}-${i}`} href={r.href} className={className}>
                    {content}
                  </Link>
                )
              })}
            </div>
          )}
        </main>
      ) : (
        /* ── DEFAULT CONTENT ─────────────────────────────────────────────── */
        <>
          {/* Quick links — prefill search or jump to contact */}
          <section className="border-b border-black/8">
            <div className="max-w-5xl mx-auto px-6 py-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-black/8">
                {quickLinks.map((item, i) => {
                  const body = (
                    <>
                      <item.icon size={16} className="text-[#017bfd]" />
                      <p className="text-xs font-medium text-[#07080c]/80 group-hover:text-[#07080c] transition-colors">{item.label}</p>
                      <p className="text-[11px] font-mono text-[#07080c]/35 leading-snug">{item.desc}</p>
                    </>
                  )
                  const className = "group bg-white flex flex-col gap-2 p-5 hover:bg-[#f7f8f9] transition-colors text-left"
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    >
                      {"query" in item ? (
                        <button onClick={() => setQuery(item.query)} className={className + " w-full"}>
                          {body}
                        </button>
                      ) : (
                        <a href={item.href} className={className + " flex"}>
                          {body}
                        </a>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Products hub */}
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
                      {(["manual", "software", "ficha", "certificado", "dimensiones"] as const).map((cat) => {
                        const count = item.downloads.filter((d) => d.category === cat).length
                        if (!count) return null
                        const labels: Record<string, string> = { manual: "Manuales", software: "Software", ficha: "Fichas", certificado: "Certs.", dimensiones: "CAD" }
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
        </>
      )}

      {/* ── Contact support (always shown) ── */}
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
