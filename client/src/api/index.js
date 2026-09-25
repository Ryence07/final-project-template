import * as httpApi from './httpApi.js'
import * as mockApi from './mockApi.js'

export const USING_MOCK_API =
  import.meta.env.VITE_USE_MOCK_API !== 'false'

const implementation =
  USING_MOCK_API ? mockApi : httpApi

export const {
  listPaddles,
  getPaddle,
  listPlayers,
  getPlayer,

  login,
  register,
  getCurrentPlayer,
  logout,
  isLoggedIn,

  sendMatchRequest,
  listMatches,
  acceptMatch,
  recordMatchResult,
} = implementation