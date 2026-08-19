/**
 * ID del contenedor de Google Tag Manager.
 *
 * Se puede sobreescribir por entorno con `NEXT_PUBLIC_GTM_ID` (por ejemplo,
 * un contenedor distinto en preview). Un valor vacío desactiva por completo
 * la carga de GTM y del `<noscript>` en el layout.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MSLKT9D9"

/**
 * Measurement ID de Google Analytics 4 (gtag.js, cargado directo — no vía
 * GTM). Si algún día mueves GA4 dentro del contenedor de GTM, vacía esta
 * constante para no duplicar el conteo de páginas.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-8XQTCY1DRC"

/**
 * Tag ID de Contentsquare (Hotjar) — mapas de calor, grabaciones de sesión
 * y análisis de embudo. Reemplaza a Microsoft Clarity. Vacío desactiva la
 * carga.
 */
export const CONTENTSQUARE_TAG_ID =
  process.env.NEXT_PUBLIC_CONTENTSQUARE_TAG_ID ?? "60db6e6f43e01"
