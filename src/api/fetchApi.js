import { BASE_URL } from '@/api/constants'

const defaultHeaders = () => {
  return {
    'Content-type': 'application/json'
    // 'Authorization': 'Bearer ' + window.localStorage.getItem('token')
  }
}

const responseHandler = response => {
  if (!response.ok) {
    throw Error(response.status)
  }
  return response
}
const successHandler = response => {
  try {
    let json = response.json()
    if (response.status >= 200 && response.status < 300) {
      return json
    }
    // if (response.status === 500) {
    //   window.location.replace('/#/someting-wrong')
    // }
    return json.then(Promise.reject.bind(Promise))
  } catch (e) {
    throw e
  }
}

const errorHandler = error => {
  throw error
}

export const get = (endpoint, objectId = '', headers = defaultHeaders()) => {
  return fetch(`${BASE_URL}${endpoint}${objectId}`, {
    method: 'GET',
    headers
  }).then(responseHandler).then(successHandler).catch(errorHandler)
}

export const post = (endpoint, object, headers = defaultHeaders()) => {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(object)
  }).then(successHandler)
}

export const remove = (endpoint, objectId = '', headers = defaultHeaders()) => {
  return fetch(`${BASE_URL}${endpoint}${objectId}`, {
    method: 'DELETE',
    headers
  }).then(successHandler)
}

export const put = (endpoint, object, headers = defaultHeaders()) => {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(object)
  }).then(successHandler)
}
