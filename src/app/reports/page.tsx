'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Clock, MessageSquare } from 'lucide-react'
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
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [chartData, setChartData] = useState<ChartItem[]>([])
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [noteContent, setNoteContent] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    else if (user) {
      fetchSessions()
      fetchNotes()
    }
  }, [user, loading])

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

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
        
        // Group by subject
        const subjectsMap: Record<string, number> = {}
        data.forEach((s: Session) => {
          const name = s.subject.name
          subjectsMap[name] = (subjectsMap[name] || 0) + (s.durationMinutes / 60)
        })

        const chart = Object.keys(subjectsMap).map(name => ({
          name,
          hours: parseFloat(subjectsMap[name].toFixed(1))
        }))
        setChartData(chart)
      }
    } catch (error) {
      console.error('Failed to fetch sessions', error)
    }
  }

  if (loading || !user) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>

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
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '0.75rem' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: '600' }}
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
              )}
            </div>
          ))}
          {sessions.length === 0 && <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem', padding: '1rem 0' }}>Nenhum estudo registrado nos últimos 7 dias.</p>}
          
          {user.plan === 'free' && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--accent)', borderRadius: '0.75rem', border: '1px dashed var(--primary)' }}>
              <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--primary)', fontWeight: '600' }}>
                O plano gratuito exibe apenas os últimos 7 dias. Migre para o Premium para ver o histórico completo. (R$ 19,90/mês)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
