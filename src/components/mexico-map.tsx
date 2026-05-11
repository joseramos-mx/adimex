"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo"
import type { FeatureCollection, Geometry } from "geojson"
import { MapPin, Globe2 } from "lucide-react"
import mexicoGeo from "@/data/mexico-states.json"

interface StateProps { name: string; id: string }

const geoData = mexicoGeo as unknown as FeatureCollection<Geometry, StateProps>

const W = 760
const H = 500

const presenceStates = [
  "Nuevo León", "Ciudad de México", "Jalisco", "Guanajuato", "Querétaro",
  "Coahuila", "Chihuahua", "Sonora", "Veracruz", "Puebla",
  "San Luis Potosí", "Tamaulipas", "+22",
]

export default function MexicoMap() {
  const [hovered, setHovered] = useState<string | null>(null)

  const { pathFn, features } = useMemo(() => {
    const projection = geoMercator().fitSize([W, H], geoData)
    const pathFn = geoPath().projection(projection)
    return { pathFn, features: geoData.features }
  }, [])

  return (
    <section className="bg-white py-24 px-6 border-t border-black/5">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[1fr_320px] gap-10 xl:gap-16 items-center">

          {/* ── Map ─────────────────────────────────────────────────────────────── */}
          <div className="relative overflow-hidden">
            <p
              className="absolute top-3 left-3 z-10 text-[11px] font-mono text-white bg-[#07080c] border border-black/10 px-3 py-1.5 pointer-events-none transition-opacity duration-150"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              {hovered ?? ""}
            </p>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              aria-label="Mapa de México — ADIMEX presente en los 32 estados"
              style={{ filter: "drop-shadow(0 8px 32px rgba(1,123,253,0.12))" }}
            >
              {features.map((f) => {
                const name = f.properties.name
                const d = pathFn(f as GeoPermissibleObjects)
                if (!d) return null
                const [cx, cy] = pathFn.centroid(f as GeoPermissibleObjects)
                const isHovered = hovered === name

                return (
                  <g key={name}>
                    <path
                      d={d}
                      fill={isHovered ? "#0066ff" : "#0066ff"}
                      fillOpacity={isHovered ? 1 : 0.8}
                      stroke="#ffffff"
                      strokeWidth=".5"
                      strokeLinejoin="round"
                      style={{ transition: "fill 0.12s, fill-opacity 0.12s" }}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(name)}
                      onMouseLeave={() => setHovered(null)}
                    />
                    {!isNaN(cx) && !isNaN(cy) && (
                      <image
                        href="/mark.svg"
                        x={cx - 6}
                        y={cy - 6}
                        width="12"
                        height="12"
                        className="pointer-events-none"
                      />
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* ── Presence panel ──────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            <div>
              <p className="text-[10px] tracking-widest text-[#017bfd] uppercase font-mono mb-3">
                Presencia nacional
              </p>
              <h2 className="text-2xl lg:text-3xl font-semibold text-[#07080c] leading-tight tracking-tight">
                Cobertura en todo México.
              </h2>
              <p className="mt-3 text-sm text-[#07080c]/50 leading-relaxed">
                Con distribuidores certificados y técnicos de campo en los principales
                polos industriales del país.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {presenceStates.map((state) => {
                if (state.startsWith("+")) {
                  return (
                    <div key={state} className="flex items-center px-3 py-1.5 border border-black/10 text-xs text-[#07080c]/35 font-mono">
                      {state} estados más
                    </div>
                  )
                }
                const active = hovered === state
                return (
                  <div
                    key={state}
                    className="flex items-center gap-1.5 px-3 py-1.5 border text-xs"
                    style={{
                      borderColor: active ? "rgba(1,123,253,0.5)" : "rgba(0,0,0,0.1)",
                      background: active ? "rgba(1,123,253,0.08)" : "transparent",
                      color: active ? "#017bfd" : "rgba(7,8,12,0.55)",
                      transition: "border-color 0.15s, background 0.15s, color 0.15s",
                    }}
                  >
                    <MapPin size={10} className="text-[#017bfd] shrink-0" />
                    {state}
                  </div>
                )
              })}
            </div>

            {/* CTA card */}
            <div className="p-5 border border-black/8 bg-[#f5f6f8] flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-[#017bfd]/10 shrink-0">
                <Globe2 size={16} className="text-[#017bfd]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#07080c]">¿No estás en la lista?</p>
                <p className="text-[11px] text-[#07080c]/45 mt-0.5">Contáctanos — podemos llegar hasta ti.</p>
              </div>
              <Link
                href="/soporte"
                className="ml-auto text-xs text-[#017bfd] hover:underline whitespace-nowrap"
              >
                Contactar
              </Link>
            </div>

            <div className="flex items-center gap-2.5 pt-1 border-t border-black/5">
              <div className="w-2.5 h-2.5 bg-[#017bfd] opacity-70" />
              <span className="text-[11px] font-mono text-[#07080c]/30">32 estados · República Mexicana</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
