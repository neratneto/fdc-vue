<template>
<v-dialog class="confirm-dialog" width="30%" v-model="open" persistent>
  <v-card>
    <v-card-text>
      <p class="confirm-text">{{ message }}</p>
      <p v-for="item in items" :key="item">{{ item }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :color="cancelColor" @click.stop="onCancel()">{{ cancelText }}</v-btn>
      <v-btn :color="confirmColor" @click.stop="onConfirm()">{{ confirmText }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>
<style lang="scss">
.confirm-text {
    font-size: 16px;
}
</style>
