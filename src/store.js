import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '@/api'

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
    async getGames({state, commit}) {
      const {games} = await api.getGamesList()
      commit('SET_OBJECT', {
        name: 'gamesList',
        games,
        state
      })
    },
    async getClientInfo({}, id) {
      const { client } = await api.getClientInfoById(id)
      return client
    },
    async getRentedGames({}) {
      const { data } = await api.getRentedGamesList()
      return data
    },
    async gameRevision({}, payload) {
      const response = await api.postGameRevision(payload)
    }
  }
})
