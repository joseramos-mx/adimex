"use client"

import { TimelineContent } from "@/components/ui/timeline-animation"
import Image from "next/image"
import { useRef } from "react"

const testimonials = [
    {
        quote: "ADIMEX transformó por completo nuestra línea de producción. Sus soluciones de servomotores FLEXEM redujeron nuestros tiempos de ciclo en un 35%.",
        name: "Carlos Méndez",
        role: "Director de Operaciones, Grupo TREMEC",
        image: "/images/carlos-mendez.jpg",
        variant: "light",
        size: "large",
        logo: "/logos/tremec.svg",
        logoAlt: "Grupo TREMEC",
        stats: [
            { value: "35%", label: "reducción en tiempos de ciclo" },
            { value: "2.1×", label: "aumento en throughput de planta" },
        ],
    },
    {
        quote: "El soporte técnico de ADIMEX es excepcional. Siempre disponibles y con un profundo conocimiento de sus productos.",
        name: "Sofía Guerrero",
        role: "Gerente de Planta, Vitro Packaging",
        image: "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?q=80&w=687&auto=format&fit=crop",
        variant: "blue",
        size: "small",
    },
    {
        quote: "Implementamos los PLCs FL7 en toda nuestra planta y la estabilidad ha sido impecable. Sin interrupciones en más de 18 meses.",
        name: "Rodrigo Alvarado",
        role: "Jefe de Automatización, CEMEX",
        image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1021&auto=format&fit=crop",
        variant: "dark",
        size: "medium",
    },
    {
        quote: "La integración de FlexSCADA con nuestros sistemas existentes fue sorprendentemente fluida. El equipo de ADIMEX estuvo con nosotros en cada paso.",
        name: "Ana Torres",
        role: "CTO, Mabe México",
        image: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687&auto=format&fit=crop",
        variant: "dark",
        size: "medium",
    },
    {
        quote: "Redujimos nuestro consumo energético en un 22% gracias a los variadores de frecuencia recomendados por ADIMEX.",
        name: "Javier Reyes",
        role: "Gerente de Ingeniería, RASSINI",
        image: "https://images.unsplash.com/photo-1740102074295-c13fae3e4f8a?q=80&w=687&auto=format&fit=crop",
        variant: "dark",
        size: "medium",
    },
    {
        quote: "ADIMEX ha sido un socio estratégico clave en nuestra expansión. Su portafolio cubre todas nuestras necesidades de automatización.",
        name: "Valeria Montoya",
        role: "Directora de Manufactura, Nemak",
        image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=765&auto=format&fit=crop",
        variant: "blue",
        size: "small",
    },
    {
        quote: "Llevamos 6 años trabajando con ADIMEX y su nivel de compromiso con la calidad y el servicio postventa no tiene comparación en el mercado industrial mexicano.",
        name: "Miguel Ángel Flores",
        role: "VP de Operaciones, Vitro",
        image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=687&auto=format&fit=crop",
        variant: "light",
        size: "large",
        logo: "/logos/vitro.svg",
        logoAlt: "Vitro",
        stats: [
            { value: "6 años", label: "como socio estratégico ADIMEX" },
            { value: "99.4%", label: "uptime en líneas automatizadas" },
        ],
    },
]

const cardStyles: Record<string, string> = {
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

    const col1 = testimonials.slice(0, 2)   // light large + blue small
    const col2 = testimonials.slice(2, 5)   // 3 dark
    const col3 = testimonials.slice(5, 7)   // blue small + light large

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
                    Empresas líderes en manufactura e industria confían en ADIMEX para sus proyectos de automatización.
                </TimelineContent>
            </div>

            {/* Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3">

                {/* Column 1 */}
                <div className="flex flex-col gap-3">
                    <TimelineContent
                        animationNum={0}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[7] flex flex-col justify-between p-6 ${cardStyles.light}`}
                    >
                        {/* Logo + stats */}
                        <div className="space-y-5 mb-6">
                            <img src={col1[0].logo} alt={col1[0].logoAlt} className="h-8 w-auto object-contain" />
                            <div className="grid grid-cols-2 divide-x divide-gray-200">
                                {col1[0].stats!.map((s) => (
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
                                "{col1[0].quote}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{col1[0].name}</p>
                                    <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-geist-sans)" }}>{col1[0].role}</p>
                                </div>
                                <Image src={col1[0].image} alt={col1[0].name} width={200} height={200} className="w-12 h-12 object-cover" />
                            </div>
                        </article>
                    </TimelineContent>
                    <TimelineContent
                        animationNum={1}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[3] flex flex-col justify-between p-6 ${cardStyles.blue}`}
                    >
                        <article className="mt-auto space-y-5">
                            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                "{col1[1].quote}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{col1[1].name}</p>
                                    <p className="text-xs text-white/70" style={{ fontFamily: "var(--font-geist-sans)" }}>{col1[1].role}</p>
                                </div>
                                <Image src={col1[1].image} alt={col1[1].name} width={200} height={200} className="w-12 h-12 object-cover" />
                            </div>
                        </article>
                    </TimelineContent>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-3">
                    {col2.map((t, i) => (
                        <TimelineContent
                            key={t.name}
                            animationNum={i + 2}
                            customVariants={revealVariants}
                            timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                            className={`flex flex-col justify-between p-6 ${cardStyles.dark}`}
                        >
                            <article className="space-y-5">
                                <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{t.name}</p>
                                        <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-geist-sans)" }}>{t.role}</p>
                                    </div>
                                    <Image src={t.image} alt={t.name} width={200} height={200} className="w-12 h-12 object-cover" />
                                </div>
                            </article>
                        </TimelineContent>
                    ))}
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-3">
                    <TimelineContent
                        animationNum={5}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[3] flex flex-col justify-between p-6 ${cardStyles.blue}`}
                    >
                        <article className="mt-auto space-y-5">
                            <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-geist-sans)" }}>
                                "{col3[0].quote}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{col3[0].name}</p>
                                    <p className="text-xs text-white/70" style={{ fontFamily: "var(--font-geist-sans)" }}>{col3[0].role}</p>
                                </div>
                                <Image src={col3[0].image} alt={col3[0].name} width={200} height={200} className="w-12 h-12 object-cover" />
                            </div>
                        </article>
                    </TimelineContent>
                    <TimelineContent
                        animationNum={6}
                        customVariants={revealVariants}
                        timelineRef={testimonialRef as React.RefObject<HTMLElement>}
                        className={`flex-[7] flex flex-col justify-between p-6 ${cardStyles.light}`}
                    >
                        {/* Logo + stats */}
                        <div className="space-y-5 mb-6">
                            <img src={col3[1].logo} alt={col3[1].logoAlt} className="h-8 w-auto object-contain" />
                            <div className="grid grid-cols-2 divide-x divide-gray-200">
                                {col3[1].stats!.map((s) => (
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
                                "{col3[1].quote}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-geist-sans)" }}>{col3[1].name}</p>
                                    <p className="text-xs text-gray-500" style={{ fontFamily: "var(--font-geist-sans)" }}>{col3[1].role}</p>
                                </div>
                                <Image src={col3[1].image} alt={col3[1].name} width={200} height={200} className="w-12 h-12 object-cover" />
                            </div>
                        </article>
                    </TimelineContent>
                </div>

            </div>
        </section>
    )
}
