<template>
<v-container fluid>
  <v-layout wrap>
    <v-flex xs12 md6>
      <performance-card class="ma-3" title="Cadastros" :items="cadastros" :headers="['Ano - Mês', 'Novos cadastros']" :loading="cadastrosLoading" />
    </v-flex>
    <v-flex xs12 md6>
      <performance-card class="ma-3" title="Locações" :items="locacoes" :headers="['Ano - Mês', 'Locações']" :loading="locacoesLoading" />
    </v-flex>
    <v-flex xs12 md6>
      <performance-card class="ma-3" title="Devoluções" :items="devolucoes" :headers="['Ano - Mês', 'Devoluções']" :loading="devolucoesLoading" />
    </v-flex>
    <v-flex xs12 md6>
      <performance-card class="ma-3" title="Conferências" :items="conferencias" :headers="['Ano - Mês', 'Conferências']" :loading="conferenciasLoading" />
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import PerformanceCard from '../components/PerformanceCard.vue'

export default {
  components: {
    PerformanceCard
  },
  data: () => ({
    cadastros: [],
    locacoes: [],
    devolucoes: [],
    conferencias: [],
    cadastrosLoading: true,
    locacoesLoading: true,
    devolucoesLoading: true,
    conferenciasLoading: true
  }),
  methods: {
    ...mapActions(['getRegisterTimestamps', 'getHistoryDates']),
    setCadastros(interval, dates) {
      let chartData = []
      if (interval === 'monthly') {
        const months = dates.map(date => date.format('YYYYMM'))
        for (let month of months) {
          const monthIndex = _.findIndex(chartData, ['text', month])
          if (~monthIndex) {
            chartData[monthIndex].value = chartData[monthIndex].value + 1
          } else {
            chartData.push({
              text: month,
              value: 1
            })
          }
        }
        chartData = _.orderBy(chartData, 'text')
      }
      return chartData
    },
    setHistoryDates(interval, dates) {
      let chartData = []
      if (interval === 'monthly') {
        const months = dates.map(date => date.format('YYYYMM'))
        for (let month of months) {
          const monthIndex = _.findIndex(chartData, ['text', month])
          if (~monthIndex) {
            chartData[monthIndex].value = chartData[monthIndex].value + 1
          } else {
            chartData.push({
              text: month,
              value: 1
            })
          }
        }
        chartData = _.orderBy(chartData, 'text')
      }
      return chartData
    },
    getCadastros() {
      this.cadastrosLoading = true
      this.getRegisterTimestamps().then(timestamps => {
        const formattedTimestamps = timestamps.map(timestamp => this.$moment(timestamp))
        this.cadastros = this.setHistoryDates('monthly', formattedTimestamps)
        this.cadastrosLoading = false
      })
    },
    getHistory(variableName, actionName) {
      this[`${variableName}Loading`] = true
      this.getHistoryDates(actionName).then(timestamps => {
        const formattedTimestamps = timestamps.map(timestamp => this.$moment(timestamp))
        this[variableName] = this.setHistoryDates('monthly', formattedTimestamps)
        this[`${variableName}Loading`] = false
      })
    }
  },
  mounted() {
    this.getCadastros()
    this.getHistory('locacoes', 'Locação')
    this.getHistory('devolucoes', 'Devolução')
    this.getHistory('conferencias', 'Conferência')
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
