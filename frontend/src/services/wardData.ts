import type { Ward } from '../types'

export const MOCK_WARDS: Ward[] = [
  { id: '1', name: 'Dharavi' },
  { id: '2', name: 'Kurla East' },
  { id: '3', name: 'Govandi' },
  { id: '4', name: 'Mankhurd' },
  { id: '5', name: 'Bandra West' },
]

export async function fetchMumbaiWards(): Promise<Ward[]> {
  const key = (import.meta.env.VITE_DATA_GOV_KEY || '').trim()
  if (!key) {
    return MOCK_WARDS
  }

  try {
    const res = await fetch(
      `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${key}&format=json&filters[state]=Maharashtra&limit=50`
    )
    if (!res.ok) {
      throw new Error('data.gov request failed')
    }
    const data = await res.json()
    const records = Array.isArray(data?.records) ? data.records : []
    const wards = records
      .filter((r: any) => r?.ward_name)
      .map((r: any) => ({
        id: String(r.lgd_code || r.ward_no || r.ward_name),
        name: String(r.ward_name),
      }))

    return wards.length > 0 ? wards : MOCK_WARDS
  } catch {
    return MOCK_WARDS
  }
}
