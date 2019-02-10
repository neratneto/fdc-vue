<template>
<v-container justify-center>
  <v-layout align-center justify-center column fill-height>
    <p class="page-title"> Registro de novo usuário!</p>

    <v-card class="pa-2" width="320px">
      <v-card-text>
        <v-layout align-start fill-height column>
          <v-text-field label="CPF" v-model="cpf" solo />
          <v-text-field label="Nome completo" v-model="name" solo />
          <v-text-field label="Endereço" v-model="address" solo />
          <v-text-field label="Email" v-model="email" solo />
          <v-text-field label="Telefone" v-model="tel" solo />
          <v-text-field label="Celular" v-model="cel" solo />
          <v-text-field label="Rede social" v-model="social" solo />
          <v-select v-model="indication" label="O que te trouxe até a loja?" :items="indicationOptions" solo />
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
import Termos from '../components/Termos.vue'

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
    indication: null,
    adminPassword: '',
    acceptedTerms: false,
    submitLoader: false,
    indicationOptions: ['Facebook', 'Instagram', 'Amigos', 'Família', 'Pa-Kua', 'Eventos', 'Outros']
  }),
  methods: {
    submit() {
      this.submitLoader = true
      if (this.acceptedTerms) {
        this.$router.push('/')
      } else {
        this.$snackbar({ message: 'Você deve concordar com os termos de locação', snackbarColor: 'error' })
        this.submitLoader = false
      }
    }
  }
}
</script>
