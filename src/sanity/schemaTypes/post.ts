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
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Automatización", value: "automatizacion" },
          { title: "Servomotores", value: "servomotores" },
          { title: "SCADA", value: "scada" },
          { title: "PLCs", value: "plcs" },
          { title: "Industria 4.0", value: "industria40" },
          { title: "Casos de éxito", value: "casos" },
        ],
      },
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
