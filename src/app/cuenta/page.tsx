'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/auth-context'
import { Header } from '@/components/ui/header-04'
import Footer from '@/components/footer'
import { Package, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LineItem { title: string; quantity: number; image: string | null }
interface Order {
  id: string
  name: string
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: string
  currencyCode: string
  lineItems: LineItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(parseFloat(amount))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase()
  if (s === 'paid' || s === 'fulfilled') {
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono text-green-600">
        <CheckCircle2 size={11} /> {status}
      </span>
    )
  }
  if (s === 'pending' || s === 'unfulfilled' || s === 'in_progress') {
    return (
      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-500">
        <Clock size={11} /> {status}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
      <XCircle size={11} /> {status}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CuentaPage() {
  const { customer, isLoggedIn, ready, login } = useAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [ordersError, setOrdersError] = useState(false)

  useEffect(() => {
    if (ready && !isLoggedIn) login()
  }, [ready, isLoggedIn, login])

  // Fetch orders once the user is confirmed logged in
  useEffect(() => {
    if (!isLoggedIn) return
    fetch('/api/account/orders')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ orders }) => setOrders(orders))
      .catch(() => setOrdersError(true))
  }, [isLoggedIn])

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <Header />

      <div data-theme="light" className="pt-20 px-6 border-b border-black/5 bg-white">
        <div className="max-w-3xl mx-auto py-3 flex items-center gap-2 text-[11px] font-mono text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-[#07080c]">Mi cuenta</span>
        </div>
      </div>

      <main data-theme="light" className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 space-y-10">

        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-1">Mi cuenta</p>
            <h1 className="text-2xl font-semibold text-[#07080c]">Bienvenido</h1>
            <p className="text-sm text-gray-400 mt-1">{customer.email}</p>
          </div>
          <Button asChild variant="outline"
            className="text-xs h-8 border-black/15 hover:border-red-200 hover:text-red-500 transition-colors">
            <Link href="/api/auth/logout">Cerrar sesión</Link>
          </Button>
        </div>

        {/* Orders */}
        <section>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-4">Mis pedidos</p>

          {/* Loading */}
          {orders === null && !ordersError && (
            <div className="flex items-center justify-center py-16 border border-black/5 bg-gray-50">
              <Loader2 size={16} className="animate-spin text-gray-300" />
            </div>
          )}

          {/* Scope not granted or API error */}
          {ordersError && (
            <div className="border border-black/5 bg-gray-50 p-8 flex flex-col items-center gap-3 text-center">
              <Package size={28} className="text-gray-200" />
              <p className="text-sm font-medium text-[#07080c]">No se pudieron cargar los pedidos</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Es posible que necesites volver a iniciar sesión para otorgar acceso a tus pedidos.
              </p>
              <Button onClick={login} className="h-8 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0">
                Volver a iniciar sesión
              </Button>
            </div>
          )}

          {/* Empty */}
          {orders?.length === 0 && (
            <div className="border border-black/5 bg-gray-50 p-10 flex flex-col items-center gap-3 text-center">
              <Package size={32} className="text-gray-200" />
              <p className="text-sm font-medium text-[#07080c]">Sin pedidos aún</p>
              <p className="text-xs text-gray-400">Explora el catálogo y realiza tu primer pedido.</p>
              <Button asChild className="h-8 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0">
                <Link href="/productos">Ver catálogo</Link>
              </Button>
            </div>
          )}

          {/* Orders list */}
          {orders && orders.length > 0 && (
            <div className="flex flex-col divide-y divide-black/5 border border-black/5">
              {orders.map((order) => (
                <div key={order.id} className="p-5 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    {/* Order meta */}
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-[#07080c]">{order.name}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{formatDate(order.processedAt)}</p>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.financialStatus} />
                        <StatusBadge status={order.fulfillmentStatus} />
                      </div>
                    </div>

                    {/* Total */}
                    <p className="text-sm font-semibold text-[#07080c] font-mono shrink-0">
                      {formatPrice(order.totalPrice, order.currencyCode)}
                    </p>
                  </div>

                  {/* Line items */}
                  {order.lineItems.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.lineItems.map((li, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-black/5 px-2.5 py-1.5">
                          {li.image && (
                            <div className="relative w-6 h-6 shrink-0 overflow-hidden">
                              <Image src={li.image} alt={li.title} fill className="object-cover" sizes="24px" />
                            </div>
                          )}
                          <span className="text-[11px] text-gray-500">
                            {li.title} × {li.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  )
}
