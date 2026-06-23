'use client'

import { useRegion, formatPriceForRegion } from '@/context/region-context'

type Size = 'sm' | 'md' | 'lg'

interface Props {
  price: string
  currencyCode: string
  size?: Size
  className?: string
}

const SIZE_STYLES: Record<Size, { main: string; note: string }> = {
  sm: { main: 'text-base font-bold',  note: 'text-[10px]' },
  md: { main: 'text-xl font-bold',    note: 'text-[10px]' },
  lg: { main: 'text-2xl font-bold',   note: 'text-[11px]' },
}

/**
 * ML-style price tag. Shows the IVA-inclusive price for the active region
 * with a small "IVA incluido" note underneath.
 */
export default function PriceTag({ price, currencyCode, size = 'md', className }: Props) {
  const { region } = useRegion()
  const display = formatPriceForRegion(price, currencyCode, region)
  const styles = SIZE_STYLES[size]

  return (
    <div className={`flex flex-col leading-tight ${className ?? ''}`}>
      <span className={`${styles.main} text-[#07080c]`}>{display.formatted}</span>
      {display.ivaIncluded && (
        <span className={`${styles.note} text-gray-400 mt-0.5`}>
          IVA incluido
        </span>
      )}
    </div>
  )
}
