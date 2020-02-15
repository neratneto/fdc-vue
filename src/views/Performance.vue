<template>
<v-container fluid>
  <v-layout wrap>
    <v-flex xs12>
      <v-layout justify-center class="mb-3">
        <h1 style="font-weight: normal">Filtrar por jogo!</h1>
      </v-layout>
      <v-layout justify-center>
        <v-autocomplete style="max-width: 480px;" label="Jogo" clearable name="games" :items="possibleGames" v-model="gameFilter" solo />
        <v-btn color="secondary" @click="getAllHistories">Filtrar!</v-btn>
      </v-layout>
    </v-flex>
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
    conferenciasLoading: true,
    gameFilter: null
  }),
  computed: {
    ...mapState({
      possibleGames: state => state.gamesList
    })
  },
  methods: {
    ...mapActions(['getRegisterTimestamps', 'getHistoryDates', 'setFullGamesList']),
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
      const gameFilter = this.gameFilter || false
      this[`${variableName}Loading`] = true
      this.getHistoryDates({ actionName, gameFilter }).then(timestamps => {
        const formattedTimestamps = timestamps.map(timestamp => this.$moment(timestamp))
        this[variableName] = this.setHistoryDates('monthly', formattedTimestamps)
        this[`${variableName}Loading`] = false
      })
    },
    getAllHistories() {
      this.getHistory('locacoes', 'Locação')
      this.getHistory('devolucoes', 'Devolução')
      this.getHistory('conferencias', 'Conferência')
    }
  },
  mounted() {
    this.getCadastros()
    this.getAllHistories()
    this.setFullGamesList()
  }
}
</script>

<style lang="scss">
.sparkline-label {
    g {
        font-size: 0.32em !important;
    }
}
.app {
  background-color: rgba(248, 177, 51, 0.8) !important;
}
</style>
