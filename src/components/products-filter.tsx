"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { categoryMeta, categoryOrder, type ProductCategory } from "@/lib/products"

interface Props {
  counts: Record<ProductCategory, number>
  activeCategory?: ProductCategory
  activeSubcategory?: string
  activeSort?: string
  subcategories: string[]
}

const sortOptions = [
  { value: "default", label: "Categoría (por defecto)" },
  { value: "name-asc", label: "Nombre A → Z" },
  { value: "name-desc", label: "Nombre Z → A" },
]

export default function ProductsFilter({
  counts,
  activeCategory,
  activeSubcategory,
  activeSort,
  subcategories,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset subcategory when changing category
      if (key === "category") params.delete("subcategory")
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const clearAll = () => router.push(pathname, { scroll: false })
  const hasFilters = activeCategory || activeSubcategory || (activeSort && activeSort !== "default")
  const totalShown = activeCategory ? counts[activeCategory] : Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-6" style={{ fontFamily: "var(--font-geist-sans)" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#07080c]">
          <SlidersHorizontal size={13} className="text-[#017bfd]" />
          <span>Filtros</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#017bfd] transition-colors"
          >
            <X size={10} />
            Limpiar
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="text-[9px] tracking-widest uppercase text-gray-400 font-mono mb-2">Ordenar</p>
        <select
          value={activeSort ?? "default"}
          onChange={(e) => updateParam("sort", e.target.value === "default" ? undefined : e.target.value)}
          className="w-full text-xs border border-black/10 bg-white text-[#07080c] px-3 py-2 focus:outline-none focus:border-[#017bfd] cursor-pointer"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[9px] tracking-widest uppercase text-gray-400 font-mono mb-2">Categoría</p>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => updateParam("category", undefined)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                !activeCategory
                  ? "bg-[#017bfd]/8 text-[#017bfd] font-medium"
                  : "text-[#494F5F] hover:bg-gray-50 hover:text-[#07080c]"
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] font-mono text-gray-400">
                {Object.values(counts).reduce((a, b) => a + b, 0)}
              </span>
            </button>
          </li>
          {categoryOrder.map((cat) => {
            const meta = categoryMeta[cat]
            const isActive = activeCategory === cat
            return (
              <li key={cat}>
                <button
                  onClick={() => updateParam("category", isActive ? undefined : cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? "bg-[#017bfd]/8 text-[#017bfd] font-medium"
                      : "text-[#494F5F] hover:bg-gray-50 hover:text-[#07080c]"
                  }`}
                >
                  <span>{meta.label}</span>
                  <span className="text-[10px] font-mono text-gray-400">{counts[cat]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Subcategories (only shown when a category is active) */}
      {activeCategory && subcategories.length > 1 && (
        <div>
          <p className="text-[9px] tracking-widest uppercase text-gray-400 font-mono mb-2">Tipo</p>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => updateParam("subcategory", undefined)}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                  !activeSubcategory
                    ? "text-[#017bfd] font-medium"
                    : "text-[#494F5F] hover:bg-gray-50 hover:text-[#07080c]"
                }`}
              >
                Todos
              </button>
            </li>
            {subcategories.map((sub) => (
              <li key={sub}>
                <button
                  onClick={() => updateParam("subcategory", activeSubcategory === sub ? undefined : sub)}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors leading-snug ${
                    activeSubcategory === sub
                      ? "text-[#017bfd] font-medium"
                      : "text-[#494F5F] hover:bg-gray-50 hover:text-[#07080c]"
                  }`}
                >
                  {sub}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Active filter badge */}
      {hasFilters && (
        <div className="border-t border-black/5 pt-4">
          <p className="text-[10px] text-gray-400 font-mono">
            Mostrando <span className="text-[#07080c] font-semibold">{totalShown}</span> producto{totalShown !== 1 ? "s" : ""}
          </p>
        </div>
      )}

    </aside>
  )
}
