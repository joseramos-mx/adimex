"use client"

import { useState } from "react"
import { Zap, MessageCircle } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useRegion, formatPriceForRegion } from "@/context/region-context"
import { WHATSAPP_NUMBER } from "@/lib/contact"
import {
  trackMetaEvent,
  toMetaContentId,
  computeMetaValue,
  newEventId,
} from "@/lib/meta-pixel"

/**
 * Sticky bottom bar visible sólo en móvil (< md).
 *
 * Solución al hallazgo "20s de permanencia / 0 checkouts": la barra de compra
 * permanece a mano durante todo el scroll de la ficha. Precio con IVA + CTA
 * primario Comprar + CTA tercerio WhatsApp para dudas técnicas.
 *
 * Dispara Meta InitiateCheckout con event_id único para deduplicar
 * server-side vía Conversions API.
 */
export default function ProductStickyBar({
  variantId,
  price,
  currencyCode,
  availableForSale,
  productName,
  sku,
}: {
  variantId: string
  price: string
  currencyCode: string
  availableForSale: boolean
  productName: string
  sku?: string
}) {
  const { addItem, goToCheckout } = useCart()
  const { region } = useRegion()
  const [loading, setLoading] = useState(false)

  const priceDisplay = formatPriceForRegion(price, currencyCode, region)
  const contentId = toMetaContentId(sku ?? variantId)
  const value = computeMetaValue(price, currencyCode)

  const waMsg = `Hola, tengo dudas técnicas sobre el ${productName}. Vi la ficha en su sitio.`
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`

  async function handleBuyNow() {
    if (!availableForSale || loading) return
    setLoading(true)
    try {
      await addItem(variantId)
      trackMetaEvent(
        "InitiateCheckout",
        {
          content_ids: [contentId],
          content_type: "product",
          content_name: productName,
          num_items: 1,
          value,
          currency: "MXN",
          contents: [{ id: contentId, quantity: 1, item_price: value }],
        },
        { eventID: newEventId("ic") }
      )
      goToCheckout()
    } catch {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Spacer para que el contenido no quede oculto detrás de la barra */}
      <div className="md:hidden h-20" aria-hidden="true" />

      {/* La barra */}
      <aside
        role="region"
        aria-label="Barra de compra"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch gap-2 px-3 py-2">
          {/* Precio + WhatsApp */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <span className="text-base font-bold text-[#0B1220] leading-tight tracking-tight truncate">
              {priceDisplay.formatted}
            </span>
            {priceDisplay.ivaIncluded && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackMetaEvent("Contact", {
                    channel: "whatsapp",
                    surface: "product-sticky-bar",
                    content_ids: [contentId],
                  })
                }
                className="inline-flex items-center gap-1 text-[10px] text-[#0066FF] font-medium leading-none mt-0.5"
              >
                <MessageCircle size={10} />
                Dudas técnicas · WA
              </a>
            )}
          </div>

          {/* Comprar */}
          <button
            onClick={handleBuyNow}
            disabled={!availableForSale || loading}
            className="min-h-11 px-5 flex-1 bg-[#0066FF] hover:bg-[#0055dd] active:bg-[#0055dd] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Zap size={15} />
            {loading ? "Procesando..." : "Comprar"}
          </button>
        </div>
      </aside>
    </>
  )
}
