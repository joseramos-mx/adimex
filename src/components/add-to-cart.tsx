'use client'

import { useState } from 'react'
import { ShoppingCart, Zap, Minus, Plus, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { sileo } from 'sileo'
import { useRegion, formatPriceForRegion } from '@/context/region-context'
import {
  trackMetaEvent,
  toMetaContentId,
  computeMetaValue,
  newEventId,
} from '@/lib/meta-pixel'
import { WHATSAPP_NUMBER } from '@/lib/contact'

const toastBase = {
  fill: '#111111',
  roundness: 14,
  styles: { title: 'text-white', description: 'text-white/60' },
} as const

interface Props {
  variantId: string
  price: string
  currencyCode: string
  availableForSale: boolean
  quantityAvailable: number
  productName: string
  /** SKU / handle usado como content_id en Meta Pixel. */
  sku?: string
}

export default function AddToCart({
  variantId,
  price,
  currencyCode,
  availableForSale,
  quantityAvailable,
  productName,
  sku,
}: Props) {
  const { addItem, goToCheckout, loading: cartLoading } = useCart()
  const { region } = useRegion()
  const [localLoading, setLocalLoading] = useState(false)
  const [qty, setQty] = useState(1)

  const loading = cartLoading || localLoading

  const priceDisplay = formatPriceForRegion(price, currencyCode, region)

  const contentId = toMetaContentId(sku ?? variantId)
  // Meta espera el value CON IVA en MXN, no el precio base de Shopify.
  const unitValue = computeMetaValue(price, currencyCode)

  const waMsg = `Hola, tengo dudas técnicas sobre el ${productName}. Vi la ficha en su sitio.`
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`

  async function handleAddToCart() {
    setLocalLoading(true)
    try {
      for (let i = 0; i < qty; i++) await addItem(variantId)
      trackMetaEvent(
        'AddToCart',
        {
          content_ids: [contentId],
          content_type: 'product',
          content_name: productName,
          value: unitValue * qty,
          currency: 'MXN',
          contents: [{ id: contentId, quantity: qty, item_price: unitValue }],
        },
        { eventID: newEventId('atc') },
      )
      sileo.success({
        title: qty > 1 ? `${qty}× artículos agregados` : 'Agregado al carrito',
        description: `${productName} está listo en tu pedido.`,
        ...toastBase,
      })
    } catch {
      sileo.error({
        title: 'No se pudo agregar',
        description: 'Intenta de nuevo o contáctanos por WhatsApp.',
        ...toastBase,
      })
    } finally {
      setLocalLoading(false)
    }
  }

  async function handleBuyNow() {
    setLocalLoading(true)
    try {
      for (let i = 0; i < qty; i++) await addItem(variantId)
      trackMetaEvent(
        'InitiateCheckout',
        {
          content_ids: [contentId],
          content_type: 'product',
          content_name: productName,
          num_items: qty,
          value: unitValue * qty,
          currency: 'MXN',
          contents: [{ id: contentId, quantity: qty, item_price: unitValue }],
        },
        { eventID: newEventId('ic') },
      )
      sileo.success({
        title: 'Redirigiendo al checkout',
        description: 'Serás llevado al pago seguro de Shopify.',
        ...toastBase,
      })
      goToCheckout()
    } catch {
      sileo.error({
        title: 'Error al procesar',
        description: 'No se pudo iniciar el checkout. Intenta de nuevo.',
        ...toastBase,
      })
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Price block */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold text-[#07080c] tracking-tight">
            {priceDisplay.formatted}
          </span>
          <span className="text-sm text-gray-400 pb-1 font-mono">{priceDisplay.currency}</span>
        </div>
        {priceDisplay.ivaIncluded && (
          <p className="text-[11px] text-gray-400 mt-0.5">
            IVA incluido
            {priceDisplay.currency === 'USD' && ' · El checkout procesa en MXN'}
          </p>
        )}
      </div>

      {/* Stock */}
      {availableForSale ? (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-sm font-medium text-green-700">
            {quantityAvailable > 0 ? `${quantityAvailable} unidades disponibles` : 'Disponible'}
          </span>
          <span className="text-xs text-gray-400">· Stock en México</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
          <span className="text-sm text-gray-500">Sin existencia temporalmente</span>
        </div>
      )}

      {/* Quantity */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500 font-mono uppercase tracking-widest">Cantidad</label>
        <div className="flex items-center gap-0 w-fit border border-black/15">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-r border-black/10"
          >
            <Minus size={13} />
          </button>
          <span className="w-12 h-9 flex items-center justify-center text-sm font-mono font-medium text-[#07080c]">
            {qty}
          </span>
          <button
            onClick={() => setQty(q => Math.min(quantityAvailable || 99, q + 1))}
            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-l border-black/10"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={handleBuyNow}
          disabled={!availableForSale || loading}
          className="w-full h-12 text-sm font-semibold bg-[#017bfd] hover:bg-[#0066d6] text-white border-0"
        >
          <Zap size={15} className="mr-2" />
          {loading ? 'Procesando...' : 'Comprar ahora'}
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!availableForSale || loading}
          variant="outline"
          className="w-full h-12 text-sm font-medium border-black/20 bg-white text-[#07080c] hover:bg-gray-50"
        >
          <ShoppingCart size={15} className="mr-2" />
          Agregar al carrito
        </Button>

        {/* WhatsApp secundario — tercerio visual, no compite con Comprar */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackMetaEvent(
              'Contact',
              {
                channel: 'whatsapp',
                surface: 'product-detail',
                content_ids: [contentId],
              },
              { eventID: newEventId('contact') },
            )
          }
          className="flex items-center justify-center gap-1.5 min-h-11 text-xs text-[#0066FF] hover:text-[#0055dd] font-medium transition-colors"
        >
          <MessageCircle size={13} />
          ¿Dudas técnicas? Escríbenos por WhatsApp
        </a>
      </div>

      <p className="text-[10px] text-gray-300 font-mono text-center">
        Checkout seguro vía Shopify · {productName}
      </p>
    </div>
  )
}
