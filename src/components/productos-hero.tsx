"use client"

import { motion } from "motion/react"

/**
 * Hero animado del catálogo /productos.
 *
 * Copy mínimo — recorte agresivo para que el grid de productos suba
 * arriba del pliegue en móvil sin perder señal de marca ni SEO.
 * Anima con el mismo pattern (stagger + fade + y) que usan el hero
 * del home y la página de /casos: consistente en toda la marca.
 */
export default function ProductosHero({ pageTitle }: { pageTitle: string }) {
  return (
    <section
      data-theme="light"
      className="pt-20 pb-4 md:pt-32 md:pb-8 px-6 border-b border-black/5"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-2 md:gap-3">
        <motion.p
          className="text-[10px] tracking-widest text-[#0066FF] uppercase font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Catálogo · Distribución oficial FLEXEM
        </motion.p>

        <motion.h1
          className="text-2xl md:text-4xl font-semibold text-[#0B1220] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {pageTitle}
        </motion.h1>

        <motion.p
          className="hidden md:block text-sm text-[#494F5F] max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          PLC, HMI, servomotores, SCADA e IoT industrial FLEXEM para
          integradores, OEM y responsables de planta en México.
        </motion.p>
      </div>
    </section>
  )
}
