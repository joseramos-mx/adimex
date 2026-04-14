import { NextRequest, NextResponse } from 'next/server'
import { extractCustomerInfo } from '@/lib/customer-auth'

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!
const SHOP_ID   = process.env.SHOPIFY_SHOP_ID!
const APP_URL   = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state')

  const storedState    = req.cookies.get('sh_auth_state')?.value
  const codeVerifier   = req.cookies.get('sh_code_verifier')?.value

  // Validate state to prevent CSRF
  if (!code || !state || state !== storedState || !codeVerifier) {
    console.error('[Auth] Invalid state or missing params')
    return NextResponse.redirect(`${APP_URL}/?auth_error=1`)
  }

  // Exchange code for tokens
  const tokenRes = await fetch(
    `https://shopify.com/authentication/${SHOP_ID}/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'authorization_code',
        client_id:     CLIENT_ID,
        redirect_uri:  `${APP_URL}/api/auth/callback`,
        code,
        code_verifier: codeVerifier,
      }),
    }
  )

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error('[Auth] Token exchange failed:', err)
    return NextResponse.redirect(`${APP_URL}/?auth_error=1`)
  }

  const tokens = await tokenRes.json()
  // tokens: { access_token, id_token, refresh_token, expires_in, token_type }

  const customer = extractCustomerInfo(tokens.id_token)

  const res = NextResponse.redirect(`${APP_URL}/cuenta`)

  const secure = process.env.NODE_ENV === 'production'

  // Store tokens in httpOnly cookies
  res.cookies.set('sh_access_token', tokens.access_token, {
    httpOnly: true, secure, sameSite: 'lax',
    maxAge: tokens.expires_in ?? 3600,
    path: '/',
  })
  res.cookies.set('sh_id_token', tokens.id_token, {
    httpOnly: true, secure, sameSite: 'lax',
    maxAge: tokens.expires_in ?? 3600,
    path: '/',
  })
  if (tokens.refresh_token) {
    res.cookies.set('sh_refresh_token', tokens.refresh_token, {
      httpOnly: true, secure, sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
  }

  // Store non-sensitive customer info in a readable cookie for the client
  if (customer) {
    res.cookies.set('sh_customer', JSON.stringify(customer), {
      httpOnly: false, secure, sameSite: 'lax',
      maxAge: tokens.expires_in ?? 3600,
      path: '/',
    })
  }

  // Clear PKCE cookies
  res.cookies.delete('sh_auth_state')
  res.cookies.delete('sh_auth_nonce')
  res.cookies.delete('sh_code_verifier')

  return res
}
