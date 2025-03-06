import axios from 'axios'
import { LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'
import config from 'src/config'
import { refreshToken } from 'src/utils/intercepter'

const api = axios.create({ baseURL: config.baseURLApi })
const certificationApi = axios.create({ baseURL: config.certificationApi })
const challengeURLApi = axios.create({ baseURL: config.challengeURLApi })
const aiChallengeApi = axios.create({ baseURL: config.aiChallengesURL })
const generateQuestionApi = axios.create({ baseURL: config.generateQuestionApi })
const injectApi = axios.create({ baseURL: config.injectApi })
const webSocketCheckApi = axios.create({ baseURL: config.webSocketCheckApi })
const instances = [api, certificationApi, challengeURLApi, aiChallengeApi, generateQuestionApi, injectApi, webSocketCheckApi]

function addInterceptors(apiInstance) {
  apiInstance.interceptors.request.use(
    async (config) => {
      const token = LocalStorage.getItem('token')
      if (token) {
        config.headers.Authorization = token
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401 && error.response.data.message === 'The incoming token has expired') {
        const newToken = await refreshToken(error.response.data.message)
        if (newToken) {
          LocalStorage.set('token', newToken)
          error.config.headers.Authorization = newToken

          return axios.request(error.config)
        }
      } else if (error.response.status === 401) {
        LocalStorage.clear()
        window.location.href = '/'
      }
      return Promise.reject(error)
    }
  )
}

export default boot(({ app }) => {
  instances.forEach((instance) => addInterceptors(instance))
  app.config.globalProperties.$api = {
    api,
    certificationApi,
    challengeURLApi,
    aiChallengeApi,
    generateQuestionApi,
    injectApi,
    webSocketCheckApi
  }
})

export { aiChallengeApi, api, certificationApi, challengeURLApi, generateQuestionApi, injectApi, webSocketCheckApi }
