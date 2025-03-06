import axios from 'axios'
import config from '../config'
import { refreshToken } from './intercepter'

const instance = axios.create({
  baseURL: config.aiChallengesURL,
  headers: {
    Authorization: localStorage.getItem('token')
  }
})
instance.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    if (error.response.status === 401) {
      if (error.response.data.message === 'The incoming token has expired') {
        return refreshToken(error.response.data.message).then(async (refreshTokenResponse) => {
          await axios.interceptors.request.use(async function (config) {
            const token = localStorage.getItem('token')
            config.headers.Authorization = token
            return config
          })
          if (refreshTokenResponse === localStorage.getItem('token')) {
            const reCallApi = error.response.config
            reCallApi.headers.Authorization = localStorage.getItem('token')
            instance.interceptors.request.use((request) => {
              request.headers.Authorization = localStorage.getItem('token')
              return request
            })
            return axios(reCallApi)
          }
        })
      } else if (error.response.data.message === 'Unauthorized') {
        localStorage.removeItem('token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('breadcrumbs')
        window.location.href = '/'
      } else if (error.response.data.message === 'Not a valid token') {
        localStorage.removeItem('token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('breadcrumbs')
        window.location.href = '/'
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default instance
