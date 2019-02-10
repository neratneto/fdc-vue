import snackbarTemplate from '@/plugins/snackbar/SnackbarTemplate.vue'

/* eslint-disable prefer-promise-reject-errors */
export default {
  install(Vue) {
    let SnackbarConstructor = Vue.extend(snackbarTemplate)
    let snackbarInstance = null
    Vue.prototype.$snackbar = (config) => {
      return new Promise((resolve, reject) => {
        if (snackbarInstance) return
        snackbarInstance = new SnackbarConstructor({
          el: document.createElement('div'),
          data() {
            return {
              message: config.message || 'Ocorreu um erro, tente novamente',
              btnText: config.btnText,
              snackbarColor: config.snackbarColor || 'grey darken-1'
            }
          },
          methods: {
            closeSnackbar() {
              snackbarInstance.open = false
              snackbarInstance = null
              resolve()
            },
            clickButton() {
              snackbarInstance.open = false
              snackbarInstance = null
              reject && reject('')
            }
          }
        })
        snackbarInstance.open = true
        document.body.appendChild(snackbarInstance.$el)
      })
    }
  }
}
