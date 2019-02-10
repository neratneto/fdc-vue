import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Conferencia from './views/Conferencia.vue'
import Devolucao from './views/Devolucao.vue'
import Locacao from './views/Locacao.vue'
import Register from './views/Register.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/conferencia',
      name: 'conferencia',
      component: Conferencia
    }, {
      path: '/devolucao',
      name: 'devolucao',
      component: Devolucao
    }, {
      path: '/locacao',
      name: 'locacao',
      component: Locacao
    }, {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})
