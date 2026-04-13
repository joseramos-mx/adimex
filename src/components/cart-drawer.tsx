'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount))
}

export default function CartDrawer() {
  const { cart, itemCount, isOpen, loading, closeCart, removeItem, updateQuantity, goToCheckout } =
    useCart()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeCart])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
              <div className="flex items-center gap-2">
                <ShoppingCart size={15} className="text-[#07080c]" />
                <span className="text-sm font-semibold text-[#07080c]">
                  Carrito
                </span>
                {itemCount > 0 && (
                  <span className="text-[11px] font-mono bg-[#017bfd] text-white px-1.5 py-0.5 min-w-[20px] text-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#07080c]"
                aria-label="Cerrar carrito"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Package size={40} className="text-gray-200" />
                  <div>
                    <p className="text-sm font-medium text-[#07080c]">Tu carrito está vacío</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Agrega productos desde el catálogo
                    </p>
                  </div>
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="text-xs h-8 border-black/15 hover:border-[#017bfd]/40"
                    asChild
                  >
                    <a href="/productos">Ver catálogo</a>
                  </Button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex gap-3 pb-4 border-b border-black/5 last:border-0">
                      {/* Image */}
                      <div className="relative w-14 h-14 shrink-0 bg-gray-100 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package size={18} className="text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#07080c] leading-snug line-clamp-2">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[#017bfd] font-mono mt-1">
                          {formatPrice(item.price, item.currencyCode)}
                        </p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                            className="w-6 h-6 flex items-center justify-center border border-black/10 hover:border-black/30 transition-colors disabled:opacity-40"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-mono w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                            className="w-6 h-6 flex items-center justify-center border border-black/10 hover:border-black/30 transition-colors disabled:opacity-40"
                          >
                            <Plus size={10} />
                          </button>

                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={loading}
                            className="ml-auto p-1 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-40"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="px-5 py-4 border-t border-black/8 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Subtotal</span>
                  <span className="text-sm font-semibold text-[#07080c] font-mono">
                    {formatPrice(cart.totalAmount, cart.totalCurrencyCode)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-mono">
                  Envío e impuestos calculados en checkout
                </p>
                <Button
                  onClick={goToCheckout}
                  disabled={loading}
                  className="w-full h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 flex items-center justify-center gap-2"
                >
                  Ir a pagar
                  <ArrowRight size={13} />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
