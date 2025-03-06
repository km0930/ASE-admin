import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  error_msgs: {
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    plan: false,
    plan_msg: ''
  },
  listPayments: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  statusOfApi: true
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_PAYMENTS(state, data) {
    const prev = state.listPayments
    state.listPayments = prev.concat(data)
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  RESET_LIST_PAYMENTS(state, data) {
    state.listPayments = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async fetchPaymentsList({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'learning-path/list', payload.pagination)
      .then((res) => {
        const paymentsData = res.data.data.data.map((data) => ({
          first_name: data.first_name,
          id: data.sk,
          last_name: data.last_name,
          email: data.email
        }))
        commit('SEARCH_FIRE', false)
        if (payload.reset) {
          commit('RESET_LIST_PAYMENTS', paymentsData)
        } else {
          commit('LIST_PAYMENTS', paymentsData)
        }
        commit('PAGINATION_KEY', res.data.data.last_value || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchPayments({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const paymentsData = res.data.data.data.map((data) => ({
            first_name: data.first_name,
            id: data.sk,
            last_name: data.last_name,
            email: data.email
          }))
          commit('SEARCH_FIRE', true)

          if (payload.reset) {
            commit('RESET_LIST_PAYMENTS', paymentsData)
          } else {
            commit('LIST_PAYMENTS', paymentsData)
          }
          if (res.data.data.pagination) {
            commit('PAGINATION_KEY', res.data.data.pagination)
          } else {
            commit('PAGINATION_KEY', {})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createPayments({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: '',
      plan: false,
      plan_msg: ''
    })
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'subscription/register', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          if (res.data.message) {
            Notify.create({ message: res.data.message, color: 'green', position: 'top' })
          } else {
            Notify.create({ message: 'User has been successfully created', color: 'green', position: 'top' })
          }
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            email: false,
            email_msg: '',
            first_name: false,
            first_name_msg: '',
            last_name: false,
            last_name_msg: '',
            plan: false,
            plan_msg: ''
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
          if (error.response.data.message.plan) {
            if (typeof error.response.data.message.plan === 'object') {
              errMsgs.plan = true
              errMsgs.plan_msg = error.response.data.message.plan.toString()
            } else {
              errMsgs.plan = true
              errMsgs.plan_msg = error.response.data.message.plan
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
  },
  deletePayments({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'subscription/register/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchPaymentsList', data)

          Notify.create({ message: 'Learning Path has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchStatusOfApi: (state) => state.statusOfApi,
  isLoading: (state) => state.loading,
  listPaymentsGetter: (state) => (state.listPayments.length > 0 ? [...new Set(state.listPayments)] : []),
  paginationKeyForward: (state) => state.paginationKey,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
