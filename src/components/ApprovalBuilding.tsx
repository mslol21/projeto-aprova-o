'use client'

import React from 'react'

interface ApprovalBuildingProps {
  streak: number
  plan: string
}

export default function ApprovalBuilding({ streak, plan }: ApprovalBuildingProps) {
  // Logic for floors
  let floors = 0
  if (streak >= 30) floors = 5 + Math.floor((streak - 30) / 7)
  else if (streak >= 14) floors = 4
  else if (streak >= 7) floors = 3
  else if (streak >= 3) floors = 2
  else if (streak >= 1) floors = 1

  // Plan limitation: Free capped at 3 floors
  const displayFloors = plan === 'free' ? Math.min(floors, 3) : floors
  const isCapped = plan === 'free' && floors > 3

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>Prédio da Aprovação</h2>
        <div style={{ 
          padding: '0.4rem 0.75rem', 
          backgroundColor: 'var(--primary)', 
          color: 'white', 
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          {streak} DIAS SEGUIDOS
        </div>
      </div>

      {/* Building Visualization */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column-reverse', 
        alignItems: 'center', 
        width: '100%',
        minHeight: '200px',
        padding: '1rem 0'
      }}>
        {/* Ground Floor / Foundation */}
        <div style={{ 
          width: '120px', 
          height: '10px', 
          backgroundColor: 'var(--muted-foreground)', 
          borderRadius: '2px',
          marginBottom: '2px'
        }} />

        {/* Floors */}
        {Array.from({ length: Math.max(displayFloors, 0) }).map((_, i) => (
          <div key={i} style={{
            width: '80px',
            height: '35px',
            backgroundColor: 'var(--primary)',
            border: '2px solid var(--background)',
            borderRadius: '4px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '0 8px'
          }}>
            {/* Windows */}
            <div style={{ width: '12px', height: '18px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
            <div style={{ width: '12px', height: '18px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
            <div style={{ width: '12px', height: '18px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }} />
          </div>
        ))}

        {/* If streak is 0 */}
        {displayFloors === 0 && (
           <div style={{ 
            color: 'var(--muted-foreground)', 
            fontSize: '0.875rem', 
            textAlign: 'center',
            paddingBottom: '2rem' 
          }}>
             Comece seu primeiro dia de construção hoje.
           </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>
          {displayFloors === 0 ? 'Terreno Baldio' : `${displayFloors}º Andar Construído`}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', maxWidth: '250px' }}>
          {streak === 0 ? 'Construções sólidas exigem constância.' : 'A aprovação é construída todos os dias.'}
        </p>
      </div>

      {isCapped && (
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.75rem', 
          backgroundColor: 'var(--accent)', 
          borderRadius: '0.75rem', 
          border: '1px dashed var(--primary)',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Limite do Plano Gratuito atingido (3 andares).</span>
          <br />Migre para o Premium para construir o arranha-céu da sua aprovação! (R$ 19,90/mês)
        </div>
      )}
    </div>
  )
}
