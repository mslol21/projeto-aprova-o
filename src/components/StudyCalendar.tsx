'use client'

import React, { useState } from 'react'
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'

interface StudyCalendarProps {
  sessions: any[]
  notes: Record<string, string>
  onDateClick: (date: string) => void
  selectedDate: string | null
}

export default function StudyCalendar({ sessions, notes, onDateClick, selectedDate }: StudyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', textTransform: 'capitalize' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} className="btn-icon" style={{ padding: '0.4rem' }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="btn-icon" style={{ padding: '0.4rem' }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem' }}>
        {days.map(day => (
          <div key={day} style={{ 
            textAlign: 'center', 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            color: 'var(--muted-foreground)',
            padding: '0.5rem 0'
          }}>
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate
    })

    const sessionDates = new Set(sessions.map(s => format(new Date(s.createdAt), 'yyyy-MM-dd')))

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border)', border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
        {calendarDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isSelected = selectedDate === dateStr
          const isToday = isSameDay(day, new Date())
          const isCurrentMonth = isSameMonth(day, monthStart)
          const hasStudy = sessionDates.has(dateStr)
          const hasNote = !!notes[dateStr]

          return (
            <div
              key={i}
              onClick={() => onDateClick(dateStr)}
              style={{
                aspectRatio: '1/1',
                padding: '0.5rem',
                backgroundColor: isSelected ? 'var(--accent)' : 'var(--background)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.2s',
                border: isSelected ? '1px solid var(--primary)' : 'none'
              }}
              className="calendar-cell"
            >
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: isToday ? '700' : '500',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: isToday ? 'var(--primary)' : 'transparent',
                color: isToday ? 'white' : (isCurrentMonth ? 'var(--foreground)' : 'var(--muted-foreground)'),
                marginBottom: '4px'
              }}>
                {format(day, 'd')}
              </span>
              
              <div style={{ display: 'flex', gap: '2px', height: '4px' }}>
                {hasStudy && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                {hasNote && <MessageSquare size={10} color="var(--primary)" style={{ position: 'absolute', top: '4px', right: '4px', opacity: 0.7 }} />}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}
