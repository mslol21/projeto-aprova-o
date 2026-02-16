'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  plan: string
  streakCount: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshUser = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        // MUITO IMPORTANTE: Só limpamos se não estivermos no meio de um login
        setUser(prev => prev ? prev : null)
      }
    } catch (error) {
      console.error('Auth refresh error:', error)
      // Em caso de erro de rede, mantemos o usuário se ele existir
      setUser(prev => prev ? prev : null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = (userData: User) => {
    console.log('Login bem-sucedido para:', userData.email)
    setUser(userData)
    setLoading(false)
    
    // Pequeno delay para garantir que o cookie foi processado pelo browser
    // antes de navegar para o dashboard que fará novos requests
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 100)
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
