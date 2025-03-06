import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  error_msgs: {
    plan_name: false,
    plan_name_msg: '',
    events: false,
    events_msg: '',
    monthly_mins: false,
    monthly_mins_msg: '',
    company_id: false,
    company_id_msg: ''
  },
  listEvents: [],
  listMaps: [],
  listPlans: [],
  listPlansOffline: [],
  loading: false,
  mapInfo: {},
  mapOptions: [],
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  statusOfApi: true,
  planTypes: ['Individual', 'Enterprise', 'Event', 'Corporate'],
  selectedPlan: 'Individual',
  search: '',
  listLoading: false,
  nextPagePlan: undefined
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_MAPS(state, data) {
    const prev = state.listMaps
    state.listMaps = prev.concat(data)
  },
  LIST_PLANS(state, data) {
    state.listPlans = data
  },
  PUSH_PLANS(state, data) {
    state.listPlans?.push(...data)
  },
  LIST_PLANS_OFFLINE(state, data) {
    state.listPlansOffline = data
  },
  RESET_LIST_EVENTS(state, data) {
    state.listEvents = data
  },
  RESET_LIST_MAPS(state, data) {
    state.listMaps = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  FETCH_MAP_INFO(state, data) {
    state.mapInfo = {}
    state.mapInfo = data
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
  },
  SELECTED_PLAN_TYPE(state, data) {
    state.selectedPlan = data
  },
  SEARCH_BY_PLAN_NAME(state, data) {
    state.search = data
  },
  LIST_LOADING(state, data) {
    state.listLoading = data
  },
  NEXT_PAGE_PLAN(state, data) {
    state.nextPagePlan = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  async fetchMaps({ commit }, payload) {
    commit('LOADING', true)
    const coursemapList = []
    let pageNumber = 1
    while (pageNumber > 0) {
      await axios
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
          if (error.code === 'ERR_NETWORK') {
            pageNumber = 0
          }
        })
        .finally(() => commit('LOADING', false))
    }
    if (payload.reset) {
      commit('RESET_LIST_MAPS', coursemapList)
    } else {
      commit('LIST_MAPS', coursemapList)
    }
  },
  async searchMap({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const mapList = res.data.data.data.map((map) => ({
            name: map.plan_name,
            id: map.sk,
            event: map.event,
            plan_family: map.plan_family
          }))

          commit('SEARCH_FIRE', true)
          if (payload.reset) {
            commit('RESET_LIST_MAPS', mapList)
          } else {
            commit('LIST_MAPS', mapList)
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
  async createMap({ commit, dispatch }, payload) {
    commit('LOADING', true)
    showLoader(true)
    commit('ERROR_MSGS', {
      plan_name: false,
      plan_name_msg: '',
      events: false,
      events_msg: '',
      monthly_mins: false,
      monthly_mins_msg: '',
      company_id: false,
      company_id_msg: ''
    })
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'coursemap/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchMaps', data)
          commit('STATUS_OF_API', true)
          if (res.data.message) {
            Notify.create({ message: res.data.message, color: 'green', position: 'top' })
          }
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
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
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => {
        commit('LOADING', false)
        showLoader(false)
      })
  },
  async fetchMap({ commit }, payload) {
    commit('LOADING', true)
    await axios
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
          commit('FETCH_MAP_INFO', mapInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateMap({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
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
    await axios
      .post(config.baseURLApi + 'coursemap/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchMaps', data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
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
  async deleteMap({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'coursemap/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchMaps', data)
          Notify.create({ message: 'Coursemap deleted successfully', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchPlanOptions({ commit }, payload) {
    // commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'coursemap/chargebee/plans', payload)
      .then((res) => {
        const planOptions = res.data.data.plans.map((plan) => ({
          value: plan.id,
          label: `${plan.name}`,
          family_id: plan.item_family_id
        }))
        commit('NEXT_PAGE_PLAN', res.data?.data?.next_page)
        if (payload.page) {
          commit('PUSH_PLANS', planOptions)
        } else {
          commit('LIST_PLANS', planOptions)
        }
      })
      .catch((error) => {
        if (error?.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchPlanOptionsForOfflinePayment({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'subscription/register')
      .then((res) => {
        const planOptions = Object.entries(res.data.data).map(([key, value]) => ({
          value: value.id,
          label: `${value.name}`
        }))
        commit('LIST_PLANS_OFFLINE', planOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchEventOptions({ commit }, payload) {
    commit('LIST_LOADING', true)
    const eventOptions = []
    let isUserListExists = 1
    while (isUserListExists >= 1) {
      await axios
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
    commit('LIST_LOADING', false)
    commit('RESET_LIST_EVENTS', eventOptions)
  }
}

const getters = {
  fetchlistMaps: (state) => state.listMaps,
  fetchlistPlans: (state) => state.listPlans,
  fetchlistPlansMaps: (state) =>
    state.listMaps.map((plan) => ({
      value: plan.plan_id,
      label: plan.plan_name,
      plan: plan.plan_family
    })),
  isLoading: (state) => state.loading,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchlistEvents: (state) => state.listEvents,
  fetchStatusOfApi: (state) => state.statusOfApi,
  fetchUniquePlans: (state) =>
    state.listPlans.filter((plan) => state.listMaps.filter((mapInfo) => mapInfo.plan_id === plan.value).length === 0),
  getListPlansOffline: (state) => state.listPlansOffline,
  mapOptions: (state) => (state.mapOptions.length > 0 ? [...new Set(state.mapOptions)] : []),
  mapPaginationKeyForward: (state) => state.paginationKey,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singleMapInfo: (state) => (Object.keys(state.mapInfo).length > 0 ? state.mapInfo : []),
  existingPlanIds: (state) => state.listMaps?.map((item) => item.plan_id),
  fetchPlanTypes: (state) => state.planTypes,
  fetchSelectedPlan: (state) => state.selectedPlan,
  getSearch: (state) => state.search,
  filteredListMaps: (state) => state.listMaps.filter((item) => item.plan_name.toLowerCase().includes(state.search.toLowerCase())),
  isLoadingList: (state) => state.listLoading,
  nextPagePlanKey: (state) => state.nextPagePlan
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
