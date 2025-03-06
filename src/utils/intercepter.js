import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'

export async function refreshToken(message) {
  if (message === 'The incoming token has expired') {
    const formData = {
      refresh_token: LocalStorage.getItem('refresh_token')
    }
    return await api
      .post('admin/refresh-token', formData)
      .then(async (res) => {
        LocalStorage.remove('token')
        LocalStorage.remove('access_token')
        LocalStorage.set('token', res.data.data.AuthenticationResult.IdToken)
        LocalStorage.set('access_token', res.data.data.AuthenticationResult.AccessToken)
        return res.data.data.AuthenticationResult.IdToken
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.data.message === 'Not a valid token') {
          LocalStorage.clear()
          window.location.href = '/'
        }
      })
  } else if (message === 'Unauthorized' || message === 'Not a valid token') {
    LocalStorage.clear()
    window.location.href = '/'
  }
}

export default refreshToken
