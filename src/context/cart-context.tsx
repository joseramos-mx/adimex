'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useCookieConsent } from './cookie-consent-context'
import { gatherAttributionAttrs } from '@/lib/attribution-attrs'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string          // Shopify line-item GID
  variantId: string
  /** SKU real del producto (usado como content_id de Meta cuando existe). */
  sku: string | null
  /** Handle del producto en Shopify — segundo fallback para content_id. */
  productHandle: string | null
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
  goToCheckout: () => Promise<void>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

const CART_ID_KEY = 'adimex_cart_id'

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { consent } = useCookieConsent()
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
        if (!data || !data.id) {
          localStorage.removeItem(CART_ID_KEY)
          return
        }
        // Discard carts that were created before the MX context was enforced —
        // they'd otherwise checkout in USD with the wrong exchange rate.
        if (data.totalCurrencyCode && data.totalCurrencyCode !== 'MXN') {
          localStorage.removeItem(CART_ID_KEY)
          return
        }
        setCart(data)
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
        // Sólo en la primera adición (cartCreate) enviamos atributos de
        // atribución — Shopify no permite update de attributes sobre un
        // cart existente vía Storefront, y así preservamos la fuente
        // original de la sesión.
        const isFirstAdd = !cart?.id
        const attributes = isFirstAdd
          ? gatherAttributionAttrs(consent?.marketing ?? false)
          : undefined
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variantId,
            cartId: cart?.id ?? null,
            ...(attributes && attributes.length > 0 ? { attributes } : {}),
          }),
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
    [cart?.id, consent?.marketing, persistCart]
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

  /**
   * Empuja los atributos de atribución de la sesión actual al cart existente
   * vía `cartAttributesUpdate` (round-5 p1). Merge preserva UTMs originales.
   * No falla ruidosamente — es best-effort: si Shopify rechaza, seguimos.
   */
  const syncAttributionAttrs = useCallback(
    async (): Promise<void> => {
      if (!cart?.id) return
      const attributes = gatherAttributionAttrs(consent?.marketing ?? false)
      if (attributes.length === 0) return
      try {
        await fetch('/api/cart/attributes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId: cart.id, attributes }),
        })
      } catch (err) {
        // Silencioso — analytics no puede tumbar la UX.
        console.warn('[Cart] syncAttributionAttrs failed', err)
      }
    },
    [cart?.id, consent?.marketing],
  )

  // (a) Cuando el usuario acepta marketing y ya existe un carrito, adjunta
  //     fbp/fbc/user_agent que no pudimos setear en el cartCreate original.
  useEffect(() => {
    if (!consent?.marketing || !cart?.id) return
    void syncAttributionAttrs()
    // Dependencia sobre marketing: sólo dispara al pasar de false→true.
  }, [consent?.marketing, cart?.id, syncAttributionAttrs])

  const goToCheckout = useCallback(async () => {
    if (!cart?.checkoutUrl) return
    // (b) Antes de redirigir, refrescamos atributos por si el fbc/UA cambió
    //     o el usuario aceptó marketing después de crear el carrito.
    await syncAttributionAttrs()
    // `return_to` sets the "Continue shopping" button destination in Shopify checkout
    const url = new URL(cart.checkoutUrl)
    url.searchParams.set('return_to', '/')
    window.location.href = url.toString()
  }, [cart?.checkoutUrl, syncAttributionAttrs])

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
