"use client"

import { MessageCircle } from "lucide-react"
import { trackMetaEvent } from "@/lib/meta-pixel"
import { extractShopifyNumericId } from "@/lib/shopify-id"

/**
 * Botón WhatsApp de la BlogProductCard — separado como componente cliente
 * para poder disparar el evento `Contact` de Meta Pixel al clic sin
 * convertir toda la card en cliente.
 */
export default function WaQuoteButton({
  href,
  variantId,
}: {
  href: string
  /** GID de variante Shopify — opcional, sólo para productos comprables. */
  variantId?: string
}) {
  const contentId = variantId ? extractShopifyNumericId(variantId) : undefined
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackMetaEvent("Contact", {
          channel: "whatsapp",
          surface: "blog-product-card",
          ...(contentId ? { content_ids: [contentId] } : {}),
        })
      }
      className="inline-flex items-center gap-2 h-10 px-4 bg-[#017bfd] hover:bg-[#0066d6] text-white text-xs font-semibold transition-colors"
    >
      <MessageCircle size={14} />
      Cotizar por WhatsApp
    </a>
  )
}
