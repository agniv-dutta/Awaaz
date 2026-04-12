import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { BackgroundLayer } from './components/layout/BackgroundLayer'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { useAuthStore } from './store/authStore'

import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { NeedsMap } from './pages/NeedsMap'
import { Reports } from './pages/Reports'
import { Volunteers } from './pages/Volunteers'
import { Dispatch } from './pages/Dispatch'
import { Analytics } from './pages/Analytics'
import { Profile } from './pages/Profile'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
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
  if (!token) return <Navigate to="/login" replace />
  return <AppShell />
}

export function App() {
  return (
    <BrowserRouter>
      {/* Global background: gradient + concentric circles — rendered once */}
      <BackgroundLayer />

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<AuthGuard />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<NeedsMap />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
