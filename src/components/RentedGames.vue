<template>
<v-expansion-panel-content>
  <span class="body-2" slot="header">Jogos locados</span>
   <v-text-field
   class="mx-4"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
  <v-data-table :loading="rentedLoader" :headers="rentedHeaders" :items="rentedItems" :rows-per-page-items="[10, 15, 25, 50]"  :search="search">
    <template slot="items" slot-scope="props">
      <tr :class="isRentLate(props.item.date) ? 'late-rent' : 'on-time'">
        <td>{{ props.item.game }}</td>
        <td>{{ props.item.client_id }}</td>
        <td>{{ formatDate(props.item.date) }}</td>
      </tr>
    </template>
  </v-data-table>

</v-expansion-panel-content>
</template>


<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    rentedItems: [],
    rentedLoader: false,
    search: null
  }),
  computed: {
    rentedHeaders() {
      return [{
        text: 'Nome do jogo',
        value: 'game'
      }, {
        text: 'CPF do cliente',
        value: 'client_id'
      }, {
        text: 'Data locação',
        value: 'date'
      }]
    }
  },
  methods: {
    ...mapActions(['getRentedGames']),
    fetchRentedGames() {
      this.rentedLoader = true
      this.getRentedGames().then(data => {
        this.rentedItems = data.map(element => {
          return { ...element, date: element.date.includes('/') ? this.$moment(element.date, 'DD/MM/YYYY HH:mm') : this.$moment(element.date) }
        })
        this.rentedLoader = false
      })
    },
    formatDate(date) {
      return date.format('DD/MM/YYYY | HH:mm')
    },
    isRentLate(date) {
      const daysDifference = this.$moment().diff(date, 'days')
      return Boolean(daysDifference > 7)
    }
  },
  mounted() {
    this.fetchRentedGames()
  }
}
</script>

<style lang="scss">
.late-rent {
    color: #f44336;
}
.on-time {
    color: #4caf50;
}
</style>
