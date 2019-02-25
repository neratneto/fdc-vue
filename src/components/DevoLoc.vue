<template>
<v-container>
  <p class="page-title">{{ title }}</p>
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
    passwordValid: false
  }),
  props: {
    title: String
  },
  methods: {
    // TODO add games load to this component and prop dictates over devo or loc
    ...mapActions(['getClientInfo', 'logCheckOut', 'logCheckIn']),
    checkOut() {
      // TODO items and late check
      this.logCheckOut(items).then(response => {
        this.submitLoader = false
        console.log(response);
      }).catch(error => {
        this.submitLoader = false
        this.$snackbar({ message: error.message, snackbarColor: 'error', btnText: 'Menu incial' }).catch(() => {
          this.$router.push('/')
        })
      })
    },
    checkIn() {
      // TODO items
      this.logCheckIn(items).then(response => {
        this.submitLoader = false
        console.log(response);
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
    submit() {
      this.submitLoader = true
      this.$router.push('/')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
