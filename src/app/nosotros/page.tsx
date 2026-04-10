"use client"

import React, { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import {
  ArrowRight, Zap, Shield, Globe2, Users, MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "15+",  label: "Años en el mercado" },
  { value: "500+", label: "Proyectos entregados" },
  { value: "12",   label: "Estados en México" },
  { value: "98%",  label: "Tasa de satisfacción" },
]

const values = [
  {
    icon: Zap,
    title: "Precisión técnica",
    desc: "Cada solución está diseñada con estándares de ingeniería de primer nivel, garantizando rendimiento y confiabilidad en entornos industriales exigentes.",
  },
  {
    icon: Shield,
    title: "Compromiso total",
    desc: "Desde la consultoría hasta la puesta en marcha, acompañamos cada etapa del proyecto con soporte técnico especializado y garantías reales.",
  },
  {
    icon: Globe2,
    title: "Visión global",
    desc: "Integramos tecnología de clase mundial de FLEXEM con el conocimiento local del mercado mexicano para ofrecer lo mejor de ambos mundos.",
  },
  {
    icon: Users,
    title: "Equipo humano",
    desc: "Nuestros ingenieros y técnicos certificados son el corazón de ADIMEX, comprometidos con el éxito industrial de cada cliente.",
  },
]

const timeline = [
  {
    year: "2008",
    title: "Fundación",
    desc: "ADIMEX nace en CDMX con la misión de acercar la automatización industrial de precisión al mercado mexicano.",
  },
  {
    year: "2013",
    title: "Expansión nacional",
    desc: "Apertura de oficinas en CDMX y Guadalajara. Alcanzamos los 100 proyectos entregados en manufactura y alimenticio.",
  },
  {
    year: "2018",
    title: "Alianza FLEXEM",
    desc: "Nos convertimos en distribuidor exclusivo de FLEXEM en México, ampliando el portafolio con servomotores, PLCs y HMIs de última generación.",
  },
  {
    year: "2022",
    title: "FlexSCADA + IoT",
    desc: "Lanzamos FlexSCADA y soluciones AI+IoT, posicionando a ADIMEX en la vanguardia de la Industria 4.0.",
  },
  {
    year: "2025",
    title: "Hoy",
    desc: "Más de 500 proyectos entregados, presencia en 12 estados y un equipo de 60+ especialistas en automatización.",
  },
]

const presenceStates = [
  "Nuevo León", "CDMX", "Jalisco", "Guanajuato", "Querétaro",
  "Coahuila", "Chihuahua", "Sonora", "Veracruz", "Puebla",
  "San Luis Potosí", "Tamaulipas",
]

const industries = [
  { name: "Automotriz",      count: "80+" },
  { name: "Manufactura",     count: "120+" },
  { name: "Alimentos",       count: "95+" },
  { name: "Farmacéutico",    count: "60+" },
  { name: "Petroquímica",    count: "45+" },
  { name: "Textil",          count: "30+" },
]

// ─── Animation helpers ─────────────────────────────────────────────────────────

function FadeIn({
  children, delay = 0, className = "", direction = "up",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: "up" | "left" | "right" | "none"
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const initial =
    direction === "up"    ? { opacity: 0, y: 28 }  :
    direction === "left"  ? { opacity: 0, x: -28 } :
    direction === "right" ? { opacity: 0, x: 28 }  :
                            { opacity: 0 }
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedNumber({ target }: { target: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [display, setDisplay] = useState("0")

  const suffix = target.replace(/[0-9.]/g, "")
  const numeric = parseFloat(target.replace(/[^0-9.]/g, ""))

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = performance.now()
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(eased * numeric * 10) / 10
      setDisplay(Number.isInteger(current) ? String(current) : current.toFixed(1))
      if (t < 1) requestAnimationFrame(frame)
      else setDisplay(String(numeric))
    }
    requestAnimationFrame(frame)
  }, [inView, numeric])

  return <span ref={ref}>{display}{suffix}</span>
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen w-full" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />
      <main className="flex-1">

        {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
        <section className="bg-[#07080c] pt-14 flex flex-col min-h-screen">

          {/* Top bar */}
          <motion.div
            className="border-b border-white/8 px-6 lg:px-12 h-11 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-[11px] font-mono text-white/25 tracking-widest uppercase">
              ADIMEX — Sobre nosotros
            </span>
            <span className="text-[11px] font-mono text-white/25 tracking-widest">
              Est. 2008
            </span>
          </motion.div>

          {/* Main content — vertically centered in remaining space */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 max-w-6xl mx-auto w-full py-20">

            {/* Headline */}
            <div className="overflow-hidden">
              {["Automatización", "industrial de", "precisión."].map((line, i) => (
                <motion.p
                  key={line}
                  className="text-[clamp(2.8rem,8vw,7rem)] font-semibold text-white leading-[1.0] tracking-[-0.03em]"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.1 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Divider + tagline row */}
            <motion.div
              className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <p className="text-sm text-white/35 max-w-xs leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                Desde 2008 impulsamos la industria mexicana con tecnología de automatización de clase mundial.
              </p>
              <Link
                href="#historia"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors group shrink-0"
              >
                <span>Nuestra historia</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Stats — flush to bottom */}
          <motion.div
            className="border-t border-white/8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="px-6 lg:px-10 py-7 flex flex-col gap-1">
                <span className="text-2xl lg:text-3xl font-semibold text-white tabular-nums tracking-tight">
                  <AnimatedNumber target={s.value} />
                </span>
                <span className="text-[11px] text-white/30 font-mono">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── 2. HISTORIA ─────────────────────────────────────────────────────── */}
        <section id="historia" data-theme="light" className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              {/* Left — text */}
              <div className="flex flex-col gap-6">
                <FadeIn direction="left">
                  <p className="text-[11px] tracking-[0.2em] text-[#017bfd] uppercase font-mono">
                    Nuestro origen
                  </p>
                </FadeIn>
                <FadeIn direction="left" delay={0.08}>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#07080c] leading-tight">
                    Nacimos para resolver lo que otros no podían.
                  </h2>
                </FadeIn>
                <FadeIn direction="left" delay={0.14}>
                  <p className="text-sm text-[#07080c]/60 leading-relaxed">
                    En 2008, nuestros fundadores identificaron un problema crítico en la industria mexicana:
                    tiempos de entrega impredecibles, soporte técnico deficiente y equipos de automatización
                    de baja calidad que paralizaban líneas de producción enteras.
                  </p>
                </FadeIn>
                <FadeIn direction="left" delay={0.2}>
                  <p className="text-sm text-[#07080c]/60 leading-relaxed">
                    La respuesta fue ADIMEX — una empresa construida desde el principio con un compromiso
                    inquebrantable: llevar tecnología de automatización de primer nivel a cada planta de
                    manufactura en México, respaldada por ingenieros que entienden el piso de producción.
                  </p>
                </FadeIn>
                <FadeIn direction="left" delay={0.26}>
                  <blockquote className="border-l-2 border-[#017bfd] pl-5 mt-2">
                    <p className="text-sm italic text-[#07080c]/70 leading-relaxed">
                      "El objetivo siempre fue uno: que ningún cliente volviera a perder producción
                      por falta de soporte o equipo confiable."
                    </p>
                    <cite className="block mt-3 text-xs text-[#07080c]/40 not-italic">
                      — Fundadores, ADIMEX 2008
                    </cite>
                  </blockquote>
                </FadeIn>
              </div>

              {/* Right — founding card */}
              <FadeIn direction="right" delay={0.1} className="lg:pt-8">
                <div className="bg-[#07080c] p-10 flex flex-col gap-8">
                  <div className="flex items-end justify-between border-b border-white/10 pb-8">
                    <div>
                      <p className="text-[10px] tracking-widest text-white/30 uppercase font-mono mb-2">Fundada</p>
                      <p className="text-6xl font-bold text-white">2008</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] tracking-widest text-white/30 uppercase font-mono mb-2">Sede</p>
                      <p className="text-sm text-white/70">CDMX</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Empleados", value: "60+" },
                      { label: "Distribuidores", value: "8" },
                      { label: "Certificaciones", value: "ISO 9001" },
                      { label: "Cobertura", value: "Nacional" },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[10px] tracking-widest text-white/30 uppercase font-mono mb-1">{item.label}</p>
                        <p className="text-sm text-white font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── 3. VALORES ──────────────────────────────────────────────────────── */}
        <section className="bg-[#07080c]">
          <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">

            <FadeIn className="mb-16">
              <p className="text-[11px] tracking-[0.2em] text-[#017bfd] uppercase font-mono mb-4">
                Lo que nos define
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight max-w-xl">
                Principios que guían cada proyecto.
              </h2>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-white/10">
              {values.map((v, i) => (
                <FadeIn key={v.title} delay={i * 0.08} className="group">
                  <div className={cn(
                    "flex flex-col gap-5 p-8 h-full border-b border-white/10 lg:border-b-0 hover:bg-white/[0.03] transition-colors",
                    i < 3 && "lg:border-r lg:border-white/10",
                  )}>
                    <div className="w-9 h-9 flex items-center justify-center border border-[#017bfd]/30 bg-[#017bfd]/10 group-hover:bg-[#017bfd]/20 transition-colors">
                      <v.icon size={16} className="text-[#017bfd]" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{v.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{v.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. TIMELINE ─────────────────────────────────────────────────────── */}
        <section data-theme="light" className="bg-[#f5f6f7]">
          <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">

            <FadeIn className="mb-16">
              <p className="text-[11px] tracking-[0.2em] text-[#017bfd] uppercase font-mono mb-4">
                Nuestra trayectoria
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#07080c] leading-tight">
                Más de 15 años de evolución.
              </h2>
            </FadeIn>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[4.5rem] lg:left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2" />

              <div className="flex flex-col gap-0">
                {timeline.map((item, i) => (
                  <FadeIn key={item.year} delay={i * 0.1}>
                    <div className={cn(
                      "relative grid lg:grid-cols-2 gap-8 lg:gap-16 pb-12",
                      i % 2 === 0 ? "lg:text-right" : "lg:flex-row-reverse",
                    )}>
                      {/* Year bubble */}
                      <div className="absolute left-[4.5rem] lg:left-1/2 top-1 w-3 h-3 rounded-full bg-[#017bfd] -translate-x-1/2 ring-4 ring-[#f5f6f7]" />

                      {i % 2 === 0 ? (
                        <>
                          <div className="pl-24 lg:pl-0 lg:pr-12">
                            <p className="text-[11px] tracking-widest text-[#017bfd] font-mono mb-1">{item.year}</p>
                            <h3 className="text-base font-bold text-[#07080c] mb-2">{item.title}</h3>
                            <p className="text-sm text-[#07080c]/55 leading-relaxed">{item.desc}</p>
                          </div>
                          <div className="hidden lg:block" />
                        </>
                      ) : (
                        <>
                          <div className="hidden lg:block" />
                          <div className="pl-24 lg:pl-12">
                            <p className="text-[11px] tracking-widest text-[#017bfd] font-mono mb-1">{item.year}</p>
                            <h3 className="text-base font-bold text-[#07080c] mb-2">{item.title}</h3>
                            <p className="text-sm text-[#07080c]/55 leading-relaxed">{item.desc}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. INDUSTRIAS + PRESENCIA ────────────────────────────────────────── */}
        <section className="bg-[#07080c]">
          <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

              {/* Industries */}
              <div>
                <FadeIn direction="left">
                  <p className="text-[11px] tracking-[0.2em] text-[#017bfd] uppercase font-mono mb-4">
                    Industrias atendidas
                  </p>
                  <h2 className="text-3xl font-bold text-white mb-10">
                    Experiencia sectorial profunda.
                  </h2>
                </FadeIn>
                <div className="flex flex-col border border-white/10">
                  {industries.map((ind, i) => (
                    <FadeIn key={ind.name} delay={i * 0.06} direction="left">
                      <div className={cn(
                        "flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-colors group",
                        i < industries.length - 1 && "border-b border-white/10",
                      )}>
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                          {ind.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/30 font-mono">{ind.count} proyectos</span>
                          <ArrowRight size={12} className="text-white/20 group-hover:text-[#017bfd] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Presence */}
              <div>
                <FadeIn direction="right">
                  <p className="text-[11px] tracking-[0.2em] text-[#017bfd] uppercase font-mono mb-4">
                    Presencia nacional
                  </p>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Cobertura en todo México.
                  </h2>
                  <p className="text-sm text-white/40 leading-relaxed mb-10">
                    Con oficinas, distribuidores certificados y técnicos de campo en los principales
                    polos industriales del país.
                  </p>
                </FadeIn>

                <div className="flex flex-wrap gap-2">
                  {presenceStates.map((state, i) => (
                    <FadeIn key={state} delay={0.05 + i * 0.04} direction="none">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-[#017bfd]/40 hover:bg-[#017bfd]/5 transition-colors">
                        <MapPin size={10} className="text-[#017bfd]" />
                        <span className="text-xs text-white/60">{state}</span>
                      </div>
                    </FadeIn>
                  ))}
                </div>

                <FadeIn delay={0.3} direction="right">
                  <div className="mt-10 p-6 border border-white/10 bg-white/[0.02] flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#017bfd]/10 shrink-0">
                      <Globe2 size={18} className="text-[#017bfd]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">¿No estás en la lista?</p>
                      <p className="text-xs text-white/40 mt-0.5">Contáctanos — podemos llegar hasta ti.</p>
                    </div>
                    <Link href="#" className="ml-auto text-xs text-[#017bfd] hover:underline whitespace-nowrap">
                      Contactar
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. CTA FINAL ────────────────────────────────────────────────────── */}
        <section data-theme="light" className="bg-white border-t border-black/5">
          <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

              <FadeIn direction="left">
                <p className="text-[11px] tracking-[0.2em] text-[#017bfd] uppercase font-mono mb-4">
                  Empieza hoy
                </p>
                <h2 className="text-3xl lg:text-5xl font-bold text-[#07080c] leading-tight max-w-2xl">
                  Transforma tu planta con automatización de precisión.
                </h2>
                <p className="mt-4 text-sm text-[#07080c]/55 max-w-lg leading-relaxed">
                  Nuestro equipo de ingenieros está listo para analizar tu proceso,
                  proponer la solución correcta y acompañarte hasta la puesta en marcha.
                </p>
              </FadeIn>

              <FadeIn direction="right" delay={0.1} className="flex flex-col gap-3 lg:min-w-[200px]">
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#017bfd] text-white text-sm font-medium hover:bg-[#0066d6] transition-colors"
                >
                  Agendar demo <ArrowRight size={15} />
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 px-8 py-4 border border-black/15 text-[#07080c] text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  Contactar ventas
                </Link>
              </FadeIn>

            </div>

            {/* Bottom facts bar */}
            <FadeIn delay={0.2}>
              <div className="mt-16 pt-10 border-t border-black/8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "Años de experiencia", value: "15+" },
                  { label: "Proyectos entregados", value: "500+" },
                  { label: "Tiempo de respuesta", value: "24 h" },
                  { label: "Garantía de servicio", value: "12 meses" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <span className="text-2xl font-bold text-[#07080c]">{f.value}</span>
                    <span className="text-xs text-[#07080c]/40">{f.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
