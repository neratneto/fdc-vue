<template>
<v-card max-width="1200px" color="primary" dark class="mx-auto text-center">
  <v-card-title>
    <div class="display-1">{{ title }}</div>
  </v-card-title>

  <v-card-text>
    <v-sheet color="#ffffff">
      <v-sparkline :loading="loading" class="sparkline-label" :value="items.map(date => date.value)" color="#2196f3da" height="100" padding="16" label-size="4px" stroke-linecap="round" :labels="items.map(date => date.text)">
      </v-sparkline>
    </v-sheet>
    <v-divider></v-divider>
    <v-data-table light :loading="loading" :headers="tableHeaders" :items="items" :rows-per-page-items="[5, 10, 15, 25, 50]" no-data-text="Carregando os dados">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.text }}</td>
        <td>{{ props.item.value }}</td>
      </template>
    </v-data-table>
  </v-card-text>
</v-card>
</template>

<script>
export default {
  computed: {
    tableHeaders() {
      return [
        { text: this.headers[0], value: 'text' },
        { text: this.headers[1], value: 'value' }
      ]
    }
  },
  props: {
    title: String,
    items: Array,
    headers: Array,
    loading: Boolean
  }
}
</script>

<style lang="css" scoped>
</style>
