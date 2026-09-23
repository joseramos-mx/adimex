// Captura de fbclid (Facebook Click ID) y síntesis de la cookie _fbc
// que Meta usa como identificador de click (round-5 p2).
//
// El _fbc estándar tiene formato:
//   fb.<subdomain_index>.<creation_timestamp_ms>.<fbclid>
// donde subdomain_index = 1 cuando el pixel corre en el dominio raíz
// (subdomain_index=0 sería el ccTLD, ej: co.uk). Para adimex.io = 1.
//
// Guardamos el fbclid al aterrizar (sessionStorage) sin escribir la cookie
// todavía — la cookie sólo se crea si el usuario acepta marketing.

const KEY = "adimex.fbclid"
const FBC_COOKIE = "_fbc"
const FBC_MAX_AGE_SECONDS = 60 * 60 * 24 * 90 // 90 días, spec de Meta.

type StoredFbclid = { fbclid: string; ts: number }

function readStored(): StoredFbclid | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredFbclid
  } catch {
    return null
  }
}

/** Extrae fbclid de la URL actual y lo guarda con timestamp (una vez por sesión). */
export function captureFbclidFromLocation(): void {
  if (typeof window === "undefined") return
  const existing = readStored()
  if (existing) return
  const params = new URLSearchParams(window.location.search)
  const fbclid = params.get("fbclid")
  if (!fbclid) return
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ fbclid, ts: Date.now() }),
    )
  } catch {
    // sessionStorage bloqueado — no bloquea la app.
  }
}

function readFbcCookie(): string | undefined {
  if (typeof document === "undefined") return undefined
  const row = document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${FBC_COOKIE}=`))
  return row ? decodeURIComponent(row.slice(FBC_COOKIE.length + 1)) : undefined
}

/**
 * Si no existe cookie `_fbc` pero el navegador guardó un fbclid en sesión,
 * construye la cookie con formato `fb.1.<ts>.<fbclid>` para que fbq y el
 * cart attribute la usen. Idempotente.
 *
 * No sobreescribe una cookie _fbc existente (fbevents.js pudo haberla creado
 * antes con timestamp real del click).
 */
export function ensureFbcCookie(): void {
  if (typeof document === "undefined") return
  if (readFbcCookie()) return
  const stored = readStored()
  if (!stored) return
  const value = `fb.1.${stored.ts}.${stored.fbclid}`
  const encoded = encodeURIComponent(value)
  document.cookie = `${FBC_COOKIE}=${encoded}; path=/; max-age=${FBC_MAX_AGE_SECONDS}; SameSite=Lax`
}

/** Convenience: valor de la cookie _fbc (sintetizada o no) si existe. */
export function currentFbc(): string | undefined {
  return readFbcCookie()
}
