import { MessageCircle } from "lucide-react"
import { WHATSAPP_NUMBER } from "@/lib/contact"

/**
 * CTA de WhatsApp con texto precargado contextual al artículo.
 *
 * Este es el eslabón medido de la estrategia: cada clic aquí originado
 * en /blog/ es un evento de GA4 que atribuye conversión al contenido.
 */
export default function BlogWhatsAppCTA({
  message,
  title = "¿Tienes un proyecto similar?",
  subtitle = "Cuéntanos qué necesitas automatizar y te decimos si podemos y cómo.",
  buttonLabel = "Hablar con un ingeniero",
}: {
  /** Frase precargada — sin la parte inicial "Hola,". */
  message: string
  title?: string
  subtitle?: string
  buttonLabel?: string
}) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, ${message}`
  )}`

  return (
    <aside className="my-12 border border-[#017bfd]/30 bg-[#017bfd]/[0.06] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
      <div className="flex-1">
        <p
          className="text-[10px] tracking-widest uppercase text-[#3b95ff] mb-2"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          ADIMEX / Acompañamiento técnico
        </p>
        <h4 className="text-base font-semibold text-white mb-1.5 leading-snug">
          {title}
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">{subtitle}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="blog-whatsapp"
        className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-[#017bfd] hover:bg-[#0066d6] text-white text-sm font-semibold transition-colors shrink-0"
      >
        <MessageCircle size={15} />
        {buttonLabel}
      </a>
    </aside>
  )
}
