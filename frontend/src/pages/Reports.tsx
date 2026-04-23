import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageWrapper } from '../components/layout/PageWrapper'
import { analyzeReportText } from '../services/ai'
import { detectAndTranslate } from '../services/translate'
import { CATEGORY_LABELS, URGENCY_LABELS } from '../utils/labels'
import { EmptyState } from '../components/ui/EmptyState'
import { useIsMobile } from '../hooks/useIsMobile'

type ReportItem = {
  id: string
  text: string
  category: string
  urgency: string
  area: string
  time: string
  reporter: string
}

const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'RPT-201',
    text: 'Heavy waterlogging near lane 4. Elderly residents need transport to clinic.',
    category: 'MEDICAL',
    urgency: 'HIGH',
    area: 'Dharavi Ward',
    time: '10m ago',
    reporter: 'Community volunteer',
  },
  {
    id: 'RPT-202',
    text: 'Two families displaced after wall collapse. Need temporary shelter and blankets.',
    category: 'SHELTER',
    urgency: 'CRITICAL',
    area: 'Kurla East Ward',
    time: '22m ago',
    reporter: 'Resident call-in',
  },
  {
    id: 'RPT-203',
    text: 'Ration kits running out in flood camp B. Children need food packets.',
    category: 'FOOD',
    urgency: 'HIGH',
    area: 'Govandi Ward',
    time: '45m ago',
    reporter: 'NGO partner',
  },
]

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.72)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export function Reports() {
  const isMobile = useIsMobile(980)
  const [activeTab, setActiveTab] = useState<'submit' | 'browse'>('submit')
  const [description, setDescription] = useState('')
  const [detectedLanguage, setDetectedLanguage] = useState('')
  const [originalDescription, setOriginalDescription] = useState('')
  const [wasTranslated, setWasTranslated] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<{ category: string; urgency: string; summary: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const recentReports = useMemo(() => MOCK_REPORTS.slice(0, 3), [])

  const onDescriptionBlur = async () => {
    const value = description.trim()
    if (!value) return

    const result = await detectAndTranslate(value)
    setDetectedLanguage(result.detectedLanguage)

    if (result.wasTranslated) {
      setOriginalDescription(result.originalText)
      setDescription(result.translatedText)
      setWasTranslated(true)
    } else {
      setWasTranslated(false)
      setOriginalDescription('')
    }
  }

  const restoreOriginal = () => {
    if (!originalDescription) return
    setDescription(originalDescription)
    setWasTranslated(false)
  }

  const runAiAnalyze = async () => {
    if (!description.trim()) return

    setAnalyzing(true)
    try {
      const result = await analyzeReportText(description)
      if (result) {
        setAnalysis({
          category: result.category,
          urgency: result.urgency,
          summary: result.summary,
        })
      }
    } finally {
      setAnalyzing(false)
    }
  }

  const submitReport = async () => {
    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      setDescription('')
      setAnalysis(null)
      setDetectedLanguage('')
      setOriginalDescription('')
      setWasTranslated(false)
      setActiveTab('browse')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : 0 }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 500 }}>Community Reports</h1>
            <p style={{ fontSize: '14px', color: '#D9D9D9', marginTop: '4px' }}>
              Submit and review multilingual reports from affected neighborhoods.
            </p>
          </div>

          <div style={{ display: 'inline-flex', border: '1px solid rgba(217,217,217,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
            {[
              { key: 'submit', label: 'Submit' },
              { key: 'browse', label: 'Browse' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'submit' | 'browse')}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  padding: '8px 14px',
                  color: activeTab === tab.key ? '#1A1A1A' : '#D9D9D9',
                  background: activeTab === tab.key ? '#D9D9D9' : 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'submit' ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 58%) minmax(0, 42%)', gap: '20px' }}>
            <div style={{ ...glassCard, padding: '18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ fontSize: '12px', color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Report Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={onDescriptionBlur}
                  rows={9}
                  placeholder="Describe the situation in as much detail as possible..."
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1px solid rgba(217,217,217,0.26)',
                    background: 'rgba(255,255,255,0.02)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    padding: '12px 14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(217,217,217,0.65)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Language
                  </span>
                  {['auto', 'en', 'hi', 'mr', 'gu'].map((lang) => {
                    const active = (detectedLanguage || 'auto').toLowerCase() === lang
                    return (
                      <span
                        key={lang}
                        style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          border: `1px solid ${active ? '#C77DFF' : 'rgba(217,217,217,0.25)'}`,
                          color: active ? '#C77DFF' : '#D9D9D9',
                        }}
                      >
                        {lang.toUpperCase()}
                      </span>
                    )
                  })}
                </div>

                {wasTranslated && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      border: '1px solid rgba(199,125,255,0.35)',
                      background: 'rgba(199,125,255,0.09)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#D9D9D9' }}>Translated to English for consistent triage.</span>
                    <button
                      onClick={restoreOriginal}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#C77DFF',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textDecoration: 'underline',
                        fontFamily: 'inherit',
                      }}
                    >
                      Revert to original
                    </button>
                  </motion.div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={runAiAnalyze}
                    disabled={analyzing || !description.trim()}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid rgba(199,125,255,0.35)',
                      background: 'rgba(199,125,255,0.12)',
                      color: '#C77DFF',
                      cursor: analyzing || !description.trim() ? 'not-allowed' : 'pointer',
                      padding: '10px 14px',
                      fontSize: '13px',
                      opacity: 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>

                  <button
                    onClick={submitReport}
                    disabled={submitting || !description.trim()}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid rgba(255,158,0,0.45)',
                      background: '#FF9E00',
                      color: '#1A1A1A',
                      cursor: submitting || !description.trim() ? 'not-allowed' : 'pointer',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      opacity: submitting || !description.trim() ? 0.6 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>

                <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.55)' }}>
                  AI analysis runs through backend model routing.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ ...glassCard, padding: '16px' }}>
                <h3 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '10px', fontWeight: 500 }}>
                  AI Analysis
                </h3>
                {analysis ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#D9D9D9' }}>
                      Category: <strong style={{ color: '#FFFFFF' }}>{CATEGORY_LABELS[analysis.category] || analysis.category}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#D9D9D9' }}>
                      Urgency: <strong style={{ color: '#FFFFFF' }}>{URGENCY_LABELS[analysis.urgency] || analysis.urgency}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.82)', lineHeight: 1.6, marginTop: '4px' }}>
                      {analysis.summary}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.52)' }}>
                    Run AI analysis to auto-tag this report.
                  </div>
                )}
              </div>

              <div style={{ ...glassCard, padding: '16px' }}>
                <h3 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '10px', fontWeight: 500 }}>
                  Recent Community Reports
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentReports.map((item) => (
                    <div key={item.id} style={{ border: '1px solid rgba(217,217,217,0.15)', borderRadius: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.015)' }}>
                      <div style={{ fontSize: '12px', color: '#FFFFFF', marginBottom: '6px' }}>{item.text}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(217,217,217,0.58)' }}>
                        {item.area} - {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ ...glassCard, overflowX: 'auto' }}>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px' }}>
                {MOCK_REPORTS.map((item) => (
                  <div key={item.id} style={{ border: '1px solid rgba(255,158,0,0.12)', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '13px', color: '#D9D9D9', lineHeight: 1.5 }}>{item.text}</div>
                    <div style={{ fontSize: '12px', color: '#FFFFFF', marginTop: '8px' }}>{CATEGORY_LABELS[item.category] || item.category} - {URGENCY_LABELS[item.urgency] || item.urgency}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(217,217,217,0.8)', marginTop: '4px' }}>{item.area}</div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '14px', padding: '12px 16px', borderBottom: '1px solid rgba(255,158,0,0.12)', background: 'rgba(255,158,0,0.07)' }}>
                  {['Report', 'Category', 'Urgency', 'Area'].map((h) => (
                    <span key={h} style={{ fontSize: '11px', color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</span>
                  ))}
                </div>

                {MOCK_REPORTS.length === 0 ? (
                  <EmptyState emptyMessage="No reports submitted yet. As soon as residents submit reports, they will appear here." />
                ) : (
                  MOCK_REPORTS.map((item) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '14px', padding: '12px 16px', borderBottom: '1px solid rgba(255,158,0,0.08)' }}>
                      <div style={{ fontSize: '13px', color: '#D9D9D9' }}>{item.text}</div>
                      <div style={{ fontSize: '12px', color: '#FFFFFF' }}>{CATEGORY_LABELS[item.category] || item.category}</div>
                      <div style={{ fontSize: '12px', color: '#FFFFFF' }}>{URGENCY_LABELS[item.urgency] || item.urgency}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.8)' }}>{item.area}</div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
