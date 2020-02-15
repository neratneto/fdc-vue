import Vue from 'vue'
import Vuex from 'vuex'
import * as sheetsApi from '@/api/sheetsApi.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamesList: []
  },
  mutations: {
    'SET_OBJECT' (originalState, {name, data, state}) {
      Vue.set(state, name, data)
    }
  },
  actions: {
    async setFullGamesList({state, commit}) {
      const { data } = await sheetsApi.getGamesList()
      commit('SET_OBJECT', {
        name: 'gamesList',
        data,
        state
      })
    },
    async setRentedGamesList({state, commit}) {
      const response = await sheetsApi.getRentedGamesList()
      const data = response.data.map(object => object['game'])
      commit('SET_OBJECT', {
        name: 'gamesList',
        data,
        state
      })
    },
    async setAvaliableGamesList({state, commit}) {
      const { data } = await sheetsApi.getAvaliableGamesList()
      commit('SET_OBJECT', {
        name: 'gamesList',
        data,
        state
      })
    },
    async getClientInfo({}, id) {
      const { data } = await sheetsApi.getClientInfoById(id)
      return data
    },
    async getRentedGames({}) {
      const { data } = await sheetsApi.getRentedGamesList()
      return data
    },
    async findLateGames({}, gamesArray) {
      const { data } = await sheetsApi.findLateGamesList(gamesArray)
      return data
    },
    async logRevision({}, payload) {
      const response = await sheetsApi.revision(payload)

      if (response.message === 'success') return 'success'
      else throw Error(response.message)
    },
    async logCheckOut({}, payload) {
      const response = await sheetsApi.checkOut(payload)

      if (response.message === 'success') return 'success'
      else throw Error(response.message)
    },
    async logCheckIn({}, payload) {
      const response = await sheetsApi.checkIn(payload)

      if (response.message === 'success') return 'success'
      else throw Error(response.message)
    },
    async registerClient({}, payload) {
      if (sheetsApi.checkPassword(payload.adminPassword)) throw Error('Senha incorreta, tente novamente')
      const { message } = await sheetsApi.createClient(payload.client)
      return message
    },
    async getAdmin({}, adminId) {
      const { data } = await sheetsApi.adminCheck(adminId)
      return data
    },
    async getRegisterTimestamps({}) {
      const { data } = await sheetsApi.getRegisterDates()
      return data
    },
    async getHistoryDates({}, { actionName, gameFilter }) {
      const { data } = await sheetsApi.getActionHistoryDates(actionName, gameFilter)
      return data
    },
    async checkGameDamage({}, games) {
      const { data } = await sheetsApi.checkGameDamage(games)
      return data
    }  
  }
})
