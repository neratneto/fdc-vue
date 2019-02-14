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
    async sendToSheets({}, payload) {
        const { message } = await sheetsApi[payload.actionName](payload.items)

        if (message === 'sucesso') return message
        else throw Error(message)
    },
    async registerClient({}, payload) {
      if (sheetsApi.checkPassword(payload.adminPassword)) throw Error('Senha incorreta, tente novamente')
      const { message } = await sheetsApi.createClient(payload.client)
      return message
    }
  }
})
