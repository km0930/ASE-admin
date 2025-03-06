import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

export async function isAuthenticated(to) {
  const token = LocalStorage.getItem('token')
  if (!token) {
    return false
  } else {
    const expTime = LocalStorage.getItem('expTime')
    const currentDate = new Date()
    const currentTime = currentDate.getTime()
    if (currentTime > parseInt(expTime)) {
      try {
        const res = await refreshAccessToken()
        if (res.data.success) {
          LocalStorage.set('token', res.data.data.IdToken)
          LocalStorage.set('expTime', calculateExpirationTime())
          return true
        }
      } catch (error) {
        handleNetworkError()
      }
      return true
    }
    if (to.path.includes('/')) {
      this.$router.push('/portal/courses')
    }
    return true
  }
}

async function refreshAccessToken() {
  const payload = {
    refresh_token: LocalStorage.getItem('rtoken')
  }
  return await api.post('user/refresh-token', payload)
}
function calculateExpirationTime() {
  return new Date().setSeconds(new Date().getSeconds() + 14400)
}
function handleNetworkError() {
  const keysToRemove = ['startTime', 'expTime', 'token', 'isOwasp', 'rtoken', 'user', 'userId', 'provisionInfo', 'sub_']
  keysToRemove.forEach((key) => LocalStorage.remove(key))
  window.location.href = '/'
  return false
}
