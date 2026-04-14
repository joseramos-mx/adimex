'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthContextValue {
  customer: Customer | null
  isLoggedIn: boolean
  ready: boolean   // true once the cookie check is done
  login: () => void
  logout: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [ready, setReady] = useState(false)

  // Read customer info from the non-httpOnly cookie on mount
  useEffect(() => {
    try {
      const raw = document.cookie
        .split('; ')
        .find((c) => c.startsWith('sh_customer='))
        ?.split('=')
        .slice(1)
        .join('=')

      if (raw) {
        setCustomer(JSON.parse(decodeURIComponent(raw)))
      }
    } catch {
      // cookie absent or malformed — user not logged in
    } finally {
      setReady(true)
    }
  }, [])

  const login  = () => { window.location.href = '/api/auth/login' }
  const logout = () => { window.location.href = '/api/auth/logout' }

  return (
    <AuthContext.Provider
      value={{ customer, isLoggedIn: !!customer, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
