import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { UploadCloud } from 'lucide-react'
import { C } from '../utils/colors'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

const tabBase: React.CSSProperties = {
  paddingBottom: '10px',
  paddingLeft: '4px',
  paddingRight: '4px',
  fontSize: '14px',
  fontWeight: 500,
  background: 'none',
  border: 'none',
  borderBottom: '2px solid transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
}

export function Reports() {
  const [activeTab, setActiveTab] = useState<'submit' | 'ocr' | 'browse'>('submit')

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Reports</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>Submit and browse community need reports</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid rgba(255,158,0,0.12)', paddingBottom: '0' }}>
          {(['submit', 'ocr', 'browse'] as const).map(tab => {
            const labels = { submit: 'Submit Report', ocr: 'Upload Document', browse: 'Browse Past' }
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...tabBase,
                  color: isActive ? C.orange : 'rgba(217,217,217,0.55)',
                  borderBottomColor: isActive ? C.orange : 'transparent',
                }}
              >
                {labels[tab]}
              </button>
            )
          })}
        </div>

        {activeTab === 'submit' && <SubmitTab />}
        {activeTab === 'ocr' && <OCRTab />}
        {activeTab === 'browse' && <BrowseTab />}
      </div>
    </PageWrapper>
  )
}

function SubmitTab() {
  const categories = ['FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'LEGAL', 'MENTAL_HEALTH', 'ELDERLY_CARE', 'OTHER']
  const [selectedCat, setSelectedCat] = useState('MEDICAL')
  const [urgency, setUrgency] = useState('HIGH')

  const urgencyColors: Record<string, string> = {
    CRITICAL: C.orange,
    HIGH: C.orangeDark,
    MEDIUM: C.violet,
    LOW: 'rgba(217,217,217,0.4)',
  }

  return (
    <div style={{ ...glassCard, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Category chips */}
      <div>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(217,217,217,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
          Category
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
                background: selectedCat === cat ? 'rgba(255,158,0,0.15)' : 'rgba(255,158,0,0.05)',
                border: `1px solid ${selectedCat === cat ? 'rgba(255,158,0,0.5)' : 'rgba(255,158,0,0.15)'}`,
                color: selectedCat === cat ? C.orange : 'rgba(217,217,217,0.6)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(217,217,217,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Description
        </label>
        <textarea
          placeholder="Describe the need..."
          rows={4}
          style={{
            width: '100%',
            background: 'rgba(26,26,26,0.6)',
            border: '1px solid rgba(255,158,0,0.2)',
            borderRadius: '8px',
            color: '#FFFFFF',
            padding: '12px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#FF9E00')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,158,0,0.2)')}
        />
      </div>

      {/* Ward + Urgency row */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: 'rgba(217,217,217,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Ward</label>
          <select style={{
            width: '100%',
            height: '40px',
            background: 'rgba(26,26,26,0.6)',
            border: '1px solid rgba(255,158,0,0.2)',
            borderRadius: '8px',
            color: '#FFFFFF',
            padding: '0 12px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
          }}>
            <option>Ward 1 - Dharavi</option>
            <option>Ward 2 - Kurla</option>
            <option>Ward 3 - Govandi</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: 'rgba(217,217,217,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Urgency</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(u => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  background: urgency === u ? urgencyColors[u] + '22' : 'transparent',
                  border: `1px solid ${urgency === u ? urgencyColors[u] : 'rgba(255,158,0,0.2)'}`,
                  color: urgency === u ? urgencyColors[u] : 'rgba(217,217,217,0.55)',
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button variant="primary" style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
        Submit Report
      </Button>
    </div>
  )
}

function OCRTab() {
  const [isHover, setIsHover] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [text, setText] = useState('')

  const handleSimulate = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setText('Extracted: Needs 50 blankets and medical supply kit near main crossroad.')
    }, 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          width: '100%',
          height: '240px',
          border: `2px dashed ${isHover ? C.orange : 'rgba(255,158,0,0.35)'}`,
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          background: isHover ? 'rgba(255,158,0,0.05)' : 'transparent',
          transition: 'all 0.2s',
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleSimulate}
      >
        {isProcessing ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Spinner />
            <span style={{ color: C.orange, fontWeight: 500 }}>Extracting needs...</span>
          </div>
        ) : (
          <>
            <UploadCloud style={{ width: '48px', height: '48px', color: C.orange, opacity: 0.5, marginBottom: '12px' }} />
            <span style={{ color: '#D9D9D9', fontWeight: 500 }}>Drop PDF or image here</span>
            <span style={{ color: C.textMuted, fontSize: '13px', marginTop: '4px' }}>.pdf, .jpg, .png</span>
          </>
        )}
      </div>

      {text && (
        <div style={{ ...glassCard, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#D9D9D9' }}>Extracted Content</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(26,26,26,0.6)',
              border: '1px solid rgba(255,158,0,0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              padding: '12px',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical',
            }}
          />
          <Button variant="primary" style={{ alignSelf: 'flex-start' }}>Confirm &amp; Submit</Button>
        </div>
      )}
    </div>
  )
}

function BrowseTab() {
  const statuses = ['PENDING', 'PROCESSED', 'FLAGGED']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ ...glassCard, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: '#D9D9D9', fontSize: '14px', fontWeight: 500 }}>Report #{i}293</span>
            <span style={{ color: C.textMuted, fontSize: '12px' }}>Today at {9 + i}:45 AM · Ward {i}</span>
          </div>
          <span style={{
            fontSize: '10px',
            padding: '3px 10px',
            borderRadius: '20px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            border: `1px solid ${i === 1 ? 'rgba(255,158,0,0.35)' : i === 2 ? C.violetBorder : 'rgba(217,217,217,0.25)'}`,
            color: i === 1 ? C.orange : i === 2 ? C.violet : 'rgba(217,217,217,0.5)',
            background: i === 1 ? C.orangeGhost : i === 2 ? C.violetGhost : 'transparent',
          }}>
            {statuses[i - 1]}
          </span>
        </div>
      ))}
    </div>
  )
}
