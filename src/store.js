import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '@/api'
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
      const { client } = await api.getClientInfoById(id)
      return client
    },
    async getRentedGames({}) {
      const { data } = await sheetsApi.getRentedGamesList()
      return data
    }
  }
})
