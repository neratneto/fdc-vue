<template>
<v-container>
  <devo-loc title="Devolução" />
</v-container>
</template>

<script>
import DevoLoc from '../components/DevoLoc.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    DevoLoc
  },
  methods: {
    ...mapActions(['setRentedGamesList'])
  },
  mounted() {
    this.setRentedGamesList()
  }
}
</script>

<style lang="css" scoped>
</style>
