import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useCompanyStore = defineStore('company', () => {
  const companyAdmins = ref([])
  const companyUsersStats = ref({})
  const error_msgs = ref({
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
  })
  const errorMessageDialog = ref({
    message: '',
    status: false
  })
  const listCompanies = ref([])
  const listInActiveCompanies = ref([])
  const listPlans = ref([])
  const loading = ref([])
  const paginationKey = ref([])
  const paginationKeyAdmin = ref([])
  const paginationKeyInActive = ref([])
  const searchByName = ref([])
  const searchByNameInActive = ref([])
  const searchFire = ref(false)
  const searchFireInActive = ref(false)
  const show_more = ref([])
  const statusOfApi = ref([])

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function FETCH_COMPANIES(data) {
    const prev = listCompanies.value || []
    listCompanies.value = prev.concat(data)
  }
  function FETCH_INACTIVE_COMPANIES(data) {
    const prev = listInActiveCompanies.value
    listInActiveCompanies.value = prev.concat(data)
  }
  function COMPANY_ADMINS(data) {
    const prev = companyAdmins.value
    companyAdmins.value = prev.concat(data)
  }
  function RESET_COMPANY_ADMINS(data) {
    companyAdmins.value = data
  }
  function ERROR_MESSAGE_DIALOG(data) {
    errorMessageDialog.value = data
  }
  function SHOW_MORE(data) {
    show_more.value = data
  }
  function RESET_LIST_COMPANIES(data) {
    listCompanies.value = data
  }
  function RESET_LIST_INACTIVE_COMPANIES(data) {
    listInActiveCompanies.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function PAGINATION_KEY_INACTIVE(data) {
    paginationKeyInActive.value = data
  }
  function PAGINATION_KEY_ADMIN(data) {
    paginationKeyAdmin.value = data
  }
  function LIST_PLANS(data) {
    listPlans.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_BY_NAME_INACTIVE(data) {
    searchByNameInActive.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function SEARCH_FIRE_INACTIVE(data) {
    searchFireInActive.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function COMPANY_USERS_STATS(data) {
    companyUsersStats.value = data
  }
  function COMPANY_USERS_STATS_PARTIAL_UPDATE(data = undefined) {
    companyUsersStats.value.company_info.idp_name = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  async function fetchCompanies(payload) {
    LOADING(true)
    await api
      .post('company/list-active-companies', payload.pagination)
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
            RESET_LIST_COMPANIES(companyData)
          } else {
            FETCH_COMPANIES(companyData)
          }
          if (res.data.data.last_value) {
            SHOW_MORE(true)
            PAGINATION_KEY(res.data.data.last_value)
          } else {
            PAGINATION_KEY({})
          }
          SEARCH_FIRE(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchInActiveCompanies(payload) {
    LOADING(true)
    await api
      .post('company/list-expired-companies', payload.pagination)
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
            RESET_LIST_INACTIVE_COMPANIES(companyData)
          } else {
            FETCH_INACTIVE_COMPANIES(companyData)
          }
          if (res.data.data.last_value) {
            SHOW_MORE(true)
            PAGINATION_KEY_INACTIVE(res.data.data.last_value)
          } else {
            PAGINATION_KEY_INACTIVE({})
          }
          SEARCH_FIRE_INACTIVE(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchCompanyAdmins(payload) {
    LOADING(true)
    SHOW_MORE(false)
    api
      .post('dashboard/get-company-admins', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const companyData = res.data.data.data.company_admin_users.map((data) => ({
            name: data.name,
            email: data.email
          }))
          if (payload.reset) {
            RESET_COMPANY_ADMINS(companyData)
          } else {
            COMPANY_ADMINS(companyData)
          }
          if (res.data.data.last_value) {
            SHOW_MORE(true)
            PAGINATION_KEY_ADMIN(res.data.data.last_value)
          } else {
            PAGINATION_KEY_ADMIN({})
          }
          SEARCH_FIRE(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function searchByNameInActiveAction(payload) {
    SEARCH_BY_NAME_INACTIVE(payload)
  }
  async function searchCompanies(payload) {
    LOADING(true)
    SHOW_MORE(false)
    await api
      .post('company/search-active-companies', payload.pagination, {
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
          SEARCH_FIRE(true)

          if (payload.reset) {
            RESET_LIST_COMPANIES(companyData)
          } else {
            FETCH_COMPANIES(companyData)
          }
          if (res.data.data.data.pagination) {
            SHOW_MORE(true)
            PAGINATION_KEY(res.data.data.data.pagination)
          } else {
            PAGINATION_KEY({})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchInActiveCompanies(payload) {
    LOADING(true)
    SHOW_MORE(false)
    await api
      .post('company/search-expired-companies', payload.pagination, {
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
          SEARCH_FIRE_INACTIVE(true)

          if (payload.reset) {
            RESET_LIST_INACTIVE_COMPANIES(companyData)
          } else {
            FETCH_INACTIVE_COMPANIES(companyData)
          }
          if (res.data.data.data.pagination) {
            SHOW_MORE(true)
            PAGINATION_KEY_INACTIVE(res.data.data.data.pagination)
          } else {
            PAGINATION_KEY_INACTIVE({})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createCompany(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    STATUS_OF_API(true)
    ERROR_MESSAGE_DIALOG({ status: false, message: '' })
    await api
      .post('company/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = { pagination: {}, reset: true }
          fetchCompanies(data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Company has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
        }
        const { message } = error.response.data
        Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
      })
      .finally(() => LOADING(false))
  }
  async function fetchPlanOptions(payload) {
    LOADING(true)
    await api
      .post('company/chargebee/plans', payload)
      .then((res) => {
        const planOptions = res.data.data.map((plan) => ({
          value: plan.id,
          label: `${plan.name}`
        }))
        LIST_PLANS(planOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function deleteCompany(payload) {
    LOADING(true)
    api
      .post('company/delete', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Company was deleted successfully', color: 'red', position: 'top' })
          const data = {
            pagination: {},
            reset: true
          }
          fetchCompanies(data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
  }
  async function actionCompany(payload) {
    STATUS_OF_API(true)
    LOADING(true)
    await api
      .post('company/update', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          Notify.create({ message: 'Company successfully updated', color: 'green', position: 'top' })
          const data = {
            company_id: payload.company_id
          }
          fetchCompanyUserStats(data)
          LOADING(false)
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        LOADING(false)
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
  }
  async function fetchCompanyUserStats(payload) {
    LOADING(true)
    await api
      .post('company/dashboard/user-stats', payload)
      .then((res) => {
        if (res.data.success) {
          COMPANY_USERS_STATS(res.data.data || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const { message } = error.response.data
          Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updateCompanyInfo(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    STATUS_OF_API(true)
    ERROR_MESSAGE_DIALOG({
      status: false,
      message: ''
    })
    await api
      .post('company/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = { pagination: {}, reset: true }
          fetchCompanies(data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Company has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
        }
        const { message } = error.response.data
        Notify.create({ message: typeof message === 'string' ? message : Object.values(message)[0], color: 'red', position: 'top' })
      })
      .finally(() => LOADING(false))
  }
  async function fetchCompanyID() {
    try {
      const { data } = await api.get('company/idp')
      return data
    } catch (err) {
      console.warn(err)
    }
  }
  async function createIdp(payload) {
    try {
      await api.post('company/idp', payload)
      COMPANY_USERS_STATS_PARTIAL_UPDATE(payload.provider_name)
      return true
    } catch (err) {
      return false
    }
  }
  async function deleteIdp(payload) {
    try {
      await api.delete('company/idp', {
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      COMPANY_USERS_STATS_PARTIAL_UPDATE()
      return true
    } catch (err) {
      return false
    }
  }
  return {
    companyUsersStats,
    companyAdmins,
    statusOfApi,
    error_msgs,
    listPlans,
    searchFire,
    searchFireInActive,
    searchByName,
    listCompanies,
    listInActiveCompanies,
    errorMessageDialog,
    paginationKey,
    paginationKeyInActive,
    searchByNameInActive,
    SEARCH_BY_NAME,
    SEARCH_BY_NAME_INACTIVE,
    loadingStatus,
    errorMsgReset,
    fetchCompanies,
    fetchInActiveCompanies,
    fetchCompanyAdmins,
    searchByNameAction,
    searchByNameInActiveAction,
    searchCompanies,
    searchInActiveCompanies,
    createCompany,
    fetchPlanOptions,
    deleteCompany,
    actionCompany,
    fetchCompanyUserStats,
    updateCompanyInfo,
    fetchCompanyID,
    createIdp,
    deleteIdp
  }
})
