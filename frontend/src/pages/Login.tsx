import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Badge } from '../components/ui/Badge'
import { authApi } from '../services/auth'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isHoverNGO, setIsHoverNGO] = useState(false)
  const [isHoverField, setIsHoverField] = useState(false)
  const [healthStatus, setHealthStatus] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const handleQuickLogin = (role: 'admin' | 'volunteer') => {
    if (role === 'admin') {
      fillDemoCredentials('admin@awaaz.dev', 'awaaz123')
    } else {
      fillDemoCredentials('volunteer@awaaz.dev', 'awaaz123')
    }
  }

  const handleHealthCheck = async () => {
    setHealthStatus('Checking...')
    try {
      await authApi.healthCheck()
      setHealthStatus('✅ Backend is reachable')
    } catch (error: any) {
      setHealthStatus(`❌ Backend error: ${error.message}`)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#1A1A1A',
    }}>
      {/* Left side: Dark panel (50%) */}
      <div style={{
        width: '50%',
        background: 'rgba(15, 10, 5, 0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
        boxShadow: '20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {/* Top: Branding */}
        <div>
          <span style={{ fontSize: '28px', fontWeight: 600, color: '#FF9E00', letterSpacing: '-0.5px' }}>
            Awaaz
          </span>
          <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.5)', marginTop: '2px' }}>
            Community Intelligence
          </div>
        </div>

        {/* Middle: Login Form */}
        <div style={{ maxWidth: '400px', width: '100%', alignSelf: 'center' }}>
          <h1 style={{ border: 'none', padding: 0, fontSize: '36px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(217,217,217,0.55)' }}>
            Sign in to your Awaaz workspace
          </p>

          <form onSubmit={handleLogin} style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#D9D9D9', letterSpacing: '0.04em', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@awaaz.dev"
                style={{
                  width: '100%', height: '48px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,158,0,0.2)', borderRadius: '10px',
                  color: '#FFFFFF', fontSize: '15px', padding: '0 16px', outline: 'none', transition: 'all 0.15s'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#FF9E00'; e.currentTarget.style.background = 'rgba(255,158,0,0.05)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,158,0,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#D9D9D9', letterSpacing: '0.04em', display: 'block', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', height: '48px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,158,0,0.2)', borderRadius: '10px',
                  color: '#FFFFFF', fontSize: '15px', padding: '0 16px', outline: 'none', transition: 'all 0.15s'
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#FF9E00'; e.currentTarget.style.background = 'rgba(255,158,0,0.05)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,158,0,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              />
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <a href="#" style={{ fontSize: '13px', color: 'rgba(255,158,0,0.7)', textDecoration: 'none' }}>Forgot password?</a>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#f87171'
              }}>
                {error}
              </div>
            )}

            {healthStatus && (
              <div style={{
                padding: '12px',
                background: healthStatus.includes('✅') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                border: healthStatus.includes('✅') ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(248, 113, 113, 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                color: healthStatus.includes('✅') ? '#4ade80' : '#f87171'
              }}>
                {healthStatus}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary-hover"
              disabled={isLoading}
              style={{
                width: '100%', height: '50px', background: isLoading ? 'rgba(255,158,0,0.5)' : '#FF9E00', 
                color: '#1A1A1A', borderRadius: '10px', fontSize: '15px', fontWeight: 500, 
                letterSpacing: '0.02em', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', 
                transition: 'background 0.15s ease'
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleHealthCheck}
              style={{
                width: '100%', height: '40px', background: 'transparent', 
                color: 'rgba(255,255,255,0.6)', borderRadius: '8px', fontSize: '12px', 
                border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', 
                marginTop: '12px'
              }}
            >
              🏥 Test Backend Connection
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(217,217,217,0.4)' }}>or continue as</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                onMouseEnter={() => setIsHoverNGO(true)}
                onMouseLeave={() => setIsHoverNGO(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                  background: isHoverNGO ? 'rgba(255,158,0,0.12)' : 'rgba(255,158,0,0.06)',
                  border: `1px solid ${isHoverNGO ? 'rgba(255,158,0,0.5)' : 'rgba(255,158,0,0.25)'}`,
                  color: '#D9D9D9'
                }}
              >
                NGO Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('volunteer')}
                onMouseEnter={() => setIsHoverField(true)}
                onMouseLeave={() => setIsHoverField(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                  background: isHoverField ? 'rgba(255,158,0,0.12)' : 'rgba(255,158,0,0.06)',
                  border: `1px solid ${isHoverField ? 'rgba(255,158,0,0.5)' : 'rgba(255,158,0,0.25)'}`,
                  color: '#D9D9D9'
                }}
              >
                Field Volunteer
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(217,217,217,0.6)' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ color: '#FF9E00', textDecoration: 'none', fontWeight: 500 }}
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>

        {/* Bottom: Stats */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: 500, color: '#FFFFFF' }}>214</span>
              <span style={{ fontSize: '11px', color: 'rgba(217,217,217,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>open needs</span>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: 500, color: '#FFFFFF' }}>47</span>
              <span style={{ fontSize: '11px', color: 'rgba(217,217,217,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>volunteers</span>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: 500, color: '#FFFFFF' }}>89%</span>
              <span style={{ fontSize: '11px', color: 'rgba(217,217,217,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>dispatch rate</span>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(217,217,217,0.35)', marginTop: '24px' }}>
            Serving 5 Mumbai wards
          </div>
        </div>
      </div>

      {/* Right side: Gradient + Preview (50%) */}
      <div style={{
        width: '50%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px',
      }}>
        {/* Quote */}
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <p style={{
            fontSize: '28px', fontWeight: 400, color: 'rgba(255,255,255,0.9)',
            maxWidth: '380px', lineHeight: 1.5, fontStyle: 'italic', margin: 0
          }}>
            "Giving communities a voice, one report at a time."
          </p>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '12px' }}>
            — Awaaz Platform
          </div>
        </div>

        {/* Floating NeedCard Mockup */}
        <div style={{
          width: '340px',
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 158, 0, 0.25)',
          borderLeft: '4px solid #FF9E00',
          borderRadius: '16px',
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          padding: '24px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          transform: 'rotate(-2deg)',
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <Badge variant="orange">MEDICAL</Badge>
            <Badge variant="red">CRITICAL</Badge>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#FFFFFF', border: 'none', padding: 0, marginBottom: '6px' }}>
            Dharavi Ward — urgent care needed
          </h3>
          <p style={{ fontSize: '13px', color: '#D9D9D9', margin: 0 }}>
            38 reports · Last filed 2 min ago
          </p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
             <span style={{
               padding: '4px 12px', background: 'rgba(255,158,0,0.15)',
               border: '1px solid #FF9E00', borderRadius: '20px',
               fontSize: '11px', color: '#FF9E00', fontWeight: 600,
               letterSpacing: '0.04em', animation: 'pulse-dot 2s infinite'
             }}>
               Dispatching...
             </span>
          </div>
        </div>
      </div>
    </div>
  )
}
