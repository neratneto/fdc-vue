<template>
<v-app id="app" class="app">
  <v-layout>
    <v-btn icon v-if="$route.path !== '/'" color="secondary" to="/">
      <v-icon>home</v-icon>
    </v-btn>
    <settings v-else />
  </v-layout>
  <router-view />
</v-app>
</template>

<script>
import Settings from '@/components/Settings.vue'

export default {
  components: {
    Settings
  }
}
</script>

<style lang="scss">
@font-face {
    font-family: 'Recto filled';
    src: url("./assets/Recto_Filled.ttf");
}

.app {
    background-color: rgb(248, 177, 51) !important;
    /* font-family: 'Recto filled'; */
    font-family: 'Oswald', sans-serif !important;
}

.page-title {
    color: #FFF;
    font-size: 32px;
    font-family: 'Oswald', sans-serif !important;
}

.azulpadrao {
    background-color: rgb(0, 158, 226);
}
</style>
