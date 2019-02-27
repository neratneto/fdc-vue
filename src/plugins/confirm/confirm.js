import confirmTemplate from '@/plugins/confirm/ConfirmTemplate.vue'

/* eslint-disable prefer-promise-reject-errors */
export default {
  install(Vue) {
    let ConfirmConstructor = Vue.extend(confirmTemplate)
    let confirmInstance = null
    Vue.prototype.$confirm = (config) => {
      return new Promise((resolve, reject) => {
        if (confirmInstance) return
        confirmInstance = new ConfirmConstructor({
          el: document.createElement('div'),
          data() {
            return {
              message: config.message || '',
              confirmText: config.confirmText || 'Sim',
              cancelText: config.cancelText || 'Não',
              confirmColor: config.confirmColor || 'primary',
              cancelColor: config.cancelColor || undefined,
              items: config.items || []
            }
          },
          methods: {
            onConfirm() {
              confirmInstance.open = false
              confirmInstance = null
              resolve()
            },
            onCancel() {
              confirmInstance.open = false
              confirmInstance = null
              reject && reject('')
            }
          }
        })
        confirmInstance.open = true
        document.body.appendChild(confirmInstance.$el)
      })
    }
  }
}
