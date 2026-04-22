import { api } from './api'
import type { Need } from '../types'

const WARD_NAMES: Record<string, string> = {
  '1': 'Dharavi',
  '2': 'Kurla East',
  '3': 'Govandi',
  '4': 'Mankhurd',
  '5': 'Bandra West',
}

export const getNeeds = async (): Promise<Need[]> => {
  const { data } = await api.get('/needs')
  return (Array.isArray(data) ? data : []).map((need: any) => ({
    ...need,
    ward_name: need?.ward?.name || WARD_NAMES[String(need.ward_id)] || 'Mumbai Ward',
  }))
}
