<template>
<v-container>
  <p class="page-title">{{ title }}</p>
  <v-layout class="py-2" wrap>
    <v-flex>
      <cpf-jogo-senha :cpf.sync="cpf" :selectedGames.sync="selectedGames" :adminPassword.sync="adminPassword" />
      <v-btn color="secondary" :loading="submitLoader" @click="submit">Enviar!</v-btn>
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
    adminPassword: null,
    clientInfoLoader: false
  }),
  props: {
    title: String
  },
  watch: {
    cpf(value) {
      if (value && value.length === 14) {
        this.fetchClientInfo()
      }
    }
  },
  methods: {
    ...mapActions(['getClientInfo']),
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
        if (error.message === '404') {
          this.$confirm({ message: 'CPF não encontrado, deseja realizar cadastro?', cancelText: 'Tentar novamente' }).then(() => {
            this.$router.push('/register')
          })
        } else {
          this.$snackbar({ message: 'Ocorreu um erro, tente novamente', snackbarColor: 'error' })
        }
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
