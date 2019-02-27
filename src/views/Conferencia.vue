<template>
<v-container>
  <p class="page-title">Conferência </p>
  <v-layout class="py-2" wrap>
    <v-flex xs6>
      <cpf-jogo-senha :cpf.sync="cpf" :selectedGames.sync="selectedGames" :password-valid.sync="passwordValid" :id-function="checkAdmin" />
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
      <v-btn color="secondary" :disabled="passwordValid" :loading="submitLoader" @click="submit">Enviar!</v-btn>
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
    damage: null,
    damageDescription: null,
    submitLoader: false,
    adminName: null,
    passwordValid: false
  }),
  methods: {
    ...mapActions(['setFullGamesList', 'logRevision', 'getAdmin']),
    submit() {
      this.submitLoader = true
      const items = {
        adminName: this.adminName,
        selectedGames: this.selectedGames,
        damage: this.damage,
        damageDescription: this.damageDescription
      }
      this.logRevision(items).then(response => {
        this.submitLoader = false
        this.$snackbar({ message: 'Sucesso!', snackbarColor: 'success', btnText: 'Menu incial' }).catch(() => {
          this.$router.push('/')
        })
      }).catch(error => {
        this.submitLoader = false
        this.$snackbar({ message: error, snackbarColor: 'error', btnText: 'Menu incial' }).catch(() => {
          this.$router.push('/')
        })
      })
    },
    checkAdmin() {
      this.getAdmin(this.cpf).then(data => {
        if (data.message === 'success') {
          this.adminName = data.name
        } else if (data.message === 'not found') {
          this.$confirm({ message: 'Administrador não encontrado, você faz parte do staff?' }).then(() => {
            this.cpf = null
          }).catch(() => {
            this.$router.push('/')
          })
        }
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
