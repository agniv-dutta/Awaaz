import { useQuery } from '@tanstack/react-query'
import { getDispatches } from '../services/dispatch'

export const useDispatch = () => {
  return useQuery({
    queryKey: ['dispatches'],
    queryFn: getDispatches
  })
}
