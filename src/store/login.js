import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { Notify } from 'quasar'
import config from '../config'

const state = {
  email: '',
  error_msgs: {
    status: true,
    username: false,
    username_msg: '',
    password: false,
    password_msg: ''
  },
  error_msgs_forgot_pwd: {
    status: true,
    email: false,
    email_msg: ''
  },
  error_msgs_forgot_pwd_with_hash: {
    status: true,
    email: false,
    email_msg: '',
    code: false,
    code_msg: '',
    password: false,
    password_msg: ''
  },
  addedNewPwd: false,
  isError: false,
  isLoggedIn: false,
  isVerify: false,
  isVerifyError: false,
  loading: false,
  pwdErrorMsg: '',
  successMsgPWd: '',
  token: ''
}

const mutations = {
  async LOGIN_SUCCESS(state, token) {
    state.token = token.IdToken
    state.access_token = token.AccessToken
    state.refresh_token = token.RefreshToken
    state.email = 'tilak@appsecengineer.com'
    localStorage.setItem('token', state.token)
    localStorage.setItem('access_token', state.access_token)
    localStorage.setItem('refresh_token', state.refresh_token)
    const decodedData = jwtDecode(token.IdToken)
    const user = {
      email: decodedData.email,
      firstName: decodedData.given_name,
      lastName: decodedData.family_name,
      role: token.role
    }
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.removeItem('breadcrumbs')
    await this.$router.push('/portal/instructor')
    await this.$router.go('/portal/instructor')
  },
  LOGIN_STATUS(state, data) {
    state.isLoggedIn = data
  },
  IS_VERIFY_STATUS(state, data) {
    state.isVerify = data
  },
  LOGIN_ERROR(state, data) {
    state.isError = data
  },
  SUCCESS_MSG_PWD(state, data) {
    state.successMsgPWd = data
  },
  PASSWORD_ERROR_MSG(state, data) {
    state.pwdErrorMsg = data
  },
  ADDED_NEW_PASSWORD(state, data) {
    state.addedNewPwd = data
  },
  IS_VERIFY_ERROR(state, data) {
    state.isVerifyError = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  ERROR_MSGS_FORGOT_PWD(state, data) {
    state.error_msgs_forgot_pwd = Object.assign(state.error_msgs_forgot_pwd, data)
  },
  ERROR_MSGS_FORGOT_PWD_WITH_HASH(state, data) {
    state.error_msgs_forgot_pwd_with_hash = Object.assign(state.error_msgs_forgot_pwd_with_hash, data)
  }
}

const actions = {
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  isVerifyStatus({ commit }, payload) {
    commit('IS_VERIFY_ERROR', false)
    commit('IS_VERIFY_STATUS', payload)
  },
  async setPasswordWithConfirmationCodes({ commit }, payload) {
    commit('ERROR_MSGS_FORGOT_PWD_WITH_HASH', {
      status: true,
      email: false,
      email_msg: '',
      code: false,
      code_msg: '',
      password: false,
      password_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'admin/forgot-password', payload)
      .then((res) => {
        if (res.data.message === 'Confirm Password') {
          this.$router.push('/confirm-user')
        }
        if (res.data.success) {
          commit('ADDED_NEW_PASSWORD', true)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        } else {
          commit('ADDED_NEW_PASSWORD', false)
          Notify.create({ message: res.data.message, color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        commit('LOGIN_STATUS', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            email: false,
            email_msg: '',
            code: false,
            code_msg: '',
            password: false,
            password_msg: ''
          }
          if (error.response.data.message.email) {
            if (typeof error.response.data.message.email === 'object') {
              errMsgs.email = true
              errMsgs.email_msg = error.response.data.message.email.toString()
            } else {
              errMsgs.email = true
              errMsgs.email_msg = error.response.data.message.email
            }
          }
          if (error.response.data.message.code) {
            if (typeof error.response.data.message.code === 'object') {
              errMsgs.code = true
              errMsgs.code_msg = error.response.data.message.code.toString()
            } else {
              errMsgs.code = true
              errMsgs.code_msg = error.response.data.message.code
            }
          }
          if (error.response.data.message.password) {
            if (typeof error.response.data.message.password === 'object') {
              errMsgs.password = true
              errMsgs.password_msg = error.response.data.message.password.toString()
            } else {
              errMsgs.password = true
              errMsgs.password_msg = error.response.data.message.password
            }
          }
          commit('ERROR_MSGS_FORGOT_PWD_WITH_HASH', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
  },
  async forgotPassword({ commit }, payload) {
    commit('ERROR_MSGS_FORGOT_PWD', {
      status: true,
      email: false,
      email_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'admin/forgot-passwords', payload)
      .then((res) => {
        if (res.data.success) {
          commit('PASSWORD_ERROR_MSG', '')
          commit('SUCCESS_MSG_PWD', res.data.data)
          Notify.create({ message: 'Confirmation code has been sent to a registered email', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            email: false,
            email_msg: ''
          }
          if (error.response.data.message.email) {
            if (typeof error.response.data.message.email === 'object') {
              errMsgs.email = true
              errMsgs.email_msg = error.response.data.message.email.toString()
            } else {
              errMsgs.email = true
              errMsgs.email_msg = error.response.data.message.email
            }
          }
          commit('ERROR_MSGS_FORGOT_PWD', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
  },
  async loginUserVerify({ commit }, payload) {
    localStorage.setItem('trial', 'false')
    localStorage.removeItem('verify')

    await axios
      .post(config.baseURLApi + 'auth/respond', payload)
      .then((res) => {
        commit('IS_VERIFY_STATUS', false)

        if (res.data.success) {
          commit('LOGIN_SUCCESS', { ...res.data.data.AuthenticationResult, ...{ role: res.data.data.role } })
        } else {
          commit('IS_LOGIN_STATUS', false)
          commit('IS_LOGIN_ERROR', true)
          commit('ERROR_MSG_STATIS', true)
          commit('IS_VALID_RECAPTCH', false)
          commit('IS_LOGIN_ERROR_MSG', res.data.data)
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
      })
      .catch((error) => {
        commit('IS_VERIFY_STATUS', false)
        if (error.response.data.Session) {
          this.$router.push('/')
        }
        commit('IS_VERIFY_STATUS', false)
        commit('IS_VERIFY_ERROR', true)
        if (error.response.status === 400) {
          if (error.response.data.message === 'Not Authorized') {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: 'Attempts expired! Please generate new sign-in code'
            })
          } else {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: 'Attempts expired! Please generate new sign-in code'
            })
          }
          this.$router.push('/')
        } else if (error.toString() === 'Error: Network Error') {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Server busy please try latter!' })
        } else {
          if (typeof error.response.data.message === 'string') {
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: 'Attempts expired! Please generate new sign-in code'
            })
            this.$router.push('/')
          }
        }
      })
  },
  async loginStatus({ commit }, payload) {
    commit('LOGIN_ERROR', false)
    commit('LOGIN_STATUS', payload)
  },
  async loginData({ _ }, payload) {
    const res = await axios.post(config.baseURLApi + 'auth/signin', payload)
    return res
  },
  logout() {
    Notify.create({ message: 'User logout successfully', color: 'green', position: 'top' })
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('breadcrumbs')
    localStorage.clear()
    this.$router.push('/')
  }
}

const getters = {
  addedNewPwd: (state) => state.addedNewPwd,
  loading: (state) => state.isLoggedIn,
  fetchUserInfo: () => JSON.parse(localStorage.getItem('user')),
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchErrorMsgsForgotPwd: (state) => state.error_msgs_forgot_pwd,
  fetchErrorMsgsForgotPwdWithHash: (state) => state.error_msgs_forgot_pwd_with_hash,
  roleIsAdmin() {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    return !(userInfo.email && userInfo.role === 'Analyst')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
