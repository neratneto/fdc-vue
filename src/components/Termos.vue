<template>
<v-dialog v-model="dialog" width="800px">
  <v-btn slot="activator" color="info">Termos de locação</v-btn>
  <v-card>
    <v-card-text>
      <iframe style="border: none;" width="760px" height="600px" src="https://docs.google.com/document/d/e/2PACX-1vSbmewwyibn_DcZEzoPJ0gMsRfxkX-j1I1P8j8jWuKyD30BEMlFCp32aaa0GaCbdNe-Ky8HJzF_L2Kg/pub?embedded=true"></iframe>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="success" @click="accept">Aceito!</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false
  }),
  props: {
    terms: Boolean
  },
  computed: {
    scopedTerms: {
      get() {
        return this.terms
      },
      set(value) {
        this.$emit('update:terms', value)
      }
    }
  },
  methods: {
    accept() {
      this.scopedTerms = true
      this.dialog = false
    }
  }
}
</script>
