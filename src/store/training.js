import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  error_msgs: {
    training_name: false,
    training_name_msg: '',
    plans: false,
    plans_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    num_users: false,
    num_users_msg: '',
    minutes_per_user: false,
    minutes_per_user_msg: '',
    domains: false,
    domains_msg: ''
  },
  error_msgs_user: {
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    role: false,
    role_msg: ''
  },
  listTraining: [],
  listTrainingInActive: [],
  loading: false,
  paginationKey: {},
  paginationKeyBackward: {},
  paginationKeyInActive: {},
  plansOptions: [],
  searchByName: '',
  searchFire: false,
  statusOfApi: true,
  trainingInfo: {}
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  ERROR_MSGS_USER(state, data) {
    state.error_msgs_user = Object.assign(state.error_msgs_user, data)
  },
  LIST_TRAINING(state, data) {
    const prev = state.listTraining
    state.listTraining = prev.concat(data)
  },
  RESET_LIST_TRAINING(state, data) {
    state.listTraining = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  LIST_TRAINING_INACTIVE(state, data) {
    const prev = state.listTrainingInActive
    state.listTrainingInActive = prev.concat(data)
  },
  RESET_LIST_TRAINING_INACTIVE(state, data) {
    state.listTrainingInActive = data
  },
  PAGINATION_KEY_INACTIVE(state, data) {
    state.paginationKeyInActive = data
  },
  FETCH_TRAINING_INFO(state, data) {
    state.trainingInfo = {}
    state.trainingInfo = data
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
  errorMsgResetUser({ commit }, data) {
    commit('ERROR_MSGS_USER', data)
  },
  async fetchTrainings({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'training/list-active-trainings', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const traniningList = res.data.data.data.map((data) => ({
            name: data.training_name,
            id: data.sk,
            numUsers: data.num_users,
            startDate: data.start_date,
            endDate: data.end_date,
            plans: data.plans ? data.plans.length : 0
          }))
          if (payload.reset) {
            commit('RESET_LIST_TRAINING', traniningList)
          } else {
            commit('LIST_TRAINING', traniningList)
          }
          commit('PAGINATION_KEY', res.data.data.last_value || {})
          commit('SEARCH_FIRE', false)
        }
        commit('LOADING', false)
      })
      .catch((error) => {
        commit('LOADING', false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  },
  async fetchTrainingsInActive({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'training/list-expired-trainings', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const traniningList = res.data.data.data.map((data) => ({
            name: data.training_name,
            id: data.sk,
            numUsers: data.num_users,
            startDate: data.start_date,
            endDate: data.end_date,
            plans: data.plans ? data.plans.length : 0
          }))
          if (payload.reset) {
            commit('RESET_LIST_TRAINING_INACTIVE', traniningList)
          } else {
            commit('LIST_TRAINING_INACTIVE', traniningList)
          }
          commit('PAGINATION_KEY_INACTIVE', res.data.data.pagination || {})
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
  async searchTraining({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const traniningList = res.data.data.data.map((partner) => ({
            name: partner.training_name,
            id: partner.sk
          }))

          commit('SEARCH_FIRE', true)
          if (payload.reset) {
            commit('RESET_LIST_TRAINING', traniningList)
          } else {
            commit('LIST_TRAINING', traniningList)
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
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async createTraining({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      training_name: false,
      training_name_msg: '',
      minutes_per_user: false,
      minutes_per_user_msg: '',
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
      .post(config.baseURLApi + 'training/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchTrainings', data)
          commit('STATUS_OF_API', true)

          Notify.create({ message: 'Event has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            training_name: false,
            training_name_msg: '',
            minutes_per_user: false,
            minutes_per_user_msg: '',
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
          if (error.response.data.message.training_name) {
            if (typeof error.response.data.message.training_name === 'object') {
              errMsgs.training_name = true
              errMsgs.training_name_msg = error.response.data.message.training_name.toString()
            } else {
              errMsgs.training_name = true
              errMsgs.training_name_msg = error.response.data.message.training_name
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
          if (error.response.data.message.minutes_per_user_msg) {
            if (typeof error.response.data.message.minutes_per_user_msg === 'object') {
              errMsgs.minutes_per_user_msg = true
              errMsgs.minutes_per_user_msg_msg = error.response.data.message.minutes_per_user_msg.toString()
            } else {
              errMsgs.minutes_per_user_msg = true
              errMsgs.minutes_per_user_msg_msg = error.response.data.message.minutes_per_user_msg
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
  async fetchTraining({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'training/get', payload)
      .then((res) => {
        if (res.data.success) {
          const trainingInfo = {
            ...res.data.data,
            id: res.data.data.sk,
            plan: res.data.data.plan?.id || res.data.data.plan || res.data.data.plans[0]
          }
          commit('FETCH_TRAINING_INFO', trainingInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateTraining({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      training_name: false,
      training_name_msg: '',
      minutes_per_user: false,
      minutes_per_user_msg: '',
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
      .post(config.baseURLApi + 'training/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchTrainings', data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Event has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            training_name: false,
            training_name_msg: '',
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
          if (error.response.data.message.training_name) {
            if (typeof error.response.data.message.training_name === 'object') {
              errMsgs.training_name = true
              errMsgs.training_name_msg = error.response.data.message.training_name.toString()
            } else {
              errMsgs.training_name = true
              errMsgs.training_name_msg = error.response.data.message.training_name
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
          if (error.response.data.message.minutes_per_user_msg) {
            if (typeof error.response.data.message.minutes_per_user_msg === 'object') {
              errMsgs.minutes_per_user_msg = true
              errMsgs.minutes_per_user_msg_msg = error.response.data.message.minutes_per_user_msg.toString()
            } else {
              errMsgs.minutes_per_user_msg = true
              errMsgs.minutes_per_user_msg_msg = error.response.data.message.minutes_per_user_msg
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
  deleteTraining({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'training/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchTrainings', data)
          Notify.create({ message: 'Event has been successfully deleted', color: 'red', position: 'top' })
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
      .post(config.baseURLApi + 'training/chargebee/plans', payload)
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
  },
  async createUser({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS_USER', {
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'training/user/add', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'User is created successfully', color: 'green', position: 'top' })
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
          commit('ERROR_MSGS_USER', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async removeStatusUserTraining({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'training/user/remove', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', true)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async issueCertificate({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('event/issue-certificate', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Successfully sent', color: 'positive', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 404) {
          Notify.create({ message: error.response.data.message, color: 'negative', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async sendCertificate({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('training/send', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Successfully sent', color: 'positive', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || error.response.status === 404) {
          Notify.create({ message: error.response.data.message, color: 'negative', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchErrorMsgsUser: (state) => state.error_msgs_user,
  fetchlistTrainings: (state) => state.listTraining,
  fetchlistTrainingsInActive: (state) => state.listTrainingInActive,
  fetchStatusOfApi: (state) => state.statusOfApi,
  isLoading: (state) => state.loading,
  plansOptionsGetter: (state) => (state.plansOptions.length > 0 ? [...new Set(state.plansOptions)] : []),
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singleTrainingInfo: (state) => (Object.keys(state.trainingInfo).length > 0 ? state.trainingInfo : []),
  trainingPaginationKeyBackward: (state) => state.paginationKeyBackward,
  trainingPaginationKeyForward: (state) => state.paginationKey,
  trainingPaginationKeyForwardInActive: (state) => state.paginationKeyInActive
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
