import type { ReactNode } from "react"

/**
 * Clusters del blog SEO — 5 categorías estratégicas definidas en
 * `.claude/Estrategia_SEO_Blog_ADIMEX.md`.
 *
 * - `transaccional` (A): keywords de marca FLEXEM, conversión directa.
 * - `comparativas` (B): decisiones de compra, versus.
 * - `maquina`      (C): soluciones por tipo de máquina.
 * - `soporte`      (D): tutoriales y troubleshooting.
 * - `educacional`  (E): TOFU, autoridad temática.
 */
export type BlogCluster =
  | "transaccional"
  | "comparativas"
  | "maquina"
  | "soporte"
  | "educacional"

export const clusterMeta: Record<
  BlogCluster,
  { label: string; description: string }
> = {
  transaccional: {
    label: "Guías de compra",
    description: "Todo lo que necesitas antes de cotizar tu proyecto Flexem.",
  },
  comparativas: {
    label: "Comparativas",
    description: "Alternativas honestas para elegir tu PLC, HMI o SCADA.",
  },
  maquina: {
    label: "Soluciones por máquina",
    description: "Arquitecturas probadas por tipo de máquina industrial.",
  },
  soporte: {
    label: "Soporte técnico",
    description: "Tutoriales, errores comunes y descargas comentadas.",
  },
  educacional: {
    label: "Educación",
    description: "Fundamentos para integradores y responsables de planta.",
  },
}

export type BlogFAQ = { q: string; a: string }

export interface BlogPost {
  slug: string
  title: string
  /** Máx 160 chars — se usa como meta description y en el listado. */
  excerpt: string
  /** Máx 200 chars — resumen humano-legible bajo el H1. */
  description: string
  cluster: BlogCluster
  /** Categoría visible en la tarjeta y en el detalle. */
  category: string
  publishedAt: string
  updatedAt?: string
  author: string
  /** Tiempo estimado de lectura en minutos. */
  readingMinutes: number
  /** Imagen hero — puede ser un asset local en /public. */
  cover?: { src: string; alt: string }
  /** Palabra clave principal para la que se optimiza el artículo. */
  focusKeyword: string
  /** Slugs de productos que se enlazan/embeben en el artículo. */
  relatedProductSlugs?: string[]
  /** Slugs de otros artículos del mismo cluster. */
  relatedPostSlugs?: string[]
  /** Texto precargado para el CTA de WhatsApp contextual. */
  whatsappContext: string
  /** Preguntas frecuentes — genera schema.org/FAQPage. */
  faq?: BlogFAQ[]
  /** Cuerpo renderizado como React. */
  Body: () => ReactNode
}
