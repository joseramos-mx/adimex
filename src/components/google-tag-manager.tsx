"use client"

import Script from "next/script"
import { useCookieConsent } from "@/context/cookie-consent-context"
import { GTM_ID } from "@/lib/gtm"

/**
 * Carga el contenedor de Google Tag Manager sólo cuando el usuario consintió
 * la categoría de analítica — mismo criterio que `GatedAnalytics`, para no
 * rastrear antes de que el usuario decida (LFPDPPP y Política de Cookies).
 *
 * El `<noscript>` que exige Google vive en `app/layout.tsx`, inmediatamente
 * después de `<body>`, porque debe salir en el HTML del servidor.
 */
export default function GoogleTagManager() {
  const { consent } = useCookieConsent()

  if (!GTM_ID || !consent?.analytics) return null

  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  )
}
