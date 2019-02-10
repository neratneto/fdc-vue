<template>
<v-dialog v-model="dialog">
  <v-btn slot="activator" color="primary" icon>
    <v-icon>settings</v-icon>
  </v-btn>
  <v-card>
    <v-card-title>
      <span class="headline">Ferramentas do administrador</span>
    </v-card-title>
    <v-card-text>
      <v-expansion-panel v-model="expansionPanel">
        <rented-games />
      </v-expansion-panel>

    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
import RentedGames from '@/components/RentedGames.vue'

export default {
  components: {
    RentedGames
  },
  data: () => ({
    expansionPanel: 0,
    dialog: false
  })
}
</script>
