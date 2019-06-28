<template>
<v-dialog v-model="dialog" width="400px">
  <v-btn color="accent" slot="activator">Chaves EmailJS</v-btn>
  <v-card>
    <v-card-title>
      <p class="subheading">Credenciais EmailJS</p>
    </v-card-title>
    <v-alert type="error" :value="true">Alterações nestas chaves poderão resultar em erros no envio de e-mail.</v-alert>
    <v-card-text>
      <v-text-field label="Template ID" v-model="emailTemplateId" solo />
      <v-text-field label="User ID" v-model="emailUserId" solo />
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
    emailTemplateId: null,
    emailUserId: null
  }),
  computed: {
    noneFilled() {
      return Boolean(this.emailTemplateId && this.emailUserId)
    }
  },
  methods: {
    submit() {
      window.localStorage.setItem('emailTemplateId', this.emailTemplateId)
      window.localStorage.setItem('emailUserId', this.emailUserId)
      this.dialog = false
    }
  }
}
</script>
