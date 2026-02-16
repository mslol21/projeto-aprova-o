'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'

interface Subject {
  id: string
  name: string
}

interface SubjectListProps {
  subjects: Subject[]
  onAdd: (name: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  canAdd: boolean
}

export default function SubjectList({ subjects, onAdd, onDelete, canAdd }: SubjectListProps) {
  const [newName, setNewName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await onAdd(newName)
    setNewName('')
    setIsAdding(false)
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Minhas Matérias</h2>
        {canAdd && !isAdding && (
          <button className="btn btn-secondary" onClick={() => setIsAdding(true)} style={{ padding: '0.25rem 0.5rem' }}>
            <Plus size={18} />
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            className="input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome da matéria"
            autoFocus
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
          <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>X</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {subjects.map((subject) => (
          <div key={subject.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0.75rem 1rem', 
            backgroundColor: 'var(--secondary)',
            borderRadius: '0.75rem',
            marginBottom: '0.25rem'
          }}>
            <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{subject.name}</span>
            <button 
              onClick={() => onDelete(subject.id)}
              className="btn-icon"
              style={{ color: 'var(--muted-foreground)' }}
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {subjects.length === 0 && !isAdding && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textAlign: 'center', py: '1rem' } as any}>
            Nenhuma matéria cadastrada.
          </p>
        )}
      </div>
    </div>
  )
}
