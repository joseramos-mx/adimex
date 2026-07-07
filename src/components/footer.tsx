"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Check, Linkedin } from "lucide-react"

const LINKEDIN_URL = "https://www.linkedin.com/company/americandimex/"

const nav = [
    {
        heading: "Productos",
        links: [
            { label: "HMI F007N",              href: "/productos/hmi-f007n" },
            { label: "HMI F110",               href: "/productos/productos-hmi-f110" },
            { label: "PLC FL7",                href: "/productos/plc-fl7" },
            { label: "Ver catálogo completo",  href: "/productos" },
        ],
    },
    {
        heading: "Soluciones",
        links: [
            { label: "FlexSCADA",        href: "/productos/scada-flexscada" },
            { label: "Servomotores",     href: "/productos?category=servo" },
            { label: "IoT Gateways",     href: "/productos?category=iot-gateway" },
            { label: "Casos de estudio", href: "/casos" },
        ],
    },
    {
        heading: "Compañía",
        links: [
            { label: "Sobre nosotros",    href: "/nosotros" },
            { label: "Blog",              href: "/blog" },
            { label: "Soporte técnico",   href: "/soporte" },
            { label: "Contactar ventas",  href: "/soporte" },
        ],
    },
]

export default function Footer() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email.includes("@")) return
        setSubmitted(true)
        setEmail("")
    }

    return (
        <footer className="w-full" style={{ fontFamily: "var(--font-geist-sans)" }}>

            {/* Top SVG divider */}
            <div className="w-full">
                <img src="/footer.svg" alt="" aria-hidden="true" className="w-[60%] block" />
            </div>

            {/* Main body */}
            <div className="bg-[#0066FF] w-full">

                <div className="bg-[#0066FF] max-w-6xl mx-auto px-6 pt-16 pb-14 flex flex-col lg:flex-row gap-16">

                    {/* Left — logo + tagline + newsletter */}
                    <div className="bg-[#0066FF] flex flex-col gap-8 lg:w-72 shrink-0">
                        <div className="flex flex-col gap-5">
                            <Link href="/" aria-label="ADIMEX — inicio">
                                <Image src="/logo.svg" alt="ADIMEX" width={110} height={25} className="h-6 w-auto self-start" />
                            </Link>
                            <p className="text-xl text-white/80 leading-relaxed max-w-xs">
                                Distribuidor autorizado FLEXEM · Automatización industrial en México.
                            </p>
                        </div>

                        {/* Newsletter — boletín técnico */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm text-white font-semibold leading-tight">
                                    Boletín técnico ADIMEX
                                </p>
                                <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                                    Nuevos artículos, guías FLEXEM y avisos de stock en tu correo.
                                </p>
                            </div>
                            {submitted ? (
                                <div className="flex items-center gap-2 border border-white px-3 py-2.5">
                                    <Check size={14} className="text-white shrink-0" />
                                    <p className="text-xs text-white">Gracias — recibirás el próximo boletín.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex border border-white">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@correo.com"
                                        className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none font-light min-w-0"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 text-xs font-normal text-white border-l border-white hover:bg-white hover:text-[#0066FF] transition-colors shrink-0"
                                    >
                                        Suscribir
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Social */}
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                                Síguenos
                            </p>
                            <div className="flex items-center gap-2">
                                <a
                                    href={LINKEDIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="ADIMEX en LinkedIn"
                                    className="w-9 h-9 border border-white/40 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#0066FF] transition-colors"
                                >
                                    <Linkedin size={15} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right — bordered nav columns */}
                    <div className="bg-[#0066FF] flex-1 grid grid-cols-1 sm:grid-cols-3 border border-white/40 divide-y sm:divide-y-0 sm:divide-x divide-white/40">
                        {nav.map((col) => (
                            <div key={col.heading} className="p-8 flex flex-col gap-1">
                                <p className="text-sm font-semibold text-white">{col.heading}</p>
                                <ul className="flex flex-col gap-3.5 mt-4">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors font-light group"
                                            >
                                                <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Legal strip — visible en desktop y mobile */}
            <div className="bg-[#0066FF] border-t border-white/20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-[11px] text-white/60 font-light">
                        © 2026 American Digital de México, S.A. de C.V. · Distribuidor autorizado FLEXEM
                    </p>
                    <nav className="flex items-center gap-5 flex-wrap">
                        <Link
                            href="/legal/aviso-de-privacidad"
                            className="text-[11px] text-white/60 hover:text-white transition-colors"
                        >
                            Aviso de Privacidad
                        </Link>
                        <Link
                            href="/legal/terminos-y-condiciones"
                            className="text-[11px] text-white/60 hover:text-white transition-colors"
                        >
                            Términos y Condiciones
                        </Link>
                        <Link
                            href="/legal/politica-de-cookies"
                            className="text-[11px] text-white/60 hover:text-white transition-colors"
                        >
                            Política de Cookies
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Bottom watermark */}
            <div className="bg-[#0066FF] relative">

                {/* Vertical microcopy — desktop */}
                <p
                    className="hidden lg:block absolute left-4 bottom-0 top-0 my-auto h-fit text-[10px] text-white/45 font-light tracking-widest"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    ADIMEX · Automatización Industrial · México
                </p>

                {/* Watermark logo — flush to bottom */}
                <div className="pointer-events-none select-none flex items-end" aria-hidden="true">
                    <Image
                        src="/logo.svg"
                        alt=""
                        width={1400}
                        height={315}
                        className="opacity-[0.9] w-full block"
                    />
                </div>

            </div>

        </footer>
    )
}
