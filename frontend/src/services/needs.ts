import { api } from './api'
import type { Need } from '../types'

export const getNeeds = async (): Promise<Need[]> => {
  const { data } = await api.get('/needs')
  return data
}
