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
 * - `necessary`  siempre true (no se puede rechazar).
 * - `analytics`  controla Vercel Analytics, GA4, GTM y Contentsquare/Hotjar.
 * - `marketing`  controla píxeles publicitarios (Meta Pixel, LinkedIn Insight,
 *                Google Ads conversion tag). Cuando esté en false, ningún tag
 *                de retargeting o remarketing carga.
 * - `version`    permite invalidar el consentimiento cuando cambia el set de
 *                categorías o la política — al subirla, el banner reaparece.
 *                v1 = necessary + analytics.
 *                v2 = añadió marketing.
 */
export type CookieConsent = {
  necessary: true
  analytics: boolean
  marketing: boolean
  version: number
  timestamp: number
}

const STORAGE_KEY = "adimex.cookie-consent"
const COOKIE_NAME = "adimex_consent"
// 180 días — el prompt (T04) exige no volver a preguntar en ~6 meses.
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180
const CURRENT_VERSION = 2

function writeConsentCookie(value: CookieConsent): void {
  if (typeof document === "undefined") return
  try {
    const payload = encodeURIComponent(JSON.stringify(value))
    document.cookie = `${COOKIE_NAME}=${payload}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
  } catch {
    // silencioso
  }
}

function readConsentCookie(): CookieConsent | null {
  if (typeof document === "undefined") return null
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`))
    if (!match) return null
    const raw = decodeURIComponent(match.slice(COOKIE_NAME.length + 1))
    const parsed = JSON.parse(raw) as Partial<CookieConsent>
    if (parsed.version !== CURRENT_VERSION) return null
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      version: CURRENT_VERSION,
      timestamp: parsed.timestamp ?? Date.now(),
    }
  } catch {
    return null
  }
}

const defaultConsent: Omit<CookieConsent, "timestamp"> = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: CURRENT_VERSION,
}

type MutablePrefs = Partial<Omit<CookieConsent, "necessary" | "version" | "timestamp">>

type CookieConsentContextValue = {
  /** null hasta que el usuario decide por primera vez (banner visible). */
  consent: CookieConsent | null
  /** true si el banner debe mostrarse — no decidió o versión obsoleta. */
  needsDecision: boolean
  acceptAll: () => void
  acceptOnlyNecessary: () => void
  save: (prefs: MutablePrefs) => void
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

  // Hidrata desde cookie (180 d) primero — sobrevive a cambio de localStorage —
  // y cae a localStorage si no está.
  useEffect(() => {
    let restored: CookieConsent | null = readConsentCookie()
    if (!restored) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<CookieConsent>
          if (parsed.version === CURRENT_VERSION) {
            restored = {
              necessary: true,
              analytics: Boolean(parsed.analytics),
              marketing: Boolean(parsed.marketing),
              version: CURRENT_VERSION,
              timestamp: parsed.timestamp ?? Date.now(),
            }
          }
        }
      } catch {
        // localStorage bloqueado o JSON inválido — banner reaparece.
      }
    }
    if (restored) {
      setConsent(restored)
      // Reescribe la cookie para renovar el max-age y mantener sincronizados
      // ambos storages.
      writeConsentCookie(restored)
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
    writeConsentCookie(next)
  }, [])

  const acceptAll = useCallback(() => {
    persist({
      necessary: true,
      analytics: true,
      marketing: true,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    })
  }, [persist])

  const acceptOnlyNecessary = useCallback(() => {
    persist({
      necessary: true,
      analytics: false,
      marketing: false,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    })
  }, [persist])

  const save: CookieConsentContextValue["save"] = useCallback(
    (prefs) => {
      persist({
        necessary: true,
        analytics: prefs.analytics ?? consent?.analytics ?? false,
        marketing: prefs.marketing ?? consent?.marketing ?? false,
        version: CURRENT_VERSION,
        timestamp: Date.now(),
      })
    },
    [consent?.analytics, consent?.marketing, persist]
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
