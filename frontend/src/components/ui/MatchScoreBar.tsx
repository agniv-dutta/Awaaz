import { useState } from 'react'
import type { HTMLAttributes } from 'react';
import { C } from '../../utils/colors'

interface MatchScoreBarProps extends HTMLAttributes<HTMLDivElement> {
  score: number // 0 to 1
  breakdown?: {
    skillMatch: number;
    proximityScore: number;
    reliabilityScore: number;
    availabilityScore: number;
    languageMatch: number;
  }
}

const WEIGHTS = {
  skillMatch: 0.35,
  proximityScore: 0.25,
  reliabilityScore: 0.20,
  availabilityScore: 0.15,
  languageMatch: 0.05,
}

const FACTOR_CONFIG = {
  skillMatch: { label: 'Skill match', color: '#FF9E00' },
  proximityScore: { label: 'Proximity', color: '#C77DFF' },
  reliabilityScore: { label: 'Reliability', color: '#FF9E00' },
  availabilityScore: { label: 'Availability', color: '#4ade80' },
  languageMatch: { label: 'Language', color: '#C77DFF' },
}

export function MatchScoreBar({ score, breakdown, style, ...props }: MatchScoreBarProps) {
  const [showXAI, setShowXAI] = useState(false)
  const percentage = Math.max(0, Math.min(1, score)) * 100

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }} {...props}>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '140px', cursor: breakdown ? 'pointer' : 'default' }}
        onMouseEnter={() => breakdown && setShowXAI(true)}
        onMouseLeave={() => setShowXAI(false)}
        onClick={() => breakdown && setShowXAI(!showXAI)}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.55)' }}>{Math.round(percentage)}% Match</span>
        </div>
        <div style={{
          height: '4px',
          width: '100%',
          borderRadius: '2px',
          background: 'rgba(255,158,0,0.12)',
          overflow: 'hidden',
        }}>
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${C.orange}, ${C.violet})`,
            }}
          />
        </div>
      </div>

      {/* XAI Breakdown Panel */}
      {showXAI && breakdown && (
        <div
          style={{
            position: 'fixed',
            background: 'rgba(15, 10, 5, 0.97)',
            border: '1px solid rgba(255, 158, 0, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            width: '280px',
            zIndex: 100,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            top: '100px',
            right: '20px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', marginBottom: '4px' }}>
            Why this match?
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(217, 217, 217, 0.5)', marginBottom: '14px' }}>
            Score breakdown · {Math.round(score * 100)}% overall
          </div>

          {(Object.keys(FACTOR_CONFIG) as (keyof typeof FACTOR_CONFIG)[]).map((factor) => {
            const value = breakdown[factor as keyof typeof breakdown] || 0
            const weight = WEIGHTS[factor as keyof typeof WEIGHTS] || 0
            const config = FACTOR_CONFIG[factor]

            return (
              <div key={factor} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#D9D9D9' }}>{config.label}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(217, 217, 217, 0.4)' }}>×{weight.toFixed(2)}</span>
                  </div>
                  <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${value * 100}%`,
                        background: config.color,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#FFFFFF', minWidth: '30px', textAlign: 'right' }}>
                  {Math.round(value * 100)}%
                </span>
              </div>
            )
          })}

          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '13px',
            color: 'rgba(217, 217, 217, 0.4)',
            lineHeight: 1.5,
          }}>
            Awaaz AI matched this volunteer based on weighted community factors.
          </div>
        </div>
      )}
    </div>
  )
}
