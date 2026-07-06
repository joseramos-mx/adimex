"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

/**
 * Preferencias de cookies persistidas por usuario.
 *
 * - `necessary` siempre es true (no se puede rechazar).
 * - `analytics` controla Vercel Analytics y Speed Insights.
 * - `version` permite invalidar el consentimiento cuando cambia el
 *   set de categorías o la política — al subirla, el banner reaparece.
 */
export type CookieConsent = {
  necessary: true
  analytics: boolean
  version: number
  timestamp: number
}

const STORAGE_KEY = "adimex.cookie-consent"
const CURRENT_VERSION = 1

const defaultConsent: Omit<CookieConsent, "timestamp"> = {
  necessary: true,
  analytics: false,
  version: CURRENT_VERSION,
}

type CookieConsentContextValue = {
  /** null hasta que el usuario decide por primera vez (banner visible). */
  consent: CookieConsent | null
  /** true si el banner debe mostrarse — no decidió o versión obsoleta. */
  needsDecision: boolean
  acceptAll: () => void
  acceptOnlyNecessary: () => void
  save: (prefs: Partial<Omit<CookieConsent, "necessary" | "version" | "timestamp">>) => void
  /** Fuerza reabrir el banner (para "Ajustar preferencias" en la política). */
  reopen: () => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)

  // Hidrata desde localStorage en el cliente
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CookieConsent
        if (parsed.version === CURRENT_VERSION) {
          setConsent(parsed)
        }
      }
    } catch {
      // localStorage bloqueado o JSON inválido — banner reaparece.
    }
    setHydrated(true)
  }, [])

  const persist = useCallback((next: CookieConsent) => {
    setConsent(next)
    setForceOpen(false)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Silencioso — cookies rechazadas o modo privado.
    }
  }, [])

  const acceptAll = useCallback(() => {
    persist({
      necessary: true,
      analytics: true,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    })
  }, [persist])

  const acceptOnlyNecessary = useCallback(() => {
    persist({
      necessary: true,
      analytics: false,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    })
  }, [persist])

  const save: CookieConsentContextValue["save"] = useCallback(
    (prefs) => {
      persist({
        necessary: true,
        analytics: prefs.analytics ?? consent?.analytics ?? false,
        version: CURRENT_VERSION,
        timestamp: Date.now(),
      })
    },
    [consent?.analytics, persist]
  )

  const reopen = useCallback(() => setForceOpen(true), [])

  const needsDecision = useMemo(() => {
    if (!hydrated) return false
    if (forceOpen) return true
    return consent === null
  }, [consent, forceOpen, hydrated])

  const value = useMemo(
    () => ({ consent, needsDecision, acceptAll, acceptOnlyNecessary, save, reopen }),
    [consent, needsDecision, acceptAll, acceptOnlyNecessary, save, reopen]
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    throw new Error("useCookieConsent must be used inside CookieConsentProvider")
  }
  return ctx
}

/** Silencia el default para SSR pre-hidratación cuando el hook aún no está listo. */
export { defaultConsent }
