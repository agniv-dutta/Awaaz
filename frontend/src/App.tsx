import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Sidebar } from "./components/layout/Sidebar"
import { TopBar } from "./components/layout/TopBar"
import { useAuthStore } from "./store/authStore"

import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { NeedsMap } from "./pages/NeedsMap"
import { Reports } from "./pages/Reports"
import { Volunteers } from "./pages/Volunteers"
import { Dispatch } from "./pages/Dispatch"
import { Analytics } from "./pages/Analytics"
import { Profile } from "./pages/Profile"

function AuthGuard() {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return (
    <div className="flex h-screen w-full bg-charcoal overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar title="Awaaz Platform" />
        <Outlet />
      </div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
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
