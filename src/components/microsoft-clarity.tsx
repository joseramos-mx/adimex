"use client"

import Script from "next/script"
import { useCookieConsent } from "@/context/cookie-consent-context"
import { CLARITY_PROJECT_ID } from "@/lib/analytics-ids"

/**
 * Microsoft Clarity — mapas de calor y repetición de sesión. Como graba la
 * interacción del visitante, se carga sólo con el consentimiento de
 * analítica, igual que GA4 y GTM.
 */
export default function MicrosoftClarity() {
  const { consent } = useCookieConsent()

  if (!CLARITY_PROJECT_ID || !consent?.analytics) return null

  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  )
}
