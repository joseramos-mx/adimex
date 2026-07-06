import type { ReactNode } from "react"
import Link from "next/link"

/**
 * Componentes de composición para el cuerpo de los artículos estáticos.
 *
 * Todos usan tipografía Geist Sans y las clases oscuras del blog para
 * mantener consistencia visual con los posts renderizados desde Sanity.
 */

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] text-white/70 leading-[1.8] mb-6">{children}</p>
  )
}

export function H2({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 text-xl font-bold text-white tracking-tight mt-12 mb-4"
    >
      {children}
    </h2>
  )
}

export function H3({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <h3
      id={id}
      className="scroll-mt-28 text-base font-semibold text-white tracking-tight mt-8 mb-3"
    >
      {children}
    </h3>
  )
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc pl-6 mb-6 space-y-2 text-[15px] text-white/70 leading-[1.8] marker:text-[#017bfd]">
      {children}
    </ul>
  )
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal pl-6 mb-6 space-y-2 text-[15px] text-white/70 leading-[1.8] marker:text-[#017bfd]">
      {children}
    </ol>
  )
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="pl-1">{children}</li>
}

export function A({
  href,
  children,
  external,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#017bfd] underline underline-offset-4 hover:text-[#3b95ff]"
      >
        {children}
      </a>
    )
  }
  return (
    <Link
      href={href}
      className="text-[#017bfd] underline underline-offset-4 hover:text-[#3b95ff]"
    >
      {children}
    </Link>
  )
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="text-white font-semibold">{children}</strong>
}

export function Callout({
  title,
  children,
  variant = "info",
}: {
  title?: string
  children: ReactNode
  variant?: "info" | "warning" | "success"
}) {
  const border =
    variant === "warning"
      ? "border-amber-400/30 bg-amber-500/5"
      : variant === "success"
      ? "border-emerald-400/30 bg-emerald-500/5"
      : "border-[#017bfd]/30 bg-[#017bfd]/5"
  const label =
    variant === "warning"
      ? "text-amber-300"
      : variant === "success"
      ? "text-emerald-300"
      : "text-[#3b95ff]"

  return (
    <aside className={`border ${border} px-5 py-4 my-6`}>
      {title && (
        <p
          className={`text-[10px] tracking-widest uppercase mb-2 ${label}`}
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {title}
        </p>
      )}
      <div className="text-sm text-white/70 leading-[1.75]">{children}</div>
    </aside>
  )
}

export function SpecTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: (string | ReactNode)[][]
}) {
  return (
    <div className="my-8 overflow-x-auto border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-white/5">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[10px] tracking-widest uppercase text-white/40 font-normal border-b border-white/10"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-white/70 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Quote({
  children,
  cite,
}: {
  children: ReactNode
  cite?: string
}) {
  return (
    <blockquote className="my-8 border-l-2 border-[#017bfd] pl-5 text-[15px] italic text-white/80 leading-[1.8]">
      {children}
      {cite && (
        <footer className="not-italic text-xs text-white/40 mt-2">
          — {cite}
        </footer>
      )}
    </blockquote>
  )
}
