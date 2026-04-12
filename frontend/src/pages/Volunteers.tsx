import { useState } from 'react';
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '../components/layout/PageWrapper'
import { VolunteerCard } from '../components/volunteers/VolunteerCard'
import { useVolunteers } from '../hooks/useVolunteers'
import { Spinner } from '../components/ui/Spinner'
import type { Volunteer } from '../types'
import { Button } from '../components/ui/Button'
import { C } from '../utils/colors'

const allSkills = ['MEDICAL', 'LOGISTICS', 'TEACHING', 'COOKING', 'LEGAL', 'TRANSLATION']

export function Volunteers() {
  const { data: volunteers, isLoading } = useVolunteers()
  const [search, setSearch] = useState('')
  const [activeSkills, setActiveSkills] = useState<string[]>([])
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null)

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const filteredVols = volunteers?.filter(v => {
    const matchSearch = ((v as any).name || '').toLowerCase().includes(search.toLowerCase())
    const matchSkills = activeSkills.length === 0 || activeSkills.some(s => v.skills.includes(s))
    return matchSearch && matchSkills
  }) || []

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Volunteers</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>Browse and assign community volunteers</p>
        </div>

        {/* Search + filter chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search box */}
          <div style={{ position: 'relative', maxWidth: '380px' }}>
            <Search style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              width: '16px', height: '16px', color: C.textMuted,
            }} />
            <input
              placeholder="Search volunteers by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '38px',
                paddingRight: '12px',
                background: 'rgba(26,26,26,0.6)',
                border: '1px solid rgba(255,158,0,0.2)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#FF9E00')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,158,0,0.2)')}
            />
          </div>

          {/* Skill filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allSkills.map(skill => {
              const isActive = activeSkills.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                    background: isActive ? 'rgba(255,158,0,0.15)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255,158,0,0.5)' : 'rgba(255,158,0,0.25)'}`,
                    color: isActive ? C.orange : 'rgba(217,217,217,0.6)',
                  }}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>

        {/* Volunteer grid */}
        {isLoading ? (
          <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {filteredVols.map(vol => (
              <VolunteerCard
                key={vol.id}
                volunteer={vol}
                onClick={() => setSelectedVol(vol)}
              />
            ))}
          </div>
        )}

        {/* Detail drawer */}
        <AnimatePresence>
          {selectedVol && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh',
                width: '380px',
                background: 'rgba(26,26,26,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255,158,0,0.2)',
                zIndex: 200,
                overflowY: 'auto',
                padding: '32px 24px',
              }}
            >
              <button
                onClick={() => setSelectedVol(null)}
                style={{
                  position: 'absolute', top: '24px', right: '24px',
                  background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted,
                }}
              >
                <X size={20} />
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#FFFFFF', marginBottom: '24px', marginTop: '4px' }}>
                {(selectedVol as any).name || 'Volunteer Details'}
              </h2>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '11px', color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Availability
                </h3>
                <div style={{
                  background: 'rgba(255,158,0,0.06)',
                  border: '1px solid rgba(255,158,0,0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  color: C.textMuted,
                  fontSize: '13px',
                }}>
                  7-day availability matrix
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="secondary" style={{ flex: 1 }}>Contact</Button>
                <Button variant="primary" style={{ flex: 1 }}>Assign to need</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
