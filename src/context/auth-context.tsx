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
  ready: boolean
  login: () => void
  logout: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [ready, setReady] = useState(false)

  // Ask the server if we have a valid session (reads the httpOnly cookie)
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : { customer: null }))
      .then(({ customer }) => { if (customer) setCustomer(customer) })
      .catch(() => {})
      .finally(() => setReady(true))
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
