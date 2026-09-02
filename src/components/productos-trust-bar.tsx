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
        <motion.ul
          className="flex items-center gap-4 md:gap-6 overflow-x-auto whitespace-nowrap px-6 py-2.5 md:justify-center text-[11px] md:text-xs font-medium text-[#0B1220]"
          style={{ scrollbarWidth: "none" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24, ease: "easeOut" }}
        >
          {ITEMS.map((label, i) => (
            <motion.li
              key={label}
              className="flex items-center gap-1.5 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.28 + i * 0.05 }}
            >
              <span className="w-1 h-1 rounded-full bg-[#0066FF]" />
              {label}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
