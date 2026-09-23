import { NextRequest, NextResponse } from "next/server"
import { META_PIXEL_ID } from "@/lib/meta-pixel"

/**
 * Meta Conversions API — endpoint para eventos del navegador (T06).
 *
 * Recibe {event_name, event_id, event_source_url, custom_data} del cliente
 * y lo reenvía a Meta con el mismo `event_id` para que se deduplique con
 * el evento gemelo del Pixel.
 *
 * Enriquece con:
 *   - client_ip_address  (headers X-Forwarded-For / X-Real-IP)
 *   - client_user_agent  (User-Agent)
 *   - fbp, fbc           (cookies _fbp / _fbc del dominio)
 *
 * Respeta consent: si CONSENT_MODE es 'opt-in', el navegador solo llama
 * a esta ruta cuando el usuario aceptó marketing. La ruta hace además una
 * verificación adicional leyendo la cookie `adimex_consent` (backup).
 *
 * Purchase NO se manda desde aquí — la app de Meta en Shopify la envía
 * server-to-server a partir del checkout. Rechazamos `Purchase` para
 * evitar doble-conteo.
 */

const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Contact",
  "Search",
])

type EventPayload = {
  event_name: string
  event_id: string
  event_source_url?: string
  custom_data?: Record<string, unknown>
}

function readCookie(req: NextRequest, name: string): string | undefined {
  return req.cookies.get(name)?.value
}

function consentAllowed(req: NextRequest): boolean {
  const raw = readCookie(req, "adimex_consent")
  if (!raw) return false
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { marketing?: boolean }
    return Boolean(parsed.marketing)
  } catch {
    return false
  }
}

function clientIp(req: NextRequest): string | undefined {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]!.trim()
  return req.headers.get("x-real-ip") ?? undefined
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json(
      { error: "META_CAPI_ACCESS_TOKEN not configured" },
      { status: 501 },
    )
  }

  if (!consentAllowed(req)) {
    // Respondemos 204 para que el navegador no falle ruidosamente.
    return new NextResponse(null, { status: 204 })
  }

  let ev: EventPayload
  try {
    ev = (await req.json()) as EventPayload
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  if (!ev.event_name || !ev.event_id) {
    return NextResponse.json(
      { error: "event_name and event_id required" },
      { status: 400 },
    )
  }

  if (ev.event_name === "Purchase") {
    return NextResponse.json(
      { error: "Purchase must come from Shopify webhook, not browser" },
      { status: 400 },
    )
  }

  if (!ALLOWED_EVENTS.has(ev.event_name)) {
    return NextResponse.json(
      { error: `event_name '${ev.event_name}' not allowed` },
      { status: 400 },
    )
  }

  const userData: Record<string, string> = {}
  const ip = clientIp(req)
  if (ip) userData.client_ip_address = ip
  const ua = req.headers.get("user-agent")
  if (ua) userData.client_user_agent = ua
  const fbp = readCookie(req, "_fbp")
  if (fbp) userData.fbp = fbp
  const fbc = readCookie(req, "_fbc")
  if (fbc) userData.fbc = fbc

  const payload = {
    data: [
      {
        event_name: ev.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.event_id,
        action_source: "website",
        event_source_url:
          ev.event_source_url ?? req.headers.get("referer") ?? "https://adimex.io/",
        user_data: userData,
        ...(ev.custom_data ? { custom_data: ev.custom_data } : {}),
      },
    ],
    ...(process.env.META_CAPI_TEST_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_CODE }
      : {}),
  }

  const url = `https://graph.facebook.com/v20.0/${META_PIXEL_ID}/events?access_token=${accessToken}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const body = await res.json()
    if (!res.ok) {
      console.error("[meta-capi/event]", res.status, body)
      return NextResponse.json({ ok: false, meta: body }, { status: res.status })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[meta-capi/event] fetch failed", err)
    return NextResponse.json({ ok: false, error: "fetch failed" }, { status: 500 })
  }
}
