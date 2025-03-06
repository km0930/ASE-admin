import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  companyAdmins: [],
  companyUsersStats: {},
  error_msgs: {
    company_name_msg: '',
    company_name: false,
    domains_msg: '',
    domains: false,
    email_msg: '',
    email: false,
    end_date_msg: '',
    end_date: false,
    events_msg: '',
    events: false,
    first_name_msg: '',
    first_name: false,
    is_event_msg: '',
    is_event: false,
    last_name_msg: '',
    last_name: false,
    minutes_per_user_msg: '',
    minutes_per_user: false,
    monthly_minutes_msg: '',
    monthly_minutes: false,
    num_users_msg: '',
    num_users: false,
    parent_msg: '',
    parent: false,
    payment_complete_msg: '',
    payment_complete: false,
    plans_msg: '',
    plans: false,
    start_date_msg: '',
    start_date: false,
    status: true,
    subscription_msg: '',
    subscription: false
  },
  errorMessageDialog: {
    message: '',
    status: false
  },
  listCompanies: [],
  listInActiveCompanies: [],
  listPlans: [],
  loading: false,
  paginationKey: {},
  paginationKeyAdmin: {},
  paginationKeyInActive: {},
  searchByName: '',
  searchByNameInActive: '',
  searchFire: false,
  searchFireInActive: false,
  show_more: false,
  statusOfApi: true
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  FETCH_COMPANIES(state, data) {
    const prev = state.listCompanies
    state.listCompanies = prev.concat(data)
  },
  FETCH_INACTIVE_COMPANIES(state, data) {
    const prev = state.listInActiveCompanies
    state.listInActiveCompanies = prev.concat(data)
  },
  COMPANY_ADMINS(state, data) {
    const prev = state.companyAdmins
    state.companyAdmins = prev.concat(data)
  },
  RESET_COMPANY_ADMINS(state, data) {
    state.companyAdmins = data
  },
  ERROR_MESSAGE_DIALOG(state, data) {
    state.errorMessageDialog = data
  },
  SHOW_MORE(state, data) {
    state.show_more = data
  },
  RESET_LIST_COMPANIES(state, data) {
    state.listCompanies = data
  },
  RESET_LIST_INACTIVE_COMPANIES(state, data) {
    state.listInActiveCompanies = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  PAGINATION_KEY_INACTIVE(state, data) {
    state.paginationKeyInActive = data
  },
  PAGINATION_KEY_ADMIN(state, data) {
    state.paginationKeyAdmin = data
  },
  LIST_PLANS(state, data) {
    state.listPlans = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_BY_NAME_INACTIVE(state, data) {
    state.searchByNameInActive = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  },
  SEARCH_FIRE_INACTIVE(state, data) {
    state.searchFireInActive = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
  },
  COMPANY_USERS_STATS(state, data) {
    state.companyUsersStats = data
  },
  COMPANY_USERS_STATS_PARTIAL_UPDATE(state, data = undefined) {
    state.companyUsersStats.company_info.idp_name = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  fetchCompanies({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE', false)
    axios
      .post(config.baseURLApi + 'company/list-active-companies', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const companyData = res.data.data.data.map((data) => ({
            ...data,
            courses_count: data.events ? data.events.length : 0,
            endDate: data.end_date,
            id: data.sk,
            isCredits: data.is_credits,
            minutesPerUser: data.minutes_per_user,
            monthlyMinutes: data.monthly_minutes,
            name: data.company_name,
            numUsers: data.num_users,
            paymentComplete: data.payment_complete,
            startDate: data.start_date,
            subscriptionType: data.subscription
          }))
          if (payload.reset) {
            commit('RESET_LIST_COMPANIES', companyData)
          } else {
            commit('FETCH_COMPANIES', companyData)
          }
          if (res.data.data.last_value) {
            commit('SHOW_MORE', true)
            commit('PAGINATION_KEY', res.data.data.last_value)
          } else {
            commit('PAGINATION_KEY', {})
          }
          commit('SEARCH_FIRE', false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchInActiveCompanies({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE', false)
    axios
      .post(config.baseURLApi + 'company/list-expired-companies', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const companyData = res.data.data.data.map((data) => ({
            name: data.company_name,
            id: data.sk,
            numUsers: data.num_users,
            paymentComplete: data.payment_complete,
            isCredits: data.is_credits,
            credits: data.credits,
            minutesPerUser: data.minutes_per_user,
            monthlyMinutes: data.monthly_minutes,
            startDate: data.start_date,
            endDate: data.end_date,
            courses_count: data.events ? data.events.length : 0,
            subscriptionType: data.subscription,
            managed: data.managed
          }))
          if (payload.reset) {
            commit('RESET_LIST_INACTIVE_COMPANIES', companyData)
          } else {
            commit('FETCH_INACTIVE_COMPANIES', companyData)
          }
          if (res.data.data.last_value) {
            commit('SHOW_MORE', true)
            commit('PAGINATION_KEY_INACTIVE', res.data.data.last_value)
          } else {
            commit('PAGINATION_KEY_INACTIVE', {})
          }
          commit('SEARCH_FIRE_INACTIVE', false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchCompanyAdmins({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE', false)
    axios
      .post(config.baseURLApi + 'dashboard/get-company-admins', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const companyData = res.data.data.data.company_admin_users.map((data) => ({
            name: data.name,
            email: data.email
          }))
          if (payload.reset) {
            commit('RESET_COMPANY_ADMINS', companyData)
          } else {
            commit('COMPANY_ADMINS', companyData)
          }
          if (res.data.data.last_value) {
            commit('SHOW_MORE', true)
            commit('PAGINATION_KEY_ADMIN', res.data.data.last_value)
          } else {
            commit('PAGINATION_KEY_ADMIN', {})
          }
          commit('SEARCH_FIRE', false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async searchByNameInActiveAction({ commit }, payload) {
    commit('SEARCH_BY_NAME_INACTIVE', payload)
  },
  async searchCompanies({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE', false)
    await axios
      .post(config.baseURLApi + 'company/search-active-companies', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const companyData = res.data.data.data.map((data) => ({
            ...data,
            courses_count: data.events ? data.events.length : 0,
            endDate: data.end_date,
            id: data.sk,
            isCredits: data.is_credits,
            minutesPerUser: data.minutes_per_user,
            name: data.company_name,
            numUsers: data.num_users,
            paymentComplete: data.payment_complete,
            startDate: data.start_date,
            subscriptionType: data.subscription
          }))
          commit('SEARCH_FIRE', true)

          if (payload.reset) {
            commit('RESET_LIST_COMPANIES', companyData)
          } else {
            commit('FETCH_COMPANIES', companyData)
          }
          if (res.data.data.data.pagination) {
            commit('SHOW_MORE', true)
            commit('PAGINATION_KEY', res.data.data.data.pagination)
          } else {
            commit('PAGINATION_KEY', {})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchInActiveCompanies({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE', false)
    await axios
      .post(config.baseURLApi + 'company/search-expired-companies', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const companyData = res.data.data.data.map((data) => ({
            name: data.company_name,
            id: data.sk,
            numUsers: data.num_users,
            paymentComplete: data.payment_complete,
            isCredits: data.is_credits,
            credits: data.credits,
            minutesPerUser: data.minutes_per_user,
            startDate: data.start_date,
            endDate: data.end_date,
            courses_count: data.events ? data.events.length : 0,
            subscriptionType: data.subscription
          }))
          commit('SEARCH_FIRE_INACTIVE', true)

          if (payload.reset) {
            commit('RESET_LIST_INACTIVE_COMPANIES', companyData)
          } else {
            commit('FETCH_INACTIVE_COMPANIES', companyData)
          }
          if (res.data.data.data.pagination) {
            commit('SHOW_MORE', true)
            commit('PAGINATION_KEY_INACTIVE', res.data.data.data.pagination)
          } else {
            commit('PAGINATION_KEY_INACTIVE', {})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createCompany({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      company_name: false,
      company_name_msg: '',
      monthly_minutes: false,
      monthly_minutes_msg: '',
      parent: false,
      parent_msg: '',
      is_event: false,
      is_event_msg: '',
      num_users: false,
      num_users_msg: '',
      minutes_per_user: false,
      minutes_per_user_msg: '',
      start_date: false,
      start_date_msg: '',
      end_date: false,
      end_date_msg: '',
      payment_complete: false,
      payment_complete_msg: '',
      domains: false,
      domains_msg: '',
      events: false,
      events_msg: '',
      subscription: false,
      subscription_msg: '',
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: '',
      plans: false,
      plans_msg: ''
    })
    commit('STATUS_OF_API', true)
    commit('ERROR_MESSAGE_DIALOG', { status: false, message: '' })
    await axios
      .post(config.baseURLApi + 'company/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = { pagination: {}, reset: true }
          dispatch('fetchCompanies', data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Company has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            company_name: false,
            company_name_msg: '',
            is_event: false,
            is_event_msg: '',
            num_users: false,
            num_users_msg: '',
            minutes_per_user: false,
            minutes_per_user_msg: '',
            start_date: false,
            start_date_msg: '',
            end_date: false,
            end_date_msg: '',
            payment_complete: false,
            payment_complete_msg: '',
            subscription: false,
            subscription_msg: '',
            domains: false,
            domains_msg: '',
            events: false,
            events_msg: '',
            is_poc: false,
            is_poc_msg: '',
            email: false,
            email_msg: '',
            first_name: false,
            first_name_msg: '',
            last_name: false,
            last_name_msg: '',
            plans: false,
            plans_msg: ''
          }
          if (error.response.data.message.company_name) {
            if (typeof error.response.data.message.company_name === 'object') {
              errMsgs.company_name = true
              errMsgs.company_name_msg = error.response.data.message.company_name.toString()
            } else {
              errMsgs.company_name = true
              errMsgs.company_name_msg = error.response.data.message.company_name
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
          if (error.response.data.message.plans) {
            if (typeof error.response.data.message.plans === 'object') {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans.toString()
            } else {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans
            }
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
          if (error.response.data.message.is_event) {
            if (typeof error.response.data.message.is_event === 'object') {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event.toString()
            } else {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event
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
          if (error.response.data.message.minutes_per_user) {
            if (typeof error.response.data.message.minutes_per_user === 'object') {
              errMsgs.minutes_per_user = true
              errMsgs.minutes_per_user_msg = error.response.data.message.minutes_per_user.toString()
            } else {
              errMsgs.minutes_per_user = true
              errMsgs.minutes_per_user_msg = error.response.data.message.minutes_per_user
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
          if (error.response.data.message.payment_complete) {
            if (typeof error.response.data.message.payment_complete === 'object') {
              errMsgs.payment_complete = true
              errMsgs.payment_complete_msg = error.response.data.message.payment_complete.toString()
            } else {
              errMsgs.payment_complete = true
              errMsgs.payment_complete_msg = error.response.data.message.payment_complete
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
          if (error.response.data.message.events) {
            if (typeof error.response.data.message.events === 'object') {
              errMsgs.events = true
              errMsgs.events_msg = error.response.data.message.events.toString()
            } else {
              errMsgs.events = true
              errMsgs.events_msg = error.response.data.message.events
            }
          }
          if (error.response.data.message.is_poc) {
            if (typeof error.response.data.message.is_poc === 'object') {
              errMsgs.is_poc = true
              errMsgs.is_poc_msg = error.response.data.message.is_poc.toString()
            } else {
              errMsgs.is_poc = true
              errMsgs.is_poc_msg = error.response.data.message.is_poc
            }
          }
          if (error.response.data.message.subscription) {
            if (typeof error.response.data.message.subscription === 'object') {
              errMsgs.subscription = true
              errMsgs.subscription_msg = error.response.data.message.subscription.toString()
            } else {
              errMsgs.subscription = true
              errMsgs.subscription_msg = error.response.data.message.subscription
            }
          }
          if (error.response.data.message.parent) {
            if (typeof error.response.data.message.parent === 'object') {
              errMsgs.parent = true
              errMsgs.parent_msg = error.response.data.message.parent.toString()
            } else {
              errMsgs.parent = true
              errMsgs.parent_msg = error.response.data.message.parent
            }
          }
          if (error.response.data.message.monthly_minutes) {
            if (typeof error.response.data.message.monthly_minutes === 'object') {
              errMsgs.monthly_minutes = true
              errMsgs.monthly_minutes_msg = error.response.data.message.monthly_minutes.toString()
            } else {
              errMsgs.monthly_minutes = true
              errMsgs.monthly_minutes_msg = error.response.data.message.monthly_minutes
            }
          }
          commit('ERROR_MSGS', errMsgs)
        }
        const { message } = error.response.data
        Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchPlanOptions({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'company/chargebee/plans', payload)
      .then((res) => {
        const planOptions = res.data.data.map((plan) => ({
          value: plan.id,
          label: `${plan.name}`
        }))
        commit('LIST_PLANS', planOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  deleteCompany({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'company/delete', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Company was deleted successfully', color: 'red', position: 'top' })
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchCompanies', data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
  },
  async actionCompany({ commit, dispatch }, payload) {
    commit('STATUS_OF_API', true)
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'company/update', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Company successfully updated', color: 'green', position: 'top' })
          const data = {
            company_id: payload.company_id
          }
          dispatch('fetchCompanyUserStats', data)
          commit('LOADING', false)
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        commit('LOADING', false)
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
  },
  async fetchCompanyUserStats({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'company/dashboard/user-stats', payload)
      .then((res) => {
        if (res.data.success) {
          commit('COMPANY_USERS_STATS', res.data.data || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateCompanyInfo({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      company_name: false,
      company_name_msg: '',
      monthly_minutes: false,
      monthly_minutes_msg: '',
      parent: false,
      parent_msg: '',
      is_event: false,
      is_event_msg: '',
      num_users: false,
      num_users_msg: '',
      minutes_per_user: false,
      minutes_per_user_msg: '',
      start_date: false,
      start_date_msg: '',
      end_date: false,
      end_date_msg: '',
      payment_complete: false,
      payment_complete_msg: '',
      domains: false,
      domains_msg: '',
      events: false,
      events_msg: '',
      subscription: false,
      subscription_msg: '',
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: '',
      plans: false,
      plans_msg: ''
    })
    commit('STATUS_OF_API', true)
    commit('ERROR_MESSAGE_DIALOG', {
      status: false,
      message: ''
    })
    await axios
      .post(config.baseURLApi + 'company/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = { pagination: {}, reset: true }
          dispatch('fetchCompanies', data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Company has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            company_name: false,
            company_name_msg: '',
            parent: false,
            parent_msg: '',
            is_event: false,
            is_event_msg: '',
            num_users: false,
            num_users_msg: '',
            minutes_per_user: false,
            minutes_per_user_msg: '',
            start_date: false,
            start_date_msg: '',
            end_date: false,
            end_date_msg: '',
            payment_complete: false,
            payment_complete_msg: '',
            domains: false,
            domains_msg: '',
            events: false,
            events_msg: '',
            subscription: false,
            subscription_msg: '',
            email: false,
            email_msg: '',
            first_name: false,
            first_name_msg: '',
            last_name: false,
            last_name_msg: '',
            plans: false,
            plans_msg: ''
          }
          if (error.response.data.message.company_name) {
            if (typeof error.response.data.message.company_name === 'object') {
              errMsgs.company_name = true
              errMsgs.company_name_msg = error.response.data.message.company_name.toString()
            } else {
              errMsgs.company_name = true
              errMsgs.company_name_msg = error.response.data.message.company_name
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
          if (error.response.data.message.plans) {
            if (typeof error.response.data.message.plans === 'object') {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans.toString()
            } else {
              errMsgs.plans = true
              errMsgs.plans_msg = error.response.data.message.plans
            }
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
          if (error.response.data.message.is_event) {
            if (typeof error.response.data.message.is_event === 'object') {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event.toString()
            } else {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event
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
          if (error.response.data.message.minutes_per_user) {
            if (typeof error.response.data.message.minutes_per_user === 'object') {
              errMsgs.minutes_per_user = true
              errMsgs.minutes_per_user_msg = error.response.data.message.minutes_per_user.toString()
            } else {
              errMsgs.minutes_per_user = true
              errMsgs.minutes_per_user_msg = error.response.data.message.minutes_per_user
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
          if (error.response.data.message.payment_complete) {
            if (typeof error.response.data.message.payment_complete === 'object') {
              errMsgs.payment_complete = true
              errMsgs.payment_complete_msg = error.response.data.message.payment_complete.toString()
            } else {
              errMsgs.payment_complete = true
              errMsgs.payment_complete_msg = error.response.data.message.payment_complete
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
          if (error.response.data.message.events) {
            if (typeof error.response.data.message.events === 'object') {
              errMsgs.events = true
              errMsgs.events_msg = error.response.data.message.events.toString()
            } else {
              errMsgs.events = true
              errMsgs.events_msg = error.response.data.message.events
            }
          }
          if (error.response.data.message.subscription) {
            if (typeof error.response.data.message.subscription === 'object') {
              errMsgs.subscription = true
              errMsgs.subscription_msg = error.response.data.message.subscription.toString()
            } else {
              errMsgs.subscription = true
              errMsgs.subscription_msg = error.response.data.message.subscription
            }
          }
          if (error.response.data.message.parent) {
            if (typeof error.response.data.message.parent === 'object') {
              errMsgs.parent = true
              errMsgs.parent_msg = error.response.data.message.parent.toString()
            } else {
              errMsgs.parent = true
              errMsgs.parent_msg = error.response.data.message.parent
            }
          }
          if (error.response.data.message.monthly_minutes) {
            if (typeof error.response.data.message.monthly_minutes === 'object') {
              errMsgs.monthly_minutes = true
              errMsgs.monthly_minutes_msg = error.response.data.message.monthly_minutes.toString()
            } else {
              errMsgs.monthly_minutes = true
              errMsgs.monthly_minutes_msg = error.response.data.message.monthly_minutes
            }
          }
          commit('ERROR_MSGS', errMsgs)
        }
        const { message } = error.response.data
        Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchCompanyID({ commit, dispatch }, payload) {
    try {
      const { data } = await axios.get(`${config.baseURLApi}/company/idp`)
      return data
    } catch (err) {
      console.warn(err)
    }
  },
  async createIdp({ commit, dispatch }, payload) {
    try {
      await axios.post(`${config.baseURLApi}company/idp`, payload)
      commit('COMPANY_USERS_STATS_PARTIAL_UPDATE', payload.provider_name)
      return true
    } catch (err) {
      return false
    }
  },
  async deleteIdp({ commit, dispatch }, payload) {
    try {
      await axios.delete(`${config.baseURLApi}company/idp`, {
        data: payload, // This is the key to include the request body
        headers: {
          'Content-Type': 'application/json' // Specify the content type if necessary
        }
      })
      commit('COMPANY_USERS_STATS_PARTIAL_UPDATE')
      return true
    } catch (err) {
      return false
    }
  }
}

const getters = {
  companiesData: (state) => (state.listCompanies.length > 0 ? [...new Set(state.listCompanies)] : []),
  companiesDataInActive: (state) => (state.listInActiveCompanies.length > 0 ? [...new Set(state.listInActiveCompanies)] : []),
  companyPaginationKeyForward: (state) => state.paginationKey,
  companyPaginationKeyInActiveForward: (state) => state.paginationKeyInActive,
  detailedCompanyUsersInfo: (state) => state.companyUsersStats,
  errorMessageDialogGetter: (state) => state.errorMessageDialog,
  fetchCompanyAdminGetter: (state) => state.companyAdmins,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchlistPlans: (state) => state.listPlans,
  fetchStatusOfApiCompany: (state) => state.statusOfApi,
  isLoading: (state) => state.loading,
  searchByNameGetter: (state) => state.searchByName,
  searchByNameInActiveGetter: (state) => state.searchByNameInActive,
  searchFireActive: (state) => state.searchFire,
  searchFireActiveInActive: (state) => state.searchFireInActive
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
