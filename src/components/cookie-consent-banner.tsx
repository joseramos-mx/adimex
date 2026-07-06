"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Cookie, ChevronDown, ChevronUp, Check } from "lucide-react"
import { useCookieConsent } from "@/context/cookie-consent-context"

/**
 * Banner de consentimiento de cookies.
 *
 * Reutiliza el patrón `AnimatePresence + motion.div` con el easing
 * `[0.32, 0.72, 0, 1]` del cart drawer para mantener consistencia visual.
 * Slide desde abajo, colapsable a panel expandido con toggles por categoría.
 */
export default function CookieConsentBanner() {
  const { needsDecision, consent, acceptAll, acceptOnlyNecessary, save } =
    useCookieConsent()
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState<boolean>(consent?.analytics ?? true)

  const savePreferences = () => {
    save({ analytics })
  }

  return (
    <AnimatePresence>
      {needsDecision && (
        <motion.aside
          key="cookie-banner"
          role="dialog"
          aria-label="Consentimiento de cookies"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-50 bg-white border border-black/10 shadow-2xl"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 p-5 pb-4">
            <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-[#017bfd]/8 text-[#017bfd]">
              <Cookie size={17} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#07080c] leading-snug">
                Este sitio usa cookies
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Las estrictamente necesarias son indispensables para operar el
                carrito y la sesión. Las analíticas nos ayudan a mejorar el
                sitio con datos agregados. Consulta la{" "}
                <Link
                  href="/legal/politica-de-cookies"
                  className="text-[#017bfd] hover:underline"
                >
                  Política de Cookies
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Expanded preferences */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="prefs"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden border-t border-black/8"
              >
                <div className="px-5 py-4 flex flex-col gap-3">
                  <CategoryRow
                    title="Estrictamente necesarias"
                    description="Sesión, carrito, región y tema. No se pueden desactivar."
                    checked
                    disabled
                    onChange={() => {}}
                  />
                  <CategoryRow
                    title="Analíticas"
                    description="Vercel Analytics y Speed Insights. Datos agregados, sin identificarte."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="px-5 pb-5 pt-1 flex flex-col gap-2">
            {expanded ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={acceptOnlyNecessary}
                  className="h-9 border border-black/15 text-xs font-medium text-[#07080c] hover:bg-gray-50 transition-colors"
                >
                  Rechazar opcionales
                </button>
                <button
                  onClick={savePreferences}
                  className="h-9 bg-[#017bfd] hover:bg-[#0066d6] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check size={13} /> Guardar preferencias
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={acceptOnlyNecessary}
                  className="h-9 border border-black/15 text-xs font-medium text-[#07080c] hover:bg-gray-50 transition-colors"
                >
                  Solo necesarias
                </button>
                <button
                  onClick={acceptAll}
                  className="h-9 bg-[#017bfd] hover:bg-[#0066d6] text-xs font-semibold text-white transition-colors"
                >
                  Aceptar todo
                </button>
              </div>
            )}

            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center justify-center gap-1 text-[11px] text-gray-500 hover:text-[#07080c] transition-colors py-1 font-mono"
            >
              {expanded ? (
                <>
                  Ocultar preferencias <ChevronUp size={11} />
                </>
              ) : (
                <>
                  Ver preferencias <ChevronDown size={11} />
                </>
              )}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function CategoryRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#07080c]">{title}</p>
        <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
          {description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative w-9 h-5 shrink-0 transition-colors",
          checked ? "bg-[#017bfd]" : "bg-gray-300",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        <motion.span
          layout
          transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
          className={[
            "absolute top-0.5 w-4 h-4 bg-white",
            checked ? "right-0.5" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  )
}
