// Utilidades UTM (T07)
// Guarda los UTM de la primera página de la sesión y los recupera después.
// Persistencia: sessionStorage (dura hasta que cierran la pestaña).

const KEY = "adimex.session-utms"

export type SessionUtms = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  landing_url?: string
  captured_at?: number
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

/** Escribe los UTM detectados en la URL actual, sólo si no hay valor previo. */
export function captureUtmsFromLocation(): void {
  if (typeof window === "undefined") return
  try {
    const existing = readUtms()
    if (existing && Object.keys(existing).length > 0) return

    const params = new URLSearchParams(window.location.search)
    const captured: SessionUtms = {}
    for (const k of UTM_KEYS) {
      const v = params.get(k)
      if (v) (captured as Record<string, string>)[k] = v
    }
    if (Object.keys(captured).length === 0) return

    captured.landing_url = window.location.href
    captured.captured_at = Date.now()
    window.sessionStorage.setItem(KEY, JSON.stringify(captured))
  } catch {
    // sessionStorage bloqueado — no bloquea la app
  }
}

export function readUtms(): SessionUtms | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionUtms
  } catch {
    return null
  }
}

export function getUtmContent(): string | null {
  return readUtms()?.utm_content ?? null
}

/**
 * Toma un href de wa.me y le añade ` [Ref: <utm_content>]` al final del
 * mensaje prellenado si hay `utm_content` en la sesión. No modifica el link
 * si no hay UTM o si el href ya trae `[Ref:`.
 */
export function appendUtmRefToWaHref(href: string): string {
  const ref = getUtmContent()
  if (!ref) return href
  try {
    const url = new URL(href, window.location.origin)
    const text = url.searchParams.get("text")
    if (!text) return href
    if (text.includes("[Ref:")) return href
    url.searchParams.set("text", `${text} [Ref: ${ref}]`)
    return url.toString()
  } catch {
    return href
  }
}
