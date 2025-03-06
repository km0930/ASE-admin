import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

export default {
  namespaced: true,
  state: {
    email: '',
    error_msgs: {
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: ''
    },
    isFetch: false,
    loading: false
  },
  mutations: {
    LOADING(state, data) {
      state.loading = data
      showLoader(data)
    },
    IS_CONFIRM_USER_STATUS(state, data) {
      state.isFetch = data
    },
    ERROR_MSGS(state, data) {
      state.error_msgs = Object.assign(state.error_msgs, data)
    }
  },
  actions: {
    loadingStatus({ commit }, data) {
      commit('LOADING', data)
    },
    errorMsgReset({ commit }, data) {
      commit('ERROR_MSGS', data)
    },
    async changeUserDetails({ commit }, payload) {
      commit('LOADING', true)
      commit('ERROR_MSGS', {
        email: false,
        email_msg: '',
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: ''
      })
      await axios
        .post(config.baseURLApi + 'admin/update', payload)
        .then((res) => {
          if (res.data.success) {
            Notify.create({ message: 'User details has been successfully updated.', color: 'green', position: 'top' })
          }
        })
        .catch((error) => {
          commit('IS_CONFIRM_USER_STATUS', false)
          if (error.response.status === 400) {
            const errMsgs = {
              email: false,
              email_msg: '',
              first_name: false,
              first_name_msg: '',
              last_name: false,
              last_name_msg: ''
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
            if (error.response.data.message.first_name) {
              if (typeof error.response.data.message.first_name === 'object') {
                errMsgs.first_name = true
                errMsgs.first_name_msg = error.response.data.message.first_name.toString()
              } else {
                errMsgs.first_name = true
                errMsgs.first_name_msg = error.response.data.message.first_name
              }
            }
            if (error.response.data.message.last_name) {
              if (typeof error.response.data.message.last_name === 'object') {
                errMsgs.last_name = true
                errMsgs.last_name_msg = error.response.data.message.last_name.toString()
              } else {
                errMsgs.last_name = true
                errMsgs.last_name_msg = error.response.data.message.last_name
              }
            }
            commit('ERROR_MSGS', errMsgs)
            if (typeof error.response.data.message === 'string') {
              Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
            }
          } else {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        })
        .finally(() => commit('LOADING', false))
    }
  },
  getters: {
    fetchErrorMsgs: (state) => state.error_msgs,
    isLoading: (state) => state.loading
  }
}
