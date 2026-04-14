'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { Header } from '@/components/ui/header-04'
import Footer from '@/components/footer'
import { Package, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CuentaPage() {
  const { customer, isLoggedIn, ready, login } = useAuth()

  // Only redirect after the cookie check is done and the user is not logged in
  useEffect(() => {
    if (ready && !isLoggedIn) login()
  }, [ready, isLoggedIn, login])

  // Still checking cookie — show spinner to avoid flash/loop
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={20} className="animate-spin text-gray-300" />
      </div>
    )
  }

  // Auth confirmed but no customer data yet (shouldn't happen, just a guard)
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
          <Button
            asChild
            variant="outline"
            className="text-xs h-8 border-black/15 hover:border-red-200 hover:text-red-500 transition-colors"
          >
            <Link href="/api/auth/logout">Cerrar sesión</Link>
          </Button>
        </div>

        {/* Orders */}
        <section>
          <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-4">Mis pedidos</p>
          <div className="border border-black/5 bg-gray-50 p-10 flex flex-col items-center gap-4 text-center">
            <Package size={32} className="text-gray-200" />
            <div>
              <p className="text-sm font-medium text-[#07080c]">Historial de pedidos</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Consulta el detalle y seguimiento de tus pedidos en el portal de Shopify.
              </p>
            </div>
            <Button
              asChild
              className="h-8 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 flex items-center gap-1.5"
            >
              <a
                href="https://shopify.com/67101950161/account/orders"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver mis pedidos
                <ArrowRight size={12} />
              </a>
            </Button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
