"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Download, ArrowUpRight } from "lucide-react"

const directory = [
    {
        title: "Centro de descargas",
        description: "Brochures, manuales, fichas técnicas y archivos CAD de toda la línea ADIMEX.",
        link: "/soporte",
        label: "Visitar centro de descargas",
    },
    {
        title: "Casos de éxito",
        description: "Hemos resuelto los desafíos de automatización de nuestros clientes durante años. Descubra cómo.",
        link: "/casos",
        label: "Ver casos de éxito",
    },
    {
        title: "Sobre nosotros",
        description: "Conoce al equipo, nuestra trayectoria y los principios que guían cada proyecto.",
        link: "/nosotros",
        label: "Conocer a ADIMEX",
    },
    {
        title: "Contacto",
        description: "¿Tiene preguntas sobre nuestros productos o soluciones? Estamos listos para ayudarle.",
        link: "/soporte#contacto",
        label: "Contactar a ADIMEX",
    },
]

// FL7 brochure on the CDN — used as the launching product catalog reference
const CATALOG_PDF = "https://cdn.adimex.io/pdf/FL7/FL7%20Serires%20PLC%20Product%20Brochure%20-20251021.pdf"

export default function Catalog() {
    return (
        <>
        <section data-theme="light" className="w-full bg-white border-t border-white/10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2">

                {/* Image side */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="border-r border-white/10"
                >
                    <Image
                        src="/catalog.jpg"
                        alt="ADIMEX Product Catalog"
                        width={900}
                        height={675}
                        className="w-full h-full object-cover"
                        priority
                    />
                </motion.div>

                {/* Text side */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-start justify-center gap-8 p-8 lg:p-16"
                >
                    <p
                        className="text-2xl font-bold text-[#0D1A2D]} leading-snug"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                        Amplia cartera de productos ADIMEX en automatización industrial.
                    </p>
                    <p className="text-sm text-[#494F5F] leading-relaxed" style={{fontFamily:"var(--font-geist-sans)"}}>
                        Descubre nuestra cartera completa de soluciones FLEXEM: PLCs, servomotores, HMI, gateways IoT y plataforma SCADA, con casos de éxito ya entregados en plantas mexicanas.
                    </p>

                    <a
                        href={CATALOG_PDF}
                        download
                        className="flex items-center gap-3 bg-[#017bfd] px-6 py-4 text-white text-sm hover:bg-[#0066d6] transition-colors"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                        <Download size={16} />
                        Descargar el catálogo
                    </a>

                    <a
                        href={CATALOG_PDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#a7a9ac] hover:text-[#0066FF] transition-colors underline underline-offset-4"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                        Ver en línea
                    </a>
                </motion.div>

            </div>
        </section>

        {/* Directory */}
        <section data-theme="light" className="w-full bg-white border-t border-black/10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
                {directory.map((item) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-3 p-8"
                    >
                        <h3
                            className="text-sm font-bold text-[#07080c]"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                            {item.title}
                        </h3>
                        <p
                            className="text-xs leading-relaxed text-gray-500 flex-1"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                            {item.description}
                        </p>
                        <a
                            href={item.link}
                            className="flex items-center gap-1.5 text-xs text-[#017bfd] hover:underline underline-offset-4 transition-colors mt-2"
                            style={{ fontFamily: "var(--font-geist-sans)" }}
                        >
                            <ArrowUpRight size={13} />
                            {item.label}
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
        </>
    )
}
