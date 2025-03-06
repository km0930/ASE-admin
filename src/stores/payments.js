import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const usePaymentsStore = defineStore('payments', () => {
  const error_msgs = ref({
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    plan: false,
    plan_msg: ''
  })
  const listPayments = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_PAYMENTS(data) {
    const prev = listPayments.value
    listPayments.value = prev.concat(data)
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function RESET_LIST_PAYMENTS(data) {
    listPayments.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  async function searchByNameAction(payload) {
    commit('SEARCH_BY_NAME', payload)
    SEARCH_BY_NAME(payload)
  }
  async function fetchPaymentsList(payload) {
    LOADING(true)
    api
      .post('learning-path/list', payload.pagination)
      .then((res) => {
        const paymentsData = res.data.data.data.map((data) => ({
          first_name: data.first_name,
          id: data.sk,
          last_name: data.last_name,
          email: data.email
        }))
        SEARCH_FIRE(false)
        if (payload.reset) {
          RESET_LIST_PAYMENTS(paymentsData)
        } else {
          LIST_PAYMENTS(paymentsData)
        }
        PAGINATION_KEY(res.data.data.last_value || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchPayments(payload) {
    LOADING(true)
    api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const paymentsData = res.data.data.data.map((data) => ({
            first_name: data.first_name,
            id: data.sk,
            last_name: data.last_name,
            email: data.email
          }))
          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_PAYMENTS(paymentsData)
          } else {
            LIST_PAYMENTS(paymentsData)
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
  async function createPayments(payload) {
    LOADING(true)
    ERROR_MSGS({
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: '',
      plan: false,
      plan_msg: ''
    })
    STATUS_OF_API(true)
    await api
      .post('subscription/register', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          if (res.data.message) {
            Notify.create({ message: res.data.message, color: 'green', position: 'top' })
          } else {
            Notify.create({ message: 'User has been successfully created', color: 'green', position: 'top' })
          }
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
  function deletePayments(payload) {
    LOADING(true)
    api
      .post('subscription/register/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchPaymentsList(data)
          Notify.create({ message: 'Learning Path has been successfully deleted', color: 'red', position: 'top' })
        }
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
    listPayments,
    loading,
    paginationKey,
    searchByName,
    searchFire,
    statusOfApi,
    SEARCH_BY_NAME,
    loadingStatus,
    errorMsgReset,
    searchByNameAction,
    searchPayments,
    createPayments,
    deletePayments
  }
})
