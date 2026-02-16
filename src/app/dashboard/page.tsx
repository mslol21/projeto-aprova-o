'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import WeeklyProgress from '@/components/WeeklyProgress'
import TimerSection from '@/components/TimerSection'
import SubjectList from '@/components/SubjectList'
import ApprovalBuilding from '@/components/ApprovalBuilding'
import { LogOut, Settings, BarChart2, Moon, Sun, Clock, Wifi, WifiOff } from 'lucide-react'
import { toast } from 'sonner'

interface Subject {
  id: string
  name: string
}

interface Session {
  id: string
  durationMinutes: number
  type: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [goal, setGoal] = useState({ targetHours: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const fetchData = async () => {
    try {
      const [subsRes, sessRes, goalRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/sessions'),
        fetch('/api/goals')
      ])

      if (subsRes.ok) setSubjects(await subsRes.json())
      if (sessRes.ok) setSessions(await sessRes.json())
      if (goalRes.ok) setGoal(await goalRes.json())
    } catch (error) {
      console.error('Failed to fetch dashboard data', error)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchData()
    }
  }, [user, loading, router])

  const handleAddSubject = async (data: { name: string; weight: number; color: string }) => {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) fetchData()
    else {
        const errData = await res.json()
        alert(errData.error)
    }
  }

  const handleUpdateSubject = async (id: string, data: { name: string; weight: number; color: string }) => {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (res.ok) fetchData()
    else {
        const errData = await res.json()
        alert(errData.error)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Excluir esta matéria?')) return
    const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' })
    if (res.ok) fetchData()
  }

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0)
  const totalHours = totalMinutes / 60

  if (loading || !user) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>

  const SkeletonCard = () => (
    <div className="card animate-pulse" style={{ height: '150px', backgroundColor: 'var(--secondary)', opacity: 0.5 }}></div>
  )

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem', 
        paddingTop: '1.5rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/icons/app-icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.1' }}>PROJETO</h1>
            <h1 style={{ fontSize: '1.125rem', fontWeight: '800', lineHeight: '1.1' }}>APROVAÇÃO</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user.plan === 'free' && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}
              onClick={async () => {
                const res = await fetch('/api/checkout', { method: 'POST' })
                const data = await res.json()
                if (data.init_point) window.location.href = data.init_point
              }}
            >
              🚀 Upgrade Premium
            </button>
          )}
           <button onClick={toggleTheme} className="btn-icon" style={{ color: 'var(--muted-foreground)' }}>
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           <button onClick={() => router.push('/reports')} className="btn-icon" style={{ color: 'var(--muted-foreground)' }}><BarChart2 size={20} /></button>
           <button onClick={logout} className="btn-icon" style={{ color: 'var(--muted-foreground)' }}><LogOut size={20} /></button>
        </div>
      </header>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Bem-vindo de volta,</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user?.name || 'Usuário'}</h2>
        </div>
        {!isOnline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--destructive)', fontSize: '0.75rem', fontWeight: '600' }}>
            <WifiOff size={14} /> Offline
          </div>
        )}
      </div>

      {statsLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : (
        <>
          <ApprovalBuilding streak={user.streakCount} plan={user.plan} />
          
          <WeeklyProgress currentHours={totalHours} targetHours={goal.targetHours} />
          
          <TimerSection subjects={subjects} />

          <SubjectList 
            subjects={subjects} 
            onAdd={handleAddSubject} 
            onUpdate={handleUpdateSubject}
            onDelete={handleDeleteSubject} 
            canAdd={user.plan === 'premium' || subjects.length < 6}
            isPremium={user.plan === 'premium'}
          />
        </>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%' }}
          onClick={() => {
            const h = prompt('Sua meta de horas semanais:', goal.targetHours.toString())
            if (h) {
                fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetHours: parseInt(h) })
                }).then(fetchData)
            }
          }}
        >
          <Settings size={18} style={{ marginRight: '0.5rem' }} />
          Ajustar Meta Semanal
        </button>
      </div>
    </div>
  )
}
