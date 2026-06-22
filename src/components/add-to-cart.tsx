'use client'

import { useState } from 'react'
import { ShoppingCart, Zap, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { sileo } from 'sileo'
import { useRegion, formatPriceForRegion } from '@/context/region-context'

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
}

export default function AddToCart({
  variantId,
  price,
  currencyCode,
  availableForSale,
  quantityAvailable,
  productName,
}: Props) {
  const { addItem, goToCheckout, loading: cartLoading } = useCart()
  const { region } = useRegion()
  const [localLoading, setLocalLoading] = useState(false)
  const [qty, setQty] = useState(1)

  const loading = cartLoading || localLoading

  const priceDisplay = formatPriceForRegion(price, currencyCode, region)

  async function handleAddToCart() {
    setLocalLoading(true)
    try {
      for (let i = 0; i < qty; i++) await addItem(variantId)
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
      </div>

      <p className="text-[10px] text-gray-300 font-mono text-center">
        Checkout seguro vía Shopify · {productName}
      </p>
    </div>
  )
}
