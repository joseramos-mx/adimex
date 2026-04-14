/**
 * Shopify Customer Account API — PKCE OAuth utilities
 * Docs: https://shopify.dev/docs/api/customer
 */

// ─── PKCE helpers ─────────────────────────────────────────────────────────────

function base64urlEncode(buffer: ArrayBuffer): string {
  return Buffer.from(buffer)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateCodeVerifier(): string {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return base64urlEncode(array.buffer)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoded = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return base64urlEncode(hash)
}

export function generateState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64urlEncode(array.buffer)
}

export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64urlEncode(array.buffer)
}

// ─── JWT decode (no verify — server only reads its own issued tokens) ─────────

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

// ─── Customer info from id_token ──────────────────────────────────────────────

export interface CustomerInfo {
  id: string        // sub claim — Shopify customer GID
  email: string
  firstName: string
  lastName: string
}

export function extractCustomerInfo(idToken: string): CustomerInfo | null {
  const payload = decodeJwtPayload(idToken)
  if (!payload) return null

  // `given_name`/`family_name` come from the `profile` scope (not always available).
  // Fall back to the email prefix so the header always has something to show.
  const emailStr = (payload.email as string) ?? ''
  const fallbackName = emailStr.split('@')[0] ?? ''

  return {
    id: (payload.sub as string) ?? '',
    email: emailStr,
    firstName: (payload.given_name as string) || fallbackName,
    lastName: (payload.family_name as string) ?? '',
  }
}
