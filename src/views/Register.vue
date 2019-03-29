<template>
<v-container justify-center>
  <v-layout align-center justify-center column fill-height>
    <p class="page-title"> Registro de novo usuário!</p>

    <v-card class="pa-2" width="320px">
      <v-card-text>
        <v-layout align-start fill-height column>
          <v-text-field label="CPF" v-model="cpf" mask="###.###.###-##" solo />
          <v-text-field label="Nome completo" v-model="name" solo />
          <v-text-field label="Endereço" v-model="address" solo />
          <v-text-field label="Email" v-model="email" solo />
          <v-text-field label="Telefone" v-model="tel" mask="(##) ####-####" solo />
          <v-text-field label="Celular" v-model="cel" mask="(##) # ####-####" solo />
          <v-text-field label="Rede social" v-model="social" solo />
          <v-select label="O que te trouxe até a loja?" @input="setIndication" :items="indicationOptions" solo />
          <v-text-field label="Senha do administrador" v-model="adminPassword" solo />
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn :color="acceptedTerms ? 'secondary' : 'error'" :loading="submitLoader" @click="submit">Enviar!</v-btn>
        <v-spacer />
        <termos :terms.sync="acceptedTerms" />
      </v-card-actions>
    </v-card>
  </v-layout>
</v-container>
</template>

<script>
import Termos from '@/components/Termos.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    Termos
  },
  data: () => ({
    cpf: null,
    name: null,
    address: null,
    tel: null,
    cel: null,
    email: null,
    social: null,
    acceptedTerms: false,
    indication: null,
    adminPassword: '',
    submitLoader: false,
    indicationOptions: ['Facebook', 'Instagram', 'Amigos', 'Família', 'Pa-Kua', 'Eventos', 'Outros']
  }),
  methods: {
    ...mapActions(['registerClient']),
    submit() {
      this.submitLoader = true
      if (this.acceptedTerms) {
        const client = {
          cpf: this.cpf,
          name: this.name,
          address: this.address,
          tel: this.tel,
          cel: this.cel,
          email: this.email,
          social: this.social,
          agreement: `Concordou com o contrato vigente em ${this.$moment()}`,
          indication: this.indication
        }
        this.registerClient({ adminPassword: this.adminPassword, client }).then(() => {
          this.submitLoader = false
          this.$snackbar({ message: 'Cliente cadastrado com sucesso!', snackbarColor: 'success', btnText: 'Menu incial' }).catch(() => {
            this.$router.push('/')
          })
        }).catch(error => {
          this.submitLoader = false
          this.$snackbar({ message: error.message, snackbarColor: 'error', btnText: 'Menu incial' }).catch(() => {
            this.$router.push('/')
          })
        })
      } else {
        this.submitLoader = false
        this.$snackbar({ message: 'Você deve concordar com os termos de locação', snackbarColor: 'error' })
      }
    },
    setIndication(value) { this.indication = value }
  }
}
</script>
