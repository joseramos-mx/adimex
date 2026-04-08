/**
 * Seed script — creates example blog posts in Sanity.
 *
 * Requirements:
 *   1. Add SANITY_API_TOKEN to .env.local (create a token at sanity.io/manage
 *      → your project → API → Tokens → Add API token with "Editor" permissions)
 *   2. Run:  node scripts/seed-posts.mjs
 */

import { createClient } from "@sanity/client"
import "dotenv/config"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const posts = [
  {
    _type: "post",
    title: "Servomotores FV5-E: precisión industrial en cada ciclo",
    slug: { _type: "slug", current: "servomotores-fv5e-precision-industrial" },
    excerpt:
      "La nueva generación de servomotores FV5-E de ADIMEX redefine los estándares de precisión y respuesta dinámica para líneas de manufactura de alta velocidad. Descubra cómo reduce tiempos de ciclo hasta un 35%.",
    category: "Servomotores",
    author: "Ing. Carlos Méndez",
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: "block",
        _key: "intro",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "intro-text",
            text: "La automatización industrial moderna exige componentes capaces de responder en milisegundos sin sacrificar precisión. Los servomotores FV5-E fueron diseñados con exactamente ese objetivo en mente.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h1",
        style: "h2",
        children: [{ _type: "span", _key: "h1-t", text: "¿Qué los diferencia?" }],
      },
      {
        _type: "block",
        _key: "body1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "b1",
            text: "El FV5-E integra encoders absolutos de 23 bits, lo que permite una resolución de posición de 0.00004°. Combinado con su controlador dedicado, el sistema cierra el lazo de posición en menos de 62.5 µs, eliminando prácticamente el error acumulativo en operaciones repetitivas.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h2",
        style: "h2",
        children: [{ _type: "span", _key: "h2-t", text: "Resultados en planta" }],
      },
      {
        _type: "block",
        _key: "body2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "b2",
            text: "En una implementación reciente con Grupo TREMEC, la sustitución de servos convencionales por FV5-E redujo los tiempos de ciclo en un 35% y el scrap por posicionamiento deficiente cayó a cero en el primer mes de operación.",
          },
        ],
      },
    ],
  },
  {
    _type: "post",
    title: "FlexSCADA: visibilidad total de su planta en tiempo real",
    slug: { _type: "slug", current: "flexscada-visibilidad-planta-tiempo-real" },
    excerpt:
      "FlexSCADA conecta todos sus activos industriales en un solo dashboard. Alarmas inteligentes, KPIs en vivo y trazabilidad completa sin necesidad de infraestructura adicional.",
    category: "SCADA",
    author: "Ing. Sofía Guerrero",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    body: [
      {
        _type: "block",
        _key: "intro",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "i1",
            text: "Tomar decisiones operativas sin datos en tiempo real es como conducir con los ojos cerrados. FlexSCADA fue creado para eliminar esa brecha entre el piso de producción y la sala de control.",
          },
        ],
      },
      {
        _type: "block",
        _key: "h1",
        style: "h2",
        children: [{ _type: "span", _key: "h1t", text: "Arquitectura sin servidor propio" }],
      },
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "b1t",
            text: "A diferencia de los SCADA tradicionales que requieren servidores dedicados y licencias por nodo, FlexSCADA opera en la nube con conectores nativos para OPC-UA, Modbus TCP y MQTT. La instalación completa toma menos de un día.",
          },
        ],
      },
    ],
  },
  {
    _type: "post",
    title: "Variadores de frecuencia: ahorro energético del 22% en manufactura",
    slug: { _type: "slug", current: "variadores-frecuencia-ahorro-energetico" },
    excerpt:
      "Un estudio de caso con RASSINI demuestra cómo la implementación de variadores de frecuencia en motores de baja carga puede generar ahorros superiores al 22% en la factura eléctrica anual.",
    category: "Automatización",
    author: "Ing. Javier Reyes",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    body: [
      {
        _type: "block",
        _key: "intro",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "i1",
            text: "Los motores eléctricos representan hasta el 70% del consumo energético en una planta manufacturera típica. Cuando estos motores operan a velocidad fija en aplicaciones de carga variable, la energía desperdiciada es enorme. Los variadores de frecuencia resuelven exactamente ese problema.",
          },
        ],
      },
    ],
  },
]

async function seed() {
  console.log(`Connecting to project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)

  for (const post of posts) {
    const result = await client.create(post)
    console.log(`✓ Created: "${post.title}" (${result._id})`)
  }

  console.log("\nDone! Visit /blog to see your posts.")
}

seed().catch((err) => {
  console.error("Seed failed:", err.message)
  process.exit(1)
})
