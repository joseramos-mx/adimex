// Modo de consentimiento del sitio (T04).
//
// Cámbialo aquí — es una sola línea — cuando legal/abogado decida el modelo.
//   'opt-in'  → el pixel y las cookies de marketing SÓLO cargan al aceptar.
//               Cumple GDPR estricto y la LFPDPPP mexicana en su interpretación
//               más conservadora.
//   'notice'  → el pixel carga desde el inicio; el banner informa que se usan
//               cookies y permite oponerse. Común en LATAM.
//
// Por defecto arrancamos en 'opt-in'. El cliente confirmará con su asesor legal.

export type ConsentMode = "opt-in" | "notice"

export const CONSENT_MODE: ConsentMode = "opt-in"

/**
 * ¿Debe cargar hoy el pixel de marketing?
 * En 'notice' carga siempre. En 'opt-in' sólo si el usuario aceptó.
 */
export function shouldLoadMarketing(marketingAccepted: boolean): boolean {
  if (CONSENT_MODE === "notice") return true
  return marketingAccepted
}

/**
 * ¿Debe cargar hoy analytics?
 * Analytics respeta el mismo criterio — cumplen la misma normativa que
 * marketing en México.
 */
export function shouldLoadAnalytics(analyticsAccepted: boolean): boolean {
  if (CONSENT_MODE === "notice") return true
  return analyticsAccepted
}
