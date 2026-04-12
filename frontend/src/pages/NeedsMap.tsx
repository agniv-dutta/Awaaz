import { useState } from 'react';
import { useNeeds } from '../hooks/useNeeds'
import { PageWrapper } from '../components/layout/PageWrapper'
import { motion, AnimatePresence } from 'framer-motion'
import { SidebarClose, SidebarOpen, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { UrgencyBadge } from '../components/needs/UrgencyBadge'
import { C } from '../utils/colors'

const glassPanel: React.CSSProperties = {
  background: 'rgba(26,26,26,0.80)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,158,0,0.18)',
}

export function NeedsMap() {
  const { data: needs } = useNeeds()
  const [leftOpen, setLeftOpen] = useState(true)
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(null)

  const selectedNeed = needs?.find(n => n.id === selectedNeedId)

  return (
    <PageWrapper noPadding>
      {/* Map background placeholder */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,6,0,0.35)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ color: 'rgba(255,158,0,0.4)', fontSize: '13px' }}>Live Map View</span>
          <span style={{ color: 'rgba(217,217,217,0.25)', fontSize: '12px' }}>Set VITE_MAPBOX_TOKEN to enable</span>
        </div>
      </div>

      {/* Left filter panel */}
      <AnimatePresence>
        {leftOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '280px',
              ...glassPanel,
              borderRight: '1px solid rgba(255,158,0,0.15)',
              borderTop: 'none',
              borderBottom: 'none',
              borderLeft: 'none',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,158,0,0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <h2 style={{ color: '#FFFFFF', fontWeight: 500, fontSize: '15px', margin: 0 }}>Filters</h2>
              <button
                onClick={() => setLeftOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted }}
              >
                <SidebarClose style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
              <span style={{
                fontSize: '10px',
                color: 'rgba(217,217,217,0.45)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '10px',
              }}>
                Matching Needs
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {needs?.map(need => (
                  <div
                    key={need.id}
                    onClick={() => setSelectedNeedId(need.id)}
                    style={{
                      background: selectedNeedId === need.id ? 'rgba(255,158,0,0.12)' : 'rgba(26,26,26,0.5)',
                      border: `1px solid ${selectedNeedId === need.id ? 'rgba(255,158,0,0.35)' : 'rgba(255,158,0,0.1)'}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: C.silver }}>{need.category}</span>
                      <UrgencyBadge urgency={need.urgency} />
                    </div>
                    <span style={{ fontSize: '11px', color: 'rgba(217,217,217,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Ward {need.ward_id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      {!leftOpen && (
        <button
          onClick={() => setLeftOpen(true)}
          style={{
            position: 'absolute', left: '16px', top: '16px', zIndex: 10,
            background: 'rgba(26,26,26,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,158,0,0.2)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: C.silver,
          }}
        >
          <SidebarOpen style={{ width: '20px', height: '20px' }} />
        </button>
      )}

      {/* Right detail panel */}
      <AnimatePresence>
        {selectedNeed && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '300px',
              ...glassPanel,
              borderLeft: '1px solid rgba(255,158,0,0.15)',
              borderTop: 'none',
              borderBottom: 'none',
              borderRight: 'none',
              zIndex: 10,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <button
              onClick={() => setSelectedNeedId(null)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted,
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#FFFFFF', margin: 0 }}>{selectedNeed.category}</h2>
              <UrgencyBadge urgency={selectedNeed.urgency} />
            </div>

            <span style={{ fontSize: '13px', color: C.textMuted }}>Ward {selectedNeed.ward_id}</span>

            <p style={{ fontSize: '14px', color: C.silver, lineHeight: 1.6, flex: 1 }}>
              {selectedNeed.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,158,0,0.1)', paddingTop: '16px' }}>
              <Button variant="primary" style={{ width: '100%' }}>Dispatch Volunteers</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
