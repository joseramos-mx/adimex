"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { WA_DEMO } from "@/lib/contact"

const SLIDE_DURATION = 5000

const slides = [
  {
    name: "PLC FL7",
    image: "/bgfl7h.png",
    heading: ["Más preciso y más eficiente", "PLC de la", "serie FL7"],
    description:
      "El PLC de la serie FL7 está diseñado para aplicaciones complejas de automatización mecánica y control de movimiento multieje. Incorpora funciones integradas de entrada y salida de pulsos de alta velocidad, admite diversos algoritmos de interpolación y levas electrónicas, y puede controlar hasta 32 ejes simultáneamente.",
  },
  {
    name: "AI + IoT",
    image: "/iotaibg.png",
    heading: ["Automatización industrial en México", "AI + IoT"],
    description:
      "Flexem AI+IoT logra una automatización totalmente integrada de software y hardware, rompe los silos de datos, optimiza los procesos de producción a través de algoritmos inteligentes, mejora significativamente la eficiencia y los beneficios, e impulsa actualizaciones inteligentes industriales.",
  },
  {
    name: "HMI Capacitiva",
    image: "/hmibg.png",
    heading: ["Estética industrial", "HMI Capacitiva", "FLEXEM"],
    description:
      "La HMI capacitiva FLEXEM presenta un diseño de estética industrial, una pantalla de alta definición y alto brillo, y amplios ángulos de visión. Su superficie resistente a rayones y duradera facilita una variedad de operaciones gestuales fluidas.",
  },
]

export const Hero = () => {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(0)
    const start = performance.now()
    let raf: number

    const frame = (now: number) => {
      const pct = Math.min(((now - start) / SLIDE_DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(frame)
      } else {
        setActive((prev) => (prev + 1) % slides.length)
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const slide = slides[active]

  return (
    <section className="relative h-screen pt-14 overflow-hidden">

      {/* z-0 — background images cross-fade */}
      <AnimatePresence>
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* z-5 — hero-mask */}
      <img
        src="/hero-mask.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-5 h-full w-full object-cover"
      />

      {/* z-10 — content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between py-12 px-6 lg:px-16 text-white w-full lg:w-[55%]">

        <div className="flex flex-col gap-8 flex-1 justify-center">

          {/* Heading — first line is subtitle (small), rest are large */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`heading-${active}`}
              className="flex flex-col gap-1"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
                exit: { opacity: 0, transition: { duration: 0.3 } },
              }}
            >
              {slide.heading.map((line, i) => (
                <motion.span
                  key={i}
                  className={`block overflow-hidden ${
                    i === 0
                      ? "text-sm sm:text-base font-medium text-white/70 tracking-wide"
                      : "text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                  }`}
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`desc-${active}`}
              className="relative max-w-sm lg:max-w-115 p-4 border border-white/50"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            >
              <span className="absolute top-[-5] left-[-3] h-2 w-2 bg-white" />
              <span className="absolute top-[-5] right-[-5] h-2 w-2 bg-white" />
              <span className="absolute bottom-[-5] left-[-5] h-2 w-2 bg-white" />
              <span className="absolute bottom-[-5] right-[-5] h-2 w-2 bg-white" />
              <p
                className="text-sm leading-relaxed text-white/90"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3" style={{ fontFamily: "var(--font-geist-sans)" }}>
            <Link href="/productos" className="bg-[#0d1a2d] text-white px-6 py-3 text-xs font-medium hover:bg-[#0d1a2d]/80 transition-colors">
              Ver catálogo
            </Link>
            <a
              href={WA_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white text-white px-6 py-3 text-xs font-medium hover:bg-white/10 transition-colors"
            >
              Agendar demo
            </a>
          </div>
        </div>

        {/* Category tabs with progress bars */}
        <div className="flex gap-6 lg:gap-10 font-mono text-xs text-white overflow-x-auto pb-1 scrollbar-none">
          {slides.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActive(i)}
              className="flex flex-col gap-1.5 cursor-pointer text-left"
            >
              <span className={`transition-colors duration-300 ${i === active ? "text-white" : "text-white/50"}`}>
                {cat.name}
              </span>
              <div className="h-0.5 w-full bg-white/20 overflow-hidden">
                {i === active && (
                  <motion.div
                    className="h-full bg-orange-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0, ease: "linear" }}
                  />
                )}
                {i < active && <div className="h-full w-full bg-white/40" />}
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
