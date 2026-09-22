const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`

    try {
      const body = await response.json()

      if (body?.error) {
        message = body.error
      }
    } catch {
      // The body was not JSON.
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listPaddles = () => request('/api/paddles')

export const getPaddle = (id) => request(`/api/paddles/${id}`)

export const listPlayers = () => request('/api/players')

export const getPlayer = (id) => request(`/api/players/${id}`)