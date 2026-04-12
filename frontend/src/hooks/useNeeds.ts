import { useQuery } from '@tanstack/react-query'
import { getNeeds } from '../services/needs'

export const useNeeds = () => {
  return useQuery({
    queryKey: ['needs'],
    queryFn: getNeeds
  })
}
