// Fuente única de verdad para precios visibles al usuario.
// Shopify guarda el precio base en MXN sin IVA. Todo precio mostrado se pasa
// por estas funciones para garantizar IVA incluido y formato consistente.

export const IVA_RATE = Number(process.env.NEXT_PUBLIC_IVA_RATE) || 0.16
export const USD_MXN_RATE = Number(process.env.NEXT_PUBLIC_USD_MXN_RATE) || 18

function toNumber(amount: string | number): number {
  return typeof amount === "string" ? parseFloat(amount) : amount
}

export function mxnWithIva(baseMxn: string | number): number {
  return toNumber(baseMxn) * (1 + IVA_RATE)
}

export function usdFromMxnBase(baseMxn: string | number): number {
  return mxnWithIva(baseMxn) / USD_MXN_RATE
}

const MXN_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
})

const USD_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

export function formatMxnWithIva(baseMxn: string | number): string {
  return MXN_FORMATTER.format(mxnWithIva(baseMxn))
}

export function formatUsdWithIva(baseMxn: string | number): string {
  return USD_FORMATTER.format(usdFromMxnBase(baseMxn))
}

export function formatRawCurrency(
  amount: string | number,
  currency: string,
  locale = "es-MX",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(toNumber(amount))
}
