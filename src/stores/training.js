import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useTrainingStore = defineStore('training', () => {
  const error_msgs = ref({
    training_name: '',
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
  })
  const error_msgs_user = ref({
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    role: false,
    role_msg: ''
  })
  const listTraining = ref([])
  const listTrainingInActive = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const paginationKeyBackward = ref({})
  const paginationKeyInActive = ref({})
  const plansOptions = ref([])
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)
  const trainingInfo = ref({})

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function ERROR_MSGS_USER(data) {
    error_msgs_user.value = Object.assign(error_msgs_user, data)
  }
  function LIST_TRAINING(data) {
    const prev = listTraining.value
    listTraining.value = prev.concat(data)
  }
  function RESET_LIST_TRAINING(data) {
    listTraining.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function LIST_TRAINING_INACTIVE(data) {
    const prev = listTrainingInActive.value
    listTrainingInActive.value = prev.concat(data)
  }
  function RESET_LIST_TRAINING_INACTIVE(data) {
    listTrainingInActive.value = data
  }
  function PAGINATION_KEY_INACTIVE(data) {
    paginationKeyInActive.value = data
  }
  function FETCH_TRAINING_INFO(data) {
    trainingInfo.value = data
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
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  function errorMsgResetUser(data) {
    ERROR_MSGS_USER(data)
  }
  async function fetchTrainings(payload) {
    LOADING(true)
    await api
      .post('training/list-active-trainings', payload.pagination)
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
            RESET_LIST_TRAINING(traniningList)
          } else {
            LIST_TRAINING(traniningList)
          }
          PAGINATION_KEY(res.data.data.last_value || {})
          SEARCH_FIRE(false)
        }
        LOADING(false)
      })
      .catch((error) => {
        LOADING(false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  }
  async function fetchTrainingsInActive(payload) {
    LOADING(true)
    await api
      .post('training/list-expired-trainings', payload.pagination)
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
            RESET_LIST_TRAINING_INACTIVE(traniningList)
          } else {
            LIST_TRAINING_INACTIVE(traniningList)
          }
          PAGINATION_KEY_INACTIVE(res.data.data.pagination || {})
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
  async function searchTraining(payload) {
    LOADING(true)
    await api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const traniningList = res.data.data.data.map((partner) => ({
            name: partner.training_name,
            id: partner.sk
          }))

          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_TRAINING(traniningList)
          } else {
            LIST_TRAINING(traniningList)
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
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function createTraining(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    STATUS_OF_API(true)
    await api
      .post('training/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchTrainings(data)
          STATUS_OF_API(true)

          Notify.create({ message: 'Event has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
  async function fetchTraining(payload) {
    LOADING(true)
    await api
      .post('training/get', payload)
      .then((res) => {
        if (res.data.success) {
          const trainingInfo = {
            ...res.data.data,
            id: res.data.data.sk,
            plan: res.data.data.plan?.id || res.data.data.plan || res.data.data.plans[0]
          }
          FETCH_TRAINING_INFO(trainingInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updateTraining(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
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
    await api
      .post('training/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchTrainings(data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Event has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
  async function deleteTraining(payload) {
    LOADING(true)
    await api
      .post('training/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchTrainings(data)
          Notify.create({ message: 'Event has been successfully deleted', color: 'red', position: 'top' })
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
      .post('training/chargebee/plans', payload)
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
  async function createUser(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS_USER({
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: ''
    })
    await api
      .post('training/user/add', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          Notify.create({ message: 'User is created successfully', color: 'green', position: 'top' })
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
          ERROR_MSGS_USER(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function removeStatusUserTraining(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    await api
      .post('training/user/remove', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
        }
      })
      .catch((error) => {
        STATUS_OF_API(true)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function issueCertificate(payload) {
    LOADING(true)
    await api
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
      .finally(() => LOADING(false))
  }
  async function sendCertificate(payload) {
    LOADING(true)
    await api
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
      .finally(() => LOADING(false))
  }
  return {
    error_msgs,
    error_msgs_user,
    listTraining,
    listTrainingInActive,
    loading,
    paginationKey,
    paginationKeyBackward,
    paginationKeyInActive,
    plansOptions,
    searchByName,
    searchFire,
    statusOfApi,
    trainingInfo,
    loadingStatus,
    errorMsgReset,
    errorMsgResetUser,
    fetchTrainings,
    fetchTrainingsInActive,
    searchTraining,
    searchByNameAction,
    createTraining,
    fetchTraining,
    updateTraining,
    deleteTraining,
    fetchplansOptions,
    createUser,
    removeStatusUserTraining,
    issueCertificate,
    sendCertificate
  }
})
