import type { BlogFAQ } from "@/content/blog/types"

/**
 * Bloque de preguntas frecuentes visible + genera JSON-LD FAQPage
 * (se renderiza aparte desde la página del post).
 */
export default function FAQBlock({ items }: { items: BlogFAQ[] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="mt-14 pt-10 border-t border-white/10">
      <p
        className="text-[10px] tracking-widest text-[#017bfd] uppercase mb-2"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Preguntas frecuentes
      </p>
      <h3 className="text-lg font-semibold text-white mb-6">
        Lo que otros integradores nos han preguntado
      </h3>
      <div className="border border-white/10">
        {items.map((item, i) => (
          <details
            key={i}
            className="group border-b border-white/10 last:border-b-0"
          >
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between text-sm font-medium text-white hover:bg-white/[0.02]">
              <span className="pr-4">{item.q}</span>
              <span className="text-[#017bfd] text-lg leading-none shrink-0 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export function FAQSchema({ items }: { items: BlogFAQ[] }) {
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
