'use client'

import React, { useState, useEffect } from 'react'
import { useStudy } from '@/context/StudyContext'
import { Play, Pause, Square, Clock } from 'lucide-react'

interface Subject {
  id: string
  name: string
}

export default function TimerSection({ subjects }: { subjects: Subject[] }) {
  const { isActive, isPaused, seconds, totalSeconds, startTimer, pauseTimer, resumeTimer, saveSession } = useStudy()
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedType, setSelectedType] = useState<'50min' | '25min' | 'free'>('50min')

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

  const timeLeft = totalSeconds > 0 ? totalSeconds - seconds : seconds

  return (
    <div className="card" style={{ marginBottom: '1rem', textAlign: 'center' }}>
      {!isActive ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <button className="btn btn-secondary" onClick={saveSession} style={{ color: 'var(--destructive)' }}>
              <Square size={20} style={{ marginRight: '0.25rem' }} /> Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
