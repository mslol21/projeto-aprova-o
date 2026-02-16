'use client'

import React, { useState, useEffect } from 'react'
import { useStudy } from '@/context/StudyContext'
import { useAuth } from '@/context/AuthContext'
import { Play, Pause, Square, Clock, Lock } from 'lucide-react'

interface Subject {
  id: string
  name: string
}

export default function TimerSection({ subjects }: { subjects: Subject[] }) {
  const { user } = useAuth()
  const isPremium = user?.plan === 'premium'
  const { isActive, isPaused, seconds, totalSeconds, startTimer, pauseTimer, resumeTimer, saveSession, resetTimer } = useStudy()
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedType, setSelectedType] = useState<'50min' | '25min' | 'free'>('50min')
  
  // Novos estados para Performance e Notas
  const [showSummary, setShowSummary] = useState(false)
  const [questionsTotal, setQuestionsTotal] = useState<number>(0)
  const [questionsCorrect, setQuestionsCorrect] = useState<number>(0)
  const [notes, setNotes] = useState('')
  
  // Ciclo de Estudos
  const [recommendation, setRecommendation] = useState<any>(null)

  useEffect(() => {
    if (!isActive && !showSummary) {
      fetch('/api/subjects/next')
        .then(res => res.json())
        .then(data => {
          if (data.nextSubject) setRecommendation(data)
        })
        .catch(() => {})
    }
  }, [isActive, showSummary])

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    if (!selectedSubject) {
      alert('Selecione uma matéria primeiro')
      return
    }
    startTimer(selectedSubject, selectedType)
  }

  const handleFinish = async () => {
    await saveSession({
      questionsTotal: Number(questionsTotal),
      questionsCorrect: Number(questionsCorrect),
      notes
    })
    setShowSummary(false)
    setQuestionsTotal(0)
    setQuestionsCorrect(0)
    setNotes('')
  }

  const timeLeft = totalSeconds > 0 ? totalSeconds - seconds : seconds

  if (showSummary) {
    return (
      <div className="card" style={{ marginBottom: '1rem', position: 'relative' }}>
        {!isPremium && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(2px)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Lock size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Recurso Premium</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
              O Módulo de Performance e Anotações de Sessão são exclusivos para assinantes Premium.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={async () => {
                const res = await fetch('/api/checkout', { method: 'POST' })
                const data = await res.json()
                if (data.init_point) window.location.href = data.init_point
              }}
            >
              🚀 ASSINAR PREMIUM AGORA
            </button>
            <button 
                className="btn btn-secondary" 
                style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} 
                onClick={() => {
                    saveSession()
                    setShowSummary(false)
                }}
            >
                Salvar apenas tempo (Grátis)
            </button>
          </div>
        )}
        <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Resumo da Sessão</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}>QUESTÕES</label>
            <input 
              type="number" 
              className="input" 
              placeholder="Total"
              disabled={!isPremium}
              value={questionsTotal || ''} 
              onChange={(e) => setQuestionsTotal(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}>ACERTOS</label>
            <input 
              type="number" 
              className="input" 
              placeholder="Acertos"
              disabled={!isPremium}
              value={questionsCorrect || ''} 
              onChange={(e) => setQuestionsCorrect(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--muted-foreground)' }}>ANOTAÇÕES (O que você estudou?)</label>
          <textarea 
            className="input" 
            style={{ minHeight: '100px', resize: 'vertical' }}
            placeholder="Ex: Teoria de Atos Administrativos, páginas 1 a 20..."
            disabled={!isPremium}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowSummary(false)} style={{ flex: 1 }}>Voltar</button>
          <button className="btn btn-primary" onClick={handleFinish} style={{ flex: 1 }}>Salvar Estudo</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ marginBottom: '1rem', textAlign: 'center' }}>
      {!isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isPremium ? (
            <div style={{ 
              backgroundColor: 'rgba(241, 245, 249, 1)', 
              padding: '1rem', 
              borderRadius: '1rem', 
              border: '1px dashed var(--border)',
              marginBottom: '0.5rem',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                <Lock size={14} />
                <p style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Ciclo de Estudos Premium</p>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
                Descubra qual matéria estudar agora com o ciclo automático.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', fontSize: '0.7rem', backgroundColor: '#f59e0b', borderColor: '#f59e0b', fontWeight: '800' }}
                onClick={async () => {
                  const res = await fetch('/api/checkout', { method: 'POST' })
                  const data = await res.json()
                  if (data.init_point) window.location.href = data.init_point
                }}
              >
                ATIVAR CICLO PREMIUM
              </button>
            </div>
          ) : recommendation ? (
            <div style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.08)', 
              padding: '1rem', 
              borderRadius: '1rem', 
              border: '1px dashed var(--primary)',
              marginBottom: '0.5rem',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>🎯 Recomendação do Ciclo</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: '700' }}>Estude {recommendation.nextSubject.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{recommendation.reason}</p>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setSelectedSubject(recommendation.nextSubject.id)
                  startTimer(recommendation.nextSubject.id, selectedType)
                }}
                style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.75rem' }}
              >
                Seguir Ciclo
              </button>
            </div>
          ) : null}

          <select 
            className="input" 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Selecione a matéria</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id} style={{ textTransform: 'capitalize' }}>{s.name}</option>
            ))}
          </select>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
            gap: '0.75rem',
            width: '100%' 
          }}>
            {['50min', '25min', 'free'].map((t) => (
              <button
                key={t}
                className={`btn ${selectedType === t ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedType(t as any)}
                style={{ fontSize: '0.875rem', padding: '0.6rem' }}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleStart} style={{ padding: '1rem', fontSize: '1.125rem' }}>
            <Play size={20} style={{ marginRight: '0.5rem' }} />
            Iniciar Estudo
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            <Clock size={16} />
            <span style={{ textTransform: 'capitalize' }}>Estudando: {subjects.find(s => s.id === useStudy().subjectId)?.name}</span>
          </div>

          <div style={{ fontSize: '4rem', fontWeight: '800', fontFamily: 'monospace' }}>
            {formatTime(timeLeft < 0 ? 0 : timeLeft)}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {!isPaused ? (
              <button className="btn btn-secondary" onClick={pauseTimer}>
                <Pause size={20} style={{ marginRight: '0.25rem' }} /> Pausar
              </button>
            ) : (
              <button className="btn btn-primary" onClick={resumeTimer}>
                <Play size={20} style={{ marginRight: '0.25rem' }} /> Retomar
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => setShowSummary(true)} style={{ color: 'var(--destructive)' }}>
              <Square size={20} style={{ marginRight: '0.25rem' }} /> Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
