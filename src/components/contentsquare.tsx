"use client"

import Script from "next/script"
import { useCookieConsent } from "@/context/cookie-consent-context"
import { CONTENTSQUARE_TAG_ID } from "@/lib/analytics-ids"

/**
 * Contentsquare / Hotjar — mapas de calor, grabaciones de sesión anónimas
 * y análisis de embudo. Como graba interacciones del visitante, se carga
 * sólo con el consentimiento de analítica, igual que GA4, GTM y Vercel.
 *
 * Reemplaza a Microsoft Clarity — mismo objetivo funcional, mejor set de
 * datos y compatibilidad con el flujo B2B que estamos midiendo.
 */
export default function Contentsquare() {
  const { consent } = useCookieConsent()

  if (!CONTENTSQUARE_TAG_ID || !consent?.analytics) return null

  return (
    <Script
      id="contentsquare-tag"
      strategy="afterInteractive"
      src={`https://t.contentsquare.net/uxa/${CONTENTSQUARE_TAG_ID}.js`}
      async
    />
  )
}
