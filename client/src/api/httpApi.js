const BASE = import.meta.env.VITE_API_BASE_URL || ''

let authHeader = null

function getAuthHeader() {
  if (authHeader) {
    return authHeader
  }

  const username = window.prompt('PaddleMatch username:')
  if (username === null) {
    throw new Error('Authentication cancelled')
  }

  const password = window.prompt('PaddleMatch password:')
  if (password === null) {
    throw new Error('Authentication cancelled')
  }

  authHeader = `Basic ${btoa(`${username}:${password}`)}`

  return authHeader
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`

    try {
      const body = await response.json()

      if (body?.error) {
        message = body.error
      }
    } catch { }

    // Clear credentials if the server rejected them.
    if (response.status === 401) {
      authHeader = null
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listPaddles = () => request('/api/paddles')
export const getPaddle = (id) => request(`/api/paddles/${id}`)
export const listPlayers = () => request('/api/players')
export const getPlayer = (id) => request(`/api/players/${id}`)