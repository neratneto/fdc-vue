<template>
<v-dialog v-model="dialog" width="400px">
  <v-btn color="primary" slot="activator">Chaves Google API</v-btn>
  <v-card>
    <v-card-title>
      <p class="subheading">Credenciais Google API</p>
    </v-card-title>
    <v-alert type="error" :value="true">Alterações nestas chaves poderão resultar em erros no servidor.</v-alert>
    <v-card-text>
      <v-text-field label="API Key" v-model="apiKey" solo />
      <v-text-field label="Client ID" v-model="clientId" solo />
      <v-text-field label="SpreadSheet ID" v-model="spreadsheetId" solo />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="!noneFilled" color="primary" @click="submit">
        <v-icon>check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    apiKey: null,
    clientId: null,
    spreadsheetId: null
  }),
  computed: {
    noneFilled() {
      return Boolean(this.apiKey && this.clientId && this.spreadsheetId)
    }
  },
  methods: {
    submit() {
      window.localStorage.setItem('apiKey', this.apiKey)
      window.localStorage.setItem('clientId', this.clientId)
      window.localStorage.setItem('spreadsheetId', this.spreadsheetId)
      this.dialog = false
    }
  }
}
</script>
