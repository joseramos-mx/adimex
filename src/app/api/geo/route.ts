import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * Returns the visitor's country code (ISO 3166-1 alpha-2).
 * Uses Vercel's geo headers in production; falls back to Accept-Language hints
 * (and finally `null`) in environments without geo.
 */
export async function GET(req: NextRequest) {
  const headerCountry =
    req.headers.get('x-vercel-ip-country') ??
    req.headers.get('cf-ipcountry') ??
    req.headers.get('x-country-code')

  if (headerCountry) {
    return NextResponse.json({ country: headerCountry.toUpperCase() })
  }

  // Fallback: peek at Accept-Language. Best-effort only.
  const lang = req.headers.get('accept-language') ?? ''
  const m = lang.match(/[a-z]{2}-([A-Z]{2})/)
  if (m) return NextResponse.json({ country: m[1] })

  return NextResponse.json({ country: null })
}
