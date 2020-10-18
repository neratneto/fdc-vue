<template>
<v-dialog v-model="dialog" width="400px">
  <v-btn color="success" slot="activator">HighLevel Api</v-btn>
  <v-card>
    <v-card-title>
      <p class="subheading">HighLevel Api</p>
    </v-card-title>
    <v-alert type="error" :value="true">Alterações nestas chaves poderão resultar em erros no envio de triggers para a HighLevel.</v-alert>
    <v-card-text>
      <v-text-field label="Api Key" v-model="hlApiKey" solo />
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
    hlApiKey: null
  }),
  computed: {
    noneFilled() {
      return Boolean(this.hlApiKey)
    }
  },
  methods: {
    submit() {
      window.localStorage.setItem('hlApiKey', this.hlApiKey)
      this.dialog = false
    }
  }
}
</script>
