'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle2, ArrowRight, Zap, Cpu, Activity, BarChart3,
  Phone, Mail, MessageCircle, ChevronDown, Star, Shield,
  Package, Clock, Settings2, Layers, X, Menu,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

// ─── Data ──────────────────────────────────────────────────────────────────────

const WHATSAPP = '521XXXXXXXXXX' // TODO: replace with real number

const stats = [
  { value: '32', unit: 'ejes', label: 'Control simultáneo' },
  { value: '200', unit: 'kHz', label: 'Pulso alta velocidad' },
  { value: '8', unit: 'HSC', label: 'Contadores rápidos' },
  { value: '100%', unit: '', label: 'Compatible CODESYS' },
]

const features = [
  {
    icon: Layers,
    title: 'Control multi-eje hasta 32 ejes',
    desc: 'Coordina hasta 32 servomotores de forma simultánea con algoritmos de interpolación lineal, circular y helicoidal.',
  },
  {
    icon: Zap,
    title: 'I/O de alta velocidad (PTO/HSC)',
    desc: 'Entrada de contador de alta velocidad a 200 kHz y salida de pulso PTO en 4 ejes — sin módulos adicionales.',
  },
  {
    icon: Settings2,
    title: 'Leva electrónica integrada',
    desc: 'Sincronización maestro-esclavo mediante levas electrónicas programables, ideal para líneas de packaging y ensamble.',
  },
  {
    icon: Cpu,
    title: 'Programación CODESYS',
    desc: 'Entorno estándar IEC 61131-3 con soporte de los 5 lenguajes: ST, LD, FBD, IL y SFC. Sin licencias propietarias.',
  },
  {
    icon: Activity,
    title: 'Conectividad dual RS485 + Ethernet',
    desc: '2 puertos RS485 para Modbus RTU/ASCII y 1 Ethernet para Modbus TCP, PROFINET y EtherCAT opcional.',
  },
  {
    icon: Shield,
    title: 'Diseño industrial robusto',
    desc: 'Alimentación 24 V DC, temperatura de operación extendida y protección contra interferencias electromagnéticas.',
  },
]

const specs = [
  { label: 'Modelos base',                value: 'FL721-0808N-D · FL721-0808P-D · FL721-0806R-D' },
  { label: 'Alimentación',               value: '24 V DC' },
  { label: 'Entradas digitales',         value: '8 puntos (transistor bidireccional)' },
  { label: 'Contador alta velocidad',    value: '8 puntos · 4 canales AB @ 200 kHz' },
  { label: 'Salidas digitales',          value: '8 NPN / 8 PNP / 6 Relé' },
  { label: 'Salida de pulso (PTO)',       value: '8 puntos · 4 ejes @ 200 kHz' },
  { label: 'Ejes máximos simultáneos',   value: '32 ejes' },
  { label: 'Comunicación',               value: '2 × RS485 · 1 × Ethernet' },
  { label: 'Protocolo',                  value: 'Modbus RTU/ASCII/TCP · PROFINET' },
  { label: 'Norma de programación',      value: 'IEC 61131-3 (CODESYS)' },
]

const applications = [
  'Maquinaria de empaques',
  'Ensamble de equipos electrónicos',
  'Dispositivos 3C',
  'Procesamiento de semiconductores',
  'Máquinas herramienta',
  'Fabricación de baterías de litio',
  'Impresión industrial',
  'Robótica cartesiana',
]

const cases = [
  {
    industry: 'Automotriz',
    company: 'TREMEC',
    result: 'Reducción del 40% en tiempo de ciclo en línea de ensamble de transmisiones.',
    href: '/casos/tremec-servomotores-linea-ensamble',
  },
  {
    industry: 'Manufactura',
    company: 'Mabe',
    result: 'Visibilidad total de producción con SCADA integrado y control PLC FL7.',
    href: '/casos/mabe-scada-visibilidad-produccion',
  },
  {
    industry: 'Cementera',
    company: 'CEMEX',
    result: 'Automatización de proceso con lógica PLC y reducción de paros no planeados.',
    href: '/casos/cemex-plc-control-proceso',
  },
]

const testimonials = [
  {
    name: 'Ing. Carlos Mendoza',
    role: 'Jefe de Automatización · Grupo Industrial del Norte',
    text: 'El FL7 nos permitió reemplazar un sistema de control legacy en menos de una semana. La integración con CODESYS fue inmediata y el soporte de ADIMEX fue excepcional.',
    stars: 5,
  },
  {
    name: 'Ing. Patricia Solís',
    role: 'Gerente de Proyectos · Líneas de Empaque SA',
    text: 'Control de 12 ejes sincronizados en nuestra máquina de flow-pack. El PTO a 200 kHz superó nuestras expectativas de velocidad y precisión.',
    stars: 5,
  },
  {
    name: 'Mtro. Roberto Fuentes',
    role: 'Director Técnico · Manufactura Avanzada MX',
    text: 'Llevamos 3 años usando la Serie FL7 en 8 líneas de producción. Cero fallas críticas. La relación precio-desempeño no tiene competencia en el mercado.',
    stars: 5,
  },
]

const faqs = [
  {
    q: '¿Cuánto tiempo tarda la entrega?',
    a: 'Stock disponible en México. Entregas en 3-5 días hábiles en CDMX y área metropolitana, 5-8 días al interior de la república.',
  },
  {
    q: '¿Incluye soporte técnico?',
    a: 'Sí. Todo equipo FLEXEM distribuido por ADIMEX incluye soporte técnico en español, acceso a manuales y asesoría de programación CODESYS.',
  },
  {
    q: '¿Puedo ver una demostración antes de comprar?',
    a: 'Por supuesto. Agendamos una demo técnica presencial o por videollamada donde mostramos el equipo funcionando con tu aplicación específica.',
  },
  {
    q: '¿El FL7 es compatible con mis servomotores actuales?',
    a: 'El FL7 es compatible con cualquier servomotor que acepte pulso+dirección o señal analógica ±10V. Para servos FLEXEM FV5-E/U3, la integración es plug-and-play.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ContactForm({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hola ADIMEX, me interesa el PLC Serie FL7.\n\nNombre: ${form.nombre}\nEmpresa: ${form.empresa}\nEmail: ${form.email}\nTeléfono: ${form.telefono}\n\n${form.mensaje}`
    )
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank')
    setSent(true)
  }

  const inputClass = `w-full h-9 px-3 text-xs border transition-colors outline-none focus:border-[#017bfd] ${
    dark
      ? 'bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:bg-white/8'
      : 'bg-white border-black/15 text-[#07080c] placeholder:text-gray-300'
  }`

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <CheckCircle2 size={32} className="text-[#017bfd]" />
        <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-[#07080c]'}`}>
          ¡Gracias! Abrimos WhatsApp para continuar.
        </p>
        <button onClick={() => setSent(false)} className="text-xs text-gray-400 underline underline-offset-2">
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleWhatsApp} className="flex flex-col gap-3">
      {!compact && (
        <p className={`text-[10px] tracking-widest uppercase font-mono mb-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          Solicitar cotización
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Nombre *" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className={inputClass} />
        <input placeholder="Empresa" value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} className={inputClass} />
      </div>
      <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
      <input type="tel" placeholder="Teléfono" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} className={inputClass} />
      {!compact && (
        <textarea
          placeholder="¿Cuál es tu aplicación? (opcional)"
          value={form.mensaje}
          onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
          rows={3}
          className={`${inputClass} h-auto py-2 resize-none`}
        />
      )}
      <Button type="submit" className="w-full h-10 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 font-semibold">
        <MessageCircle size={13} className="mr-2" />
        Solicitar cotización vía WhatsApp
      </Button>
      <p className={`text-[10px] text-center font-mono ${dark ? 'text-white/30' : 'text-gray-300'}`}>
        Respuesta en menos de 2 horas · Sin compromiso
      </p>
    </form>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="flex flex-col divide-y divide-black/5">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left gap-4"
          >
            <span className="text-sm font-medium text-[#07080c]">{faq.q}</span>
            <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-[#494F5F] pb-4 leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// ─── Sticky Nav ───────────────────────────────────────────────────────────────

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Beneficios', href: '#beneficios' },
    { label: 'Especificaciones', href: '#specs' },
    { label: 'Casos de éxito', href: '#casos' },
    { label: 'Preguntas frecuentes', href: '#faq' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-200 border-b font-mono ${
      scrolled ? 'bg-[#07080c]/95 backdrop-blur-xl border-white/10' : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <img src="/logo.svg" alt="ADIMEX" className="h-4 w-auto" />
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-xs text-white/60 hover:text-white transition-colors">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="text-xs h-8 border-white/20 bg-transparent text-white hover:bg-white/10">
            <Link href="/productos/plc-fl7">Ver producto</Link>
          </Button>
          <Button size="sm" className="text-xs h-8 bg-[#017bfd] hover:bg-[#0066d6] text-white border-0"
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
            Cotizar ahora
          </Button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-[#07080c] border-b border-white/10 px-6 pb-4"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            <ul className="flex flex-col gap-3 pt-3 mb-4">
              {links.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setMobileOpen(false)} className="text-sm text-white/60 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
            <Button className="w-full text-xs h-9 bg-[#017bfd] hover:bg-[#0066d6] text-white border-0"
              onClick={() => { setMobileOpen(false); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Cotizar ahora
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FL7LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <LandingNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-[#07080c] flex items-center overflow-hidden pt-14">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Blue glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#017bfd]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest uppercase text-[#017bfd] bg-[#017bfd]/10 border border-[#017bfd]/20 px-2 py-0.5 font-mono">
                Distribuidor Oficial FLEXEM
              </span>
              <span className="text-[9px] tracking-widest uppercase text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 font-mono">
                Stock disponible
              </span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight">
                PLC Serie FL7
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mt-1" style={{ color: '#017bfd' }}>
                Control multi-eje
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white/20 leading-[1.05] tracking-tight mt-1">
                hasta 32 ejes.
              </h2>
            </div>

            <p className="text-base text-white/50 leading-relaxed max-w-md">
              CODESYS · PTO 200 kHz · Ethernet + RS485. El PLC industrial diseñado para aplicaciones de movimiento y empaque de alta precisión.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {stats.map((s) => (
                <div key={s.label} className="border border-white/10 p-3 flex flex-col gap-1">
                  <p className="text-2xl font-semibold text-white font-mono">
                    {s.value}<span className="text-sm text-[#017bfd] ml-0.5">{s.unit}</span>
                  </p>
                  <p className="text-[10px] text-white/30 font-mono">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="h-10 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 px-5"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle size={13} className="mr-2" />
                Cotizar ahora
              </Button>
              <Button asChild variant="outline" className="h-10 text-xs border-white/20 bg-transparent text-white hover:bg-white/10 px-5">
                <Link href="/productos/plc-fl7" className="flex items-center gap-2">
                  Ver ficha técnica
                  <ArrowRight size={12} />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <a href={`tel:+${WHATSAPP}`} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors font-mono">
                <Phone size={11} /> Llamar ahora
              </a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors font-mono">
                <MessageCircle size={11} /> WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="lg:pl-8"
          >
            <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold text-white mb-1">Habla con un especialista</p>
              <p className="text-[11px] text-white/40 font-mono mb-5">Te contactamos en menos de 2 horas</p>
              <ContactForm dark />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <p className="text-[9px] font-mono text-white tracking-widest uppercase">Descubre más</p>
          <ChevronDown size={14} className="text-white animate-bounce" />
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="bg-[#07080c] border-t border-white/5 py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Distribuidor autorizado</p>
          <div className="flex flex-wrap items-center gap-8">
            {['FLEXEM', 'CODESYS', 'Modbus', 'PROFINET', 'EtherCAT'].map(b => (
              <span key={b} className="text-[11px] font-mono text-white/40 tracking-widest">{b}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-green-400" />
            <span className="text-[11px] font-mono text-white/40">Soporte en español</span>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────────── */}
      <section id="beneficios" data-theme="light" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Por qué elegir el FL7</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight max-w-lg">
                  Todo lo que necesitas en un solo controlador
                </h2>
              </div>
              <Button
                className="h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 shrink-0"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Solicitar demo
                <ArrowRight size={12} className="ml-2" />
              </Button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 0.07}>
                <div className="group p-6 border border-black/5 hover:border-[#017bfd]/30 hover:shadow-sm transition-all duration-200 h-full">
                  <div className="w-8 h-8 bg-[#017bfd]/8 flex items-center justify-center mb-4">
                    <feat.icon size={15} className="text-[#017bfd]" />
                  </div>
                  <p className="text-sm font-semibold text-[#07080c] mb-2 leading-snug">{feat.title}</p>
                  <p className="text-xs text-[#494F5F] leading-relaxed">{feat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── INLINE CTA ───────────────────────────────────────────────────── */}
      <section className="bg-[#017bfd] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">¿Tienes una aplicación específica?</p>
            <p className="text-xs text-white/70 mt-0.5">Nuestros ingenieros te asesoran sin costo para elegir la configuración correcta.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button
              variant="outline"
              className="h-9 text-xs border-white/30 bg-transparent text-white hover:bg-white/10"
              onClick={() => window.open(`https://wa.me/${WHATSAPP}`, '_blank')}
            >
              <MessageCircle size={12} className="mr-2" /> WhatsApp
            </Button>
            <Button
              className="h-9 text-xs bg-white text-[#017bfd] hover:bg-white/90 border-0 font-semibold"
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Cotizar FL7
            </Button>
          </div>
        </div>
      </section>

      {/* ── SPECS ────────────────────────────────────────────────────────── */}
      <section id="specs" data-theme="light" className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Especificaciones técnicas</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight mb-8">
              Rendimiento sin<br />compromisos
            </h2>
            <div className="border border-black/5 divide-y divide-black/5">
              {specs.map((s, i) => (
                <div key={s.label} className={`grid grid-cols-2 px-4 py-3 text-xs gap-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <span className="text-gray-400 font-mono">{s.label}</span>
                  <span className="text-[#07080c] font-medium">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Button asChild variant="outline" className="h-8 text-xs border-black/15 hover:border-[#017bfd]/30">
                <a href="https://es.flexem.com/products_detail/Serie_FL7.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  Ficha técnica completa <ArrowRight size={11} />
                </a>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-col gap-6">
              {/* Product image */}
              <div className="relative aspect-square bg-white border border-black/5 overflow-hidden">
                <Image
                  src="https://cdn.shopify.com/s/files/1/0671/0195/0161/files/9b4c8cda-3b31-4a27-8492-a71eec09963e.jpg"
                  alt="PLC Serie FL7"
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Applications */}
              <div>
                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Aplicaciones</p>
                <div className="flex flex-wrap gap-2">
                  {applications.map(a => (
                    <span key={a} className="text-[11px] text-[#494F5F] border border-black/10 px-3 py-1.5 hover:border-[#017bfd]/40 hover:text-[#017bfd] transition-colors">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                className="w-full h-10 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageCircle size={13} className="mr-2" />
                Quiero una cotización
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CASES ────────────────────────────────────────────────────────── */}
      <section id="casos" className="bg-[#07080c] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-[10px] tracking-widest text-white/30 uppercase font-mono mb-3">Casos de éxito</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight mb-12">
              Empresas que ya<br />confían en ADIMEX
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cases.map((c, i) => (
              <FadeIn key={c.company} delay={i * 0.1}>
                <Link href={c.href}
                  className="group flex flex-col justify-between p-6 border border-white/8 hover:border-[#017bfd]/40 hover:bg-white/3 transition-all duration-200 h-full">
                  <div>
                    <span className="text-[9px] tracking-widest uppercase font-mono text-[#017bfd] bg-[#017bfd]/10 border border-[#017bfd]/20 px-2 py-0.5">
                      {c.industry}
                    </span>
                    <p className="text-xl font-semibold text-white mt-4 mb-2">{c.company}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{c.result}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-6 text-[11px] font-mono text-white/30 group-hover:text-[#017bfd] transition-colors">
                    <span>Ver caso completo</span>
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section data-theme="light" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Testimonios</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight mb-12">
              Lo que dicen nuestros clientes
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="p-6 border border-black/5 bg-gray-50 flex flex-col gap-4 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={11} className="text-[#017bfd] fill-[#017bfd]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#494F5F] leading-relaxed flex-1">"{t.text}"</p>
                  <div className="border-t border-black/5 pt-4">
                    <p className="text-xs font-semibold text-[#07080c]">{t.name}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" data-theme="light" className="bg-gray-50 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Preguntas frecuentes</p>
            <h2 className="text-3xl font-semibold text-[#07080c] leading-tight tracking-tight mb-10">
              Resolvemos tus dudas
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <FAQ />
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 p-5 border border-black/5 bg-white flex items-center justify-between gap-4">
              <p className="text-sm text-[#494F5F]">¿Tienes otra pregunta? Habla directamente con un ingeniero.</p>
              <Button
                className="h-9 text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0 shrink-0"
                onClick={() => window.open(`https://wa.me/${WHATSAPP}`, '_blank')}
              >
                <MessageCircle size={12} className="mr-1.5" /> WhatsApp
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CONTACT ────────────────────────────────────────────────── */}
      <section id="contacto" data-theme="light" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeIn>
            <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Contacto</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight mb-4">
              ¿Listo para implementar<br />el PLC FL7?
            </h2>
            <p className="text-sm text-[#494F5F] leading-relaxed mb-8 max-w-md">
              Nuestro equipo de ingenieros analiza tu aplicación y te entrega una cotización con la configuración óptima en menos de 24 horas.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#017bfd]/8 border border-[#017bfd]/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} className="text-[#017bfd]" />
                </div>
                <p className="text-sm text-[#494F5F]">Cotización sin costo ni compromiso</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#017bfd]/8 border border-[#017bfd]/15 flex items-center justify-center shrink-0">
                  <Clock size={13} className="text-[#017bfd]" />
                </div>
                <p className="text-sm text-[#494F5F]">Respuesta en menos de 2 horas hábiles</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#017bfd]/8 border border-[#017bfd]/15 flex items-center justify-center shrink-0">
                  <Package size={13} className="text-[#017bfd]" />
                </div>
                <p className="text-sm text-[#494F5F]">Stock disponible · Envío a toda la república</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#017bfd]/8 border border-[#017bfd]/15 flex items-center justify-center shrink-0">
                  <Phone size={13} className="text-[#017bfd]" />
                </div>
                <p className="text-sm text-[#494F5F]">Soporte técnico en español incluido</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-gray-50 border border-black/5 p-6">
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
