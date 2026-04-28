import { create } from 'zustand'

export interface MockUser {
  name: string
  role: string
  email: string
  ward: string
}

interface MockUserStore {
  user: MockUser
  isLoading: boolean
  setUser: (user: MockUser) => void
  logout: () => void
}

export const mockUser = {
  name: "Demo User",
  role: "ngo_coordinator",
  email: "demo@awaaz.dev",
  ward: "Dharavi"
}

export const useMockUserStore = create<MockUserStore>((set) => ({
  user: mockUser,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: mockUser })
}))
