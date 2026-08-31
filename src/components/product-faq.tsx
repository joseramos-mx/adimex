"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { ProductFAQ } from "@/data/products"

/**
 * Bloque de preguntas frecuentes específicas del SKU con acordeón nativo.
 * El JSON-LD FAQPage se emite aparte (server-side) desde la página del producto.
 */
export default function ProductFAQBlock({ items }: { items: ProductFAQ[] }) {
  const [open, setOpen] = useState<number | null>(0)
  if (!items || items.length === 0) return null

  return (
    <section className="mt-14 pt-10 border-t border-black/8">
      <p
        className="text-[10px] tracking-widest text-[#017bfd] uppercase mb-2"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Preguntas frecuentes
      </p>
      <h2 className="text-lg font-semibold text-[#07080c] mb-6">
        Lo que otros integradores nos han preguntado
      </h2>

      <div className="border border-black/8">
        {items.map((item, i) => {
          const isOpen = open === i
          return (
            <div
              key={i}
              className="border-b border-black/8 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-[#07080c] leading-snug pr-4">
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#017bfd] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-[grid-template-rows] duration-200 grid ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <div className="px-5 pb-5 text-sm text-[#494F5F] leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** JSON-LD server-side para rich results de FAQ en Google. */
export function ProductFAQSchema({ items }: { items: ProductFAQ[] }) {
  if (!items || items.length === 0) return null
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
