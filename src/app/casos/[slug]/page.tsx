import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MapPin, Calendar, Building2 } from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import { casos } from "@/data/casos"

export function generateStaticParams() {
  return casos.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caso = casos.find((c) => c.slug === slug)
  if (!caso) return {}
  return {
    title: `${caso.client} — ${caso.industry} | ADIMEX`,
    description: caso.tagline,
  }
}

export default async function CasoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caso = casos.find((c) => c.slug === slug)
  if (!caso) notFound()

  const related = casos.filter((c) => c.slug !== caso.slug).slice(0, 2)

  return (
    <div
      className="flex flex-col min-h-screen bg-[#07080c]"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <Header />

      {/* ── Breadcrumb ── */}
      <div className="pt-14 border-b border-white/8">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2 text-[11px] font-mono text-white/25">
          <Link href="/" className="hover:text-white/50 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/casos" className="hover:text-white/50 transition-colors">Casos de estudio</Link>
          <span>/</span>
          <span className="text-white/50">{caso.client}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="border-b border-white/8">
        <div className="max-w-5xl mx-auto px-6 py-14 lg:py-20">

          {/* Industry badge */}
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#017bfd] uppercase mb-6">
            {caso.industry}
          </p>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-semibold text-white leading-tight tracking-tight max-w-3xl mb-8">
            {caso.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 text-[11px] font-mono text-white/30 mb-10">
            <span className="flex items-center gap-1.5">
              <Building2 size={11} className="text-white/20" />
              {caso.client}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-white/20" />
              {caso.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={11} className="text-white/20" />
              {caso.year}
            </span>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/10">
            {caso.metrics.map((m, i) => (
              <div
                key={m.label}
                className={`px-6 py-5 flex flex-col gap-1 ${i < caso.metrics.length - 1 ? "border-b lg:border-b-0 border-r-0 lg:border-r border-white/10" : ""} ${i % 2 === 0 && i < caso.metrics.length - 1 ? "border-r border-white/10 lg:border-r-0" : ""}`}
              >
                <span className="text-3xl font-semibold text-white tabular-nums tracking-tight">
                  {m.value}
                </span>
                <span className="text-[10px] font-mono text-white/30">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image placeholder ── */}
      <div className="border-b border-white/8 bg-[#0d0e12]">
        <div className="max-w-5xl mx-auto px-6 py-0">
          <div className="w-full aspect-[16/7] bg-[#111316] flex items-center justify-center">
            <span className="text-[11px] font-mono text-white/15">
              {caso.client} — {caso.location}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1fr_280px] gap-16">

            {/* Left — narrative */}
            <div className="flex flex-col gap-14">

              {/* Challenge */}
              <section>
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/25 uppercase mb-5">
                  El reto
                </p>
                <div className="border-l border-white/10 pl-6">
                  <p className="text-sm text-white/55 leading-[1.85]">
                    {caso.challenge}
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-white/8" />

              {/* Solution */}
              <section>
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/25 uppercase mb-5">
                  La solución
                </p>
                <div className="border-l-2 border-[#017bfd] pl-6">
                  <p className="text-sm text-white/55 leading-[1.85]">
                    {caso.solution}
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-white/8" />

              {/* Result */}
              <section>
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/25 uppercase mb-5">
                  Los resultados
                </p>
                <p className="text-sm text-white/55 leading-[1.85] mb-6">
                  {caso.result}
                </p>

                {/* Result metrics highlight */}
                <div className="grid grid-cols-2 gap-px bg-white/8">
                  {caso.metrics.map((m) => (
                    <div key={m.label} className="bg-[#07080c] px-5 py-4">
                      <p className="text-2xl font-semibold text-white tracking-tight">{m.value}</p>
                      <p className="text-[10px] font-mono text-white/30 mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Right — sidebar */}
            <aside className="flex flex-col gap-8">

              {/* Products used */}
              <div className="border border-white/10 p-6 flex flex-col gap-4">
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/25 uppercase">
                  Productos utilizados
                </p>
                <div className="flex flex-col gap-2">
                  {caso.products.map((p) => (
                    <Link
                      key={p}
                      href="/productos"
                      className="flex items-center justify-between text-xs text-white/50 hover:text-white group transition-colors py-1 border-b border-white/5 last:border-0"
                    >
                      <span>{p}</span>
                      <ArrowRight size={11} className="text-white/20 group-hover:text-[#017bfd] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="border border-white/10 p-6 flex flex-col gap-4">
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/25 uppercase">
                  Industria & tecnología
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {caso.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2.5 py-1 border border-white/10 text-white/35"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="border border-[#017bfd]/20 bg-[#017bfd]/5 p-6 flex flex-col gap-4">
                <p className="text-xs font-semibold text-white leading-snug">
                  ¿Proyecto similar en tu planta?
                </p>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Nuestro equipo puede diseñar una solución adaptada a tu proceso.
                </p>
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#017bfd] text-white text-xs font-medium hover:bg-[#0066d6] transition-colors"
                >
                  Hablar con un ingeniero
                  <ArrowRight size={12} />
                </Link>
              </div>

            </aside>
          </div>
        </div>

        {/* ── Related cases ── */}
        {related.length > 0 && (
          <div className="border-t border-white/8">
            <div className="max-w-5xl mx-auto px-6 py-14">
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/25 uppercase mb-8">
                Más casos de estudio
              </p>
              <div className="grid sm:grid-cols-2 gap-px bg-white/8">
                {related.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/casos/${c.slug}`}
                    className="group bg-[#07080c] p-6 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-[#017bfd] uppercase">{c.industry}</span>
                      <span className="text-[10px] font-mono text-white/20">{c.year}</span>
                    </div>
                    <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors leading-snug">
                      {c.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/25 mt-auto">
                      <span>{c.client}</span>
                      <ArrowRight size={11} className="ml-auto text-white/15 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Back link ── */}
      <div className="border-t border-white/8">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link
            href="/casos"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft size={12} />
            Todos los casos
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
