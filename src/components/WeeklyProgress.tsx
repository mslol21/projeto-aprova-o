'use client'

import React from 'react'

interface WeeklyProgressProps {
  currentHours: number
  targetHours: number
}

export default function WeeklyProgress({ currentHours, targetHours }: WeeklyProgressProps) {
  const percentage = targetHours > 0 ? Math.min(100, (currentHours / targetHours) * 100) : 0
  
  let message = "Defina sua meta semanal para começar."
  if (targetHours > 0) {
    if (percentage < 50) message = "Você está abaixo da meta."
    else if (percentage < 100) message = "Continue. A constância gera aprovação."
    else message = "Meta cumprida. Disciplina mantida."
  }

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Meta da Semana</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
        <span>{currentHours.toFixed(1)}h</span>
        <span style={{ color: 'var(--muted-foreground)' }}>/ {targetHours}h</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: percentage >= 100 ? '#059669' : 'var(--foreground)' }}>
        {message}
      </p>
    </div>
  )
}
