import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import config from 'src/config'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useMapStore = defineStore('mapStore', () => {
  const error_msgs = ref({
    plan_name: false,
    plan_name_msg: '',
    events: false,
    events_msg: '',
    monthly_mins: false,
    monthly_mins_msg: '',
    company_id: false,
    company_id_msg: ''
  })
  const listEvents = ref([])
  const listMaps = ref([])
  const listPlans = ref([])
  const listPlansOffline = ref([])
  const loading = ref(false)
  const mapOptions = ref([])
  const mapInfo = ref({})
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)
  const planTypes = ref(['Individual', 'Enterprise', 'Event'])
  const selectedPlan = ref('Individual')
  const search = ref('')
  const listLoading = ref(false)
  const nextPagePlan = ref(undefined)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_MAPS(data) {
    const prev = listMaps.value
    listMaps.value = prev.concat(data)
  }
  function PUSH_PLANS(data) {
    listPlans.value?.push(...data)
  }
  function LIST_PLANS(data) {
    listPlans.value = data
  }
  function LIST_PLANS_OFFLINE(data) {
    listPlansOffline.value = data
  }
  function RESET_LIST_EVENTS(data) {
    listEvents.value = data
  }
  function RESET_LIST_MAPS(data) {
    listMaps.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function FETCH_MAP_INFO(data) {
    mapInfo.value = {}
    mapInfo.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SELECTED_PLAN_TYPE(data) {
    selectedPlan.value = data
  }
  function SEARCH_BY_PLAN_NAME(data) {
    search.value = data
  }
  function NEXT_PAGE_PLAN(data) {
    nextPagePlan.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function LIST_LOADING(data) {
    listLoading.value = data
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  async function fetchMaps(payload) {
    LOADING(true)
    const coursemapList = []
    let pageNumber = 1
    while (pageNumber > 0) {
      await api
        .post(config.baseURLApi + 'coursemap/list', payload.pagination)
        .then((res) => {
          if (res.data.success) {
            res.data.data.data.forEach((map) =>
              coursemapList.push({
                plan_name: map.plan_name.replace('plan - ', '').replace('addon - ', ''),
                plan_id: map.plan_id,
                search_name: map.search_name,
                id: map.sk,
                plan_family: map.plan_family
              })
            )
            if (res.data.data.last_value) {
              payload.pagination = {
                last_value: res.data.data.last_value || {}
              }
            } else if (res.data.data.pagination) {
              payload.pagination = {
                pagination: res.data.data.pagination || {}
              }
            } else {
              pageNumber = 0
            }
          } else {
            pageNumber = 0
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          }
        })
        .finally(() => LOADING(false))
    }
    if (payload.reset) {
      RESET_LIST_MAPS(coursemapList)
    } else {
      LIST_MAPS(coursemapList)
    }
  }
  async function searchMap(payload) {
    LOADING(true)
    await api
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const mapList = res.data.data.data.map((map) => ({
            name: map.plan_name,
            id: map.sk,
            event: map.event,
            plan_family: map.plan_family
          }))

          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_MAPS(mapList)
          } else {
            LIST_MAPS(mapList)
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
  async function createMap(payload) {
    LOADING(true)
    showLoader(true)
    ERROR_MSGS({
      plan_name: false,
      plan_name_msg: '',
      events: false,
      events_msg: '',
      monthly_mins: false,
      monthly_mins_msg: '',
      company_id: false,
      company_id_msg: ''
    })
    STATUS_OF_API(true)
    await api
      .post(config.baseURLApi + 'coursemap/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchMaps(data)
          STATUS_OF_API(true)
          if (res.data.message) {
            Notify.create({ message: res.data.message, color: 'green', position: 'top' })
          }
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const errMsgs = {
            plan_name: false,
            plan_name_msg: '',
            events: false,
            events_msg: ''
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
          if (error.response.data.message.plan_name) {
            if (typeof error.response.data.message.plan_name === 'object') {
              errMsgs.plan_name = true
              errMsgs.plan_name_msg = error.response.data.message.plan_name.toString()
            } else {
              errMsgs.plan_name = true
              errMsgs.plan_name_msg = error.response.data.message.plan_name
            }
          }
          if (error.response.data.message.monthly_mins) {
            if (typeof error.response.data.message.monthly_mins === 'object') {
              errMsgs.monthly_mins = true
              errMsgs.monthly_mins_msg = error.response.data.message.monthly_mins.toString()
            } else {
              errMsgs.monthly_mins = true
              errMsgs.monthly_mins_msg = error.response.data.message.monthly_mins
            }
          }
          if (error.response.data.message.company_id) {
            if (typeof error.response.data.message.company_id === 'object') {
              errMsgs.company_id = true
              errMsgs.company_id_msg = error.response.data.message.company_id.toString()
            } else {
              errMsgs.company_id = true
              errMsgs.company_id_msg = error.response.data.message.company_id
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
      .finally(() => {
        LOADING(false)
        showLoader(false)
      })
  }
  async function fetchMap(payload) {
    LOADING(true)
    await api
      .post(config.baseURLApi + 'coursemap/get', payload)
      .then((res) => {
        if (res.data.success) {
          const mapInfo = {
            plan_name: res.data.data.plan_name,
            plan_id: res.data.data.plan_id,
            events: res.data.data.events,
            id: res.data.data.sk,
            company_id: res.data.data.company_id,
            company_name: res.data.data.company_name,
            monthly_mins: res.data.data.monthly_mins,
            search_name: res.data.data.search_name,
            plan_family: res.data.data.plan_family
          }
          FETCH_MAP_INFO(mapInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updateMap(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
      plan_name: false,
      plan_name_msg: '',
      plan_id: false,
      plan_id_msg: '',
      events: false,
      events_msg: '',
      monthly_mins: false,
      monthly_mins_msg: '',
      company_id: false,
      company_id_msg: ''
    })
    await api
      .post(config.baseURLApi + 'coursemap/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchMaps(data)
          STATUS_OF_API(true)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const errMsgs = {
            plan_name: false,
            plan_name_msg: '',
            events: false,
            events_msg: ''
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
          if (error.response.data.message.plan_name) {
            if (typeof error.response.data.message.plan_name === 'object') {
              errMsgs.plan_name = true
              errMsgs.plan_name_msg = error.response.data.message.plan_name.toString()
            } else {
              errMsgs.plan_name = true
              errMsgs.plan_name_msg = error.response.data.message.plan_name
            }
          }
          if (error.response.data.message.monthly_mins) {
            if (typeof error.response.data.message.monthly_mins === 'object') {
              errMsgs.monthly_mins = true
              errMsgs.monthly_mins_msg = error.response.data.message.monthly_mins.toString()
            } else {
              errMsgs.monthly_mins = true
              errMsgs.monthly_mins_msg = error.response.data.message.monthly_mins
            }
          }
          if (error.response.data.message.company_id) {
            if (typeof error.response.data.message.company_id === 'object') {
              errMsgs.company_id = true
              errMsgs.company_id_msg = error.response.data.message.company_id.toString()
            } else {
              errMsgs.company_id = true
              errMsgs.company_id_msg = error.response.data.message.company_id
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
  async function deleteMap(payload) {
    LOADING(true)
    await api
      .post(config.baseURLApi + 'coursemap/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          fetchMaps(data)
          Notify.create({ message: 'Coursemap deleted successfully', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchPlanOptions(payload) {
    // LOADING(true)
    await api
      .post(config.baseURLApi + 'coursemap/chargebee/plans', payload)
      .then((res) => {
        const planOptions = res.data.data.plans.map((plan) => ({
          value: plan.id,
          label: `${plan.name}`,
          family_id: plan.item_family_id
        }))
        NEXT_PAGE_PLAN(res.data?.data?.next_page)
        if (payload.page) {
          PUSH_PLANS(planOptions)
        } else {
          LIST_PLANS(planOptions)
        }
      })
      .catch((error) => {
        if (error?.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchPlanOptionsForOfflinePayment() {
    LOADING(true)
    await api
      .get(config.baseURLApi + 'subscription/register')
      .then((res) => {
        const planOptions = Object.entries(res.data.data).map(([key, value]) => ({
          value: value.id,
          label: `${value.name}`
        }))
        LIST_PLANS_OFFLINE(planOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchEventOptions(payload) {
    LIST_LOADING(true)
    const eventOptions = []
    let isUserListExists = 1
    while (isUserListExists >= 1) {
      await api
        .post(config.baseURLApi + 'event/lists', payload.pagination)
        .then((res) => {
          if (res.data.success) {
            res.data.data.forEach((event) =>
              eventOptions.push({
                value: event.sk,
                label: event.event_name
              })
            )
            if (res.data.last_value) {
              payload.pagination = {
                last_value: res.data.last_value || {}
              }
              isUserListExists += 1
            } else {
              isUserListExists = 0
              payload.pagination = {}
            }
          } else {
            isUserListExists = 0
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          }
        })
    }
    LIST_LOADING(false)
    RESET_LIST_EVENTS(eventOptions)
  }
  return {
    listMaps,
    listPlans,
    loading,
    error_msgs,
    listEvents,
    statusOfApi,
    listPlansOffline,
    mapOptions,
    paginationKey,
    searchByName,
    searchFire,
    mapInfo,
    planTypes,
    selectedPlan,
    search,
    listLoading,
    nextPagePlan,
    SELECTED_PLAN_TYPE,
    NEXT_PAGE_PLAN,
    SEARCH_BY_PLAN_NAME,
    searchMap,
    errorMsgReset,
    fetchMaps,
    searchByNameAction,
    createMap,
    fetchMap,
    updateMap,
    deleteMap,
    fetchPlanOptions,
    fetchPlanOptionsForOfflinePayment,
    fetchEventOptions
  }
})
