import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const usePartnerStore = defineStore('partner', () => {
  const error_msgs = ref({
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
  const listInActivePartners = ref([])
  const listPartners = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const paginationKeyInActive = ref({})
  const partnerInfo = ref({})
  const plansOptions = ref([])
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function RESET_LIST_PARTNERS(data) {
    listPartners.value = data
  }
  function LIST_PARTNERS(data) {
    const prev = listPartners.value
    listPartners.value = prev.concat(data)
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function RESET_LIST_INACTIVE_PARTNERS(data) {
    listInActivePartners.value = data
  }
  function LIST_INACTIVE_PARTNERS(data) {
    const prev = listInActivePartners.value
    listInActivePartners.value = prev.concat(data)
  }
  function PAGINATION_KEY_INACTIVE(data) {
    paginationKeyInActive.value = data
  }
  function FETCH_PARTNER_INFO(data) {
    partnerInfo.value = data
  }
  function PLANS_LIST(data) {
    plansOptions.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  async function fetchPartners(payload) {
    LOADING(true)
    await api
      .post('partner/list-active-partners', payload.pagination)
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
            RESET_LIST_PARTNERS(partnerList)
          } else {
            LIST_PARTNERS(partnerList)
          }
          PAGINATION_KEY(res.data.data.last_value || {})
          SEARCH_FIRE(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchInActivePartners(payload) {
    LOADING(true)
    await api
      .post('partner/list-expired-partners', payload.pagination)
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
            RESET_LIST_INACTIVE_PARTNERS(partnerList)
          } else {
            LIST_INACTIVE_PARTNERS(partnerList)
          }
          PAGINATION_KEY_INACTIVE(res.data.data.last_value || {})
          SEARCH_FIRE(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchPartner(payload) {
    LOADING(true)
    await api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const partnerList = res.data.data.data.map((partner) => ({
            name: partner.partner_name,
            id: partner.sk
          }))

          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_PARTNERS(partnerList)
          } else {
            LIST_PARTNERS(partnerList)
          }
          if (res.data.data.pagination) {
            PAGINATION_KEY(res.data.data.pagination)
          } else {
            PAGINATION_KEY({})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchPartnerInActive(payload) {
    LOADING(true)
    api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const partnerList = res.data.data.data.map((partner) => ({
            name: partner.partner_name,
            id: partner.sk
          }))
          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_INACTIVE_PARTNERS(partnerList)
          } else {
            LIST_INACTIVE_PARTNERS(partnerList)
          }
          if (res.data.data.pagination) {
            PAGINATION_KEY_INACTIVE(res.data.data.pagination)
          } else {
            PAGINATION_KEY_INACTIVE({})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function createPartner(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    STATUS_OF_API(true)
    await api
      .post('partner/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchPartners(data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Partner has been created successfully', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchPartner(payload) {
    LOADING(true)
    await api
      .post('partner/get', payload)
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
          FETCH_PARTNER_INFO(partnerInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updatePartner(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
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
    await api
      .post('partner/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchPartners(data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Partner has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  function deletePartner(payload) {
    LOADING(true)
    api
      .post('partner/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchPartners(data)
          Notify.create({ message: 'Partner has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchplansOptions(payload) {
    LOADING(true)
    await api
      .post('partner/chargebee/plans', payload)
      .then((res) => {
        const plansOptions = res.data.data.map((plan) => ({
          value: plan.id,
          label: `${plan.name}`
        }))
        PLANS_LIST(plansOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  return {
    error_msgs,
    listInActivePartners,
    listPartners,
    loading,
    paginationKey,
    paginationKeyInActive,
    partnerInfo,
    plansOptions,
    searchByName,
    searchFire,
    statusOfApi,
    loadingStatus,
    errorMsgReset,
    fetchPartners,
    fetchInActivePartners,
    searchPartner,
    searchPartnerInActive,
    searchByNameAction,
    createPartner,
    fetchPartner,
    updatePartner,
    deletePartner,
    fetchplansOptions
  }
})
