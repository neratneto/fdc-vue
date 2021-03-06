import Vue from 'vue'
import Vuex from 'vuex'
import * as sheetsApi from '@/api/sheetsApi.js'
import { fireTrigger } from './api/hl-integration'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamesList: [],
    gamesObjectList: [],
    namesList: []
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
      commit('SET_OBJECT', {
        name: 'gamesObjectList',
        data: response.data,
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
    async setNamesList({state, commit}) {
      const { data } = await sheetsApi.getNamesList()
      commit('SET_OBJECT', {
        name: 'namesList',
        data,
        state
      })
    },
    async getClientInfo({}, id) {
      const { data } = await sheetsApi.getClientInfoById(id)
      return data
    },
    async getClientInfoFromName({}, name) {
      const { data } = await sheetsApi.getClientInfoByName(name)
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

      if (response.message === 'success') {
        try {
          if (payload.hlContactInfo.length > 0) {
            payload.hlContactInfo.forEach(async contact => {
              fireTrigger(contact, 'fdc-checkout')
            })
          }
        } catch (err) { }     
        
        return 'success'
      } else throw Error(response.message)
    },
    async logCheckIn({}, payload) {
      const response = await sheetsApi.checkIn(payload)

      if (response.message === 'success') {
        try {
          await fireTrigger(payload.hlContactInfo, 'fdc-checkin')
        } catch (err) { }     
        
        return 'success'
      } else throw Error(response.message)
    },
    async registerClient({}, payload) {
      if (sheetsApi.checkPassword(payload.adminPassword)) throw Error('Senha incorreta, tente novamente')
      const { message } = await sheetsApi.createClient(payload.client)
      
      try {
        await fireTrigger(payload.client, 'fdc-register')
      } catch (err) { }     
      
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
