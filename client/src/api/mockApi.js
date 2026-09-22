import { paddles } from '../data/paddles.js'
import { players } from '../data/players.js'

const delay = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function listPaddles() {
  await delay()
  return paddles
}

export async function getPaddle(id) {
  await delay()

  const found = paddles.find(
    (paddle) => String(paddle.id) === String(id)
  )

  if (!found) {
    throw new Error('Paddle not found')
  }

  return found
}

export async function listPlayers() {
  await delay()
  return players
}

export async function getPlayer(id) {
  await delay()

  const found = players.find(
    (player) => String(player.id) === String(id)
  )

  if (!found) {
    throw new Error('Player not found')
  }

  return found
}