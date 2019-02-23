<template>
<v-layout align-start justify-left fill-height column>
  <v-text-field label="CPF" v-model="scopedCpf" solo mask="###.###.###-##" @input="validateId" return-masked-value required />
  <v-autocomplete label="Jogos" :items="possibleGames" v-model="scopedSelectedGames" solo required />
  <v-text-field label="Senha do administrador" v-model="scopedAdminPassword" solo :append-icon="visibility ? 'visibility' : 'visibility_off'" @click:append="() => (visibility = !visibility)" :type="visibility ? 'password' : 'text'" required />
</v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    visibility: true
  }),
  props: {
    cpf: String,
    selectedGames: [Array, String],
    adminPassword: String,
    idFunction: Function
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
