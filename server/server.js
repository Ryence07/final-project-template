import cors from 'cors'
import express from 'express'
import { pool } from './db/pool.js'
import * as paddles from './paddlesRepo.js'
import * as players from './playersRepo.js'

const app = express()

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Is the process alive?
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Is the database reachable?
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

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
    const row = await paddles.getById(pool, request.params.id)

    if (!row) {
      return response.status(404).json({ error: 'Paddle not found' })
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
    const row = await players.getById(pool, request.params.id)

    if (!row) {
      return response.status(404).json({ error: 'Player not found' })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// =========================
// 404 HANDLER
// =========================

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

// =========================
// ERROR HANDLER
// =========================

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

// =========================
// START SERVER
// =========================

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})