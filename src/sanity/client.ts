import { createClient } from "next-sanity"
import { apiVersion, dataset, projectId, isSanityConfigured } from "@/sanity/env"

/**
 * Cliente Sanity — sólo se instancia si hay credenciales en el entorno.
 * Cuando faltan, `client.fetch()` devuelve un array vacío para que las
 * páginas del blog sigan renderizando con los artículos estáticos.
 */
type FetchFn = <T>(
  query: string,
  params?: Record<string, unknown>,
  options?: Record<string, unknown>
) => Promise<T>

type MinimalClient = { fetch: FetchFn }

const stubClient: MinimalClient = {
  fetch: async <T,>(): Promise<T> => {
    // Devuelve un array vacío. Los callers actuales o esperan una lista
    // o un objeto/null — en ambos casos la coerción a null via el `[0]`
    // que hace GROQ resuelve al valor esperado sin fallo.
    return [] as unknown as T
  },
}

export const client: MinimalClient = isSanityConfigured
  ? (createClient({ projectId, dataset, apiVersion, useCdn: true }) as MinimalClient)
  : stubClient
