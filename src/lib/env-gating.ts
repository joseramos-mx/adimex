// Gate de envío/carga de pixel según entorno Vercel (round-5 p4).
//
// - Producción: pixel siempre carga si hay consent; CAPI siempre envía.
// - Preview / development: pixel NO carga a menos que la URL traiga
//   `?pixel_test=1` (persistido en sessionStorage para navegación siguiente).
//   CAPI sólo envía si META_CAPI_TEST_CODE existe, y siempre lo incluye
//   (para que el evento llegue a Test Events, no a producción).

const PIXEL_TEST_PARAM = "pixel_test"
const PIXEL_TEST_STORAGE = "adimex.pixel_test"

/** Server-side helper: ¿estamos en producción de Vercel? */
export function isProdEnv(): boolean {
  return process.env.VERCEL_ENV === "production"
}

/**
 * Client-side helper. Vercel expone VERCEL_ENV al server; para el cliente
 * copiamos a NEXT_PUBLIC_VERCEL_ENV en next.config.ts. En local dev queda
 * undefined → gateado como preview.
 */
export function isProdEnvClient(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
}

/**
 * ¿Debe cargar el pixel del navegador este pageview?
 * En prod: siempre (el consent lo evalúa aparte).
 * En preview: sólo si `?pixel_test=1` en URL, y lo persistimos en session
 * storage para que las siguientes vistas no lo pierdan.
 */
export function shouldLoadPixelInEnv(): boolean {
  if (isProdEnvClient()) return true
  if (typeof window === "undefined") return false
  try {
    const url = new URL(window.location.href)
    if (url.searchParams.get(PIXEL_TEST_PARAM) === "1") {
      window.sessionStorage.setItem(PIXEL_TEST_STORAGE, "1")
      return true
    }
    return window.sessionStorage.getItem(PIXEL_TEST_STORAGE) === "1"
  } catch {
    return false
  }
}

/**
 * Server-side: ¿debe la ruta CAPI reenviar a Meta?
 * En prod: sí siempre (si hay token).
 * En preview: sólo si hay META_CAPI_TEST_CODE — para no contaminar el pixel
 * de producción con eventos de prueba.
 */
export function shouldSendCapi(): boolean {
  if (isProdEnv()) return true
  return Boolean(process.env.META_CAPI_TEST_CODE)
}

/**
 * Server-side: ¿debe forzar `test_event_code` en el payload?
 * En preview con TEST_CODE presente: siempre. En prod: sólo si el operador
 * lo dejó definido a propósito (útil para verificar producción sin doble-conteo).
 */
export function forceTestEventCode(): boolean {
  return !isProdEnv() && Boolean(process.env.META_CAPI_TEST_CODE)
}
