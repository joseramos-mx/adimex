import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "ADIMEX — American Digital de México. Distribuidor autorizado FLEXEM en México. Automatización industrial de precisión con soporte técnico local.",
  alternates: { canonical: "https://adimex.io/nosotros" },
}

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
