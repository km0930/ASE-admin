import jwtDecode from 'jwt-decode'
import { defineStore } from 'pinia'
import { LocalStorage, Notify } from 'quasar'
import { api } from 'src/boot/axios'
const useLoginStore = defineStore('loginStore', {
  state: () => ({
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
  }),
  getters: {
    addedNewPwd: (state) => state.addedNewPwd,
    loading: (state) => state.isLoggedIn,
    fetchUserInfo: () => LocalStorage.getItem('user'),
    fetchErrorMsgs: (state) => state.error_msgs,
    fetchErrorMsgsForgotPwd: (state) => state.error_msgs_forgot_pwd,
    fetchErrorMsgsForgotPwdWithHash: (state) => state.error_msgs_forgot_pwd_with_hash,
    roleIsAdmin() {
      const userInfo = LocalStorage.getItem('user')
      return !(userInfo.email && userInfo.role === 'Analyst')
    }
  },
  actions: {
    async LOGIN_SUCCESS(token) {
      this.token = token.IdToken
      this.access_token = token.AccessToken
      this.refresh_token = token.RefreshToken
      this.email = 'tilak@appsecengineer.com'
      LocalStorage.set('token', this.token)
      LocalStorage.set('access_token', this.access_token)
      LocalStorage.set('refresh_token', this.refresh_token)
      const decodedData = jwtDecode(token.IdToken)
      const user = {
        email: decodedData.email,
        firstName: decodedData.given_name,
        lastName: decodedData.family_name,
        role: token.role
      }
      LocalStorage.set('user', user)
      LocalStorage.remove('breadcrumbs')
      window.location = '/portal/dashboard'
    },
    LOGIN_STATUS(data) {
      this.isLoggedIn = data
    },
    IS_VERIFY_STATUS(data) {
      this.isVerify = data
    },
    LOGIN_ERROR(data) {
      this.isError = data
    },
    SUCCESS_MSG_PWD(data) {
      this.successMsgPWd = data
    },
    PASSWORD_ERROR_MSG(data) {
      this.pwdErrorMsg = data
    },
    ADDED_NEW_PASSWORD(data) {
      this.addedNewPwd = data
    },
    IS_VERIFY_ERROR(data) {
      this.isVerifyError = data
    },
    ERROR_MSGS(data) {
      this.error_msgs = Object.assign(this.error_msgs, data)
    },
    ERROR_MSGS_FORGOT_PWD(data) {
      this.error_msgs_forgot_pwd = Object.assign(this.error_msgs_forgot_pwd, data)
    },
    ERROR_MSGS_FORGOT_PWD_WITH_HASH(data) {
      this.error_msgs_forgot_pwd_with_hash = Object.assign(this.error_msgs_forgot_pwd_with_hash, data)
    },
    errorMsgReset(data) {
      this.ERROR_MSGS(data)
    },
    isVerifyStatus(payload) {
      this.IS_VERIFY_ERROR(false)
      this.IS_VERIFY_STATUS(payload)
    },
    SET_IS_LOADING(payload) {
      this.loading = payload
    },
    async setPasswordWithConfirmationCodes(payload) {
      this.SET_IS_LOADING(true)
      this.ERROR_MSGS_FORGOT_PWD_WITH_HASH({
        status: true,
        email: false,
        email_msg: '',
        code: false,
        code_msg: '',
        password: false,
        password_msg: ''
      })
      try {
        const res = await api.post('admin/forgot-password', payload)
        if (res.data.message === 'Confirm Password') {
          window.location = '/confirm-user'
        }
        if (res.data.success) {
          this.ADDED_NEW_PASSWORD(true)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        } else {
          this.ADDED_NEW_PASSWORD(false)
          Notify.create({ message: res.data.message, color: 'red', position: 'top' })
        }
      } catch (error) {
        this.LOGIN_STATUS(false)
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
            errMsgs.email = true
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
          this.ERROR_MSGS_FORGOT_PWD_WITH_HASH(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      } finally {
        this.SET_IS_LOADING(false)
      }
    },
    async forgotPassword(payload) {
      this.SET_IS_LOADING(true)
      this.ERROR_MSGS_FORGOT_PWD({
        status: true,
        email: false,
        email_msg: ''
      })
      try {
        const res = await api.post('admin/forgot-passwords', payload)
        if (res.data.success) {
          this.PASSWORD_ERROR_MSG('')
          this.SUCCESS_MSG_PWD(res.data.data)
          Notify.create({ message: 'Confirmation code has been sent to a registered email', color: 'green', position: 'top' })
        }
      } catch (error) {
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
          this.ERROR_MSGS_FORGOT_PWD(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      } finally {
        this.SET_IS_LOADING(false)
      }
    },
    async loginUserVerify(payload) {
      LocalStorage.set('trial', 'false')
      LocalStorage.remove('verify')
      try {
        const res = await api.post('auth/respond', payload)
        this.IS_VERIFY_STATUS(false)
        if (res.data.success) {
          this.LOGIN_SUCCESS(res.data.data.AuthenticationResult)
        } else {
          this.IS_LOGIN_STATUS(false)
          this.IS_LOGIN_ERROR(true)
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
      } catch (error) {
        console.log(error)
        this.IS_VERIFY_STATUS(false)
        if (error.response.data.Session) {
          LocalStorage.set('session', error.response.data.Session)
          window.location = '/'
        }
        this.IS_VERIFY_STATUS(false)
        this.IS_VERIFY_ERROR(true)
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
          window.location = '/'
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
            window.location = '/'
          }
        }
      }
    },
    async loginStatus(payload) {
      this.LOGIN_ERROR(false)
      this.LOGIN_STATUS(payload)
    },
    async loginData(payload) {
      const res = await api.post('auth/signin', payload)
      return res
    },
    logout() {
      Notify.create({ message: 'User logout successfully', color: 'green', position: 'top' })
      LocalStorage.clear()
      window.location = '/'
    }
  }
})

export { useLoginStore }
