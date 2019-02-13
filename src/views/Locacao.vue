<template>
<v-container>
  <devo-loc title="Locação" />
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
    ...mapActions(['setAvaliableGamesList'])
  },
  mounted() {
    this.setAvaliableGamesList()
  }
}
</script>

<style lang="css" scoped>
</style>
