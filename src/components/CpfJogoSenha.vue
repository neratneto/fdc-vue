<template>
<v-layout align-start justify-left fill-height column>
  <v-autocomplete v-if="useName" @change="idFunction" style="max-width: 480px;" autocomplete="interfacefdc1" label="Nome completo" clearable name="interfacefdc1" deletable-chips :items="possibleNames" v-model="scopedClientName" solo required />
  <v-text-field v-else-if="useCpf" autocomplete="interfacefdc1" name="interfacefdc1" label="CPF" v-model="scopedCpf" clearable solo mask="###.###.###-##" @input="validateId" return-masked-value required />
  <v-autocomplete style="max-width: 480px;" autocomplete="interfacefdc2" label="Jogos" multiple chips clearable name="interfacefdc2" deletable-chips :items="possibleGames" v-model="scopedSelectedGames" solo required />
  <v-text-field label="Senha do administrador" autocomplete="interfacefdc3" clearable name="interfacefdc3" v-model="adminPassword" solo :append-icon="visibility ? 'visibility' : 'visibility_off'" @click:append="() => (visibility = !visibility)" :type="visibility ? 'password' : 'text'"
    required :error="passwordError" />
</v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { checkPassword } from '@/api/sheetsApi.js'

export default {
  data: () => ({
    visibility: true,
    adminPassword: null
  }),
  props: {
    useName: {
      type: Boolean,
      default: false
    },
    clientName: String,
    useCpf: {
      type: Boolean,
      default: true
    },
    cpf: String,
    selectedGames: [Array, String],
    idFunction: Function
  },
  computed: {
    ...mapState({
      possibleGames: state => state.gamesList,
      possibleNames: state => state.namesList
    }),
    passwordError() {
      const invalid = checkPassword(this.adminPassword)
      this.$emit('update:passwordValid', !invalid)
      return invalid
    },
    scopedCpf: {
      get() {
        return this.cpf
      },
      set(value) {
        this.$emit('update:cpf', value)
      }
    },
    scopedClientName: {
      get() {
        return this.clientName
      },
      set(value) {
        this.$emit('update:clientName', value)
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
