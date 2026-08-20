"use client"

import { MessageCircle } from "lucide-react"
import { trackMetaEvent, toMetaContentId } from "@/lib/meta-pixel"

/**
 * Botón WhatsApp de la BlogProductCard — separado como componente cliente
 * para poder disparar el evento `Contact` de Meta Pixel al clic sin
 * convertir toda la card en cliente.
 */
export default function WaQuoteButton({
  href,
  productSku,
}: {
  href: string
  productSku: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackMetaEvent("Contact", {
          channel: "whatsapp",
          surface: "blog-product-card",
          content_ids: [toMetaContentId(productSku)],
        })
      }
      className="inline-flex items-center gap-2 h-10 px-4 bg-[#017bfd] hover:bg-[#0066d6] text-white text-xs font-semibold transition-colors"
    >
      <MessageCircle size={14} />
      Cotizar por WhatsApp
    </a>
  )
}
