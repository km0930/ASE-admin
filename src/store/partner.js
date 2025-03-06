import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  error_msgs: {
    partner_name: false,
    partner_name_msg: '',
    plans: false,
    plans_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    num_users: false,
    num_users_msg: '',
    domains: false,
    domains_msg: ''
  },
  listInActivePartners: [],
  listPartners: [],
  loading: false,
  paginationKey: {},
  paginationKeyInActive: {},
  partnerInfo: {},
  plansOptions: [],
  searchByName: '',
  searchFire: false,
  statusOfApi: true
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_PARTNERS(state, data) {
    const prev = state.listPartners
    state.listPartners = prev.concat(data)
  },
  RESET_LIST_PARTNERS(state, data) {
    state.listPartners = data
  },
  LIST_INACTIVE_PARTNERS(state, data) {
    const prev = state.listInActivePartners
    state.listInActivePartners = prev.concat(data)
  },
  RESET_LIST_INACTIVE_PARTNERS(state, data) {
    state.listInActivePartners = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  PAGINATION_KEY_INACTIVE(state, data) {
    state.paginationKeyInActive = data
  },
  FETCH_PARTNER_INFO(state, data) {
    state.partnerInfo = {}
    state.partnerInfo = data
  },
  PLANS_LIST(state, data) {
    state.plansOptions = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
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
  async fetchPartners({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'partner/list-active-partners', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const partnerList = res.data.data.data.map((data) => ({
            name: data.partner_name,
            id: data.sk,
            numUsers: data.num_users,
            startDate: data.start_date,
            endDate: data.end_date,
            plans: data.plans ? data.plans.length : 0
          }))
          if (payload.reset) {
            commit('RESET_LIST_PARTNERS', partnerList)
          } else {
            commit('LIST_PARTNERS', partnerList)
          }
          commit('PAGINATION_KEY', res.data.data.last_value || {})
          commit('SEARCH_FIRE', false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchInActivePartners({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'partner/list-expired-partners', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const partnerList = res.data.data.data.map((data) => ({
            name: data.partner_name,
            id: data.sk,
            numUsers: data.num_users,
            startDate: data.start_date,
            endDate: data.end_date,
            plans: data.plans ? data.plans.length : 0
          }))
          if (payload.reset) {
            commit('RESET_LIST_INACTIVE_PARTNERS', partnerList)
          } else {
            commit('LIST_INACTIVE_PARTNERS', partnerList)
          }
          commit('PAGINATION_KEY_INACTIVE', res.data.data.last_value || {})
          commit('SEARCH_FIRE', false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchPartner({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const partnerList = res.data.data.data.map((partner) => ({
            name: partner.partner_name,
            id: partner.sk
          }))

          commit('SEARCH_FIRE', true)
          if (payload.reset) {
            commit('RESET_LIST_PARTNERS', partnerList)
          } else {
            commit('LIST_PARTNERS', partnerList)
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
  async searchPartnerInActive({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const partnerList = res.data.data.data.map((partner) => ({
            name: partner.partner_name,
            id: partner.sk
          }))
          commit('SEARCH_FIRE', true)
          if (payload.reset) {
            commit('RESET_LIST_INACTIVE_PARTNERS', partnerList)
          } else {
            commit('LIST_INACTIVE_PARTNERS', partnerList)
          }
          if (res.data.data.pagination) {
            commit('PAGINATION_KEY_INACTIVE', res.data.data.pagination)
          } else {
            commit('PAGINATION_KEY_INACTIVE', {})
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
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async createPartner({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      partner_name: false,
      partner_name_msg: '',
      plans: false,
      plans_msg: '',
      start_date: false,
      start_date_msg: '',
      end_date: false,
      end_date_msg: '',
      num_users: false,
      num_users_msg: '',
      domains: false,
      domains_msg: ''
    })
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'partner/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchPartners', data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Partner has been created successfully', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            partner_name: false,
            partner_name_msg: '',
            plans: false,
            plans_msg: '',
            start_date: false,
            start_date_msg: '',
            end_date: false,
            end_date_msg: '',
            num_users: false,
            num_users_msg: '',
            domains: false,
            domains_msg: ''
          }
          if (error.response.data.message.partner_name) {
            if (typeof error.response.data.message.partner_name === 'object') {
              errMsgs.partner_name = true
              errMsgs.partner_name_msg = error.response.data.message.partner_name.toString()
            } else {
              errMsgs.partner_name = true
              errMsgs.partner_name_msg = error.response.data.message.partner_name
            }
          }
          if (error.response.data.message.plans) {
            if (typeof error.response.data.message.plans === 'object') {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans.toString()
            } else {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans
            }
          }
          if (error.response.data.message.start_date) {
            if (typeof error.response.data.message.start_date === 'object') {
              errMsgs.start_date = true
              errMsgs.start_date_msg = error.response.data.message.start_date.toString()
            } else {
              errMsgs.start_date = true
              errMsgs.start_date_msg = error.response.data.message.start_date
            }
          }
          if (error.response.data.message.end_date) {
            if (typeof error.response.data.message.end_date === 'object') {
              errMsgs.end_date = true
              errMsgs.end_date_msg = error.response.data.message.end_date.toString()
            } else {
              errMsgs.end_date = true
              errMsgs.end_date_msg = error.response.data.message.end_date
            }
          }
          if (error.response.data.message.num_users) {
            if (typeof error.response.data.message.num_users === 'object') {
              errMsgs.num_users = true
              errMsgs.num_users_msg = error.response.data.message.num_users.toString()
            } else {
              errMsgs.num_users = true
              errMsgs.num_users_msg = error.response.data.message.num_users
            }
          }
          if (error.response.data.message.domains) {
            if (typeof error.response.data.message.domains === 'object') {
              errMsgs.domains = true
              errMsgs.domains_msg = error.response.data.message.domains.toString()
            } else {
              errMsgs.domains = true
              errMsgs.domains_msg = error.response.data.message.domains
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
  async fetchPartner({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'partner/get', payload)
      .then((res) => {
        if (res.data.success) {
          const partnerInfo = {
            partner_name: res.data.data.partner_name,
            id: res.data.data.sk,
            domains: res.data.data.domains,
            end_date: res.data.data.end_date,
            start_date: res.data.data.start_date,
            num_users: res.data.data.num_users,
            plans: res.data.data.plans
          }
          commit('FETCH_PARTNER_INFO', partnerInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updatePartner({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      partner_name: false,
      partner_name_msg: '',
      plans: false,
      plans_msg: '',
      start_date: false,
      start_date_msg: '',
      end_date: false,
      end_date_msg: '',
      num_users: false,
      num_users_msg: '',
      domains: false,
      domains_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'partner/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchPartners', data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Partner has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            partner_name: false,
            partner_name_msg: '',
            plans: false,
            plans_msg: '',
            start_date: false,
            start_date_msg: '',
            end_date: false,
            end_date_msg: '',
            num_users: false,
            num_users_msg: '',
            domains: false,
            domains_msg: ''
          }
          if (error.response.data.message.partner_name) {
            if (typeof error.response.data.message.partner_name === 'object') {
              errMsgs.partner_name = true
              errMsgs.partner_name_msg = error.response.data.message.partner_name.toString()
            } else {
              errMsgs.partner_name = true
              errMsgs.partner_name_msg = error.response.data.message.partner_name
            }
          }
          if (error.response.data.message.plans) {
            if (typeof error.response.data.message.plans === 'object') {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans.toString()
            } else {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans
            }
          }
          if (error.response.data.message.start_date) {
            if (typeof error.response.data.message.start_date === 'object') {
              errMsgs.start_date = true
              errMsgs.start_date_msg = error.response.data.message.start_date.toString()
            } else {
              errMsgs.start_date = true
              errMsgs.start_date_msg = error.response.data.message.start_date
            }
          }
          if (error.response.data.message.end_date) {
            if (typeof error.response.data.message.end_date === 'object') {
              errMsgs.end_date = true
              errMsgs.end_date_msg = error.response.data.message.end_date.toString()
            } else {
              errMsgs.end_date = true
              errMsgs.end_date_msg = error.response.data.message.end_date
            }
          }
          if (error.response.data.message.num_users) {
            if (typeof error.response.data.message.num_users === 'object') {
              errMsgs.num_users = true
              errMsgs.num_users_msg = error.response.data.message.num_users.toString()
            } else {
              errMsgs.num_users = true
              errMsgs.num_users_msg = error.response.data.message.num_users
            }
          }
          if (error.response.data.message.domains) {
            if (typeof error.response.data.message.domains === 'object') {
              errMsgs.domains = true
              errMsgs.domains_msg = error.response.data.message.domains.toString()
            } else {
              errMsgs.domains = true
              errMsgs.domains_msg = error.response.data.message.domains
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
  deletePartner({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'partner/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchPartners', data)
          Notify.create({ message: 'Partner has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchplansOptions({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'partner/chargebee/plans', payload)
      .then((res) => {
        const plansOptions = res.data.data.map((plan) => ({
          value: plan.id,
          label: `${plan.name}`
        }))
        commit('PLANS_LIST', plansOptions)
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
  fetchlistInActivePartners: (state) => state.listInActivePartners,
  fetchlistPartners: (state) => state.listPartners,
  fetchStatusOfApi: (state) => state.statusOfApi,
  isLoading: (state) => state.loading,
  partnerPaginationKeyForward: (state) => state.paginationKey,
  partnerPaginationKeyInActiveForward: (state) => state.paginationKeyInActive,
  plansOptionsGetter: (state) => (state.plansOptions.length > 0 ? [...new Set(state.plansOptions)] : []),
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singlepartnerInfo: (state) => (Object.keys(state.partnerInfo).length > 0 ? state.partnerInfo : [])
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
