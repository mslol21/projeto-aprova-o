'use client'

import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Lock } from 'lucide-react'

interface Subject {
  id: string
  name: string
  weight?: number
  color?: string
}

interface SubjectListProps {
  subjects: Subject[]
  onAdd: (data: { name: string; weight: number; color: string }) => Promise<void>
  onUpdate: (id: string, data: { name: string; weight: number; color: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
  canAdd: boolean
  isPremium: boolean
}

export default function SubjectList({ subjects, onAdd, onUpdate, onDelete, canAdd, isPremium }: SubjectListProps) {
  const [newName, setNewName] = useState('')
  const [newWeight, setNewWeight] = useState(1)
  const [newColor, setNewColor] = useState('#3b82f6')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await onAdd({ name: newName, weight: newWeight, color: newColor })
    setNewName('')
    setNewWeight(1)
    setNewColor('#3b82f6')
    setIsAdding(false)
  }

  const handleUpdate = async (id: string) => {
    if (!newName.trim()) return
    await onUpdate(id, { name: newName, weight: newWeight, color: newColor })
    setEditingId(null)
    setNewName('')
    setNewWeight(1)
    setNewColor('#3b82f6')
  }

  const startEditing = (subject: Subject) => {
    setEditingId(subject.id)
    setNewName(subject.name)
    setNewWeight(subject.weight || 1)
    setNewColor(subject.color || '#3b82f6')
    setIsAdding(false)
  }

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Minhas Matérias</h2>
        {canAdd && !isAdding && !editingId && (
          <button className="btn btn-secondary" onClick={() => setIsAdding(true)} style={{ padding: '0.25rem 0.5rem' }}>
            <Plus size={18} />
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--primary)', borderRadius: '1rem', backgroundColor: 'rgba(30, 58, 138, 0.05)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--primary)' }}>
            {editingId ? 'EDITAR MATÉRIA' : 'NOVA MATÉRIA'}
          </h3>
          <input
            className="input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome da matéria (ex: Direito Constitucional)"
            autoFocus
          />
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '120px', opacity: isPremium ? 1 : 0.6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                PESO { !isPremium && <Lock size={10} /> }
              </label>
              <input 
                type="number" 
                min="1" 
                max="5" 
                className="input" 
                value={newWeight}
                disabled={!isPremium}
                onChange={(e) => setNewWeight(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '150px', opacity: isPremium ? 1 : 0.6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                COR { !isPremium && <Lock size={10} /> }
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {colors.map(c => (
                  <button 
                    key={c}
                    type="button"
                    onClick={() => isPremium && setNewColor(c)}
                    disabled={!isPremium}
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      backgroundColor: c, 
                      border: newColor === c ? '2px solid var(--foreground)' : 'none',
                      cursor: isPremium ? 'pointer' : 'not-allowed',
                      padding: 0
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {editingId ? (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleUpdate(editingId)}>Salvar Alterações</button>
            ) : (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Salvar Matéria</button>
            )}
            <button className="btn btn-secondary" onClick={() => { setIsAdding(false); setEditingId(null); setNewName(''); }}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {subjects.map((subject) => (
          <div key={subject.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1rem', 
            backgroundColor: 'var(--secondary)',
            borderRadius: '1rem',
            borderLeft: `5px solid ${subject.color || '#3b82f6'}`,
            transition: 'transform 0.2s'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{subject.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', fontWeight: '700' }}>PESO {subject.weight || 1}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => startEditing(subject)}
                className="btn-icon"
                style={{ color: 'var(--muted-foreground)' }}
                title="Editar"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => onDelete(subject.id)}
                className="btn-icon"
                style={{ color: 'var(--destructive)', opacity: 0.7 }}
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {subjects.length === 0 && !isAdding && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textAlign: 'center', py: '1.5rem' } as any}>
            Nenhuma matéria cadastrada.
          </p>
        )}
      </div>
    </div>
  )
}
