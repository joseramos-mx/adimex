import { NextRequest, NextResponse } from 'next/server'

const SHOP_ID = process.env.SHOPIFY_SHOP_ID!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export async function GET(req: NextRequest) {
  const idToken = req.cookies.get('sh_id_token')?.value

  // Build Shopify logout URL (clears the Shopify session on their end)
  const logoutUrl = new URL(
    `https://shopify.com/authentication/${SHOP_ID}/logout`
  )
  if (idToken) {
    logoutUrl.searchParams.set('id_token_hint', idToken)
  }
  logoutUrl.searchParams.set('post_logout_redirect_uri', APP_URL)

  const res = NextResponse.redirect(logoutUrl.toString())

  // Clear all auth cookies
  const cookiesToDelete = ['sh_access_token', 'sh_id_token', 'sh_refresh_token']
  for (const name of cookiesToDelete) {
    res.cookies.delete({ name, path: '/' })
  }

  return res
}
