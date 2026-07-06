import type { Metadata } from "next"
import { BreadcrumbSchema } from "@/components/blog/breadcrumb"

export const metadata: Metadata = {
  title: "Soporte Técnico",
  description:
    "Centro de soporte técnico ADIMEX. Documentación, manuales, videos y asistencia para productos FLEXEM: PLCs, servomotores, HMI y SCADA.",
  alternates: { canonical: "https://adimex.io/soporte" },
}

export default function SoporteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Inicio", href: "/" },
          { name: "Soporte técnico", href: "/soporte" },
        ]}
      />
      {children}
    </>
  )
}
