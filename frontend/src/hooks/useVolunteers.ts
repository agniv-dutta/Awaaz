import { useQuery } from '@tanstack/react-query'
import { getVolunteers } from '../services/volunteers'

export const useVolunteers = () => {
  return useQuery({
    queryKey: ['volunteers'],
    queryFn: getVolunteers
  })
}
