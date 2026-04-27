import { useEffect } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { BackgroundLayer } from './components/layout/BackgroundLayer'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { useAuthStore } from './store/authStore'

import { fetchMumbaiWards } from './services/wardData'
import { useMapStore } from './store/mapStore'

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const NeedsMap = lazy(() => import('./pages/NeedsMap').then((m) => ({ default: m.NeedsMap })))
const Reports = lazy(() => import('./pages/Reports').then((m) => ({ default: m.Reports })))
const Volunteers = lazy(() => import('./pages/Volunteers'))
const Dispatch = lazy(() => import('./pages/Dispatch').then((m) => ({ default: m.Dispatch })))
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })))
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))
const Register = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.Register })))

function RouteLoadingFallback() {
  return (
    <div style={{
      position: 'relative',
      zIndex: 2,
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: 'min(92vw, 360px)',
        borderRadius: '18px',
        border: '1px solid rgba(255, 158, 0, 0.18)',
        background: 'linear-gradient(180deg, rgba(26,26,26,0.92), rgba(15,10,5,0.96))',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.28)',
        padding: '22px 20px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF9E00', animation: 'pulse-dot 1s ease infinite' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#C77DFF', animation: 'pulse-dot 1s ease 0.15s infinite' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D9D9D9', animation: 'pulse-dot 1s ease 0.3s infinite' }} />
        </div>
        <div style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500 }}>Loading Awaaz</div>
        <div style={{ fontSize: '13px', color: 'rgba(217,217,217,0.72)', marginTop: '6px', lineHeight: 1.5 }}>
          Preparing the live coordination workspace.
        </div>
      </div>
    </div>
  )
}

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/map': 'Needs Map',
  '/reports': 'Reports',
  '/volunteers': 'Volunteers',
  '/dispatch': 'Dispatch',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
}

function AppShell() {
  const location = useLocation()
  const title = ROUTE_TITLES[location.pathname] ?? 'Awaaz'

  return (
    <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar title={title} />
        <Outlet />
      </div>
    </div>
  )
}

function AuthGuard() {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/" replace />
  return <AppShell />
}

export function App() {
  const setWards = useMapStore((state) => state.setWards)
  const { loadFromStorage } = useAuthStore()

  useEffect(() => {
    fetchMumbaiWards()
      .then((wards) => setWards(wards))
      .catch(() => {})
    
    loadFromStorage()
  }, [setWards, loadFromStorage])

  return (
    <BrowserRouter>
      {/* Global background: gradient + concentric circles — rendered once */}
      <BackgroundLayer />

      <Suspense
        fallback={
          <RouteLoadingFallback />
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<NeedsMap />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
