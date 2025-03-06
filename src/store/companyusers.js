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
    last_name_msg: ''
  },
  errorMessage: '',
  listUsers: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  statusOfApi: true,
  uiSearch: false
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  IS_CREATE_ERROR(state, data) {
    state.errorMessage = data
  },
  USERS_LIST(state, data) {
    const prev = state.listUsers
    state.listUsers = prev.concat(data)
  },
  RESET_USERS_LIST(state, data) {
    state.listUsers = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
  },
  UI_SEARCH(state, data) {
    state.uiSearch = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  uiSearchAction({ commit }, data) {
    commit('UI_SEARCH', data)
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async createCompanyAdminUser({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'company/create-admin', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'User is created successfully', color: 'green', position: 'top' })
          this.$router.push(this.$router.path)
          this.$router.go(this.$router.path)
        } else {
          commit('STATUS_OF_API', false)
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
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
  },
  async fetchCompanyUserStats({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'company/users/stats', payload)
      .then((res) => {
        if (res.data.success) {
          const companyUserStats = {
            total: res.data.data.admin_users + res.data.data.users
          }
          commit('COMPANY_USERS_STATS', companyUserStats)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchCompanyUsersList({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'company/users', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.data.map((user) => ({
            first_name: user.name,
            last_name: user.name,
            email: user.email,
            isAdmin: user.is_admin,
            isActive: user.is_active,
            last_login: user.last_login || 'Not yet logged'
          }))
          if (payload.reset) {
            commit('RESET_USERS_LIST', listUsers)
          } else {
            commit('USERS_LIST', listUsers)
          }
          if (res.data.data.pagination) {
            commit('PAGINATION_KEY', res.data.data.pagination)
          } else {
            commit('PAGINATION_KEY', {})
          }
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchToggleStatus({ state, commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'company/user/toggle', payload)
      .then((res) => {
        if (res.data.success) {
          const searchIndex = state.listUsers
            .map(function (e) {
              return e.email
            })
            .indexOf(payload.email)
          const listFinal = state.listUsers
          const updateObj = listFinal[searchIndex]
          updateObj.isAdmin = res.data.data.is_admin
          listFinal[searchIndex] = updateObj
          commit('RESET_USERS_LIST', listFinal)
          const dataCompany = {
            company_id: payload.company_id
          }
          dispatch('fetchCompanyUserStats', dataCompany)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchToggleStatusIsActive({ state, commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'company/user/toggle', payload)
      .then((res) => {
        if (res.data.success) {
          const searchIndex = state.listUsers.map((e) => e.email).indexOf(payload.email)
          const listFinal = state.listUsers
          const updateObj = listFinal[searchIndex]
          updateObj.isActive = res.data.data.is_active
          listFinal[searchIndex] = updateObj
          commit('RESET_USERS_LIST', listFinal)
          const dataCompany = {
            company_id: payload.company_id
          }
          dispatch('fetchCompanyUserStats', dataCompany)
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchCompanyUsers({ state, commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.users.map((user) => ({
            first_name: user.name,
            last_name: user.name,
            email: user.email,
            isAdmin: user.is_admin,
            last_login: user.last_login || 'Not yet logged'
          }))
          commit('SEARCH_FIRE', true)

          if (payload.reset) {
            commit('RESET_USERS_LIST', listUsers)
          } else {
            commit('USERS_LIST', listUsers)
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
  }
}

const getters = {
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchStatusOfApi: (state) => state.statusOfApi,
  getCompanyUsersListGetter: (state) => (state.listUsers.length > 0 ? [...new Set(state.listUsers)] : []),
  isLoading: (state) => state.loading,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  usersCompanyPaginationKeyForward: (state) => state.paginationKey
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
