<template>
<v-container>
  <p class="page-title">{{ capitalizedAction }}</p>
  <v-layout class="py-2" wrap>
    <v-flex>
      <cpf-jogo-senha :cpf.sync="cpf" :selectedGames.sync="selectedGames" :password-valid.sync="passwordValid" :id-function="fetchClientInfo" />
      <v-btn color="secondary" :disabled="$v.$invalid" :loading="submitLoader" @click="submit">Enviar!</v-btn>
    </v-flex>
    <v-flex>
      <v-card class="pa-3" v-if="clientInfo && !clientInfoLoader">
        <p v-for="(info, index) in clientInfo" :key="index">{{ info.label }}: {{ info.value }}</p>
      </v-card>
      <v-progress-circular v-if="clientInfoLoader" indeterminate size="160" color="secondary" />
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import _ from 'lodash'
import CpfJogoSenha from './CpfJogoSenha.vue'
import { mapActions } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  components: {
    CpfJogoSenha
  },
  data: () => ({
    clientInfo: null,
    submitLoader: false,
    cpf: null,
    selectedGames: null,
    clientInfoLoader: false,
    passwordValid: false,
    hlContactInfo: {}
  }),
  validations: {
    cpf: {
      required,
      minLength: minLength(14)
    },
    selectedGames: {
      required
    },
    passwordValid: {
      isTrue: (value) => value === true
    }
  },
  props: {
    actionType: String
  },
  computed: {
    capitalizedAction() { return _.capitalize(this.actionType) }
  },
  methods: {
    ...mapActions(['getClientInfo', 'logCheckOut', 'logCheckIn', 'setAvaliableGamesList', 'setRentedGamesList', 'findLateGames', 'checkGameDamage']),
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
      const items = {
        cpf: this.cpf,
        selectedGames: this.selectedGames,
        lateGames: lateGames,
        hlContactInfo: this.hlContactInfo
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
        cpf: this.cpf,
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
          this.cpf = null
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
    fetchClientInfo() {
      this.clientInfoLoader = true
      this.getClientInfo(this.cpf).then(client => {
        this.clientInfo = [{
          label: 'CPF',
          value: this.cpf
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
          this.$confirm({ message: 'CPF não encontrado, deseja realizar cadastro?', cancelText: 'Tentar novamente' }).then(() => {
            this.$router.push({ name: 'register', params: { cpf: this.cpf } })
          }).catch(() => {
            this.cpf = null
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
  }
}
</script>

<style lang="css" scoped>
</style>
