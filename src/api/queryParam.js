const validateParams = (params) => {
  for (let param of params) {
    if (param instanceof Object) {
      for (var i in param) {
        if ((i === undefined || !i.toString().length) || (param[i] === undefined || param[i] === null || param[i] === 'all' || !param[i].toString().length)) delete param[i]
      }
    } else {
      throw new TypeError('Invalid instance')
    }
  }
}

export const queryParam = (...params) => {
  validateParams(params)
  params = Object.assign.apply(Object, [{}].concat(params))
  const esc = encodeURIComponent
  if (Object.keys(params).length === 0) return ''
  return '?' + Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&')
}
