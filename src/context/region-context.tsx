'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  IVA_RATE,
  USD_MXN_RATE,
  formatMxnWithIva,
  formatUsdWithIva,
  formatRawCurrency,
} from '@/lib/pricing'

export { IVA_RATE, USD_MXN_RATE }

export type RegionCode = 'MX' | 'US'

export type Region = {
  code: RegionCode
  label: string
  flag: string
  displayCurrency: 'MXN' | 'USD'
  locale: string
}

export const REGIONS: Record<RegionCode, Region> = {
  MX: { code: 'MX', label: 'México',        flag: '🇲🇽', displayCurrency: 'MXN', locale: 'es-MX' },
  US: { code: 'US', label: 'United States', flag: '🇺🇸', displayCurrency: 'USD', locale: 'en-US' },
}

export const REGION_LIST: Region[] = [REGIONS.MX, REGIONS.US]

type RegionContextValue = {
  region: Region
  setRegion: (code: RegionCode) => void
  autoDetected: boolean
}

const RegionContext = createContext<RegionContextValue | null>(null)

const STORAGE_KEY = 'adimex.region'

function readStored(): RegionCode | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'MX' || v === 'US' ? v : null
}

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<RegionCode>('MX')
  const [autoDetected, setAutoDetected] = useState(false)

  useEffect(() => {
    const stored = readStored()
    if (stored) {
      setCode(stored)
      return
    }
    let cancelled = false
    fetch('/api/geo')
      .then((r) => r.ok ? r.json() as Promise<{ country?: string }> : null)
      .then((data) => {
        if (cancelled || !data?.country) return
        const c = data.country.toUpperCase()
        // Only MX gets MX; everything else (including CA) maps to US for now.
        if (c === 'MX') {
          setCode('MX')
          setAutoDetected(true)
        } else {
          setCode('US')
          setAutoDetected(true)
        }
      })
      .catch(() => { /* keep default MX */ })
    return () => { cancelled = true }
  }, [])

  const setRegion = (next: RegionCode) => {
    setCode(next)
    setAutoDetected(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }

  return (
    <RegionContext.Provider value={{ region: REGIONS[code], setRegion, autoDetected }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used inside <RegionProvider>')
  return ctx
}

// ─── Price formatting ─────────────────────────────────────────────────────────

export type PriceDisplay = {
  /** Full string ready to render, e.g. "$9,103.47 MXN" or "US$505.75". */
  formatted: string
  /** Whether IVA is already included in the displayed amount. */
  ivaIncluded: boolean
  /** Currency code displayed (matches region.displayCurrency). */
  currency: 'MXN' | 'USD'
}

/**
 * Format a Shopify price (assumed MXN base, IVA-exclusive) for a given region.
 *
 *   MX → MXN with IVA included (× 1.16)
 *   US → USD with IVA included, converted at USD_MXN_RATE
 *
 * Any non-MXN source amount is shown as-is (no conversion, no IVA).
 */
export function formatPriceForRegion(
  amount: string | number,
  sourceCurrency: string,
  region: Region,
): PriceDisplay {
  const src = sourceCurrency.toUpperCase()

  if (src !== 'MXN') {
    return {
      formatted: formatRawCurrency(amount, src, region.locale),
      ivaIncluded: false,
      currency: region.displayCurrency,
    }
  }

  if (region.displayCurrency === 'USD') {
    return {
      formatted: formatUsdWithIva(amount),
      ivaIncluded: true,
      currency: 'USD',
    }
  }

  return {
    formatted: formatMxnWithIva(amount),
    ivaIncluded: true,
    currency: 'MXN',
  }
}
