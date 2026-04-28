import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Log the actual API URL being used
console.log('🌐 API BASE URL SET TO:', import.meta.env.VITE_API_BASE_URL || '/api/v1')

// Request interceptor to add JWT token (optional for demo)
api.interceptors.request.use((config) => {
  console.log('🌐 API REQUEST:', config.method?.toUpperCase(), config.url)
  console.log('🌐 BASE URL:', config.baseURL)
  console.log('🌐 HEADERS:', config.headers)
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('🌐 TOKEN ADDED TO REQUEST')
  } else {
    console.log('🌐 NO TOKEN - DEMO MODE')
  }
  
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('🌐 API RESPONSE:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('🌐 API ERROR:', error)
    console.error('🌐 ERROR STATUS:', error.response?.status)
    console.error('🌐 ERROR URL:', error.config?.url)
    console.error('🌐 ERROR DATA:', error.response?.data)
    
    if (error.response?.status === 401) {
      console.log('🌐 401 ERROR - LOGGING OUT')
      // Token expired or invalid - logout user
      localStorage.removeItem('token')
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)
