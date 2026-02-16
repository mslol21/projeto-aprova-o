'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Clock, MessageSquare, Lock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import StudyCalendar from '@/components/StudyCalendar'
import { toast } from 'sonner'

interface Session {
  id: string
  durationMinutes: number
  createdAt: string
  questionsTotal?: number
  questionsCorrect?: number
  notes?: string
  subject: {
    name: string
  }
}

interface ChartItem {
  name: string
  hours: number
}

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const isPremium = user?.plan === 'premium'
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [chartData, setChartData] = useState<ChartItem[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState('')

  // useEffect removido para usar a nova versão resiliente abaixo

  const fetchNotes = async () => {
    const res = await fetch('/api/notes')
    if (res.ok) {
        const data = await res.json()
        const noteMap: Record<string, string> = {}
        data.forEach((n: any) => {
            noteMap[n.date] = n.content
        })
        setNotes(noteMap)
    }
  }

  const saveNote = async () => {
    if (!selectedDate) return
    const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, content: noteContent })
    })
    if (res.ok) {
        setNotes(prev => ({ ...prev, [selectedDate]: noteContent }))
        toast.success('Nota salva com sucesso!')
        setSelectedDate(null)
    }
  }

  const [performanceData, setPerformanceData] = useState<ChartItem[]>([])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
        
        // Group by subject for hours
        const subjectsMap: Record<string, number> = {}
        // Group by subject for performance
        const perfMap: Record<string, { total: number; correct: number }> = {}

        data.forEach((s: Session) => {
          const name = s.subject.name
          subjectsMap[name] = (subjectsMap[name] || 0) + (s.durationMinutes / 60)
          
          if (s.questionsTotal && s.questionsTotal > 0) {
            if (!perfMap[name]) perfMap[name] = { total: 0, correct: 0 }
            perfMap[name].total += s.questionsTotal
            perfMap[name].correct += s.questionsCorrect || 0
          }
        })

        const chart = Object.keys(subjectsMap).map(name => ({
          name,
          hours: parseFloat(subjectsMap[name].toFixed(1))
        }))
        setChartData(chart)

        const perfChart = Object.keys(perfMap).map(name => ({
          name,
          hours: Math.round((perfMap[name].correct / perfMap[name].total) * 100)
        }))
        setPerformanceData(perfChart)
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error)
    }
  }

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = '/login'
      } else {
        fetchSessions()
        fetchNotes()
      }
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="container" style={{ 
        height: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div className="animate-spin" style={{ 
          width: '32px', 
          height: '32px', 
          border: '3px solid var(--secondary)', 
          borderTopColor: 'var(--primary)', 
          borderRadius: '50%' 
        }}></div>
        <p style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>Carregando estatísticas...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingTop: '1rem' }}>
        <button onClick={() => router.push('/dashboard')} className="btn-icon"><ArrowLeft /></button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Relatórios</h1>
      </header>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Calendário de Estudo</h2>
        
        <StudyCalendar 
          sessions={sessions}
          notes={notes}
          selectedDate={selectedDate}
          onDateClick={(date) => {
            setSelectedDate(date)
            setNoteContent(notes[date] || '')
          }}
        />

        {selectedDate && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '0.75rem', backgroundColor: 'var(--secondary)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem' }}>Anotação para {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</h3>
            <textarea 
              className="input" 
              style={{ minHeight: '100px', marginBottom: '0.75rem', fontSize: '0.875rem', background: 'var(--background)' }}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Ex: Hoje o foco foi em licitações. Rendimento de 85% nas questões."
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }} onClick={saveNote}>Salvar Anotação</button>
                <button className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }} onClick={() => setSelectedDate(null)}>Cancelar</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
             <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
             <span>Dia de Estudo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
             <MessageSquare size={14} color="var(--primary)" />
             <span>Contém Anotação</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Horas por Matéria</h2>
        <div style={{ width: '100%', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} unit="h" />
                <Tooltip 
                   contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '0.75rem' }}
                   itemStyle={{ color: 'var(--primary)', fontWeight: '600' }}
                   formatter={(value: any) => [`${value} horas`, 'Tempo']}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Nenhum dado para exibir.</p>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', position: 'relative' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Análise de Performance</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>% de acertos baseado nas questões resolvidas</p>
        
        {!user?.plan || user.plan === 'free' ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(3px)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '1.5rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <Lock size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Análise Premium</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
              Assine o Premium para ver sua taxa de acertos por matéria e identificar seus pontos fracos.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/')}>Ver Planos</button>
          </div>
        ) : null}

        <div style={{ width: '100%', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: user?.plan === 'premium' ? 1 : 0.3 }}>
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <YAxis dataKey="name" type="category" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                   contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '0.75rem' }}
                   itemStyle={{ color: '#10b981', fontWeight: '600' }}
                   formatter={(value: any) => [`${value}%`, 'Taxa de Acerto']}
                />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-perf-${index}`} fill={entry.hours >= 70 ? '#10b981' : entry.hours >= 50 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', textAlign: 'center' }}>
              Registre o número de questões ao finalizar seus estudos para ver este gráfico.
            </p>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Histórico Recente</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sessions.map((s) => (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--background)', borderRadius: '0.5rem' }}>
                    <BookOpen size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'capitalize' }}>{s.subject.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{new Date(s.createdAt).toLocaleDateString('pt-BR')} • {new Date(s.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '800', color: 'var(--foreground)' }}>
                    <Clock size={16} />
                    <span>{s.durationMinutes} min</span>
                  </div>
                  {s.questionsTotal ? (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: '800', 
                      color: (s.questionsCorrect || 0) / s.questionsTotal >= 0.7 ? '#10b981' : '#f59e0b',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {Math.round(((s.questionsCorrect || 0) / s.questionsTotal) * 100)}% ACERTO
                    </span>
                  ) : null}
                </div>
              </div>

              {s.notes && (
                isPremium ? (
                  <div style={{ 
                    fontSize: '0.8125rem', 
                    color: 'var(--muted-foreground)', 
                    fontStyle: 'italic',
                    padding: '0.75rem',
                    backgroundColor: 'var(--background)',
                    borderRadius: '0.75rem',
                    borderLeft: '2px solid var(--primary)'
                  }}>
                    "{s.notes}"
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--muted-foreground)', 
                    padding: '0.5rem',
                    backgroundColor: 'var(--background)',
                    borderRadius: '0.5rem',
                    border: '1px dashed var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Lock size={12} />
                    <span>Anotação disponível no Plano Premium</span>
                  </div>
                )
              )}
            </div>
          ))}
          {sessions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem', padding: '1rem 0' }}>Nenhum estudo registrado nos últimos 7 dias.</p>}
          
          {!isPremium && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(245, 158, 11, 0.05)', 
              borderRadius: '0.75rem', 
              border: '1px dashed #f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Lock size={18} color="#f59e0b" />
              <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '700', lineHeight: '1.4' }}>
                O plano gratuito exibe apenas os últimos 7 dias. Assine o Premium para salvar e visualizar seu histórico completo e anotações.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
