'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string          // Shopify line-item GID
  variantId: string
  productName: string
  price: string
  currencyCode: string
  quantity: number
  image: string | null
}

export interface CartData {
  id: string
  checkoutUrl: string
  items: CartItem[]
  totalAmount: string
  totalCurrencyCode: string
}

interface CartContextValue {
  cart: CartData | null
  itemCount: number
  isOpen: boolean
  loading: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (variantId: string) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  goToCheckout: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

const CART_ID_KEY = 'adimex_cart_id'

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  // Load persisted cart on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return

    fetch(`/api/cart?id=${encodeURIComponent(cartId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.id) {
          setCart(data)
        } else {
          // Cart expired or not found — clear storage
          localStorage.removeItem(CART_ID_KEY)
        }
      })
      .catch(() => localStorage.removeItem(CART_ID_KEY))
  }, [])

  const persistCart = useCallback((data: CartData) => {
    setCart(data)
    localStorage.setItem(CART_ID_KEY, data.id)
  }, [])

  const addItem = useCallback(
    async (variantId: string) => {
      setLoading(true)
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId, cartId: cart?.id ?? null }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        persistCart(data)
        setIsOpen(true)
      } catch (err) {
        console.error('[Cart] addItem failed:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [cart?.id, persistCart]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return
      setLoading(true)
      try {
        const res = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId: cart.id, lineId }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        persistCart(data)
      } finally {
        setLoading(false)
      }
    },
    [cart?.id, persistCart]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return
      if (quantity < 1) return removeItem(lineId)
      setLoading(true)
      try {
        const res = await fetch('/api/cart', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId: cart.id, lineId, quantity }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        persistCart(data)
      } finally {
        setLoading(false)
      }
    },
    [cart?.id, persistCart, removeItem]
  )

  const goToCheckout = useCallback(() => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl
  }, [cart?.checkoutUrl])

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isOpen,
        loading,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        goToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
