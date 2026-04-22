interface EmptyStateProps {
  emptyMessage: string
}

export function EmptyState({ emptyMessage }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,158,0,0.3)' }} />
        ))}
      </div>
      <div style={{ fontSize: '15px', color: '#D9D9D9', fontWeight: 500 }}>No data yet</div>
      <div style={{ fontSize: '13px', color: 'rgba(217,217,217,0.4)', textAlign: 'center', maxWidth: '280px' }}>{emptyMessage}</div>
    </div>
  )
}
