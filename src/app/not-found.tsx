import Link from 'next/link'
import { ArrowRight, ArrowLeft, Search, Cpu, Zap, Monitor, BarChart3 } from 'lucide-react'
import { Header } from '@/components/ui/header-04'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

const suggestions = [
  { icon: Zap,       label: 'Servomotores',  href: '/productos?category=servo' },
  { icon: Cpu,       label: 'PLCs',          href: '/productos?category=plc'   },
  { icon: Monitor,   label: 'HMI',           href: '/productos?category=hmi'   },
  { icon: BarChart3, label: 'SCADA',         href: '/productos?category=scada' },
]

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#07080c]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Blue glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#017bfd]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-2xl w-full flex flex-col items-center text-center gap-8">
          {/* 404 */}
          <div className="flex flex-col items-center gap-2">

            <p
              className="text-[120px] md:text-[300px] font-semibold leading-none tracking-tighter select-none"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
            >
              404
            </p>
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-3 -mt-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">
              Esta página no existe
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-sm mx-auto">
              La URL que buscas no existe o fue movida. Te ayudamos a encontrar lo que necesitas.
            </p>
          </div>

          {/* Primary actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 px-5">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft size={12} />
                Ir al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-9 text-xs border-white/15 bg-transparent text-white hover:bg-white/8 px-5">
              <Link href="/productos" className="flex items-center gap-2">
                Ver productos
                <ArrowRight size={12} />
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-4">
            <div className="flex-1 border-t border-white/5" />
            <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">o explora por categoría</p>
            <div className="flex-1 border-t border-white/5" />
          </div>

          {/* Category shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {suggestions.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col items-center gap-2.5 p-4 border border-white/8 hover:border-[#017bfd]/40 hover:bg-white/3 transition-all duration-200"
              >
                <s.icon size={16} className="text-white/30 group-hover:text-[#017bfd] transition-colors" />
                <span className="text-xs text-white/50 group-hover:text-white transition-colors">{s.label}</span>
              </Link>
            ))}
          </div>

          {/* Contact fallback */}
          <p className="text-[11px] text-white/25 font-mono">
            ¿No encuentras lo que buscas?{' '}
            <Link href="/soporte" className="text-[#017bfd] hover:underline underline-offset-2">
              Contacta a soporte
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
