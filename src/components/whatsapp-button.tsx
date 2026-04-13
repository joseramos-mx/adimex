"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { X } from "lucide-react"

const PHONE = "521XXXXXXXXXX" // reemplaza con el número real (código de país sin +)
const MESSAGE = encodeURIComponent("Hola, me gustaría obtener información sobre sus soluciones de automatización.")

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(true)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-[#017bfd] border border-white/10 px-3 py-2 shadow-lg"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <span className="text-xs text-white/70 whitespace-nowrap">¿Necesitas ayuda?</span>
            <button
              onClick={() => setTooltip(false)}
              className="text-white/30 hover:text-white/60 transition-colors ml-1"
              aria-label="Cerrar"
            >
              <X size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onClick={() => setTooltip(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-13 h-13 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-black/30"
      >
        {/* WhatsApp SVG */}
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.648 4.797 1.776 6.812L2 30l7.388-1.752A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 0 1-5.888-1.608l-.42-.252-4.384 1.04 1.08-4.248-.276-.436A11.526 11.526 0 0 1 4.4 16C4.4 9.593 9.593 4.4 16 4.4S27.6 9.593 27.6 16 22.407 27.6 16 27.6zm6.336-8.648c-.348-.176-2.056-1.016-2.376-1.128-.32-.116-.552-.172-.784.172-.232.344-.9 1.128-1.104 1.36-.2.232-.404.26-.752.088-.348-.176-1.468-.54-2.796-1.724-1.032-.92-1.728-2.056-1.932-2.404-.2-.344-.02-.532.152-.704.156-.156.348-.404.52-.608.172-.2.228-.344.344-.576.116-.228.056-.432-.028-.608-.088-.172-.784-1.892-1.076-2.588-.284-.68-.572-.584-.784-.596l-.668-.012c-.232 0-.608.088-.924.432-.32.344-1.212 1.184-1.212 2.888s1.24 3.352 1.412 3.584c.172.228 2.44 3.728 5.912 5.228.828.356 1.472.572 1.976.732.832.264 1.588.228 2.184.14.668-.1 2.056-.84 2.348-1.652.292-.812.292-1.508.204-1.652-.084-.148-.316-.232-.664-.408z"/>
        </svg>
      </motion.a>

    </div>
  )
}
