<template>
<v-container>
  <v-card max-width="1200px" color="primary" dark class="mx-auto text-center">
    <v-card-title>
      <div class="display-1">Cadastros</div>
    </v-card-title>

    <v-card-text>
      <v-sheet color="#ffffff">
        <v-sparkline :loading="loading" class="sparkline-label" :value="registerDates.map(date => date.value)" color="#2196f3da" height="100" padding="16" label-size="4px" stroke-linecap="round" :labels="registerDates.map(date => date.month)">
        </v-sparkline>
      </v-sheet>
      <v-divider></v-divider>
      <v-data-table light :loading="loading" :headers="tableHeaders" :items="registerDates" :rows-per-page-items="[10, 15, 25, 50]">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.month }}</td>
          <td>{{ props.item.value }}</td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'

export default {
  data: () => ({
    registerDates: [],
    tableHeaders: [
      { text: 'Mês', value: 'month' },
      { text: 'Novos cadastrados', value: 'value' }
    ],
    loading: true
  }),
  methods: {
    ...mapActions(['getRegisterTimestamps']),
    setRegisterDatesArray(interval, dates) {
      let chartData = []
      if (interval === 'monthly') {
        const months = dates.map(date => date.format('YYYYMM'))
        for (let month of months) {
          const monthIndex = _.findIndex(chartData, ['month', month])
          if (~monthIndex) {
            chartData[monthIndex].value = chartData[monthIndex].value + 1
          } else {
            chartData.push({
              month,
              value: 1
            })
          }
        }
        chartData = _.orderBy(chartData, 'month')
      }
      return chartData
    }
  },
  mounted() {
    this.loading = true
    this.getRegisterTimestamps().then(timestamps => {
      const formattedTimestamps = timestamps.map(timestamp => this.$moment(timestamp))
      this.registerDates = this.setRegisterDatesArray('monthly', formattedTimestamps)
      this.loading = false
    })
  }
}
</script>

<style lang="scss">
.sparkline-label {
    g {
        font-size: 0.32em !important;
    }
}
</style>
