import Vue from 'vue'

export const userKey = '__bibliotech_user'
export const baseApiUrl = "http://localhost:3000"

export function showError(e) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultError({ message: e.response.data.message })
  } else if (typeof e==='string') {
    Vue.toasted.global.defaultError({ message: e })
  } else {
    Vue.toasted.global.defaultError()
  }
}

export function showSuccessMsg(e) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultSuccess({ message: e.response.data.message })
  } else if (typeof e==='string') {
    Vue.toasted.global.defaultSuccess({ message: e })
  } else {
    Vue.toasted.global.defaultSuccess()
  }
}

export function decodeToken(token) {
  let base64Url = token.split('.')[1]; // pega os dados do payload
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
}

export function formatDate(date) {
  const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON().slice(0, 10)
  return formatted
}

export function addDaysOnDate(date, days) {
  date.setDate(date.getDate() + days)
  date.getDate()
  return date
}

export default { baseApiUrl, showError, userKey }