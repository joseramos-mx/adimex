'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, ArrowRight, Phone, Mail, MessageCircle,
  ChevronDown, Star, Shield, Package, Clock, X, Menu,
  Monitor, Wifi, Eye, Zap, RotateCcw, Video,
} from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

// ─── Data ──────────────────────────────────────────────────────────────────────

const WHATSAPP = '521XXXXXXXXXX' // TODO: replace with real number

const stats = [
  { value: '7"',    unit: '',    label: 'Pantalla IPS TFT'      },
  { value: '1024',  unit: '×600', label: 'Resolución HD'        },
  { value: 'IP65',  unit: '',    label: 'Protección frontal'    },
  { value: '5pt',   unit: '',    label: 'Multi-touch capacitivo'},
]

const features = [
  {
    icon: Monitor,
    title: 'Pantalla IPS 7" de alta definición',
    desc: 'Panel IPS TFT TrueColor 1024×600 con 350 cd/m² de brillo y ángulos de visión de 85° en todas las direcciones.',
  },
  {
    icon: Eye,
    title: 'Touch capacitivo multi-punto',
    desc: 'Tecnología Glass+Glass con reconocimiento de gestos: pellizco, deslizamiento y rotación. Compatible con guantes industriales.',
  },
  {
    icon: RotateCcw,
    title: 'Orientación flexible adaptable',
    desc: 'Soporte de instalación horizontal y vertical con rotación adaptativa de pantalla automática. Sin restricciones de montaje.',
  },
  {
    icon: Wifi,
    title: 'Conectividad Ethernet + 4G integrada',
    desc: 'Puerto RJ45 10/100 Mbps y módulo 4G opcional para colaboración cloud-edge y operación remota desde cualquier lugar.',
  },
  {
    icon: Video,
    title: 'VNC y visualización de cámaras en vivo',
    desc: 'Comparte pantalla remotamente vía VNC y visualiza feeds de cámaras IP directamente en la interfaz sin hardware adicional.',
  },
  {
    icon: Shield,
    title: 'Diseño robusto IP65 / -10 a 60 °C',
    desc: 'Protección IP65 frontal contra polvo y agua. Temperatura de operación extendida para ambientes industriales exigentes.',
  },
]

const specs = [
  { label: 'Tamaño de pantalla',      value: '7 pulgadas (16:9)' },
  { label: 'Resolución',              value: '1024 × 600 px' },
  { label: 'Tipo de panel',           value: 'LCD TFT IPS TrueColor' },
  { label: 'Brillo',                  value: '350 cd/m²' },
  { label: 'Ángulos de visión',       value: '85° (todas las direcciones)' },
  { label: 'Touch',                   value: 'Capacitivo multi-punto Glass+Glass' },
  { label: 'Procesador',              value: 'ARM Cortex-A8 600 MHz' },
  { label: 'Memoria',                 value: '256 MB DDR3 + 256 MB Flash' },
  { label: 'Ethernet',                value: '1 × RJ45 10/100 Mbps' },
  { label: 'Puertos serie',           value: 'COM (RS232/RS485/RS422)' },
  { label: 'USB',                     value: 'Type-C 2.0 + Type-A 2.0' },
  { label: 'Alimentación',            value: 'DC 24 V (rango 9–28 V)' },
  { label: 'Consumo',                 value: '≤ 6 W' },
  { label: 'Temperatura operación',   value: '-10 a 60 °C' },
  { label: 'Protección',              value: 'IP65 frontal · IP20 trasero' },
  { label: 'Dimensiones',             value: '185.1 × 130.9 × 32.6 mm' },
]

const applications = [
  'Maquinaria de empaques',
  'Fabricación de equipos electrónicos',
  'Procesamiento de semiconductores',
  'Producción de baterías de litio',
  'Gestión hídrica y bombeo',
  'Monitoreo de energía solar',
  'Máquinas herramienta CNC',
  'Equipos fotovoltaicos',
]

const cases = [
  {
    industry: 'Manufactura',
    company: 'Industria de Empaques del Norte',
    result: 'Reducción del 35% en errores de operación tras migrar a HMI capacitiva F007N con visualización de cámaras integrada.',
    href: '/casos',
  },
  {
    industry: 'Energía',
    company: 'Gestión Hídrica Municipal',
    result: 'Control SCADA de 12 estaciones de bombeo con supervisión remota 4G. Tiempo de respuesta a fallas: de 4 h a 20 min.',
    href: '/casos/sala-bombas-monitoreo-scada-iot',
  },
  {
    industry: 'Automotriz',
    company: 'Línea de Ensamble Tier 1',
    result: 'Integración con PLC FL7 y servos FV5-E. Panel F007N como interfaz de operador en 8 estaciones de trabajo.',
    href: '/casos',
  },
]

const testimonials = [
  {
    name: 'Ing. Marco Ávila',
    role: 'Jefe de Producción · Empacadora Industrial del Bajío',
    text: 'La pantalla capacitiva del F007N es perfecta para nuestro ambiente con humedad. Los operadores la manejan con guantes sin ningún problema, y la imagen IPS es muy nítida incluso en ángulo.',
    stars: 5,
  },
  {
    name: 'Ing. Claudia Torres',
    role: 'Supervisora de Automatización · Planta Fotovoltaica Sonora',
    text: 'Instalamos 6 paneles F007N para monitoreo de inversores. La función 4G nos permite ver el estado de planta en tiempo real desde oficinas centrales. El soporte de ADIMEX fue rápido y en español.',
    stars: 5,
  },
  {
    name: 'Mtro. Alejandro Vargas',
    role: 'Director Técnico · Sistemas de Agua Industriales',
    text: 'Llevamos 2 años usando el F007N en 15 estaciones de bombeo. Resistente, confiable y el VNC remoto nos ahorra viajes de supervisión. Excelente relación costo-beneficio.',
    stars: 5,
  },
]

const faqs = [
  {
    q: '¿El F007N es compatible con nuestro PLC actual?',
    a: 'Sí. El F007N soporta más de 100 protocolos industriales incluyendo Modbus RTU/TCP, PROFINET, EtherNet/IP, Siemens S7 y muchos más. Compatible con prácticamente cualquier PLC del mercado.',
  },
  {
    q: '¿Cuánto tiempo tarda la entrega?',
    a: 'Stock disponible en México. Entregas en 3-5 días hábiles en CDMX y área metropolitana, 5-8 días al interior de la república.',
  },
  {
    q: '¿Incluye software de programación?',
    a: 'Sí. Incluye FlexEM Studio sin costo adicional para programación de pantallas, alarmas, históricos y recetas. Compatible con Windows 10/11.',
  },
  {
    q: '¿El módulo 4G es necesario para la función VNC?',
    a: 'No. VNC funciona sobre la red Ethernet local. El módulo 4G es para acceso remoto fuera de la red local, ideal para plantas distribuidas o supervisión a distancia.',
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

function ContactForm({ dark = false }: { dark?: boolean }) {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' })
  const [sent, setSent] = useState(false)

  function handleWhatsApp(e: React.FormEvent) {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hola ADIMEX, me interesa la HMI F007N 7" Capacitiva.\n\nNombre: ${form.nombre}\nEmpresa: ${form.empresa}\nEmail: ${form.email}\nTeléfono: ${form.telefono}\n\n${form.mensaje}`
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
      <p className={`text-[10px] tracking-widest uppercase font-mono mb-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
        Solicitar cotización
      </p>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Nombre *" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className={inputClass} />
        <input placeholder="Empresa" value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} className={inputClass} />
      </div>
      <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
      <input type="tel" placeholder="Teléfono" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} className={inputClass} />
      <textarea
        placeholder="¿Cuál es tu aplicación? (opcional)"
        value={form.mensaje}
        onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
        rows={3}
        className={`${inputClass} h-auto py-2 resize-none`}
      />
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

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { label: 'Beneficios',          href: '#beneficios'  },
    { label: 'Especificaciones',     href: '#specs'       },
    { label: 'Casos de éxito',       href: '#casos'       },
    { label: 'Preguntas frecuentes', href: '#faq'         },
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
            <Link href="/productos/hmi-fe6300">Ver producto</Link>
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

export default function F007NLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'var(--font-geist-sans)' }}>
      <LandingNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-[#07080c] flex items-center overflow-hidden pt-14">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#017bfd]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-[#017bfd]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] tracking-widest uppercase text-[#017bfd] bg-[#017bfd]/10 border border-[#017bfd]/20 px-2 py-0.5 font-mono">
                Distribuidor Oficial FLEXEM
              </span>
              <span className="text-[9px] tracking-widest uppercase text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 font-mono">
                Stock disponible
              </span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight">
                HMI F007N
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight mt-1" style={{ color: '#017bfd' }}>
                7" Capacitiva
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white/20 leading-[1.05] tracking-tight mt-1">
                IPS · IP65 · 4G.
              </h2>
            </div>

            <p className="text-base text-white/50 leading-relaxed max-w-md">
              Pantalla táctil industrial de alta definición con tecnología capacitiva multi-touch, acceso remoto VNC y módulo 4G para automatización conectada.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {stats.map((s) => (
                <div key={s.label} className="border border-white/10 p-3 flex flex-col gap-1">
                  <p className="text-xl font-semibold text-white font-mono">
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
                <a href="https://es.flexem.com/products_detail/F007N-_7-_Capacitive.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Ficha técnica oficial
                  <ArrowRight size={12} />
                </a>
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
            {['FLEXEM', 'Modbus', 'PROFINET', 'EtherNet/IP', 'VNC'].map(b => (
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
                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-mono mb-3">Por qué elegir el F007N</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight max-w-lg">
                  La HMI compacta que no compromete rendimiento
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
            <p className="text-sm font-semibold text-white">¿Necesitas compatibilidad con tu PLC actual?</p>
            <p className="text-xs text-white/70 mt-0.5">Más de 100 protocolos soportados. Nuestros ingenieros verifican la integración sin costo.</p>
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
              Cotizar F007N
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
              Precisión industrial en<br />formato compacto
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
                <a href="https://es.flexem.com/products_detail/F007N-_7-_Capacitive.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  Ficha técnica completa <ArrowRight size={11} />
                </a>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="flex flex-col gap-6">
              {/* Product visual */}
              <div className="relative aspect-square bg-white border border-black/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#017bfd]/5 to-transparent" />
                <div className="flex flex-col items-center gap-4 z-10">
                  <Monitor size={80} className="text-[#07080c]/10" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#07080c] font-mono">F007N</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">7" Capacitive HMI</p>
                  </div>
                </div>
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
              ¿Listo para implementar<br />el HMI F007N?
            </h2>
            <p className="text-sm text-[#494F5F] leading-relaxed mb-8 max-w-md">
              Nuestro equipo de ingenieros verifica la compatibilidad con tu sistema y te entrega una cotización en menos de 24 horas.
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
