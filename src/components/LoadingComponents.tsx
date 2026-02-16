export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '40px'
  }

  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: '2px solid var(--muted)',
        borderTop: '2px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}
    />
  )
}

export function LoadingSkeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse ${className || ''}`}
      style={{
        backgroundColor: 'var(--muted)',
        borderRadius: '0.5rem',
        ...style
      }}
    />
  )
}

export function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1rem'
    }}>
      <LoadingSpinner size="lg" />
      <p style={{ color: 'var(--muted-foreground)' }}>Carregando...</p>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <LoadingSkeleton style={{ height: '24px', width: '60%', marginBottom: '1rem' }} />
      <LoadingSkeleton style={{ height: '16px', width: '80%', marginBottom: '0.5rem' }} />
      <LoadingSkeleton style={{ height: '16px', width: '70%' }} />
    </div>
  )
}
