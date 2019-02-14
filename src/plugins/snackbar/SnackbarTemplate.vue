<template>
<v-snackbar class="snackbar" :color="snackbarColor" left v-model="open">
  <span class="snackbar-text">{{ message }}</span>
  <v-btn v-if="btnText" color="primary" class="mr-2" @click.stop="clickButton()">{{ btnText }}</v-btn>
  <v-icon @click.stop="closeSnackbar()">close</v-icon>
</v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },
  watch: {
    open(value) {
      if (!value) {
        this.closeSnackbar()
      }
    }
  }
}
</script>

<style lang="scss">
.snackbar {
    font-family: 'Oswald', sans-serif !important;
    .snackbar-text {
        color: #FFF;
    }
}
</style>
