import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { C } from '../utils/colors'

export function Login() {
  const [email, setEmail] = useState('admin@awaaz.org')
  const [password, setPassword] = useState('password')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login('mock_token_123', { id: '1', email, name: 'Admin Dutta', phone: '123', role: 'admin', ward_id: null, is_active: true })
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '22px', fontWeight: 600, color: C.orange, letterSpacing: '-0.5px' }}>
          Awaaz
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {['Platform', 'Community', 'About'].map(link => (
            <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 400, transition: 'color 0.15s' }}>
              {link}
            </a>
          ))}
          <button style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: '8px',
            color: '#FFFFFF',
            padding: '7px 18px',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            Sign Up
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#FFFFFF',
            padding: '7px 18px',
            fontSize: '14px',
            cursor: 'pointer',
          }}>
            Log In
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '0 80px',
        paddingTop: '60px',
      }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          {/* Pill label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '4px 14px',
            marginBottom: '28px',
          }}>
            <span style={{ fontSize: '12px', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Google Solution Challenge 2025
            </span>
          </div>

          {/* Main heading */}
          <h1 style={{
            fontSize: '72px',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1,
            letterSpacing: '-2px',
            marginBottom: '12px',
          }}>
            Awaaz
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 400,
            marginBottom: '8px',
            marginTop: '8px',
          }}>
            Community Intelligence Platform
          </p>

          {/* Description */}
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6,
            maxWidth: '400px',
            marginTop: '16px',
            marginBottom: '40px',
          }}>
            Turning scattered community voices into clear, urgent action.
          </p>

          {/* Login form embedded in the CTA area */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Email address"
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                border: '1px solid rgba(255, 158, 0, 0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                padding: '13px 16px',
                fontSize: '15px',
                outline: 'none',
                width: '100%',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#FF9E00')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255, 158, 0, 0.2)')}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                border: '1px solid rgba(255, 158, 0, 0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                padding: '13px 16px',
                fontSize: '15px',
                outline: 'none',
                width: '100%',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#FF9E00')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255, 158, 0, 0.2)')}
            />
            {/* Buttons row */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="submit"
                style={{
                  background: '#FF9E00',
                  color: '#1A1A1A',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E08800')}
                onMouseLeave={e => (e.currentTarget.style.background = '#FF9E00')}
              >
                Get Started
              </button>
              <button
                type="button"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  flex: 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                Learn More
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer row */}
      <div style={{
        padding: '20px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Legal', 'Privacy', 'Cookie', 'About'].map(item => (
            <a key={item} href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
              {item}
            </a>
          ))}
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
          © 2025 Awaaz
        </span>
      </div>
    </div>
  )
}
