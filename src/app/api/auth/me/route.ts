import { NextRequest, NextResponse } from 'next/server'
import { extractCustomerInfo } from '@/lib/customer-auth'

/** GET /api/auth/me — reads the httpOnly id_token cookie and returns customer info */
export async function GET(req: NextRequest) {
  const idToken = req.cookies.get('sh_id_token')?.value
  if (!idToken) return NextResponse.json({ customer: null })

  const customer = extractCustomerInfo(idToken)
  return NextResponse.json({ customer })
}
