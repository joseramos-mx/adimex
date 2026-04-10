"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const nav = [
    {
        heading: "PRODUCTOS",
        links: [
            { label: "Serie FV5-E", href: "#" },
            { label: "Serie FS", href: "#" },
            { label: "PLCs FL7", href: "#" },
            { label: "Variadores de frecuencia", href: "#" },
            { label: "HMI Industriales", href: "#" },
        ],
    },
    {
        heading: "Soluciones",
        links: [
            { label: "FlexSCADA", href: "#" },
            { label: "AI + IOT", href: "#" },
            { label: "Sistemas de control", href: "#" },
            { label: "Automatización de procesos", href: "#" },
        ],
    },
    {
        heading: "Compañía",
        links: [
            { label: "Sobre nosotros", href: "/nosotros" },
            { label: "Contacto", href: "#" },
            { label: "Documentación", href: "#" },
            { label: "Política de privacidad", href: "#" },
        ],
    },
]

export default function Footer() {
    return (
        <footer className="w-full " style={{ fontFamily: "var(--font-geist-sans)" }}>

            {/* Top SVG divider */}
            <div className="w-full">
                <img src="/footer.svg" alt="" aria-hidden="true" className="w-[60%] block" />
            </div>

            {/* Main body */}
            <div className=" bg-[#0066FF] w-full">

                <div className="bg-[#0066FF] max-w-6xl mx-auto px-6 pt-16 pb-14 flex flex-col lg:flex-row gap-16">

                {/* Left — logo + tagline + newsletter */}
                <div className="bg-[#0066FF] flex flex-col gap-8 lg:w-72 shrink-0">
                    <div className="flex flex-col gap-5">
                        <Image src="/logo.svg" alt="ADIMEX" width={110} height={25} className="h-6 w-auto self-start" />
                        <p className="text-xl text-white/80 leading-relaxed max-w-xs">
                            Soluciones de automatización industrial.
                        </p>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs text-white/50 font-normal">Boletín de novedades</p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex border border-white"
                        >
                            <input
                                type="email"
                                placeholder="su@correo.com"
                                className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none font-light"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-xs font-normal text-white border-l border-white hover:bg-white hover:text-[#0066FF] transition-colors"
                            >
                                Suscribir
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right — bordered nav columns */}
                <div className="bg-[#0066FF] flex-1 grid grid-cols-1 sm:grid-cols-3 border border-white/40 divide-y sm:divide-y-0 sm:divide-x divide-white/40">
                    {nav.map((col) => (
                        <div key={col.heading} className="p-8 flex flex-col gap-1">
                            <p className="text-sm font-semibold text-white">
                                {col.heading}
                            </p>
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
            

            {/* Bottom watermark + copyright */}
            <div className="bg-[#0066FF] relative">

                {/* Vertical copyright — desktop */}
                <p
                    className="hidden lg:block absolute left-4 bottom-0 top-0 my-auto h-fit text-[10px] text-white/45 font-light tracking-widest"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    © 2026 ADIMEX · Todos los derechos reservados · México
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

                {/* Copyright — mobile only */}
                <div className="lg:hidden px-6 pb-5 pt-1">
                    <p className="text-[11px] text-white/45 font-light">
                        © 2026 ADIMEX. Todos los derechos reservados.
                    </p>
                </div>

            </div>

        </footer>
    )
}
