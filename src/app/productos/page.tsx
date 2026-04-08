import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header-04"
import Footer from "@/components/footer"
import ProductsFilter from "@/components/products-filter"
import {
  getProducts,
  getProductCounts,
  getSubcategoriesForCategory,
  categoryMeta,
  type ProductCategory,
  type SortOption,
} from "@/lib/products"

interface PageProps {
  searchParams: Promise<{ category?: string; subcategory?: string; sort?: string }>
}

export const metadata = {
  title: "Productos | ADIMEX",
  description:
    "Catálogo completo de productos FLEXEM: servomotores, PLCs, HMI, gateways IoT, SCADA y plataforma cloud.",
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const params = await searchParams
  const category = params.category as ProductCategory | undefined
  const subcategory = params.subcategory
  const sort = (params.sort ?? "default") as SortOption

  const [filteredProducts, counts, subcategories] = await Promise.all([
    getProducts({ category, subcategory, sort }),
    getProductCounts(),
    category ? getSubcategoriesForCategory(category) : Promise.resolve([]),
  ])

  const pageTitle = category ? categoryMeta[category].label : "Todos los productos"

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <Header />

      {/* Hero */}
      <section data-theme="light" className="pt-32 pb-12 px-6 border-b border-black/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-widest text-[#017bfd] uppercase font-mono mb-4">
            Catálogo de productos
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#07080c] leading-tight tracking-tight">
            {pageTitle}
            <br />
            <span className="text-[#494F5F]">distribución FLEXEM</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-xl">
            Distribuidor autorizado de FLEXEM en México
          </p>
        </div>
      </section>

      {/* Body */}
      <div data-theme="light" className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filter sidebar */}
          <Suspense fallback={null}>
            <ProductsFilter
              counts={counts}
              activeCategory={category}
              activeSubcategory={subcategory}
              activeSort={sort}
              subcategories={subcategories}
            />
          </Suspense>

          {/* Product grid */}
          <div className="flex-1 min-w-0">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/5">
              <p className="text-xs text-gray-400 font-mono">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
                {category ? ` · ${categoryMeta[category].label}` : ""}
                {subcategory ? ` · ${subcategory}` : ""}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-gray-400">No se encontraron productos con estos filtros.</p>
                <Link href="/productos" className="mt-3 inline-block text-xs text-[#017bfd] hover:underline">
                  Ver todos los productos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/productos/${product.slug}`}
                    className="group flex flex-col border border-black/8 hover:border-[#017bfd]/40 hover:shadow-sm transition-all duration-200 bg-white"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent" />
                      <span className="absolute top-2 left-2 text-[9px] tracking-widest uppercase text-[#017bfd] bg-white border border-[#017bfd]/20 px-2 py-0.5 font-mono">
                        {product.subcategory}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4 gap-2">
                      <h3 className="text-sm font-semibold text-[#07080c] group-hover:text-[#017bfd] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
                        {product.tagline}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-[#017bfd] font-mono mt-1">
                        <span>Ver producto</span>
                        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
