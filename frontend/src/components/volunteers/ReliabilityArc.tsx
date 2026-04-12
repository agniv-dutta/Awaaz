interface ReliabilityArcProps {
  score: number // 0 to 1
  className?: string
}

export function ReliabilityArc({ score, className }: ReliabilityArcProps) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score * circumference)

  return (
    <div className={`relative flex items-center justify-center w-11 h-11 ${className}`}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="#2E2E2E"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="#FF9E00"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-semibold text-silver">
        {Math.round(score * 100)}%
      </span>
    </div>
  )
}
