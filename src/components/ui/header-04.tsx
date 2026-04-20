"use client"

import * as React from "react"
import Link from "next/link"
import {
  Menu, X, ChevronDown, ArrowRight, Search,
  Zap, Cpu, Activity, Monitor, BarChart3, Settings2,
  Car, Factory, Layers, Radio,
  FilePlus2Icon, LayoutTemplateIcon, PenToolIcon,
  ArrowUpRightIcon, PaletteIcon, ShoppingCart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useScroll, motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"

// ─── Dropdown data ─────────────────────────────────────────────────────────────

const productosDropdown = {
  label: "Todos los Productos",
  tagline: "La solución completa para automatización industrial avanzada.",
  viewAll: { label: "Ver todos los productos", href: "/productos" },
  items: [
    { icon: Zap,       name: "Servomotores FV5-E",       desc: "Alta precisión y respuesta dinámica",  href: "/productos/servo-fv5-e" },
    { icon: Settings2, name: "Servomotores FV5-U3",      desc: "Control de movimiento versátil",        href: "/productos/servo-fv5-u3" },
    { icon: Cpu,       name: "PLCs FL8",                 desc: "EtherCAT, hasta 32 ejes",               href: "/productos/plc-fl8" },
    { icon: Cpu,       name: "PLCs FL7",                 desc: "Control lógico programable avanzado",   href: "/productos/plc-fl7" },
    { icon: Monitor,   name: "HMI FE6300",               desc: "Interfaces táctiles IoT robustas",      href: "/productos/hmi-fe6300" },
    { icon: BarChart3, name: "FlexSCADA",                desc: "Visibilidad en tiempo real",             href: "/productos/scada-flexscada" },
  ],
}

const casosDropdown = {
  label: "Casos de Estudio",
  tagline: "Proyectos reales de transformación industrial con ADIMEX.",
  byIndustry: {
    heading: "Por industria",
    items: [
      { icon: Car,     name: "Automotriz",   href: "/casos/tremec-servomotores-linea-ensamble" },
      { icon: Factory, name: "Manufactura",  href: "/casos/mabe-scada-visibilidad-produccion"  },
      { icon: Layers,  name: "Vidrio",       href: "/casos/vitro-variadores-ahorro-energia"    },
      { icon: Radio,   name: "Cementera",    href: "/casos/cemex-plc-control-proceso"          },
    ],
  },
  bySolution: {
    heading: "Por solución",
    items: [
      { icon: Zap,       name: "Servomotores",        href: "/casos/tremec-servomotores-linea-ensamble" },
      { icon: BarChart3, name: "SCADA",               href: "/casos/mabe-scada-visibilidad-produccion"  },
      { icon: Cpu,       name: "Control de procesos", href: "/casos/cemex-plc-control-proceso"          },
      { icon: Activity,  name: "Eficiencia energética", href: "/casos/vitro-variadores-ahorro-energia"  },
    ],
  },
}

const regions = [
  { flag: "🇲🇽", label: "México",        code: "MX" },
  { flag: "🇺🇸", label: "United States", code: "US" },
  { flag: "🇨🇦", label: "Canada",        code: "CA" },
]

const menuItems = [
  { name: "Productos",        href: "#",     dropdown: "productos" },
  { name: "Casos de estudio", href: "/casos", dropdown: "casos"    },
  { name: "Soporte",           href: "/soporte", dropdown: null     },
  { name: "Nosotros",         href: "/nosotros", dropdown: null     },
  { name: "Descargas",        href: "#link", dropdown: null        },
]

// ─── Mega-menu panels ──────────────────────────────────────────────────────────

function ProductosPanel() {
  return (
    <div className="flex flex-col" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <div className="grid grid-cols-[220px_1fr] divide-x divide-white/10">
        <div className="flex flex-col gap-3 p-8">
          <p className="text-[10px] tracking-widest text-white/40 uppercase">{productosDropdown.label}</p>
          <p className="text-sm font-medium text-white leading-snug max-w-[160px]">{productosDropdown.tagline}</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-white/10">
          {productosDropdown.items.map((item) => (
            <Link key={item.name} href={item.href}
              className="flex items-start gap-3 p-5 border-b border-white/10 hover:bg-white/5 transition-colors group">
              <item.icon size={16} className="text-[#017bfd] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-white group-hover:text-[#017bfd] transition-colors">{item.name}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <Link href={productosDropdown.viewAll.href}
          className="flex items-center justify-between px-8 py-4 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors group">
          <span>{productosDropdown.viewAll.label}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

function CasosPanel() {
  return (
    <div className="flex flex-col" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <div className="grid grid-cols-[220px_1fr_1fr] divide-x divide-white/10">
        <div className="flex flex-col gap-3 p-8">
          <p className="text-[10px] tracking-widest text-white/40 uppercase">{casosDropdown.label}</p>
          <p className="text-sm font-medium text-white leading-snug max-w-[160px]">{casosDropdown.tagline}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] tracking-widest text-white/40 uppercase px-6 pt-6 pb-3">{casosDropdown.byIndustry.heading}</p>
          {casosDropdown.byIndustry.items.map((item) => (
            <Link key={item.name} href={item.href}
              className="flex items-center gap-3 px-6 py-3 hover:bg-white/5 transition-colors group">
              <item.icon size={14} className="text-white/30 group-hover:text-[#017bfd] transition-colors" />
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">{item.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] tracking-widest text-white/40 uppercase px-6 pt-6 pb-3">{casosDropdown.bySolution.heading}</p>
          {casosDropdown.bySolution.items.map((item) => (
            <Link key={item.name} href={item.href}
              className="flex items-center gap-3 px-6 py-3 hover:bg-white/5 transition-colors group">
              <item.icon size={14} className="text-white/30 group-hover:text-[#017bfd] transition-colors" />
              <span className="text-xs text-white/70 group-hover:text-white transition-colors">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 grid grid-cols-[220px_1fr_1fr] divide-x divide-white/10">
        <div />
        <Link href="/casos" className="flex items-center justify-between px-6 py-4 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors group">
          <span>Ver todas las industrias</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/casos" className="flex items-center justify-between px-6 py-4 text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors group">
          <span>Ver todas las soluciones</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}

// ─── Search command ────────────────────────────────────────────────────────────

function SearchCommand({ isDark, open, setOpen }: { isDark: boolean; open: boolean; setOpen: (v: boolean) => void }) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(!open) }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "hidden lg:inline-flex items-center gap-2 h-8 px-3 text-xs transition-colors",
          isDark
            ? "text-white/40 border border-white/15 hover:border-white/30 hover:text-white/60"
            : "text-[#07080c]/40 border border-black/15 hover:border-black/30 hover:text-[#07080c]/70"
        )}
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <Search size={12} />
        <span>Buscar</span>
        <kbd className={cn("ml-1 text-[10px] px-1.5 py-0.5", isDark ? "bg-white/10" : "bg-black/8")}>Ctrl K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar productos, soluciones..." />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup heading="Productos">
            <CommandItem className="cursor-pointer" onSelect={() => { window.location.href = "/productos/servo-fv5-e" }}><Zap size={14} className="opacity-60" /><span className="pl-2">Servomotores FV5-E</span></CommandItem>
            <CommandItem className="cursor-pointer" onSelect={() => { window.location.href = "/productos/plc-fl7" }}><Cpu size={14} className="opacity-60" /><span className="pl-2">PLCs FL7</span></CommandItem>
            <CommandItem className="cursor-pointer" onSelect={() => { window.location.href = "/productos/plc-fl8" }}><Cpu size={14} className="opacity-60" /><span className="pl-2">PLCs FL8</span></CommandItem>
            <CommandItem className="cursor-pointer" onSelect={() => { window.location.href = "/productos/scada-flexscada" }}><BarChart3 size={14} className="opacity-60" /><span className="pl-2">FlexSCADA</span></CommandItem>
            <CommandItem className="cursor-pointer" onSelect={() => { window.location.href = "/productos/iot-fbox" }}><Radio size={14} className="opacity-60" /><span className="pl-2">FBox IoT Gateway</span></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navegar">
            <CommandItem className="cursor-pointer" onSelect={() => { window.location.href = "/productos" }}><ArrowUpRightIcon size={14} className="opacity-60" /><span className="pl-2">Ver catálogo</span><CommandShortcut>↗</CommandShortcut></CommandItem>
            <CommandItem className="cursor-pointer"><PaletteIcon size={14} className="opacity-60" /><span className="pl-2">Agendar demo</span></CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [isLight, setIsLight] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)
  const [region, setRegion] = React.useState(regions[0])
  const [regionOpen, setRegionOpen] = React.useState(false)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { itemCount, openCart } = useCart()
  const { customer, isLoggedIn, login, logout } = useAuth()

  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => setScrolled(latest > 0.05))
    return () => unsubscribe()
  }, [scrollYProgress])

  React.useEffect(() => {
    const check = () => {
      const lightSections = document.querySelectorAll('[data-theme="light"]')
      let light = false
      lightSections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 56 && rect.bottom >= 0) light = true
      })
      setIsLight(light)
    }
    window.addEventListener("scroll", check, { passive: true })
    check()
    return () => window.removeEventListener("scroll", check)
  }, [])

  const openDropdown = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(key)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120)
  }

  const isDark = activeDropdown || !isLight
  const linkClass = cn(
    "flex items-center gap-1 text-xs duration-200 transition-colors",
    isDark ? "text-white hover:text-white/70" : "text-[#07080c] hover:text-[#017bfd]"
  )

  return (
    <header>
      {(activeDropdown || regionOpen) && (
        <div className="fixed inset-0 z-10" onClick={() => { setActiveDropdown(null); setRegionOpen(false) }} />
      )}

      <nav
        className={cn(
          "fixed z-20 w-full h-14 border-b transition-colors duration-200 font-mono",
          activeDropdown ? "border-white/10 bg-[#07080c]" : isLight ? "border-black/10" : "border-white/10",
          scrolled && !activeDropdown && "backdrop-blur-xl"
        )}
      >
        <div className="px-6 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" aria-label="home" className="shrink-0">
            <img src="/logo.svg" alt="ADIMEX" className="h-4 w-auto transition-[filter] duration-200"
              style={{ filter: isLight && !activeDropdown ? "brightness(0)" : "none" }} />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-8 text-xs">
            {menuItems.map((item) => (
              <li key={item.name}
                onMouseEnter={() => item.dropdown ? openDropdown(item.dropdown) : setActiveDropdown(null)}
                onMouseLeave={scheduleClose}
              >
                {item.dropdown ? (
                  <button className={cn(linkClass, "cursor-pointer")} onClick={() => openDropdown(item.dropdown!)}>
                    {item.name}
                    <ChevronDown size={12} className={cn("transition-transform duration-200", activeDropdown === item.dropdown && "rotate-180")} />
                  </button>
                ) : (
                  <Link href={item.href} className={linkClass}>{item.name}</Link>
                )}
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <SearchCommand isDark={!!isDark} open={searchOpen} setOpen={setSearchOpen} />

            {/* Region picker */}
            <div className="relative">
              <button
                onClick={() => setRegionOpen((o) => !o)}
                className={cn(
                  "flex items-center gap-1.5 text-xs h-8 px-3 border transition-colors",
                  isDark
                    ? "border-white/15 hover:border-white/30 text-white/50 hover:text-white/80"
                    : "border-black/15 hover:border-black/30 text-[#07080c]/50 hover:text-[#07080c]"
                )}
              >
                <span>{region.flag}</span>
                <span>{region.code}</span>
                <ChevronDown size={11} className={cn("transition-transform duration-200", regionOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {regionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-10 w-40 bg-[#07080c] border border-white/10 z-40 py-1"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    {regions.map((r) => (
                      <button key={r.code} onClick={() => { setRegion(r); setRegionOpen(false) }}
                        className={cn("w-full flex items-center gap-2.5 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors", r.code === region.code ? "text-white" : "text-white/50")}>
                        <span>{r.flag}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart button */}
            <button
              onClick={openCart}
              aria-label="Abrir carrito"
              className={cn(
                "relative flex items-center justify-center w-8 h-8 border transition-colors",
                isDark
                  ? "border-white/15 hover:border-white/30 text-white/60 hover:text-white"
                  : "border-black/15 hover:border-black/30 text-[#07080c]/60 hover:text-[#07080c]"
              )}
            >
              <ShoppingCart size={14} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-[#017bfd] text-white text-[9px] font-mono flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setRegionOpen(false)}
                  onMouseEnter={() => setActiveDropdown('user')}
                  onMouseLeave={scheduleClose}
                  className={cn(
                    "flex items-center gap-1.5 text-xs h-8 px-3 border transition-colors",
                    isDark
                      ? "border-white/15 hover:border-white/30 text-white/70 hover:text-white"
                      : "border-black/15 hover:border-black/30 text-[#07080c]/70 hover:text-[#07080c]"
                  )}
                >
                  <span className="w-4 h-4 rounded-full bg-[#017bfd] text-white text-[9px] flex items-center justify-center shrink-0">
                    {customer?.firstName?.[0]?.toUpperCase() ?? '?'}
                  </span>
                  <span>{customer?.firstName}</span>
                  <ChevronDown size={11} className={cn("transition-transform duration-200", activeDropdown === 'user' && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-10 w-44 bg-[#07080c] border border-white/10 z-40 py-1"
                      style={{ fontFamily: "var(--font-geist-sans)" }}
                      onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
                      onMouseLeave={scheduleClose}
                    >
                      <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="text-xs text-white truncate">{customer?.firstName} {customer?.lastName}</p>
                        <p className="text-[10px] text-white/40 truncate mt-0.5">{customer?.email}</p>
                      </div>
                      <Link href="/cuenta" className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        Mis pedidos
                      </Link>
                      <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                onClick={login}
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs h-8 bg-transparent",
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10 hover:text-white"
                    : "border-black/20 text-[#07080c] hover:bg-black/8 hover:text-[#07080c]"
                )}
              >
                Login
              </Button>
            )}
            <Button asChild size="sm" className="text-xs h-8 bg-[#017bfd] hover:bg-[#0066d6] text-white border-0">
              <Link href="#">Agendar demo</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuState(!menuState)}
            className={cn("block lg:hidden p-2 transition-colors duration-200", isLight ? "text-[#07080c]" : "text-white")}
          >
            {menuState ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* Mega-menu dropdown */}
        <AnimatePresence>
          {activeDropdown && (activeDropdown === "productos" || activeDropdown === "casos") && (
            <motion.div
              key={activeDropdown}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-14 left-0 w-full bg-[#07080c] border-b border-white/10 z-30"
              onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
              onMouseLeave={scheduleClose}
            >
              <div className="max-w-5xl mx-auto">
                {activeDropdown === "productos" && <ProductosPanel />}
                {activeDropdown === "casos"     && <CasosPanel />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-x-0 top-14 z-20 bg-[#07080c] border-b border-white/10 lg:hidden overflow-hidden transition-all duration-300",
        menuState ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      )} style={{ fontFamily: "var(--font-geist-sans)" }}>
        {/* Search */}
        <div className="px-6 pt-4">
          <button
            onClick={() => { setMenuState(false); setSearchOpen(true) }}
            className="w-full flex items-center gap-2 h-9 px-3 border border-white/15 text-xs text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            <Search size={12} />
            <span>Buscar productos...</span>
            <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5">Ctrl K</kbd>
          </button>
        </div>

        <ul className="flex flex-col px-6 pt-5 pb-2 gap-5">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors" onClick={() => setMenuState(false)}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-6 pb-6 flex flex-col gap-3">
          {/* Region picker */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase px-1">Región</p>
            <div className="grid grid-cols-3 gap-1.5">
              {regions.map((r) => (
                <button
                  key={r.code}
                  onClick={() => setRegion(r)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 h-8 border text-xs transition-colors",
                    r.code === region.code
                      ? "border-[#017bfd]/50 bg-[#017bfd]/10 text-white"
                      : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                  )}
                >
                  <span>{r.flag}</span>
                  <span className="font-mono text-[11px]">{r.code}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setMenuState(false); openCart() }}
            className="w-full flex items-center justify-between px-4 h-9 border border-white/20 text-xs text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={13} />
              Carrito
            </span>
            {itemCount > 0 && (
              <span className="bg-[#017bfd] text-white text-[9px] font-mono px-1.5 py-0.5">
                {itemCount}
              </span>
            )}
          </button>
          {isLoggedIn ? (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-white/50 px-1">
                {customer?.firstName} {customer?.lastName}
              </p>
              <Button variant="outline" onClick={logout} className="w-full text-xs border-white/20 bg-transparent text-white">
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={login} className="w-full text-xs border-white/20 bg-transparent text-white">
              Login
            </Button>
          )}
          <Button asChild className="w-full text-xs bg-[#017bfd] hover:bg-[#0066d6] text-white border-0">
            <Link href="#">Agendar demo</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
