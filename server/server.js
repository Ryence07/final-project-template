import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import { promisify } from 'util'

import { pool } from './db/pool.js'
import * as paddles from './paddlesRepo.js'
import * as players from './playersRepo.js'

const app = express()

const scryptAsync = promisify(crypto.scrypt)

const SESSION_DAYS = 7

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
  })
)

app.use(express.json({ limit: '100kb' }))

function parseId(value) {
  const id = Number(value)

  if (!Number.isInteger(id) || id <= 0) {
    return null
  }

  return id
}

function createToken() {
  return crypto.randomBytes(32).toString('hex')
}

function hashToken(token) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
}

async function verifyPassword(password, storedHash) {
  const [saltHex, keyHex] = String(storedHash).split(':')

  if (!saltHex || !keyHex) {
    return false
  }

  const salt = Buffer.from(saltHex, 'hex')
  const storedKey = Buffer.from(keyHex, 'hex')

  const derivedKey = await scryptAsync(password, salt, storedKey.length)

  return crypto.timingSafeEqual(derivedKey, storedKey)
}

async function createPasswordHash(password) {
  const salt = crypto.randomBytes(16)

  const derivedKey = await scryptAsync(
    password,
    salt,
    64
  )

  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
}


// =========================
// AUTH MIDDLEWARE
// =========================

async function requireAuth(request, response, next) {
  try {
    const authorization = request.headers.authorization

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return response.status(401).json({
        error: 'Authentication required',
      })
    }

    const token = authorization.slice(7).trim()

    if (!token) {
      return response.status(401).json({
        error: 'Authentication required',
      })
    }

    const tokenHash = hashToken(token)

    const result = await pool.query(
      `
      SELECT
        s.id AS session_id,
        s.player_id,
        s.expires_at,
        p.username,
        p.name,
        p.skill_level,
        p.playing_style,
        p.availability,
        p.wins,
        p.losses,
        p.points
      FROM sessions s
      JOIN players p
        ON p.id = s.player_id
      WHERE s.token_hash = $1
        AND s.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
      `,
      [tokenHash]
    )

    if (result.rows.length === 0) {
      return response.status(401).json({
        error: 'Invalid or expired session',
      })
    }

    request.user = result.rows[0]

    next()
  } catch (error) {
    next(error)
  }
}


// =========================
// HEALTH
// =========================

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')

    response.json({
      ok: true,
      db: 'up',
    })
  } catch (error) {
    console.error('readyz failed:', error.message)

    response.status(503).json({
      ok: false,
      db: 'down',
    })
  }
})


// =========================
// AUTH ROUTES
// =========================

app.post('/api/auth/login', async (request, response, next) => {
  try {
    const username =
      typeof request.body.username === 'string'
        ? request.body.username.trim().toLowerCase()
        : ''

    const password =
      typeof request.body.password === 'string'
        ? request.body.password
        : ''

    if (!username || !password) {
      return response.status(400).json({
        error: 'Username and password are required',
      })
    }

    const result = await pool.query(
      `
      SELECT *
      FROM players
      WHERE username = $1
      LIMIT 1
      `,
      [username]
    )

    if (result.rows.length === 0) {
      return response.status(401).json({
        error: 'Invalid username or password',
      })
    }

    const player = result.rows[0]

    const validPassword = await verifyPassword(
      password,
      player.password_hash
    )

    if (!validPassword) {
      return response.status(401).json({
        error: 'Invalid username or password',
      })
    }

    const token = createToken()
    const tokenHash = hashToken(token)

    await pool.query(
      `
      INSERT INTO sessions (
        player_id,
        token_hash,
        expires_at
      )
      VALUES (
        $1,
        $2,
        CURRENT_TIMESTAMP + INTERVAL '7 days'
      )
      `,
      [player.id, tokenHash]
    )

    response.json({
      token,
      player: {
        id: player.id,
        username: player.username,
        name: player.name,
        skillLevel: player.skill_level,
        playingStyle: player.playing_style,
        availability: player.availability,
        wins: player.wins,
        losses: player.losses,
        points: player.points,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Register a new player account
app.post('/api/auth/register', async (request, response, next) => {
  try {
    const {
      name,
      username,
      password,
      skillLevel,
      playingStyle,
      availability,
    } = request.body

    const cleanName =
      typeof name === 'string'
        ? name.trim()
        : ''

    const cleanUsername =
      typeof username === 'string'
        ? username.trim().toLowerCase()
        : ''

    const cleanPassword =
      typeof password === 'string'
        ? password
        : ''

    if (
      !cleanName ||
      !cleanUsername ||
      !cleanPassword ||
      !skillLevel ||
      !playingStyle ||
      !availability
    ) {
      return response.status(400).json({
        error: 'All fields are required',
      })
    }

    if (
      cleanName.length < 2 ||
      cleanName.length > 100
    ) {
      return response.status(400).json({
        error:
          'Name must be between 2 and 100 characters',
      })
    }

    if (
      !/^[a-zA-Z0-9_]{3,30}$/.test(
        cleanUsername
      )
    ) {
      return response.status(400).json({
        error:
          'Username must be 3-30 characters and use only letters, numbers, or underscores',
      })
    }

    if (cleanPassword.length < 8) {
      return response.status(400).json({
        error:
          'Password must be at least 8 characters',
      })
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM players
      WHERE username = $1
      LIMIT 1
      `,
      [cleanUsername]
    )

    if (existingUser.rows.length > 0) {
      return response.status(409).json({
        error: 'Username is already taken',
      })
    }

    const passwordHash =
      await createPasswordHash(cleanPassword)

    const result = await pool.query(
      `
      INSERT INTO players (
        username,
        password_hash,
        name,
        skill_level,
        playing_style,
        availability,
        wins,
        losses,
        points
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        0,
        0,
        0
      )
      RETURNING
        id,
        username,
        name,
        skill_level,
        playing_style,
        availability,
        wins,
        losses,
        points
      `,
      [
        cleanUsername,
        passwordHash,
        cleanName,
        skillLevel,
        playingStyle,
        availability,
      ]
    )

    response.status(201).json({
      message: 'Account created successfully',
      player: result.rows[0],
    })
  } catch (error) {
    // Prevent duplicate usernames if two
    // registrations happen at the same time.
    if (error.code === '23505') {
      return response.status(409).json({
        error: 'Username is already taken',
      })
    }

    next(error)
  }
})

app.get('/api/auth/me', requireAuth, (request, response) => {
  response.json({
    id: request.user.player_id,
    username: request.user.username,
    name: request.user.name,
    skillLevel: request.user.skill_level,
    playingStyle: request.user.playing_style,
    availability: request.user.availability,
    wins: request.user.wins,
    losses: request.user.losses,
    points: request.user.points,
  })
})

app.post('/api/auth/logout', requireAuth, async (request, response, next) => {
  try {
    const authorization = request.headers.authorization
    const token = authorization.slice(7).trim()
    const tokenHash = hashToken(token)

    await pool.query(
      `
      DELETE FROM sessions
      WHERE token_hash = $1
      `,
      [tokenHash]
    )

    response.status(204).send()
  } catch (error) {
    next(error)
  }
})


// Everything below this point requires a logged-in player.
app.use(requireAuth)


// =========================
// PADDLE ROUTES
// =========================

app.get('/api/paddles', async (request, response, next) => {
  try {
    response.json(await paddles.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/paddles/:id', async (request, response, next) => {
  try {
    const id = parseId(request.params.id)

    if (id === null) {
      return response.status(400).json({
        error: 'Invalid paddle ID',
      })
    }

    const row = await paddles.getById(pool, id)

    if (!row) {
      return response.status(404).json({
        error: 'Paddle not found',
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})


// =========================
// PLAYER ROUTES
// =========================

app.get('/api/players', async (request, response, next) => {
  try {
    response.json(await players.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/players/:id', async (request, response, next) => {
  try {
    const id = parseId(request.params.id)

    if (id === null) {
      return response.status(400).json({
        error: 'Invalid player ID',
      })
    }

    const row = await players.getById(pool, id)

    if (!row) {
      return response.status(404).json({
        error: 'Player not found',
      })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})


// =========================
// MATCH ROUTES
// =========================

// Send match request
app.post('/api/matches', async (request, response, next) => {
  try {
    const requesterId = request.user.player_id
    const opponentId = parseId(request.body.opponent_id)

    if (opponentId === null) {
      return response.status(400).json({
        error: 'Invalid opponent ID',
      })
    }

    if (requesterId === opponentId) {
      return response.status(400).json({
        error: 'A player cannot send a match request to themselves',
      })
    }

    const opponent = await players.getById(
      pool,
      opponentId
    )

    if (!opponent) {
      return response.status(404).json({
        error: 'Player not found',
      })
    }

    const existingMatch = await pool.query(
      `
  SELECT id
  FROM matches
  WHERE (
    (
      requester_id = $1
      AND opponent_id = $2
    )
    OR
    (
      requester_id = $2
      AND opponent_id = $1
    )
  )
  AND status IN ('pending', 'accepted')
  LIMIT 1
  `,
      [requesterId, opponentId]
    )

    if (existingMatch.rows.length > 0) {
      return response.status(409).json({
        error: 'A match request already exists',
      })
    }

    const result = await pool.query(
      `
      INSERT INTO matches (
        requester_id,
        opponent_id
      )
      VALUES ($1, $2)
      RETURNING *
      `,
      [requesterId, opponentId]
    )

    response.status(201).json(result.rows[0])
  } catch (error) {
    next(error)
  }
})


// Get only matches involving logged-in player
app.get('/api/matches', async (request, response, next) => {
  try {
    const playerId = request.user.player_id

    const result = await pool.query(
      `
      SELECT
        m.id,
        m.status,
        m.winner_id,
        m.created_at,

        m.requester_id,
        requester.name AS requester_name,

        m.opponent_id,
        opponent.name AS opponent_name

      FROM matches m

      JOIN players requester
        ON requester.id = m.requester_id

      JOIN players opponent
        ON opponent.id = m.opponent_id

      WHERE
        m.requester_id = $1
        OR m.opponent_id = $1

      ORDER BY m.created_at DESC
      `,
      [playerId]
    )

    response.json(result.rows)
  } catch (error) {
    next(error)
  }
})


// Accept request
app.patch('/api/matches/:id/accept', async (request, response, next) => {
  try {
    const id = parseId(request.params.id)
    const playerId = request.user.player_id

    if (id === null) {
      return response.status(400).json({
        error: 'Invalid match ID',
      })
    }

    const result = await pool.query(
      `
      UPDATE matches
      SET status = 'accepted'

      WHERE id = $1
        AND opponent_id = $2
        AND status = 'pending'

      RETURNING *
      `,
      [id, playerId]
    )

    if (result.rows.length === 0) {
      return response.status(404).json({
        error: 'Pending match request not found',
      })
    }

    response.json(result.rows[0])
  } catch (error) {
    next(error)
  }
})


// Record result
app.patch('/api/matches/:id/result', async (request, response, next) => {
  const client = await pool.connect()

  try {
    const id = parseId(request.params.id)
    const winnerId = parseId(request.body.winner_id)
    const currentPlayerId = request.user.player_id

    if (id === null || winnerId === null) {
      return response.status(400).json({
        error: 'Invalid match ID or winner ID',
      })
    }

    await client.query('BEGIN')

    const matchResult = await client.query(
      `
      SELECT *
      FROM matches
      WHERE id = $1
        AND status = 'accepted'
        AND (
          requester_id = $2
          OR opponent_id = $2
        )
      FOR UPDATE
      `,
      [id, currentPlayerId]
    )

    if (matchResult.rows.length === 0) {
      await client.query('ROLLBACK')

      return response.status(404).json({
        error: 'Accepted match not found',
      })
    }

    const match = matchResult.rows[0]

    if (
      winnerId !== match.requester_id &&
      winnerId !== match.opponent_id
    ) {
      await client.query('ROLLBACK')

      return response.status(400).json({
        error: 'Winner must be one of the players in the match',
      })
    }

    const loserId =
      winnerId === match.requester_id
        ? match.opponent_id
        : match.requester_id

    await client.query(
      `
      UPDATE players
      SET
        wins = wins + 1,
        points = points + 3
      WHERE id = $1
      `,
      [winnerId]
    )

    await client.query(
      `
      UPDATE players
      SET losses = losses + 1
      WHERE id = $1
      `,
      [loserId]
    )

    const updatedMatch = await client.query(
      `
      UPDATE matches
      SET
        status = 'completed',
        winner_id = $1
      WHERE id = $2
      RETURNING *
      `,
      [winnerId, id]
    )

    await client.query('COMMIT')

    response.json(updatedMatch.rows[0])
  } catch (error) {
    await client.query('ROLLBACK')
    next(error)
  } finally {
    client.release()
  }
})


// =========================
// 404
// =========================

app.use((request, response) => {
  response.status(404).json({
    error: 'No such route',
  })
})


// =========================
// ERROR HANDLER
// =========================

app.use((error, request, response, next) => {
  console.error(error)

  response.status(500).json({
    error: 'Something went wrong on the server',
  })
})


// =========================
// START
// =========================

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(
    `API listening on http://localhost:${port}`
  )

  console.log(
    `CORS allows: ${allowedOrigins.join(', ')}`
  )
})