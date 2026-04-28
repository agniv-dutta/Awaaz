import { api } from './api'

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    name: string
    role: string
    phone: string
    is_active: boolean
    ward_id: string | null
  }
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: string
  phone: string
  ward_id?: string | null
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('🔑 AUTH API LOGIN ATTEMPT:', email)
    console.log('🔑 API BASE URL:', import.meta.env.VITE_API_BASE_URL)
    
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    try {
      console.log('🔑 SENDING LOGIN REQUEST...')
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('🔑 LOGIN RESPONSE:', response.status, response.data)
      return response.data
    } catch (error: any) {
      console.error('🔑 LOGIN ERROR:', error)
      console.error('🔑 ERROR STATUS:', error.response?.status)
      console.error('🔑 ERROR DATA:', error.response?.data)
      console.error('🔑 ERROR MESSAGE:', error.message)
      throw error
    }
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    console.log('📝 AUTH API REGISTER ATTEMPT:', data.email)
    
    try {
      const response = await api.post('/auth/register', data)
      console.log('📝 REGISTER RESPONSE:', response.status, response.data)
      return response.data
    } catch (error: any) {
      console.error('📝 REGISTER ERROR:', error)
      console.error('📝 ERROR STATUS:', error.response?.status)
      console.error('📝 ERROR DATA:', error.response?.data)
      throw error
    }
  },

  getCurrentUser: async () => {
    console.log('👤 GET CURRENT USER...')
    
    try {
      const response = await api.get('/auth/me')
      console.log('👤 CURRENT USER RESPONSE:', response.data)
      return response.data
    } catch (error: any) {
      console.error('👤 GET USER ERROR:', error)
      console.error('👤 ERROR STATUS:', error.response?.status)
      throw error
    }
  },

  healthCheck: async () => {
    console.log('🏥 BACKEND HEALTH CHECK...')
    
    try {
      const response = await api.get('/health')
      console.log('🏥 HEALTH CHECK RESPONSE:', response.status, response.data)
      return response.data
    } catch (error: any) {
      console.error('🏥 HEALTH CHECK ERROR:', error)
      console.error('🏥 ERROR STATUS:', error.response?.status)
      console.error('🏥 ERROR MESSAGE:', error.message)
      throw error
    }
  }
}
