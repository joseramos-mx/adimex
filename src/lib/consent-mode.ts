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
 * Cuando `false` (default), el webhook `/api/meta-capi` sólo envía Purchase
 * a Meta con datos no personales (value, currency, content_ids, event_id) si
 * el pedido no lleva `meta_consent=true` en `note_attributes`.
 *
 * Cuando `true`, se manda el `user_data` completo (email/phone/nombre/etc
 * hasheados) siempre — para tiendas donde la base legal cubre el envío de
 * datos de pedido a Meta sin consentimiento marketing explícito.
 *
 * Cambia esta línea sólo con visto bueno de legal.
 */
export const SEND_ORDER_PII_WITHOUT_CONSENT: boolean = false

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
