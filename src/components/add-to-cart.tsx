'use client'

import { useState } from 'react'
import { ShoppingCart, Zap, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

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
  const [localLoading, setLocalLoading] = useState(false)

  const loading = cartLoading || localLoading

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(price))

  async function handleAddToCart() {
    setLocalLoading(true)
    try {
      await addItem(variantId)
    } catch {
      alert('No se pudo agregar al carrito. Intenta de nuevo.')
    } finally {
      setLocalLoading(false)
    }
  }

  async function handleBuyNow() {
    setLocalLoading(true)
    try {
      await addItem(variantId)
      goToCheckout()
    } catch {
      alert('No se pudo procesar. Intenta de nuevo.')
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-[#07080c]">{formattedPrice}</span>
        <span className="text-xs text-gray-400 font-mono">{currencyCode}</span>
      </div>

      {/* Stock badge */}
      <div className="flex items-center gap-2">
        <Package size={13} className={availableForSale ? 'text-green-500' : 'text-gray-400'} />
        {availableForSale ? (
          <span className="text-xs font-mono text-green-600">
            {quantityAvailable > 0 ? `${quantityAvailable} en existencia` : 'Disponible'}
          </span>
        ) : (
          <span className="text-xs font-mono text-gray-400">Sin existencia</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleBuyNow}
          disabled={!availableForSale || loading}
          className="h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0"
        >
          <Zap size={13} className="mr-1.5" />
          {loading ? 'Procesando...' : 'Comprar ahora'}
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={!availableForSale || loading}
          variant="outline"
          className="h-9 text-xs border-black/15 bg-white text-[#07080c] hover:bg-gray-50"
        >
          <ShoppingCart size={13} className="mr-1.5" />
          Agregar al carrito
        </Button>
      </div>

      <p className="text-[10px] text-gray-400 font-mono">
        Checkout seguro vía Shopify · {productName}
      </p>
    </div>
  )
}
