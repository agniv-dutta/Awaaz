import { create } from 'zustand'
import type { User } from '../types'
import { authApi } from '../services/auth'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string, phone: string) => Promise<void>
  logout: () => void
  loadFromStorage: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await authApi.login(email, password)
      const { access_token, user } = response
      localStorage.setItem('token', access_token)
      set({ token: access_token, user, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (name: string, email: string, password: string, role: string, phone: string) => {
    set({ isLoading: true })
    try {
      const response = await authApi.register({ name, email, password, role, phone, ward_id: null })
      const { access_token, user } = response
      localStorage.setItem('token', access_token)
      set({ token: access_token, user, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  loadFromStorage: async () => {
    const token = localStorage.getItem('token')
    if (token) {
      set({ token, isLoading: true })
      try {
        const user = await authApi.getCurrentUser()
        set({ user, isLoading: false })
      } catch (error) {
        localStorage.removeItem('token')
        set({ token: null, user: null, isLoading: false })
      }
    }
  },
}))
