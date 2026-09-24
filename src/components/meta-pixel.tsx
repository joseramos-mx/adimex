"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { useCookieConsent } from "@/context/cookie-consent-context"
import { META_PIXEL_ID } from "@/lib/meta-pixel"
import { shouldLoadMarketing } from "@/lib/consent-mode"
import { shouldLoadPixelInEnv } from "@/lib/env-gating"

/**
 * Meta Pixel — se carga sólo con consentimiento de marketing.
 *
 * El PageView inicial se dispara dentro del init (línea 8 del snippet).
 * Los demás eventos (`ViewContent`, `AddToCart`, `Contact`, etc.) se
 * disparan desde los componentes que corresponden vía `trackMetaEvent`
 * en `@/lib/meta-pixel`.
 *
 * Para deduplicación server-side (Conversions API), cada evento crítico
 * debe compartir el mismo `event_id` entre navegador y CAPI. Ver
 * `src/app/api/meta-capi/route.ts`.
 */
export default function MetaPixel() {
  const { consent } = useCookieConsent()
  // Evaluamos el gate de entorno client-side después del mount para poder
  // leer sessionStorage y ?pixel_test=1 (round-5 p4).
  const [envAllows, setEnvAllows] = useState<boolean | null>(null)
  useEffect(() => {
    setEnvAllows(shouldLoadPixelInEnv())
  }, [])

  if (!META_PIXEL_ID) return null
  if (!shouldLoadMarketing(consent?.marketing ?? false)) return null
  if (envAllows === false) return null
  // envAllows === null durante el primer render — no cargamos aún; el
  // useEffect corre y re-renderiza con el valor definitivo.
  if (envAllows === null) return null

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}
