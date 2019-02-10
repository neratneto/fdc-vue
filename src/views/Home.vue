<template>
<v-container class="py-0">
  <v-layout column align-center fill-height justify-center>
    <v-img :src="logo" width="24vw" />
    <p class="page-title">E aí, qual vai ser?</p>
    <v-btn color="primary" large to="locacao">Locação!</v-btn>
    <v-btn color="primary" large to="devolucao">Devolução!</v-btn>
    <v-btn color="secondary" large to="conferencia">Conferência!</v-btn>
    <v-btn large to="register">Cadastro de cliente!</v-btn>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data: () => ({
    logo: require('@/assets/fdcLogo.png')
  })
}
</script>
