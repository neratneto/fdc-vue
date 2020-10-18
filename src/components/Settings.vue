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
        <v-expansion-panel-content>
          <span class="body-2" slot="header">Configurações internas</span>
          <v-layout justify-center>
            <SheetsApiSettings />
            <v-btn @click="gapiSignIn" color="secondary">Login conta Google</v-btn>
            <EmailApiSettings />
            <HLApiSettings />
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script>
import SheetsApiSettings from '@/components/SheetsApiSettings.vue'
import EmailApiSettings from '@/components/EmailApiSettings.vue'
import HLApiSettings from '@/components/HLApiSettings.vue'
import RentedGames from '@/components/RentedGames.vue'

export default {
  components: {
    SheetsApiSettings,
    EmailApiSettings,
    HLApiSettings,
    RentedGames
  },
  data: () => ({
    expansionPanel: 0,
    dialog: false
  }),
  methods: {
    gapiSignIn() {
      gapi.auth2.getAuthInstance().signIn()
    }
  }
}
</script>
