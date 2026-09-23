// Normalización de user_data para Meta Conversions API (round-5 p6).
//
// Regla base Meta:
// https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
//
// - em (email)          → lowercase + trim
// - fn, ln (nombres)    → lowercase, quitar puntuación (mantener letras/números/acentos ES)
// - ct (city)           → lowercase, sin espacios ni puntuación
// - zp (zip)            → sólo dígitos, primeros 5 (MX)
// - ph (phone)          → sólo dígitos; MX-friendly:
//                          10 dígitos           → "52" + 10
//                          "521" + 10 (13d)     → "52" + últimos 10 (drop del 1 legacy de móvil)
//                          "52" + 10  (12d)     → tal cual
//                          otro largo internacional → tal cual (asume ya lleva CC)
//
// Devolvemos "" para campos vacíos o inválidos — el caller no debe hashearlos.

export function normalizeEmail(raw: string | undefined | null): string {
  if (!raw) return ""
  return String(raw).trim().toLowerCase()
}

export function normalizeName(raw: string | undefined | null): string {
  if (!raw) return ""
  return String(raw)
    .toLowerCase()
    // Quita puntuación común dejando letras (incluye acentos), números, espacio y guion.
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function normalizeCity(raw: string | undefined | null): string {
  if (!raw) return ""
  return String(raw)
    .toLowerCase()
    // Meta pide "sin espacios ni puntuación" para ct.
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim()
}

export function normalizeZip(raw: string | undefined | null): string {
  if (!raw) return ""
  const digits = String(raw).replace(/\D/g, "")
  return digits.slice(0, 5)
}

export function normalizePhone(raw: string | undefined | null): string {
  if (!raw) return ""
  const digits = String(raw).replace(/\D/g, "")
  if (digits.length === 0) return ""
  if (digits.length === 10) return `52${digits}`
  if (digits.length === 13 && digits.startsWith("521")) return `52${digits.slice(3)}`
  return digits
}

/** Country code ISO-2 en minúsculas. Vacío si input no tiene 2 chars. */
export function normalizeCountry(raw: string | undefined | null): string {
  if (!raw) return ""
  const s = String(raw).trim().toLowerCase()
  return s.length === 2 ? s : ""
}
