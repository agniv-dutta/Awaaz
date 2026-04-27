interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = '20px', className = '', style = {} }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '6px',
        ...style
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div style={{
      background: 'rgba(26, 26, 26, 0.72)',
      border: '1px solid rgba(255, 158, 0, 0.18)',
      borderRadius: '16px',
      padding: '20px',
      backdropFilter: 'blur(16px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <Skeleton width={48} height={48} style={{ borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height={20} style={{ marginBottom: '8px' }} />
          <Skeleton width="40%" height={16} />
        </div>
      </div>
      <Skeleton width="80%" height={16} style={{ marginBottom: '8px' }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: '8px' }} />
      <Skeleton width="70%" height={16} />
    </div>
  )
}

export function MetricSkeleton() {
  return (
    <div style={{
      background: 'rgba(26, 26, 26, 0.72)',
      border: '1px solid rgba(255, 158, 0, 0.18)',
      borderRadius: '16px',
      padding: '24px',
      backdropFilter: 'blur(16px)'
    }}>
      <Skeleton width="60%" height={20} style={{ marginBottom: '12px' }} />
      <Skeleton width="40%" height={32} style={{ marginBottom: '8px' }} />
      <Skeleton width="80%" height={14} />
    </div>
  )
}
