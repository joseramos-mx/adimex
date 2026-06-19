// Single source of truth for contact channels.
// Replace WHATSAPP_NUMBER with the real number when available.
// Format: country code + number, digits only (e.g. "521555XXXXXXX")
export const WHATSAPP_NUMBER = "5215635698469"

const waBase = `https://wa.me/${WHATSAPP_NUMBER}`

const encode = (text: string) => encodeURIComponent(text)

/** Pre-filled WhatsApp deep links for common entry points. */
export const WA_DEMO    = `${waBase}?text=${encode("Hola, me gustaría agendar una demo de sus soluciones.")}`
export const WA_VENTAS  = `${waBase}?text=${encode("Hola, quiero hablar con un ingeniero de ventas ADIMEX.")}`
export const WA_SOPORTE = `${waBase}?text=${encode("Hola, necesito soporte técnico.")}`
