import { api } from './api'
import type { Volunteer } from '../types'

export const getVolunteers = async (): Promise<Volunteer[]> => {
  const { data } = await api.get('/volunteers')
  return data
}
