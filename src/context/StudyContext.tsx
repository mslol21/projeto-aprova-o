'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface StudyContextType {
  isActive: boolean
  isPaused: boolean
  seconds: number
  totalSeconds: number
  subjectId: string | null
  type: '50min' | '25min' | 'free'
  startTimer: (subjectId: string, type: '50min' | '25min' | 'free') => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetTimer: () => void
  saveSession: () => Promise<void>
}

const StudyContext = createContext<StudyContextType | undefined>(undefined)

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [type, setType] = useState<'50min' | '25min' | 'free'>('50min')
  const [isHydrated, setIsHydrated] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Persist timer state to localStorage
  useEffect(() => {
    if (isHydrated) {
      const state = { isActive, isPaused, seconds, totalSeconds, subjectId, type, lastUpdated: Date.now() }
      localStorage.setItem('timer_state', JSON.stringify(state))
    }
  }, [isActive, isPaused, seconds, totalSeconds, subjectId, type, isHydrated])

  // Hydrate timer state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timer_state')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.isActive) {
          const now = Date.now()
          const diff = Math.floor((now - state.lastUpdated) / 1000)
          
          setIsActive(state.isActive)
          setIsPaused(state.isPaused)
          setSubjectId(state.subjectId)
          setType(state.type)
          setTotalSeconds(state.totalSeconds)
          
          // If was running, add elapsed time
          if (!state.isPaused) {
            setSeconds(state.seconds + diff)
          } else {
            setSeconds(state.seconds)
          }
          toast.info('Cronômetro recuperado!')
        }
      } catch (e) {
        console.error('Failed to parse timer state', e)
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    const syncOfflineSessions = async () => {
      const offline = JSON.parse(localStorage.getItem('offline_sessions') || '[]')
      if (offline.length === 0) return

      console.log('Syncing offline sessions...', offline.length)
      const remaining = []

      for (const session of offline) {
        try {
          const res = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(session)
          })
          if (!res.ok) remaining.push(session)
        } catch (error) {
          remaining.push(session)
        }
      }

      if (remaining.length === 0 && offline.length > 0) {
        toast.success(`${offline.length} sessões offline sincronizadas!`)
      }

      localStorage.setItem('offline_sessions', JSON.stringify(remaining))
    }

    const handleOnline = () => {
      toast.success('Você está online! Sincronizando...')
      syncOfflineSessions()
    }
    const handleOffline = () => toast.warning('Você está offline. Estudos serão salvos localmente.')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    syncOfflineSessions()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, isPaused])

  const startTimer = (sid: string, t: '50min' | '25min' | 'free') => {
    setSubjectId(sid)
    setType(t)
    setIsActive(true)
    setIsPaused(false)
    setSeconds(0)
    
    if (t === '50min') setTotalSeconds(50 * 60)
    else if (t === '25min') setTotalSeconds(25 * 60)
    else setTotalSeconds(0)
    
    toast.success('Estudo iniciado. Foco total!')
  }

  const pauseTimer = () => setIsPaused(true)
  const resumeTimer = () => setIsPaused(false)
  const resetTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    setSeconds(0)
    setSubjectId(null)
    localStorage.removeItem('timer_state')
  }

  const saveSession = async () => {
    if (!subjectId || seconds < 60) {
        toast.error('Tempo insuficiente para salvar (mínimo 1 minuto).')
        resetTimer()
        return
    }

    const durationMinutes = Math.floor(seconds / 60)
    const sessionData = {
      subjectId,
      durationMinutes,
      type,
      createdAt: new Date().toISOString()
    }
    
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      })

      if (!res.ok) throw new Error('Failed to save')
      toast.success('Sessão registrada com sucesso!')
    } catch (error) {
      console.warn('Saving session offline', error)
      const offlineSessions = JSON.parse(localStorage.getItem('offline_sessions') || '[]')
      offlineSessions.push(sessionData)
      localStorage.setItem('offline_sessions', JSON.stringify(offlineSessions))
      toast.warning('Sessão salva offline. Será sincronizada em breve.')
    }

    resetTimer()
  }

  return (
    <StudyContext.Provider value={{
      isActive, isPaused, seconds, totalSeconds, subjectId, type,
      startTimer, pauseTimer, resumeTimer, resetTimer, saveSession
    }}>
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider')
  }
  return context
}
