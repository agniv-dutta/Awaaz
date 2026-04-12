import { api } from './api'
import type { Dispatch } from '../types'

export const getDispatches = async (): Promise<Dispatch[]> => {
  const { data } = await api.get('/dispatches')
  return data
}
