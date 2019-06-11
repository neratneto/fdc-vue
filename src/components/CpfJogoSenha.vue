<template>
<v-layout align-start justify-left fill-height column>
  <v-text-field label="CPF" v-model="scopedCpf" clearable name="cpf" solo mask="###.###.###-##" @input="validateId" return-masked-value required />
  <v-autocomplete style="max-width: 480px;" label="Jogos" multiple chips clearable name="games" deletable-chips :items="possibleGames" v-model="scopedSelectedGames" solo required />
  <v-text-field label="Senha do administrador" clearable name="admin-password" v-model="adminPassword" solo :append-icon="visibility ? 'visibility' : 'visibility_off'" @click:append="() => (visibility = !visibility)" :type="visibility ? 'password' : 'text'"
    required :error="passwordError" />
</v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { checkPassword } from '@/api/sheetsApi.js'

export default {
  data: () => ({
    visibility: true,
    adminPassword: null,
  }),
  props: {
    cpf: String,
    selectedGames: [Array, String],
    idFunction: Function
  },
  computed: {
    ...mapState({
      possibleGames: state => state.gamesList
    }),
    passwordError() {
      const valid = checkPassword(this.adminPassword)
      this.$emit('update:passwordValid', valid)
      return valid
    },
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
    }
  },
  methods: {
    validateId(value) {
      if (value && value.length === 14) {
        this.idFunction()
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
