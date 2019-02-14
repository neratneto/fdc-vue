<template>
<v-container>
  <p class="page-title">Conferência </p>
  <v-layout class="py-2" wrap>
    <v-flex xs6>
      <cpf-jogo-senha :cpf.sync="cpf" :selectedGames.sync="selectedGames" :adminPassword.sync="adminPassword" />
    </v-flex>
    <v-flex xs6>
      <v-layout column align-start>
        <p class="damage-title">Algum dano no jogo?</p>
        <v-radio-group v-model="damage">
          <v-radio color="secondary" label="Sem danos!" :value="false" />
          <v-radio color="error" label="Danificado!" :value="true" />
        </v-radio-group>

        <v-text-field v-if="damage" label="Como?" v-model="damageDescription" solo />
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-btn color="secondary" :loading="submitLoader" @click="submit">Enviar!</v-btn>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import CpfJogoSenha from '../components/CpfJogoSenha.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    CpfJogoSenha
  },
  data: () => ({
    cpf: null,
    selectedGames: null,
    adminPassword: null,
    damage: null,
    damageDescription: null,
    submitLoader: false
  }),
  methods: {
    ...mapActions(['setFullGamesList', 'sendToSheets']),
    submit() {
      this.submitLoader = true
      const items = {
        cpf: this.cpf,
        selectedGames: this.selectedGames,
        adminPassword: this.adminPassword,
        damage: this.damage,
        password: this.adminPassword,
        damageDescription: this.damageDescription
      }
      this.sendToSheets({ actionName: 'reivision', items }).then(response => {
        this.submitLoader = false
        console.log(response);
      }).catch(error => {
        this.submitLoader = false
        this.$snackbar({ message: error.message, snackbarColor: 'error', btnText: 'Menu incial' }).catch(() => {
          this.$router.push('/')
        })
      })
    }
  },
  mounted() {
    this.setFullGamesList()
  }
}
</script>

<style lang="scss">
.damage-title {
    color: #FFF;
    font-size: 24px;
}
</style>
