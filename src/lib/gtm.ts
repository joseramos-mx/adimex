/**
 * ID del contenedor de Google Tag Manager.
 *
 * Se puede sobreescribir por entorno con `NEXT_PUBLIC_GTM_ID` (por ejemplo,
 * un contenedor distinto en preview). Un valor vacío desactiva por completo
 * la carga de GTM y del `<noscript>` en el layout.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MSLKT9D9"
