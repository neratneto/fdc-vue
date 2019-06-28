import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import Moment from 'moment'
import VueMomentLib from 'vue-moment-lib'
import Confirm from '@/plugins/confirm/confirm.js'
import Snackbar from '@/plugins/snackbar/snackbar.js'
import 'vuetify/dist/vuetify.min.css'
import Vuelidate from 'vuelidate'

Moment.locale('pt-BR')

Vue.use(Confirm)
Vue.use(Snackbar)
Vue.use(VueMomentLib, { moment: Moment })
Vue.use(Vuelidate)

Vue.use(Vuetify, {
  theme: {
    primary: '#ff9800',
    secondary: '#2196f3',
    accent: '#00bcd4',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#ffc107',
    success: '#4caf50'
  }
})

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
