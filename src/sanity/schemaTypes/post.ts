import { defineField, defineType } from "sanity"

export const postType = defineType({
  name: "post",
  title: "Artículo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumen",
      type: "text",
      rows: 3,
      description: "Breve descripción que aparece en la tarjeta del artículo.",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "cluster",
      title: "Cluster SEO",
      description:
        "Cluster de la estrategia de contenido. Determina interlinking y CTA.",
      type: "string",
      options: {
        list: [
          { title: "A · Transaccional / Marca FLEXEM", value: "transaccional" },
          { title: "B · Comparativas", value: "comparativas" },
          { title: "C · Soluciones por máquina", value: "maquina" },
          { title: "D · Soporte técnico y tutoriales", value: "soporte" },
          { title: "E · Educacional (TOFU)", value: "educacional" },
        ],
      },
    }),
    defineField({
      name: "category",
      title: "Categoría visible",
      description:
        "Etiqueta que se muestra en la tarjeta del artículo (ej. \"HMI\", \"Tutoriales\").",
      type: "string",
      options: {
        list: [
          { title: "Automatización", value: "automatizacion" },
          { title: "Servomotores", value: "servomotores" },
          { title: "SCADA", value: "scada" },
          { title: "PLCs", value: "plcs" },
          { title: "HMI", value: "hmi" },
          { title: "Industria 4.0", value: "industria40" },
          { title: "Tutoriales", value: "tutoriales" },
          { title: "Distribución oficial", value: "distribucion" },
          { title: "Costos y presupuestos", value: "costos" },
          { title: "Casos de éxito", value: "casos" },
        ],
      },
    }),
    defineField({
      name: "focusKeyword",
      title: "Palabra clave objetivo",
      description:
        "Keyword principal para SEO. Se usa como referencia — no se renderiza al usuario.",
      type: "string",
    }),
    defineField({
      name: "relatedProductSlugs",
      title: "Productos relacionados (slugs)",
      description:
        "Slugs de productos que se enlazan desde el artículo (ej. plc-fl7, hmi-f007n).",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "whatsappContext",
      title: "Texto precargado para WhatsApp",
      description:
        "Frase contextual al artículo que se precarga en el CTA de WhatsApp. Ejemplo: \"quiero cotizar equipo FLEXEM\".",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "faq",
      title: "Preguntas frecuentes",
      description:
        "Genera schema.org/FAQPage y se muestra al pie del artículo.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "q", title: "Pregunta", type: "string" }),
            defineField({ name: "a", title: "Respuesta", type: "text", rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Texto alternativo" }),
            defineField({ name: "caption", type: "string", title: "Pie de foto" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "excerpt", media: "mainImage" },
  },
  orderings: [
    {
      title: "Fecha de publicación, más reciente",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
})
