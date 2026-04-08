import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "@/sanity/schemaTypes"

export default defineConfig({
  name: "adimex",
  title: "ADIMEX CMS",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Blog / Artículos")
              .child(S.documentTypeList("post").title("Artículos")),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !["post"].includes(item.getId() ?? "")
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
