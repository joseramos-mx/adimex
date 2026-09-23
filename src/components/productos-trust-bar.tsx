"use client"

import { motion } from "motion/react"

const ITEMS = [
  "IVA incluido",
  "Envío 3-5 días",
  "Garantía FLEXEM",
  "Soporte en español",
]

/**
 * Franja de garantías que va justo bajo el hero de /productos.
 *
 * En móvil: scrollable horizontal (los 4 chips en una línea, arrastrable).
 * En md+: centrada, todos visibles a la vez.
 * Anima con fade-up sutil que sigue al hero.
 */
export default function ProductosTrustBar() {
  return (
    <section
      data-theme="light"
      aria-label="Garantías del pedido"
      className="bg-[#F0F2F5] border-b border-black/5"
    >
      <div className="max-w-6xl mx-auto">
        {/* Mobile: grid 2x2 para que se vean los 4 ítems sin scroll horizontal.
            Desktop (md+): fila centrada. */}
        <motion.ul
          className="grid grid-cols-2 gap-x-4 gap-y-1 px-6 py-2.5 text-[10px] font-medium text-[#0B1220] md:flex md:items-center md:justify-center md:gap-6 md:whitespace-nowrap md:text-xs"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24, ease: "easeOut" }}
        >
          {ITEMS.map((label, i) => (
            <motion.li
              key={label}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.28 + i * 0.05 }}
            >
              <span className="w-1 h-1 rounded-full bg-[#0066FF] shrink-0" />
              {label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
