import { API_BASE_URL } from '@/lib/constants'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${API_BASE_URL}${path}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.status} for ${path}`)
  }

  return response.json() as Promise<T>
}
