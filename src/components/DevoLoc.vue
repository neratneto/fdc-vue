<template>
<v-container>
  <p class="page-title">{{ capitalize(actionType) }}</p>
  <v-layout class="py-2" wrap>
    <v-flex>
      <cpf-jogo-senha :cpf.sync="cpf" :selectedGames.sync="selectedGames" :password-valid.sync="passwordValid" :id-function="fetchClientInfo" />
      <v-btn color="secondary" :disabled="passwordValid" :loading="submitLoader" @click="submit">Enviar!</v-btn>
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
    capitalize: _.capitalize
  }),
  props: {
    actionType: String
  },
  methods: {
    ...mapActions(['getClientInfo', 'logCheckOut', 'logCheckIn', 'setAvaliableGamesList', 'setRentedGamesList', 'findLateGames']),
    checkOut() {
      this.submitLoader = true
      this.findLateGames(this.selectedGames).then(lateGames => {
        if (lateGames !== []) {
          // TODO confirm late games
        }
        const items = {
          cpf: this.cpf,
          selectedGames: this.selectedGames,
          lateGames: lateGames
        }

        this.logCheckOut(items).then(response => {
          this.submitLoader = false
          console.log(response)
          this.$router.push('/')
        }).catch(error => {
          this.submitLoader = false
          this.$snackbar({ message: error.message, snackbarColor: 'error', btnText: 'Menu incial' }).catch(() => {
            this.$router.push('/')
          })
        })
      })
    },
    checkIn() {
      this.submitLoader = true
      const items = {
        cpf: this.cpf,
        selectedGames: this.selectedGames
      }

      this.logCheckIn(items).then(response => {
        this.submitLoader = false
        console.log(response)
        this.$router.push('/')
      }).catch(error => {
        this.submitLoader = false
        this.$snackbar({ message: error.message, snackbarColor: 'error', btnText: 'Menu incial' }).catch(() => {
          this.$router.push('/')
        })
      })
    },
    fetchClientInfo() {
      this.clientInfoLoader = true
      this.getClientInfo(this.cpf).then(client => {
        this.clientInfo = [{
          label: 'Nome completo',
          value: client.name
        }, {
          label: 'Endereço',
          value: client.address
        }, {
          label: 'Telefone',
          value: client.tel
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
        this.clientInfoLoader = false
      }).catch(error => {
        this.clientInfoLoader = false
        this.$confirm({ message: 'CPF não encontrado, deseja realizar cadastro?', cancelText: 'Tentar novamente' }).then(() => {
          this.$router.push('/register')
        })
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
