import { http, HttpResponse, delay } from 'msw'
import { wards } from './data/wards'
import { volunteers } from './data/volunteers'
import { needs } from './data/needs'
import { dispatches } from './data/dispatches'

export const handlers = [
  http.get('/api/v1/needs', async () => {
    await delay(200)
    return HttpResponse.json(needs)
  }),
  http.get('/api/v1/volunteers', async () => {
    await delay(200)
    return HttpResponse.json(volunteers)
  }),
  http.get('/api/v1/wards', async () => {
    await delay(200)
    return HttpResponse.json(wards)
  }),
  http.get('/api/v1/dispatches', async () => {
    await delay(200)
    return HttpResponse.json(dispatches)
  }),
  http.post('/api/v1/auth/login', async () => {
    await delay(200)
    return HttpResponse.json({ access_token: "mock_jwt_token", token_type: "bearer" })
  }),
  http.get('/api/v1/analytics/summary', async () => {
    await delay(200)
    return HttpResponse.json({
      total_needs: 40,
      open_needs: needs.filter(n => n.status === 'OPEN').length,
      fulfilled_needs: needs.filter(n => n.status === 'FULFILLED').length,
      active_volunteers: 20,
      completed_dispatches: dispatches.filter(d => d.status === 'COMPLETED').length
    })
  })
]
