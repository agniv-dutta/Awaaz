import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { C } from '../utils/colors'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

const lineData = [
  { name: 'Mon', FOOD: 12, MEDICAL: 19, SHELTER: 3 },
  { name: 'Tue', FOOD: 15, MEDICAL: 15, SHELTER: 5 },
  { name: 'Wed', FOOD: 10, MEDICAL: 22, SHELTER: 2 },
  { name: 'Thu', FOOD: 18, MEDICAL: 18, SHELTER: 6 },
  { name: 'Fri', FOOD: 14, MEDICAL: 25, SHELTER: 4 },
  { name: 'Sat', FOOD: 20, MEDICAL: 20, SHELTER: 7 },
  { name: 'Sun', FOOD: 17, MEDICAL: 16, SHELTER: 5 },
]

const donutData = [
  { name: 'MEDICAL', value: 45, color: '#C77DFF' },
  { name: 'FOOD', value: 30, color: '#FF9E00' },
  { name: 'SHELTER', value: 15, color: '#D9D9D9' },
  { name: 'OTHER', value: 10, color: 'rgba(217,217,217,0.35)' },
]

export function Analytics() {
  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Analytics</h1>
            <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>Trends, ward performance and need breakdowns</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Input type="date" style={{ width: '160px', height: '38px' }} />
            <Input type="date" style={{ width: '160px', height: '38px' }} />
            <Button variant="secondary" style={{ height: '38px' }}>Export CSV</Button>
          </div>
        </div>

        {/* Line chart */}
        <div style={{ ...glassCard, padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', marginBottom: '20px' }}>Needs over time</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="rgba(255,158,0,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(217,217,217,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(217,217,217,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(26,26,26,0.92)',
                    border: '1px solid rgba(255,158,0,0.25)',
                    borderRadius: '10px',
                    color: '#D9D9D9',
                  }}
                />
                <Line type="monotone" dataKey="FOOD" stroke="#FF9E00" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="MEDICAL" stroke="#C77DFF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SHELTER" stroke="#D9D9D9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two-column lower section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Donut */}
          <div style={{ ...glassCard, padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', marginBottom: '16px' }}>Needs by Category</h3>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(26,26,26,0.92)',
                      border: '1px solid rgba(255,158,0,0.25)',
                      borderRadius: '10px',
                      color: '#D9D9D9',
                    }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: 'rgba(217,217,217,0.7)', fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ward leaderboard */}
          <div style={{ ...glassCard, padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF', marginBottom: '16px' }}>Ward Leaderboard</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 80px 100px',
                gap: '12px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,158,0,0.1)',
                marginBottom: '4px',
              }}>
                {['Rank', 'Ward', 'Open', 'Top Issue'].map(h => (
                  <span key={h} style={{ fontSize: '11px', color: 'rgba(217,217,217,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {h}
                  </span>
                ))}
              </div>
              {[1, 2, 3, 4, 5].map(rank => (
                <div key={rank} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 80px 100px',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: rank < 5 ? '1px solid rgba(255,158,0,0.06)' : 'none',
                  alignItems: 'center',
                }}>
                  <span style={{ color: C.orange, fontWeight: 500, fontSize: '14px' }}>#{rank}</span>
                  <span style={{ color: C.silver, fontSize: '14px' }}>Ward {rank}</span>
                  <span style={{ color: C.orange, fontSize: '14px' }}>{Math.floor(40 / rank)}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    background: C.violetGhost,
                    color: C.violet,
                    border: `1px solid ${C.violetBorder}`,
                    letterSpacing: '0.04em',
                    width: 'max-content',
                  }}>
                    MEDICAL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
