import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Feed de Google Merchant / Meta Catalog — explícito por si algún
      // crawler ignora el default de allow.
      { userAgent: "*", allow: "/products.xml" },
    ],
    sitemap: "https://adimex.io/sitemap.xml",
  }
}
