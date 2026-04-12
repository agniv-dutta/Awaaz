import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/summary')
      return data
    }
  })
}
