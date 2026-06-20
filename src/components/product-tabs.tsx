'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Spec = { label: string; value: string }

interface Props {
  description: string
  features: string[]
  specs: Spec[]
  applications: string[]
}

type TabId = 'descripcion' | 'caracteristicas' | 'especificaciones' | 'aplicaciones'

export default function ProductTabs({ description, features, specs, applications }: Props) {
  const tabs = [
    { id: 'descripcion'     as TabId, label: 'Descripción',      hasContent: !!description },
    { id: 'caracteristicas' as TabId, label: 'Características',  hasContent: features.length > 0 },
    { id: 'especificaciones' as TabId, label: 'Especificaciones', hasContent: specs.length > 0 },
    { id: 'aplicaciones'    as TabId, label: 'Aplicaciones',      hasContent: applications.length > 0 },
  ].filter((t) => t.hasContent)

  const [active, setActive] = useState<TabId>(tabs[0]?.id ?? 'descripcion')

  if (tabs.length === 0) return null

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-black/8 flex overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-5 py-3.5 text-[11px] font-mono uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
              active === tab.id
                ? 'border-[#017bfd] text-[#017bfd]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="py-8">
        {active === 'descripcion' && (
          <p className="text-sm text-[#494F5F] leading-relaxed max-w-2xl">{description}</p>
        )}

        {active === 'caracteristicas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feat) => (
              <div key={feat} className="flex items-start gap-3 p-4 bg-gray-50 border border-black/5">
                <CheckCircle2 size={14} className="text-[#017bfd] mt-0.5 shrink-0" />
                <p className="text-xs text-[#494F5F] leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        )}

        {active === 'especificaciones' && (
          <div className="border border-black/5 divide-y divide-black/5 max-w-2xl">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`grid grid-cols-2 px-5 py-3.5 text-xs gap-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <span className="text-gray-400 font-mono">{spec.label}</span>
                <span className="text-[#07080c] font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {active === 'aplicaciones' && (
          <div className="flex flex-wrap gap-2">
            {applications.map((app) => (
              <span
                key={app}
                className="text-[11px] text-[#494F5F] border border-black/10 px-3 py-1.5 hover:border-[#017bfd]/40 hover:text-[#017bfd] transition-colors cursor-default"
              >
                {app}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
