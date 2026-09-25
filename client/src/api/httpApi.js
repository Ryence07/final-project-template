const BASE = import.meta.env.VITE_API_BASE_URL || ''

const TOKEN_KEY = 'paddlematch_token'

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

async function request(
  path,
  options = {},
  requiresAuth = true
) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (requiresAuth) {
    const token = getToken()

    if (!token) {
      throw new Error('You are not logged in')
    }

    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`

    try {
      const body = await response.json()

      if (body?.error) {
        message = body.error
      }
    } catch { }

    if (response.status === 401) {
      clearToken()
    }

    throw new Error(message)
  }

  return response.status === 204
    ? null
    : response.json()
}


// =========================
// AUTH API
// =========================

export const login = async (
  username,
  password
) => {
  const data = await request(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    },
    false
  )

  saveToken(data.token)

  return data
}


// Register a new player account
export const register = async ({
  name,
  username,
  password,
  skillLevel,
  playingStyle,
  availability,
}) => {
  return request(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({
        name,
        username,
        password,
        skillLevel,
        playingStyle,
        availability,
      }),
    },
    false
  )
}


export const getCurrentPlayer = () =>
  request('/api/auth/me')


export const logout = async () => {
  try {
    await request(
      '/api/auth/logout',
      {
        method: 'POST',
      }
    )
  } finally {
    clearToken()
  }
}


export const isLoggedIn = () =>
  Boolean(getToken())


// =========================
// PADDLE API
// =========================

export const listPaddles = () =>
  request('/api/paddles')

export const getPaddle = (id) =>
  request(`/api/paddles/${id}`)


// =========================
// PLAYER API
// =========================

export const listPlayers = () =>
  request('/api/players')

export const getPlayer = (id) =>
  request(`/api/players/${id}`)


// =========================
// MATCH API
// =========================

export const sendMatchRequest = (
  opponentId
) =>
  request('/api/matches', {
    method: 'POST',
    body: JSON.stringify({
      opponent_id: opponentId,
    }),
  })


export const listMatches = () =>
  request('/api/matches')


export const acceptMatch = (
  matchId
) =>
  request(
    `/api/matches/${matchId}/accept`,
    {
      method: 'PATCH',
    }
  )


export const recordMatchResult = (
  matchId,
  winnerId
) =>
  request(
    `/api/matches/${matchId}/result`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        winner_id: winnerId,
      }),
    }
  )