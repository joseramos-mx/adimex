import { MetadataRoute } from "next"
import { casos } from "@/data/casos"

export default function sitemap(): MetadataRoute.Sitemap {
  const casoUrls = casos
    .filter((c) => !c.placeholder)
    .map((c) => ({
      url: `https://adimex.io/casos/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))

  return [
    {
      url: "https://adimex.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://adimex.io/productos",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://adimex.io/casos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...casoUrls,
    {
      url: "https://adimex.io/soporte",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://adimex.io/nosotros",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]
}
