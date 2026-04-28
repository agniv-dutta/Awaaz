import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/auth'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [healthStatus, setHealthStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await register(formData.name, formData.email, formData.password, formData.role, formData.phone || '0000000000')
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      background: 'radial-gradient(circle at 80% 20%, rgba(255,158,0,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(199,125,255,0.12), transparent 50%), #0A0704'
    }}>
      {/* Left Panel */}
      <div style={{
        width: '50%',
        background: 'rgba(8,5,3,0.97)',
        display: 'flex',
        flexDirection: 'column',
        padding: '80px',
        position: 'relative'
      }}>
        <Link 
          to="/"
          style={{
            color: '#D9D9D9',
            fontSize: '14px',
            textDecoration: 'none',
            marginBottom: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to home
        </Link>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '32px', color: '#FF9E00', fontWeight: 600 }}>Awaaz</span>
              <span style={{ fontSize: '16px', color: 'rgba(255,158,0,0.5)', marginLeft: '8px' }}>आवाज़</span>
            </div>
            
            <h1 style={{ fontSize: '36px', color: '#FFFFFF', fontWeight: 500, margin: '32px 0 12px' }}>
              Create account
            </h1>
            <p style={{ fontSize: '15px', color: '#D9D9D9', margin: 0 }}>
              Join the community coordination platform
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#D9D9D9', fontSize: '14px', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(10,7,4,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#D9D9D9', fontSize: '14px', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(10,7,4,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#D9D9D9', fontSize: '14px', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(10,7,4,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#D9D9D9', fontSize: '14px', marginBottom: '8px' }}>
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(10,7,4,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              >
                <option value="volunteer">Field Volunteer</option>
                <option value="ngo_coordinator">NGO Coordinator</option>
                <option value="field_worker">Field Worker</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#D9D9D9', fontSize: '14px', marginBottom: '8px' }}>
                Phone (optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(10,7,4,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '15px'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#f87171',
                fontSize: '14px'
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
                color: healthStatus.includes('✅') ? '#4ade80' : '#f87171',
                marginBottom: '20px'
              }}>
                {healthStatus}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '50px',
                background: '#FF9E00',
                color: '#1A1A1A',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 500,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleHealthCheck}
              style={{
                width: '100%',
                height: '40px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                borderRadius: '8px',
                fontSize: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              🏥 Test Backend Connection
            </button>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <span style={{ color: '#D9D9D9', fontSize: '14px' }}>
                Already have an account?{' '}
              </span>
              <Link 
                to="/login"
                style={{ color: '#FF9E00', fontSize: '14px', textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>

        {/* Bottom stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#FF9E00', fontWeight: 500 }}>214</div>
            <div style={{ fontSize: '12px', color: '#D9D9D9' }}>needs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#FF9E00', fontWeight: 500 }}>47</div>
            <div style={{ fontSize: '12px', color: '#D9D9D9' }}>volunteers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', color: '#FF9E00', fontWeight: 500 }}>89%</div>
            <div style={{ fontSize: '12px', color: '#D9D9D9' }}>success</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Gradient + App Preview */}
      <div style={{
        width: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px'
      }}>
        {/* Concentric circles decoration */}
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(255,158,0,0.1)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(199,125,255,0.1)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(255,158,0,0.2)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} />

        {/* App Preview Card */}
        <div style={{
          width: '420px',
          background: 'rgba(10,7,4,0.85)',
          border: '1px solid rgba(255,158,0,0.2)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          transform: 'rotate(-2deg)',
          animation: 'float 4s ease-in-out infinite',
          zIndex: 2
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 500, margin: '0 0 8px' }}>
              Join the community
            </h3>
            <p style={{ color: '#D9D9D9', fontSize: '14px', margin: 0 }}>
              Start making a difference today
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ 
              background: 'rgba(74,222,128,0.1)', 
              border: '1px solid rgba(74,222,128,0.3)', 
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤝</div>
              <div style={{ fontSize: '14px', color: '#4ade80', fontWeight: 600 }}>Connect</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9' }}>With volunteers</div>
            </div>
            <div style={{ 
              background: 'rgba(255,158,0,0.1)', 
              border: '1px solid rgba(255,158,0,0.3)', 
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
              <div style={{ fontSize: '14px', color: '#FF9E00', fontWeight: 600 }}>Respond</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9' }}>To local needs</div>
            </div>
            <div style={{ 
              background: 'rgba(199,125,255,0.1)', 
              border: '1px solid rgba(199,125,255,0.3)', 
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '14px', color: '#C77DFF', fontWeight: 600 }}>Track</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9' }}>Your impact</div>
            </div>
            <div style={{ 
              background: 'rgba(74,222,128,0.1)', 
              border: '1px solid rgba(74,222,128,0.3)', 
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center' 
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
              <div style={{ fontSize: '14px', color: '#4ade80', fontWeight: 600 }}>Grow</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9' }}>Your skills</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: rotate(-2deg) translateY(0);
          }
          50% {
            transform: rotate(-2deg) translateY(-12px);
          }
        }
      `}</style>
    </div>
  )
}
