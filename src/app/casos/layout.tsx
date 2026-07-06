import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata: Metadata = {
  title: "Casos de estudio",
  description:
    "Proyectos reales de automatización industrial con ADIMEX. Monitoreo IoT, SCADA, PLCs y servomotores aplicados en industria mexicana.",
  alternates: { canonical: "https://adimex.io/casos" },
}

export default function CasosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Inicio", href: "/" },
          { name: "Casos de estudio", href: "/casos" },
        ]}
      />
      {children}
    </>
  )
}
