import * as fetchApi from '@/api/fetchApi.js'
import * as constants from '@/api/constants.js'

export const getGamesList = () => fetchApi.get(constants.games)
export const getClientInfoById = id => fetchApi.get(constants.info_by_id + id)
export const getRentedGamesList = () => fetchApi.get(constants.rented_games)
export const postGameRevision = payload => fetchApi.post(constants.game_revision, payload)
