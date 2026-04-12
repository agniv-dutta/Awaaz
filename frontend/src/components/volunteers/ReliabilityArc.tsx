interface ReliabilityArcProps {
  score: number // 0 to 1
}

export function ReliabilityArc({ score }: ReliabilityArcProps) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - score * circumference

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px' }}>
      <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="22" cy="22" r={radius}
          stroke="rgba(255,158,0,0.15)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="22" cy="22" r={radius}
          stroke="#FF9E00"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <span style={{
        position: 'absolute',
        fontSize: '10px',
        fontWeight: 600,
        color: '#D9D9D9',
      }}>
        {Math.round(score * 100)}%
      </span>
    </div>
  )
}
