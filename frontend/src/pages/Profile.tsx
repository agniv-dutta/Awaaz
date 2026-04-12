import { PageWrapper } from "../components/layout/PageWrapper"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/Button"
import { Avatar } from "../components/ui/Avatar"
import { C } from "../utils/colors"

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

export function Profile() {
  const { user, logout } = useAuthStore()

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Profile</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>Manage your account settings</p>
        </div>

        <div style={{ ...glassCard, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <Avatar initials={user?.name || "AD"} style={{ width: '80px', height: '80px', fontSize: '24px' }} />
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#FFFFFF', marginBottom: '8px' }}>{user?.name}</h2>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '20px',
              background: C.orangeGhost,
              color: C.orange,
              border: `1px solid ${C.border}`,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              {user?.role}
            </span>
          </div>

          <div style={{ width: '100%', borderTop: '1px solid rgba(255, 158, 0, 0.12)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email</span>
                <span style={{ fontSize: '15px', color: '#FFFFFF', marginLeft: 'auto' }}>{user?.email}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</span>
                <span style={{ fontSize: '15px', color: '#FFFFFF', marginLeft: 'auto' }}>{user?.phone || 'Not set'}</span>
             </div>
          </div>

          <Button variant="secondary" style={{ width: '100%', marginTop: '8px' }} onClick={logout}>Sign Out</Button>
        </div>
      </div>
    </PageWrapper>
  )
}
