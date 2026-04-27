import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Cloud, Bot, Radio, BarChart3, Smartphone, Ear } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A0704 0%, #1A1208 50%, #0F0905 100%)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        background: 'rgba(10,7,4,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,158,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 120px',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #FF9E00 0%, #C77DFF 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Ear size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', color: '#FF9E00', fontWeight: 600, lineHeight: 1 }}>Awaaz</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,158,0,0.6)', marginTop: '-2px' }}>Community Intelligence</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#D9D9D9', fontSize: '15px', textDecoration: 'none', fontWeight: 400 }}>Features</a>
          <a href="#how-it-works" style={{ color: '#D9D9D9', fontSize: '15px', textDecoration: 'none', fontWeight: 400 }}>How it works</a>
          <a href="#impact" style={{ color: '#D9D9D9', fontSize: '15px', textDecoration: 'none', fontWeight: 400 }}>Impact</a>
          <a href="#about" style={{ color: '#D9D9D9', fontSize: '15px', textDecoration: 'none', fontWeight: 400 }}>About</a>
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #FF9E00 0%, #C77DFF 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 28px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(255,158,0,0.25)'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingLeft: '120px',
        paddingRight: '120px',
        paddingTop: '72px'
      }}>
        <div style={{ maxWidth: '650px', zIndex: 2 }}>
          <h1 style={{
            fontSize: '96px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-4px',
            lineHeight: 0.9,
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #D9D9D9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Awaaz
          </h1>
          
          <h2 style={{
            fontSize: '32px',
            fontWeight: 300,
            color: 'rgba(255,158,0,0.7)',
            letterSpacing: '3px',
            margin: '0 0 24px'
          }}>
            आवाज़
          </h2>
          
          <p style={{
            fontSize: '28px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 24px',
            lineHeight: 1.3
          }}>
            Giving communities a voice.
          </p>
          
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.8,
            maxWidth: '520px',
            margin: '0 0 48px'
          }}>
            Awaaz aggregates scattered field reports from NGOs and community workers 
            into a live intelligence dashboard — then uses AI to match and dispatch 
            the right volunteers exactly where they are needed.
          </p>
          
          <div style={{ display: 'flex', gap: '40px', margin: '0 0 48px' }}>
            <div>
              <div style={{ fontSize: '36px', color: '#FF9E00', fontWeight: 600, lineHeight: 1 }}>214</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>needs tracked</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', height: '40px' }} />
            <div>
              <div style={{ fontSize: '36px', color: '#C77DFF', fontWeight: 600, lineHeight: 1 }}>47</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>volunteers</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', height: '40px' }} />
            <div>
              <div style={{ fontSize: '36px', color: '#4ade80', fontWeight: 600, lineHeight: 1 }}>89%</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>dispatch rate</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '48px' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #FF9E00 0%, #C77DFF 100%)',
                color: '#FFFFFF',
                height: '56px',
                padding: '0 40px',
                borderRadius: '16px',
                fontSize: '17px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 8px 24px rgba(255,158,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Get Started →
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#FFFFFF',
                height: '56px',
                padding: '0 40px',
                borderRadius: '16px',
                fontSize: '17px',
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
              }}
            >
              See how it works
            </button>
          </div>
        </div>
        
        {/* App Preview Card */}
        <div style={{
          position: 'absolute',
          right: '120px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-2deg)',
          width: '480px',
          background: 'rgba(10,7,4,0.9)',
          border: '1px solid rgba(255,158,0,0.25)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 60px 120px rgba(0,0,0,0.6)',
          animation: 'float 6s ease-in-out infinite'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              background: 'rgba(255,158,0,0.12)', 
              border: '1px solid rgba(255,158,0,0.3)', 
              borderRadius: '12px', 
              padding: '16px', 
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', color: '#FF9E00', fontWeight: 700, marginBottom: '4px' }}>214</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Open Needs</div>
            </div>
            <div style={{ 
              background: 'rgba(199,125,255,0.12)', 
              border: '1px solid rgba(199,125,255,0.3)', 
              borderRadius: '12px', 
              padding: '16px', 
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', color: '#C77DFF', fontWeight: 700, marginBottom: '4px' }}>47</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Volunteers</div>
            </div>
            <div style={{ 
              background: 'rgba(255,158,0,0.12)', 
              border: '1px solid rgba(255,158,0,0.3)', 
              borderRadius: '12px', 
              padding: '16px', 
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', color: '#FF9E00', fontWeight: 700, marginBottom: '4px' }}>38</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Critical</div>
            </div>
            <div style={{ 
              background: 'rgba(74,222,128,0.12)', 
              border: '1px solid rgba(74,222,128,0.3)', 
              borderRadius: '12px', 
              padding: '16px', 
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '24px', color: '#4ade80', fontWeight: 700, marginBottom: '4px' }}>89%</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Success</div>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.06)', 
            borderRadius: '12px', 
            padding: '16px', 
            marginBottom: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', fontWeight: 500 }}>Mumbai Wards Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {[
                { color: 'rgba(255,158,0,0.4)', height: 50 },
                { color: 'rgba(255,158,0,0.4)', height: 45 },
                { color: 'rgba(199,125,255,0.4)', height: 35 },
                { color: 'rgba(199,125,255,0.4)', height: 30 },
                { color: 'rgba(217,217,217,0.25)', height: 25 }
              ].map((ward, i) => (
                <div key={i} style={{
                  height: `${ward.height}px`,
                  background: ward.color,
                  borderRadius: '6px',
                  transition: 'all 0.3s'
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              {['Dharavi', 'Kurla', 'Govandi', 'Mankhurd', 'Bandra'].map((name, i) => (
                <div key={i} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{name}</div>
              ))}
            </div>
          </div>
          
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', fontWeight: 500 }}>Live Feed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.06)', 
              borderRadius: '8px', 
              padding: '12px', 
              fontSize: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,158,0,0.2)'
            }}>
              <span style={{ 
                background: 'rgba(255,158,0,0.2)', 
                color: '#FF9E00', 
                padding: '3px 8px', 
                borderRadius: '6px', 
                marginRight: '8px',
                fontSize: '11px',
                fontWeight: 600
              }}>MEDICAL</span>
              Dharavi - Urgent supplies needed
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.06)', 
              borderRadius: '8px', 
              padding: '12px', 
              fontSize: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(199,125,255,0.2)'
            }}>
              <span style={{ 
                background: 'rgba(199,125,255,0.2)', 
                color: '#C77DFF', 
                padding: '3px 8px', 
                borderRadius: '6px', 
                marginRight: '8px',
                fontSize: '11px',
                fontWeight: 600
              }}>FOOD</span>
              Kurla East - Food distribution
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.06)', 
              borderRadius: '8px', 
              padding: '12px', 
              fontSize: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,158,0,0.2)'
            }}>
              <span style={{ 
                background: 'rgba(255,158,0,0.2)', 
                color: '#FF9E00', 
                padding: '3px 8px', 
                borderRadius: '6px', 
                marginRight: '8px',
                fontSize: '11px',
                fontWeight: 600
              }}>SHELTER</span>
              Govandi - Emergency shelter
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="how-it-works" style={{
        background: 'rgba(10,7,4,0.95)',
        padding: '120px 120px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '48px', 
            color: '#FFFFFF', 
            fontWeight: 600, 
            letterSpacing: '-2px', 
            margin: '0 0 24px',
            lineHeight: 1.1
          }}>
            The problem we solve
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.7)', 
            lineHeight: 1.6, 
            maxWidth: '640px', 
            margin: '0 auto'
          }}>
            Community data is everywhere. The people who need it can not find it.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '80px' }}>
          <div style={{ 
            background: 'rgba(26,26,26,0.8)', 
            border: '1px solid rgba(255,158,0,0.2)', 
            borderRadius: '20px', 
            padding: '40px',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'rgba(255,158,0,0.15)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '24px',
              gap: '6px'
            }}>
              <div style={{ width: '8px', height: '8px', background: '#FF9E00', borderRadius: '50%' }} />
              <div style={{ width: '8px', height: '8px', background: '#FF9E00', borderRadius: '50%' }} />
              <div style={{ width: '8px', height: '8px', background: '#FF9E00', borderRadius: '50%' }} />
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              Data scattered across silos
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
              NGO field reports, WhatsApp messages, paper surveys — valuable data trapped in different places. No one sees the full picture.
            </p>
          </div>
          
          <div style={{ 
            background: 'rgba(26,26,26,0.8)', 
            border: '1px solid rgba(255,158,0,0.2)', 
            borderRadius: '20px', 
            padding: '40px',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'rgba(255,158,0,0.15)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div style={{ width: '100%', height: '2px', background: '#FF9E00', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '4px', height: '10px', background: '#FF9E00', left: '20%', top: '-4px' }} />
                <div style={{ position: 'absolute', width: '4px', height: '14px', background: '#FF9E00', left: '50%', top: '-6px' }} />
                <div style={{ position: 'absolute', width: '4px', height: '8px', background: '#FF9E00', left: '80%', top: '-3px' }} />
              </div>
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              No clear urgency signal
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
              When everything feels urgent, nothing gets prioritized. Communities suffer while coordinators struggle to triage manually.
            </p>
          </div>
          
          <div style={{ 
            background: 'rgba(26,26,26,0.8)', 
            border: '1px solid rgba(255,158,0,0.2)', 
            borderRadius: '20px', 
            padding: '40px',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: 'rgba(199,125,255,0.15)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '24px'
            }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid #C77DFF', borderRadius: '6px', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '14px', height: '2px', background: '#C77DFF', top: '11px', left: '5px', transform: 'rotate(45deg)' }} />
                <div style={{ position: 'absolute', width: '14px', height: '2px', background: '#C77DFF', top: '11px', left: '5px', transform: 'rotate(-45deg)' }} />
              </div>
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              Wrong volunteer, wrong time
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>
              Dispatching volunteers by phone and gut feeling wastes time and burns out people who care. There has to be a smarter way.
            </p>
          </div>
        </div>
      </section>

      {/* How Awaaz Works */}
      <section style={{
        background: 'linear-gradient(135deg, #0A0704 0%, #1A1208 50%, #0F0905 100%)',
        padding: '120px 120px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '48px', 
            color: '#FFFFFF', 
            fontWeight: 600, 
            letterSpacing: '-2px', 
            margin: '0 0 24px',
            lineHeight: 1.1
          }}>
            How Awaaz works
          </h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '100px', position: 'relative', maxWidth: '1200px', margin: '100px auto 0' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            top: '36px',
            left: '80px',
            right: '80px',
            height: '2px',
            background: 'repeating-linear-gradient(90deg, rgba(255,158,0,0.3) 0px, rgba(255,158,0,0.3) 15px, transparent 15px, transparent 30px)',
            zIndex: 0
          }} />
          
          <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(255,158,0,0.15)',
              border: '2px solid rgba(255,158,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
              color: '#FF9E00',
              fontWeight: 700
            }}>
              01
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              Community voices in
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, maxWidth: '240px' }}>
              Field workers submit reports in any language — English, Marathi, Hindi. Photos, text, voice notes.
            </p>
          </div>
          
          <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(199,125,255,0.15)',
              border: '2px solid rgba(199,125,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
              color: '#C77DFF',
              fontWeight: 700
            }}>
              02
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              AI extracts what matters
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, maxWidth: '240px' }}>
              Gemini AI reads every report, detects category and urgency, clusters nearby needs, and surfaces the most critical situations.
            </p>
          </div>
          
          <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(255,158,0,0.15)',
              border: '2px solid rgba(255,158,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
              color: '#FF9E00',
              fontWeight: 700
            }}>
              03
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              Live intelligence dashboard
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, maxWidth: '240px' }}>
              Coordinators see a real-time map of community needs, ward-by-ward breakdowns, and trend analytics.
            </p>
          </div>
          
          <div style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(74,222,128,0.15)',
              border: '2px solid rgba(74,222,128,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
              color: '#4ade80',
              fontWeight: 700
            }}>
              04
            </div>
            <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px' }}>
              Right person, right place
            </h3>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0, maxWidth: '240px' }}>
              AI matches volunteers by skill, proximity, availability, and reliability. One click dispatches with explainable scoring.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        background: 'rgba(10,7,4,0.95)',
        padding: '120px 120px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '48px', 
            color: '#FFFFFF', 
            fontWeight: 600, 
            letterSpacing: '-2px', 
            margin: '0 0 24px',
            lineHeight: 1.1
          }}>
            Features
          </h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '80px' }}>
          {[
            { 
              icon: <Globe size={40} color="#FF9E00" />, 
              title: 'Multilingual reports', 
              desc: 'Marathi/Hindi/English auto-detect + translate',
              color: '#FF9E00'
            },
            { 
              icon: <Cloud size={40} color="#4ade80" />, 
              title: 'Weather-aware urgency', 
              desc: 'OpenWeatherMap integration',
              color: '#4ade80'
            },
            { 
              icon: <Bot size={40} color="#C77DFF" />, 
              title: 'Explainable AI matching', 
              desc: 'XAI breakdown showing why a volunteer was chosen',
              color: '#C77DFF'
            },
            { 
              icon: <Radio size={40} color="#FF9E00" />, 
              title: 'Real-time dispatch tracking', 
              desc: 'Live status updates via WebSocket',
              color: '#FF9E00'
            },
            { 
              icon: <BarChart3 size={40} color="#4ade80" />, 
              title: 'Ward analytics', 
              desc: '7-day trends, category breakdowns, response times',
              color: '#4ade80'
            },
            { 
              icon: <Smartphone size={40} color="#C77DFF" />, 
              title: 'Offline-ready PWA', 
              desc: 'Works on low-connectivity mobile networks',
              color: '#C77DFF'
            }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(26,26,26,0.8)',
              border: `1px solid ${feature.color}25`,
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s',
              height: '100%'
            }}>
              <div style={{ 
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px'
              }}>{feature.icon}</div>
              <div style={{ padding: '0 20px' }}>
                <h3 style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: 600, margin: '0 0 16px 0', textAlign: 'center' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" style={{
        background: 'linear-gradient(135deg, #0A0704 0%, #1A1208 50%, #0F0905 100%)',
        padding: '120px 120px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '48px', 
            color: '#FFFFFF', 
            fontWeight: 600, 
            letterSpacing: '-2px', 
            margin: '0 0 24px',
            lineHeight: 1.1
          }}>
            Impact in numbers
          </h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '80px', marginTop: '80px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', color: '#FF9E00', fontWeight: 700, marginBottom: '12px', lineHeight: 1 }}>214</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open needs tracked</div>
          </div>
          <div style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', color: '#C77DFF', fontWeight: 700, marginBottom: '12px', lineHeight: 1 }}>5</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mumbai wards</div>
          </div>
          <div style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', color: '#4ade80', fontWeight: 700, marginBottom: '12px', lineHeight: 1 }}>47</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Volunteers</div>
          </div>
          <div style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', color: '#FF9E00', fontWeight: 700, marginBottom: '12px', lineHeight: 1 }}>89%</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Dispatch success</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{
        background: 'rgba(10,7,4,0.95)',
        padding: '120px 120px',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '48px', 
            color: '#FFFFFF', 
            fontWeight: 600, 
            letterSpacing: '-2px', 
            margin: '0 0 32px',
            lineHeight: 1.1
          }}>
            Built for Mumbai, designed for every city
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.7)', 
            lineHeight: 1.8, 
            maxWidth: '800px', 
            margin: '0 auto 48px'
          }}>
            Awaaz was built for the Google Solution Challenge 2025. 
            We started with a simple question: why do communities with real needs 
            struggle to connect with people who genuinely want to help? 
            The answer was data fragmentation. Awaaz is our solution — 
            and we are building it to scale beyond Mumbai to every underserved 
            urban community in India.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '48px' }}>
            {['React', 'FastAPI', 'SQLite', 'Gemini AI', 'OpenStreetMap', 'OpenWeatherMap', 'Google Translate'].map(tech => (
              <span key={tech} style={{
                background: 'rgba(255,158,0,0.1)',
                border: '1px solid rgba(255,158,0,0.3)',
                color: '#FF9E00',
                borderRadius: '25px',
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 500
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'rgba(5,3,2,0.98)',
        padding: '64px 120px',
        borderTop: '1px solid rgba(255,158,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '24px', color: '#FFFFFF', fontWeight: 600, marginBottom: '4px' }}>Awaaz · आवाज़</div>
            <div style={{ fontSize: '16px', color: '#FFFFFF' }}>Community Intelligence Platform</div>
          </div>
          
          <div style={{ display: 'flex', gap: '48px' }}>
            <a href="#features" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '15px' }}>Features</a>
            <a href="#how-it-works" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '15px' }}>How it works</a>
            <a href="https://github.com/agniv-dutta/Awaaz" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '15px' }}>GitHub</a>
            <a href="#about" style={{ color: '#FFFFFF', textDecoration: 'none', fontSize: '15px' }}>About</a>
          </div>
          
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            © 2026 Awaaz · Google Solution Challenge
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: rotate(-2deg) translateY(0);
          }
          50% {
            transform: rotate(-2deg) translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.8);
          }
        }
        
        section:hover > div > div {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  )
}
