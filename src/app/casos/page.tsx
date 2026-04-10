"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { casos } from "@/data/casos"

const industries = ["Todos", ...Array.from(new Set(casos.map((c) => c.industry)))]

export default function CasosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#07080c]" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />

      {/* ── Header bar ── */}
      <div className="border-b border-white/8 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-4">
          <motion.p
            className="text-[11px] font-mono tracking-[0.2em] text-[#017bfd] uppercase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            Casos de estudio
          </motion.p>
          <motion.h1
            className="text-3xl lg:text-5xl font-semibold text-white tracking-tight leading-tight"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          >
            Resultados reales,<br className="hidden lg:block" /> industrias reales.
          </motion.h1>
          <motion.p
            className="text-sm text-white/40 max-w-lg leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.16 }}
          >
            Proyectos donde la automatización de precisión transformó operaciones, redujo costos y eliminó paros.
          </motion.p>
        </div>
      </div>

      {/* ── Cases grid ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">

        {/* Industry filter pills */}
        <motion.div
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
        >
          {industries.map((ind) => (
            <span
              key={ind}
              className="px-3 py-1.5 text-[11px] font-mono border border-white/10 text-white/40 hover:border-[#017bfd]/40 hover:text-white/80 transition-colors cursor-default"
            >
              {ind}
            </span>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/8">
          {casos.map((caso, i) => (
            <motion.div
              key={caso.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#07080c]"
            >
              <Link href={`/casos/${caso.slug}`} className="group flex flex-col h-full p-8 hover:bg-white/[0.02] transition-colors">

                {/* Top meta */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono tracking-widest text-[#017bfd] uppercase">
                    {caso.industry}
                  </span>
                  <span className="text-[10px] font-mono text-white/20">{caso.year}</span>
                </div>

                {/* Title */}
                <h2 className="text-base font-semibold text-white leading-snug mb-3 group-hover:text-white/90 transition-colors">
                  {caso.title}
                </h2>

                <p className="text-xs text-white/35 leading-relaxed mb-8 flex-1">
                  {caso.tagline}
                </p>

                {/* Metrics strip */}
                <div className="grid grid-cols-2 gap-px bg-white/8 mb-6">
                  {caso.metrics.slice(0, 2).map((m) => (
                    <div key={m.label} className="bg-[#07080c] px-4 py-3">
                      <p className="text-xl font-semibold text-white tabular-nums tracking-tight">{m.value}</p>
                      <p className="text-[10px] font-mono text-white/30 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/60">{caso.client}</p>
                    <p className="text-[10px] font-mono text-white/25">{caso.location}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-white/20 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all"
                  />
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
