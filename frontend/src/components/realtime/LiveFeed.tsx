import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../../hooks/useSocket'
import { C } from '../../utils/colors'
import { Badge } from '../ui/Badge'
import { CATEGORY_LABELS } from '../../utils/labels'

interface FeedItem {
  id: string
  category: string
  ward: string
  timestamp: string
}

const INITIAL_FEED: FeedItem[] = [
  { id: '1', category: 'MEDICAL', ward: 'Dharavi Ward', timestamp: new Date().toISOString() },
  { id: '2', category: 'FOOD', ward: 'Kurla East Ward', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', category: 'SHELTER', ward: 'Govandi Ward', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', category: 'MEDICAL', ward: 'Mankhurd Ward', timestamp: new Date(Date.now() - 9000000).toISOString() },
  { id: '5', category: 'FOOD', ward: 'Bandra Ward', timestamp: new Date(Date.now() - 10800000).toISOString() },
]

export function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>(INITIAL_FEED)

  useSocket('new_report', (data: FeedItem) => {
    setItems((prev) => [data, ...prev].slice(0, 20))
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
        flexShrink: 0,
      }}>
        {/* Pulse dot */}
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: C.orange,
          animation: 'pulse-dot 1.8s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <h3 style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#FFFFFF',
          margin: 0,
        }}>
          Live Feed
        </h3>
      </div>

      {/* Feed items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: '2px' }}>
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isOld = new Date().getTime() - new Date(item.timestamp).getTime() > 2 * 60 * 60 * 1000
            const isViolet = item.category === 'MEDICAL' || item.category === 'SHELTER' || item.category === 'MENTAL_HEALTH'
            const isSilver = item.category === 'EDUCATION' || item.category === 'LEGAL' || item.category === 'OTHER'

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: isOld ? 0.45 : 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(217, 217, 217, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Category badge */}
                <Badge variant={isSilver ? 'silver' : isViolet ? 'medium' : 'processed'}>
                  {CATEGORY_LABELS[item.category] || item.category}
                </Badge>

                {/* Ward */}
                <span style={{
                  fontSize: '14px',
                  color: '#D9D9D9',
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.ward}
                </span>

                {/* Time */}
                <span style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.45)', flexShrink: 0 }}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
