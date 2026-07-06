import Link from "next/link"

export type BreadcrumbItem = { name: string; href: string }

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Migas de pan"
      className="pt-4 pb-1 text-[11px] font-mono text-white/30"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((it, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={it.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-white/60 truncate max-w-[16rem]">
                  {it.name}
                </span>
              ) : (
                <Link
                  href={it.href}
                  className="hover:text-white transition-colors"
                >
                  {it.name}
                </Link>
              )}
              {!isLast && <span className="text-white/20">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.href.startsWith("http")
        ? it.href
        : `https://adimex.io${it.href}`,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
