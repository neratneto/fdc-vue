import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Conferencia from '@/views/Conferencia.vue'
import DevoLoc from '@/components/DevoLoc.vue'
import Register from '@/views/Register.vue'
import Performance from '@/views/Performance.vue'


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
      props: { actionType: 'devolução' },
      component: DevoLoc
    }, {
      path: '/locacao',
      name: 'locacao',
      props: { actionType: 'locação' },
      component: DevoLoc
    }, {
      path: '/register',
      name: 'register',
      component: Register,
      props: true
    }, {
      path: '/performance',
      name: 'performance',
      component: Performance
    }
  ]
})
