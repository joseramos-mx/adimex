import { NextResponse } from 'next/server'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  generateNonce,
} from '@/lib/customer-auth'

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!
const SHOP_ID   = process.env.SHOPIFY_SHOP_ID!
const APP_URL   = process.env.NEXT_PUBLIC_APP_URL!

export async function GET() {
  const codeVerifier  = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const state         = generateState()
  const nonce         = generateNonce()

  const authUrl = new URL(
    `https://shopify.com/authentication/${SHOP_ID}/oauth/authorize`
  )
  authUrl.searchParams.set('client_id',             CLIENT_ID)
  authUrl.searchParams.set('response_type',         'code')
  authUrl.searchParams.set('redirect_uri',          `${APP_URL}/api/auth/callback`)
  authUrl.searchParams.set('scope',                 'openid email')
  authUrl.searchParams.set('state',                 state)
  authUrl.searchParams.set('nonce',                 nonce)
  authUrl.searchParams.set('code_challenge',        codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')

  const res = NextResponse.redirect(authUrl.toString())

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 300, // 5 min — only needed during the handshake
    path: '/',
  }
  res.cookies.set('sh_auth_state',    state,        cookieOpts)
  res.cookies.set('sh_auth_nonce',    nonce,        cookieOpts)
  res.cookies.set('sh_code_verifier', codeVerifier, cookieOpts)

  return res
}
