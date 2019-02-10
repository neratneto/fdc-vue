<template>
<v-container>
  <p class="page-title">Conferência </p>
  <v-layout class="py-2" wrap>
    <v-flex xs6>
      <cpf-jogo-senha />
    </v-flex>
    <v-flex xs6>
      <v-layout column align-start>
        <p class="damage-title">Algum dano no jogo?</p>
        <v-radio-group v-model="damage">
          <v-radio color="secondary" label="Sem danos!" :value="false" />
          <v-radio color="error" label="Danificado!" :value="true" />
        </v-radio-group>

        <v-text-field v-if="damage" label="Como?" v-model="damageDescription" solo />
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-btn color="secondary" @click="submit">Enviar!</v-btn>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import CpfJogoSenha from '../components/CpfJogoSenha.vue'

export default {
  components: {
    CpfJogoSenha
  },
  data: () => ({
    damage: null,
    damageDescription: null
  }),
  methods: {
    erro() {
      this.$snackbar({ message: 'Occoreu um erro', snackbarColor: '#FF2233' })
    }
  }
}
</script>

<style lang="scss">
.damage-title {
    color: #FFF;
    font-size: 24px;
}
</style>
