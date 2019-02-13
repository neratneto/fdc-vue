import * as fetchApi from '@/api/fetchApi.js'
import { queryParam } from '@/api/queryParam.js'
import * as constants from '@/api/constants.js'

export const getGamesList = (filter) => fetchApi.get(constants.games + queryParam(filter))
export const getClientInfoById = id => fetchApi.get(constants.info_by_id + id)
export const postGameRevision = payload => fetchApi.post(constants.game_revision, payload)
