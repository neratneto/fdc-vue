<template>
<v-container>
  <p class="page-title">{{ capitalizedAction }}</p>
  <v-layout class="py-2" wrap>
    <v-flex>
      <cpf-jogo-senha useName :useCpf="false" :clientName.sync="clientName" :selectedGames.sync="selectedGames" :password-valid.sync="passwordValid" :id-function="fetchClientInfo" />
      <v-btn color="secondary" :disabled="$v.$invalid" :loading="submitLoader" @click="submit">Enviar!</v-btn>
    </v-flex>
    <v-flex>
      <v-progress-circular v-if="clientInfoLoader" indeterminate size="40" color="secondary" />
      <v-card class="pa-3" v-if="clientInfo">
        <h3>Realizando a {{ capitalizedAction }}</h3>
        <p v-for="(info, index) in clientInfo" :key="index">{{ info.label }}: {{ info.value }}</p>
      </v-card>
      <v-card class="my-2" width="300px" v-if="clientInfoArray.length > 0">
        <v-card-actions>
          <p>Atualização de devolução</p>
          <v-spacer></v-spacer> <v-btn @click="clearAll">clear</v-btn>
        </v-card-actions>
        <v-expansion-panel>
          <v-expansion-panel-content
          v-for="clientInfo in clientInfoArray" :key="clientInfo.cpf"
          >
          <template v-slot:header>
              {{ clientInfo[1].value }}
            </template>
            <h4 class="my-1 mx-3" style="font-weight: 400;" v-for="(info, index) in clientInfo" :key="index">{{ info.label }}: {{ info.value }}</h4>
            </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import _ from 'lodash'
import CpfJogoSenha from './CpfJogoSenha.vue'
import { mapState, mapActions } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  components: {
    CpfJogoSenha
  },
  data: () => ({
    clientInfo: null,
    submitLoader: false,
    clientName: null,
    selectedGames: null,
    clientInfoLoader: false,
    passwordValid: false,
    hlContactInfo: {},
    clientInfoArray: []
  }),
  validations: {
    selectedGames: {
      required
    },
    passwordValid: {
      isTrue: (value) => value === true
    }
  },
  watch: {
    selectedGames(value, oldValue) {
      if (this.isDevolucao && value) {
        if (value.length === 1 && !oldValue) {
          this.fetchClientInfoFromGameToArray(value[0])
        } else if (value.length > oldValue.length) {
          this.fetchClientInfoFromGameToArray(value[value.length - 1])
        } else if (value.length === 0) {
          this.clearAll()
        }
      }
    }
  },
  props: {
    actionType: String
  },
  computed: {
    ...mapState({
      gamesObjectList: state => state.gamesObjectList
    }),
    capitalizedAction() { return _.capitalize(this.actionType) },
    isLocacao() { return Boolean(this.actionType === 'locação') },
    isDevolucao() { return Boolean(this.actionType === 'devolução') }
  },
  methods: {
    ...mapActions(['setNamesList', 'getClientInfo', 'getClientInfoFromName', 'logCheckOut', 'logCheckIn', 'setAvaliableGamesList', 'setRentedGamesList', 'findLateGames', 'checkGameDamage']),
    clearAll() {
      this.clientInfo = null
      this.submitLoader = false
      this.clientName = null
      this.selectedGames = null
      this.clientInfoLoader = false
      this.passwordValid = false
      this.hlContactInfo = {}
      this.clientInfoArray = []
    },
    checkOut() {
      this.submitLoader = true
      this.findLateGames(this.selectedGames).then(lateGames => {
        if (lateGames !== undefined && lateGames.length != 0) {
          const lateGamesItems = lateGames.map(element => `${element.game} - ${element.days} dias`)

          this.$confirm({ message: 'Os seguintes jogos estão atrasados:', confirmText: 'Atraso pago', cancelText: 'Tentar novamente', items: lateGamesItems }).then(() => {
            this.submitCheckOut(lateGames)
          }).catch(() => {
            this.submitLoader = false
            this.selectedGames = null
          })
        } else {
          this.submitCheckOut(lateGames)
        }
      })
    },
    submitCheckOut(lateGames) {
      const hlContactInfoArray = this.clientInfoArray.map(fieldsArray => {
        return {
          name: fieldsArray[1] && fieldsArray[1].value ? fieldsArray[1].value : '',
          phone: fieldsArray[3] && fieldsArray[3].value ? fieldsArray[3].value : '',
          email: fieldsArray[4] && fieldsArray[4].value ? fieldsArray[4].value : ''
        }
      })
      const items = {
        clientName: this.clientName,
        selectedGames: this.selectedGames,
        lateGames: lateGames,
        hlContactInfo: hlContactInfoArray
      }

      this.logCheckOut(items).then(response => {
        this.submitLoader = false
        this.$confirm({ message: `${this.capitalizedAction} realizada com sucesso!`, confirmColor: 'success', confirmText: 'Menu incial', cancelColor: 'primary', cancelText: `Nova ${this.actionType}` }).then(() => {
          this.$router.push('/')
        }).catch(() => {
          this.executeTypeFunction(this.setAvaliableGamesList, this.setRentedGamesList)
        })
      }).catch(error => {
        this.submitLoader = false
        this.$confirm({ message: `Erro ao realizar a ${this.actionType}. Informações sobre o erro: ${error}`, confirmColor: 'success', confirmText: 'Menu incial', cancelColor: 'error', cancelText: 'Tentar novamente' }).then(() => {
          this.$router.push('/')
        }).catch(() => {
          this.executeTypeFunction(this.setAvaliableGamesList, this.setRentedGamesList)
        })
      })
    },
    async checkIn() {
      this.submitLoader = true
      const items = {
        clientName: this.clientName,
        selectedGames: this.selectedGames,
        hlContactInfo: this.hlContactInfo
      }

      const damagedGames = await this.checkGameDamage(this.selectedGames)
      if (damagedGames) {
        this.$confirm({ message: `Confira a planilha referente aos seguintes jogos que estão danificados: ${damagedGames.join(' ; ')}`, confirmColor: 'success', confirmText: 'Confirmar locação', cancelColor: 'error', cancelText: 'Cancelar locação' }).then(() => {
          this.submitCheckIn(items)
        }).catch(() => {
          this.submitLoader = false
        })
      } else {
        this.submitCheckIn(items)
      }
    },
    submitCheckIn(items) {
      this.logCheckIn(items).then(response => {
        this.submitLoader = false
        this.$confirm({ message: `${this.capitalizedAction} realizada com sucesso!`, confirmColor: 'success', confirmText: 'Menu incial', cancelColor: 'primary', cancelText: `Nova ${this.actionType}` }).then(() => {
          this.$router.push('/')
        }).catch(() => {
          this.selectedGames = [] // Reset so it doesn't get games from the last operation
          this.clientName = null
          this.executeTypeFunction(this.setAvaliableGamesList, this.setRentedGamesList)
        })
      }).catch(error => {
        this.submitLoader = false
        this.$confirm({ message: `Erro ao realizar a ${this.actionType}. Informações sobre o erro: ${error}`, confirmColor: 'success', confirmText: 'Menu incial', cancelColor: 'error', cancelText: 'Tentar novamente' }).then(() => {
          this.$router.push('/')
        }).catch(() => {
          this.executeTypeFunction(this.setAvaliableGamesList, this.setRentedGamesList)
        })
      })
    },
    async fetchClientInfoFromGameToArray(game) {
      this.clientInfoLoader = true
      const found = this.gamesObjectList.find(obj => obj.game === game)
      console.log(this.gamesObjectList, found, game, found.client_id)
      try {
        let client = await this.getClientInfo(found.client_id)
        this.clientInfoArray.push([{
          label: 'CPF',
          value: client.cpf
         }, {
          label: 'Nome completo',
          value: client.name
        }, {
          label: 'Endereço',
          value: client.address
        }, {
          label: 'Celular',
          value: client.cel
        }, {
          label: 'Email',
          value: client.email
        }, {
          label: 'Rede social',
          value: client.social
        }])
      } catch (err) {
        console.error(err)
        let client = await this.getClientInfoFromName(found.client_id)
        console.log(client)
        this.clientInfoArray.push([{
          label: 'CPF',
          value: client.cpf
         }, {
          label: 'Nome completo',
          value: client.name
        }, {
          label: 'Endereço',
          value: client.address
        }, {
          label: 'Celular',
          value: client.cel
        }, {
          label: 'Email',
          value: client.email
        }, {
          label: 'Rede social',
          value: client.social
        }])
      } finally {
        this.clientInfoLoader = false
      }
    },
    fetchClientInfo() {
      this.clientInfoLoader = true
      if (!this.clientName) {
        this.clientInfoLoader = false
        return; 
      }
      this.getClientInfoFromName(this.clientName).then(client => {
        this.clientInfo = [{
          label: 'CPF',
          value: client.cpf
         }, {
          label: 'Nome completo',
          value: client.name
        }, {
          label: 'Endereço',
          value: client.address
        }, {
          label: 'Celular',
          value: client.cel
        }, {
          label: 'Email',
          value: client.email
        }, {
          label: 'Rede social',
          value: client.social
        }]
        this.hlContactInfo = {
          email: client.email,
          name: client.name,
          phone: client.cel
        }
        this.clientInfoLoader = false
      }).catch(error => {
        this.clientInfoLoader = false
        if (this.actionType === 'locação') {
          this.$confirm({ message: 'Nome não encontrado, deseja realizar cadastro?', cancelText: 'Tentar novamente' }).then(() => {
            this.$router.push({ name: 'register', params: { clientName: this.clientName } })
          }).catch(() => {
            this.clientName = null
          })
        }
      })
    },
    executeTypeFunction(locacaoFunction, devolucaoFunction) {
      if (this.actionType === 'locação') {
        locacaoFunction()
      } else if (this.actionType === 'devolução') {
        devolucaoFunction()
      }
    },
    submit() {
      this.executeTypeFunction(this.checkIn, this.checkOut)
    }
  },
  mounted() {
    this.executeTypeFunction(this.setAvaliableGamesList, this.setRentedGamesList)
    this.setNamesList()
  }
}
</script>

<style lang="css" scoped>
</style>
