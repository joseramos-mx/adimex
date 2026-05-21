"use client"

import Link from "next/link"
import { useRef } from "react"
import { ShoppingBag, MessageCircle, ArrowRight } from "lucide-react"
import { TimelineContent } from "@/components/ui/timeline-animation"

const testimonials = [
    // ── 0 · Be Grand (large light, stats) ────────────────────────────────────
    {
        quote: "ADIMEX equipó nuestras torres con sistemas FLEXEM. La instalación fue limpia, los plazos se cumplieron y la operación de cada departamento entregado ha sido impecable desde el primer día.",
        name: "Be Grand",
        role: "Torres departamentales · CDMX",
        logo: "/alliies/logos/begrand.png",
        logoAlt: "Be Grand",
        stats: [
            { value: "Torres", label: "departamentales equipadas integralmente" },
            { value: "Residencial", label: "caso flagship con ADIMEX" },
        ],
    },

    // ── 1 · FEMSA (dark) ─────────────────────────────────────────────────────
    {
        quote: "Trabajar con ADIMEX nos ha permitido mantener la consistencia operativa de nuestras líneas de embotellado y distribución. Su capacidad técnica y respuesta logística están a la altura de la escala que manejamos.",
        name: "FEMSA",
        role: "Embotellado y logística · México",
        logo: "/femsalogo.svg",
        logoAlt: "FEMSA",
    },

    // ── 2 · Atlas Copco (dark) ───────────────────────────────────────────────
    {
        quote: "ADIMEX se ha consolidado como un aliado técnico confiable para integrar componentes de automatización en nuestros equipos industriales. La calidad y los tiempos de entrega cumplen con nuestros estándares globales.",
        name: "Atlas Copco",
        role: "Equipos industriales · Latinoamérica",
        logo: "/alliies/logos/Atlas-Copco.png",
        logoAlt: "Atlas Copco",
    },

    // ── 3 · SACMEX (dark) ────────────────────────────────────────────────────
    {
        quote: "El sistema SCADA e IoT implementado por ADIMEX en nuestras salas de bombas nos dio visibilidad en tiempo real de cada estación. La detección temprana de fallas mejoró la continuidad del servicio para la ciudad.",
        name: "SACMEX",
        role: "Sistema de Aguas · Ciudad de México",
        logo: "/alliies/logos/sacmex.png",
        logoAlt: "SACMEX",
    },

    // ── 4 · City Express (large light, stats) ────────────────────────────────
    {
        quote: "ADIMEX estandarizó el equipamiento técnico en nuestros hoteles directos y nos apoya como proveedor en proyectos indirectos. Calidad y servicio consistentes sin importar la ubicación.",
        name: "City Express",
        role: "Operaciones hoteleras · México",
        logo: "/alliies/logos/cityexpress.svg",
        logoAlt: "City Express",
        stats: [
            { value: "30", label: "hoteles indirectos" },
            { value: "7", label: "hoteles directos" },
        ],
    },
]

const cardStyles = {
    light: "bg-white border border-gray-200 text-[#07080c]",
    blue: "bg-[#017bfd] text-white border border-[#017bfd]",
    dark: "bg-[#07080c] text-white border border-white/10",
}

export default function Testimonial() {
    const testimonialRef = useRef<HTMLDivElement>(null)

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { delay: i * 0.12, duration: 0.5 },
        }),
        hidden: {
            filter: "blur(6px)",
            y: -16,
            opacity: 0,
        },
    }

    const beGrand   = testimonials[0]
    const dark      = testimonials.slice(1, 4)   // FEMSA, Atlas Copco, SACMEX
    const cityExp   = testimonials[4]

    return (
        <section
            data-theme="light"
            className="w-full bg-white py-20 px-6"
            ref={testimonialRef as React.RefObject<HTMLDivElement>}
        >
            {/* Header */}
            <div className="max-w-6xl mx-auto text-center space-y-3 mb-14">
                <TimelineContent
                    as="h2"
                    className="text-3xl xl:text-2xl font-bold text-[#07080c] tracking-tight"
                    animationNum={0}
                    customVariants={revealVariants}
                    timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                    Lo que dicen nuestros clientes
                </TimelineContent>
                <TimelineContent
                    as="p"
                    className="text-sm text-gray-500 max-w-lg mx-auto"
                    animationNum={1}
                    customVariants={revealVariants}
                    timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                    Empresas líderes en manufactura, infraestructura y servicios confían en ADIMEX para sus proyectos de automatización.
                </TimelineContent>
            </div>

            {/* Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3">

                {/* ── Column 1 — Be Grand + CTA tienda ── */}
                <div className="flex flex-col gap-3">
                    <TimelineContent
                        animationNum={0}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[7] flex flex-col justify-between p-6 ${cardStyles.light}`}
                    >
                        <div className="space-y-5 mb-6">
                            <img src={beGrand.logo} alt={beGrand.logoAlt} className="h-8 w-auto object-contain" />
                            <div className="grid grid-cols-2 divide-x divide-gray-200">
                                {beGrand.stats!.map((s) => (
                                    <div key={s.label} className="pr-4 first:pr-4 last:pl-4 last:pr-0 space-y-1">
                                        <p className="text-2xl font-bold text-[#07080c] tracking-tight flex items-start gap-1" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                            <span className="text-[#017bfd] text-lg mt-0.5">↗</span>{s.value}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-snug" style={{ fontFamily: "var(--font-geist-sans)" }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <article className="mt-auto space-y-5">
                            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                &ldquo;{beGrand.quote}&rdquo;
                            </p>
                            <div>
                                <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{beGrand.name}</p>
                                <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-geist-sans)" }}>{beGrand.role}</p>
                            </div>
                        </article>
                    </TimelineContent>

                    {/* CTA — tienda en línea */}
                    <TimelineContent
                        animationNum={1}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[3] ${cardStyles.blue}`}
                    >
                        <Link
                            href="/productos"
                            className="group h-full flex flex-col justify-between p-6 gap-4"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                            <ShoppingBag size={20} className="text-white/80" />
                            <div className="flex flex-col gap-2">
                                <p className="text-base font-semibold leading-snug">
                                    Cómprales en línea hoy
                                </p>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    F007N, F110 y FL7 disponibles con envío directo en México.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium pt-2 border-t border-white/20">
                                <span>Ver tienda</span>
                                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </TimelineContent>
                </div>

                {/* ── Column 2 — FEMSA, Atlas Copco, SACMEX ── */}
                <div className="flex flex-col gap-3">
                    {dark.map((t, i) => (
                        <TimelineContent
                            key={t.name}
                            animationNum={i + 2}
                            customVariants={revealVariants}
                            timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                            className={`flex flex-col justify-between p-6 ${cardStyles.dark}`}
                        >
                            <article className="flex flex-col gap-5">
                                {t.logo && (
                                    <img
                                        src={t.logo}
                                        alt={t.logoAlt}
                                        className="h-5 w-auto object-contain opacity-70 brightness-0 invert self-start"
                                    />
                                )}
                                <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div>
                                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{t.name}</p>
                                    <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-geist-sans)" }}>{t.role}</p>
                                </div>
                            </article>
                        </TimelineContent>
                    ))}
                </div>

                {/* ── Column 3 — CTA demo + City Express ── */}
                <div className="flex flex-col gap-3">
                    {/* CTA — agendar demo */}
                    <TimelineContent
                        animationNum={5}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[3] ${cardStyles.blue}`}
                    >
                        <a
                            href="https://wa.me/521XXXXXXXXXX?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20demo%20de%20sus%20soluciones."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group h-full flex flex-col justify-between p-6 gap-4"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                            <MessageCircle size={20} className="text-white/80" />
                            <div className="flex flex-col gap-2">
                                <p className="text-base font-semibold leading-snug">
                                    Agenda una demo
                                </p>
                                <p className="text-xs text-white/80 leading-relaxed">
                                    Un ingeniero ADIMEX te muestra cómo funciona en tu proceso.
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium pt-2 border-t border-white/20">
                                <span>Hablar por WhatsApp</span>
                                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    </TimelineContent>

                    <TimelineContent
                        animationNum={6}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[7] flex flex-col justify-between p-6 ${cardStyles.light}`}
                    >
                        <div className="space-y-5 mb-6">
                            <img src={cityExp.logo} alt={cityExp.logoAlt} className="h-8 w-auto object-contain" />
                            <div className="grid grid-cols-2 divide-x divide-gray-200">
                                {cityExp.stats!.map((s) => (
                                    <div key={s.label} className="pr-4 first:pr-4 last:pl-4 last:pr-0 space-y-1">
                                        <p className="text-2xl font-bold text-[#07080c] tracking-tight flex items-start gap-1" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                            <span className="text-[#017bfd] text-lg mt-0.5">↗</span>{s.value}
                                        </p>
                                        <p className="text-xs text-gray-500 leading-snug" style={{ fontFamily: "var(--font-geist-sans)" }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <article className="mt-auto space-y-5">
                            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                &ldquo;{cityExp.quote}&rdquo;
                            </p>
                            <div>
                                <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{cityExp.name}</p>
                                <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-geist-sans)" }}>{cityExp.role}</p>
                            </div>
                        </article>
                    </TimelineContent>
                </div>

            </div>
        </section>
    )
}
