<template>
<v-layout align-start justify-left fill-height column>
  <v-text-field label="CPF" v-model="scopedCpf" solo mask="###.###.###-##" return-masked-value />
  <v-autocomplete label="Jogos" :items="possibleGames" v-model="scopedSelectedGames" solo />
  <v-text-field label="Senha do administrador" v-model="scopedAdminPassword" solo />
</v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    cpf: String,
    selectedGames: [Array, String],
    adminPassword: String
  },
  computed: {
    ...mapState({
      possibleGames: state => state.gamesList
    }),
    scopedCpf: {
      get() {
        return this.cpf
      },
      set(value) {
        this.$emit('update:cpf', value)
      }
    },
    scopedSelectedGames: {
      get() {
        return this.selectedGames
      },
      set(value) {
        this.$emit('update:selectedGames', value)
      }
    },
    scopedAdminPassword: {
      get() {
        return this.adminPassword
      },
      set(value) {
        this.$emit('update:adminPassword', value)
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
