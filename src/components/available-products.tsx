"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ShoppingCart, ArrowUpRight } from "lucide-react"
import { products } from "@/data/products"

const availableProducts = products.filter((p) => p.shopifyHandle)

export default function AvailableProducts() {
  return (
    <section
      data-theme="light"
      className="w-full bg-[#f5f6f8] border-t border-black/5"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-6 border-b border-black/10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 text-[10px] tracking-widest text-[#017bfd] uppercase font-mono">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full bg-[#017bfd] opacity-60 animate-ping rounded-full" />
                  <span className="relative inline-flex w-2 h-2 bg-[#017bfd] rounded-full" />
                </span>
                Tienda en línea · activa
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#07080c] leading-tight max-w-2xl">
              Cómprales en línea hoy.
              <br />
              <span className="text-[#494F5F]">Envío directo desde México.</span>
            </h2>
          </div>

          <Link
            href="/productos"
            className="flex items-center gap-1.5 text-xs text-[#017bfd] hover:underline underline-offset-4 shrink-0"
          >
            <ArrowUpRight size={13} />
            Ver todos los disponibles
          </Link>
        </motion.div>

        {/* ── Product cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {availableProducts.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/productos/${product.slug}`}
                className="group flex flex-col bg-white border border-black/8 hover:border-[#017bfd]/40 hover:shadow-md transition-all duration-200 h-full"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 text-[9px] tracking-widest uppercase text-[#07080c] bg-white border border-black/10 px-2 py-0.5 font-mono">
                    {product.subcategory}
                  </span>
                  <span className="absolute top-3 right-3 text-[9px] tracking-widest uppercase text-white bg-[#017bfd] px-2 py-0.5 font-mono">
                    Disponible
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-2">
                  <h3 className="text-base font-bold text-[#07080c] group-hover:text-[#017bfd] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                    {product.tagline}
                  </p>

                  <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#017bfd]">
                      <ShoppingCart size={12} />
                      Comprar ahora
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-[#017bfd] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Footer note ──────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-[11px] text-gray-400 font-mono"
        >
          El resto del catálogo está disponible bajo pedido — contacta a un ingeniero para cotizar.
        </motion.p>

      </div>
    </section>
  )
}
