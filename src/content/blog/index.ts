import type { BlogPost } from "./types"
import { post as flexemMexico } from "./flexem-en-mexico-distribuidor-autorizado"
import { post as guiaFL7 } from "./guia-compra-plc-flexem-fl7"
import { post as hmiVs } from "./hmi-flexem-f007n-vs-f110c"
import { post as costoAutomatizacion } from "./cuanto-cuesta-automatizar-maquina-mexico-2026"
import { post as plcChinoEuropeo } from "./plc-chino-vs-plc-europeo"
import { post as studioP1 } from "./primer-proyecto-flexem-studio-parte-1"
import { post as modbusHmi } from "./hmi-flexem-modbus-plc-otra-marca"

/**
 * Registro central de artículos estáticos del blog.
 *
 * Cada artículo vive en su propio archivo `.tsx` para poder embeber JSX
 * (tarjetas de producto, CTA de WhatsApp, callouts). Este archivo los une
 * en una lista consumible por `src/lib/blog.ts`.
 *
 * Para agregar un artículo: crea el `.tsx`, expórtalo como `post` y añádelo
 * abajo en el orden en que quieras que aparezca por defecto.
 */
export const staticPosts: BlogPost[] = [
  flexemMexico,
  guiaFL7,
  hmiVs,
  costoAutomatizacion,
  plcChinoEuropeo,
  studioP1,
  modbusHmi,
]

export function getStaticPost(slug: string): BlogPost | undefined {
  return staticPosts.find((p) => p.slug === slug)
}
