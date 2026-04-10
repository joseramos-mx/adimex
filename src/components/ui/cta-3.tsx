"use client"

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function CallToAction() {
  const [form, setForm] = React.useState({ name: "", email: "", empresa: "", message: "" })
  const [sent, setSent] = React.useState(false)

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  const inputClass = cn(
    "w-full bg-transparent border border-[#07080c]/20 px-3 py-2 text-xs text-[#07080c] placeholder-[#07080c]/30",
    "hover:border-[#07080c]/40 focus:border-[#017bfd] focus:outline-none transition-colors duration-150"
  )

  return (
    <div className="relative w-full sm:w-[80%] lg:w-[60%] mx-auto flex flex-col justify-center items-center gap-y-8 bg-[radial-gradient(35%_80%_at_25%_0%,rgba(1,123,253,0.07),transparent)] px-4 py-16">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-[#07080c]/20" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-[#07080c]/20" />
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-px bg-[#07080c]/20" />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-px bg-[#07080c]/20" />
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

      {sent ? (
        <div
          className="text-center text-sm text-[#017bfd] border border-[#017bfd]/30 px-6 py-4 w-full max-w-md"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Mensaje recibido — le contactaremos pronto.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-3"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            <input
              required
              type="email"
              placeholder="Correo"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Empresa"
            value={form.empresa}
            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
            className={inputClass}
          />
          <textarea
            required
            rows={3}
            placeholder="¿En qué podemos ayudarle?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={cn(inputClass, "resize-none")}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#017bfd] text-white hover:bg-[#0066d6] transition-colors duration-150"
          >
            Enviar mensaje
            <ArrowRightIcon className="size-3.5" />
          </button>
        </form>
      )}
    </div>
  )
}
