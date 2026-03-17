import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export function CallToAction() {
  return (
    <div className="relative w-full sm:w-[80%] lg:w-[60%] mx-auto flex flex-col justify-center items-center gap-y-8 bg-[radial-gradient(35%_80%_at_25%_0%,rgba(1,123,253,0.07),transparent)] px-4 py-16">
      <div className="pointer-events-none absolute top-0 -left-10 -right-10 h-px bg-[#07080c]/20" />
      <div className="pointer-events-none absolute bottom-0 -left-10 -right-10 h-px bg-[#07080c]/20" />
      <div className="pointer-events-none absolute -top-10 -bottom-10 left-0 w-px bg-[#07080c]/20" />
      <div className="pointer-events-none absolute -top-10 -bottom-10 right-0 w-px bg-[#07080c]/20" />
      <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-[#07080c]/20" />

      <div className="space-y-2">
        <h2
          className="text-center font-bold text-2xl lg:text-3xl text-[#07080c] tracking-tight"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          ¿Listo para transformar su operación?
        </h2>
        <p
          className="text-center text-[#07080c]/50 text-sm"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Hable con nuestros especialistas. Sin compromiso.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="#"
          className="px-5 py-2.5 text-xs font-medium text-[#07080c] border border-[#07080c]/30 hover:border-[#07080c]/60 transition-colors"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Contactar ventas
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#017bfd] text-[#f0f2f5] hover:bg-[#0066d6] transition-colors"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Agendar consulta
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
