import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"

export function Login() {
  const [email, setEmail] = useState("admin@awaaz.org")
  const [password, setPassword] = useState("password")
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login("mock_token_123", { id: "1", email, name: "Admin", phone: "123", role: "admin", ward_id: null, is_active: true })
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center mb-4">
          <span className="font-bold text-charcoal text-2xl leading-none">A</span>
        </div>
        <h1 className="text-3xl font-bold text-silver tracking-tight">Awaaz</h1>
      </div>
      
      <Card className="w-full max-w-sm p-6">
        <h2 className="text-lg font-medium text-silver mb-6 text-center">Login to your account</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-silver-muted mb-1 block">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-silver-muted mb-1 block">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full mt-4">Sign In</Button>
        </form>
      </Card>
    </div>
  )
}
