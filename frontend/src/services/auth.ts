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
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}
