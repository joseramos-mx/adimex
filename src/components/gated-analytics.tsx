"use client"

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { useCookieConsent } from "@/context/cookie-consent-context"

/**
 * Sólo monta Vercel Analytics y Speed Insights cuando el usuario ha
 * consentido la categoría de analítica. Cumple LFPDPPP: no se rastrea
 * hasta que el usuario decide.
 */
export default function GatedAnalytics() {
  const { consent } = useCookieConsent()
  if (!consent?.analytics) return null
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
