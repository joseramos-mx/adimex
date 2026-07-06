export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

/**
 * En desarrollo local Sanity es opcional — si no hay proyecto configurado,
 * `client.ts` devuelve un cliente stub que no hace fetch. Los artículos
 * estáticos del blog siguen funcionando; sólo los posts alojados en Sanity
 * quedan omitidos hasta que se agreguen las llaves.
 */
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? ""
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""

export const isSanityConfigured = Boolean(dataset && projectId)
