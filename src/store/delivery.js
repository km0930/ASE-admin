import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  deliveryInfo: [],
  deliverySuccessInfo: {},
  detailInfo: {},
  error_msgs: {
    status: false,
    title: false,
    title_msg: '',
    _type: false,
    _type_msg: '',
    mailSubject: false,
    mailSubject_msg: '',
    designId: false,
    designId_msg: '',
    detailId: false,
    detailId_msg: '',
    details: {
      title: false,
      title_msg: '',
      duration: false,
      duration_msg: '',
      level: false,
      level_msg: '',
      duration_type: false,
      duration_type_msg: '',
      criteria: false,
      criteria_msg: '',
      skills: false,
      skills_msg: ''
    },
    emailTemplateId: false,
    emailTemplateId_msg: '',
    emailFromName: false,
    emailFromName_msg: '',
    step1: false,
    step1_msg: '',
    step2: false,
    step2_msg: '',
    step3: false,
    step3_msg: ''
  },
  error_msgs_designs: { status: true },
  error_msgs_details: { status: true },
  error_msgs_templates: { status: true },
  listDelivery: [],
  listDesigns: [],
  listDetails: [],
  listDetailSkills: [],
  listOptionsDelivery: [],
  listTemplates: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  statusOfApi: true,
  totalDeliveries: 0,
  totalDetails: 0,
  totalDesigns: 0
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  SEARCH_DELIVERIES(state, data) {
    state.listDelivery = data
  },
  LIST_DELIVERIES(state, data) {
    const prev = state.listDelivery
    state.listDelivery = [...prev, ...data]
  },
  CREATE_DELIVERY(state, data) {
    state.listDelivery.unshift(data)
  },
  UPDATE_DELIVERY(state, data) {
    const index = state.listDelivery.findIndex((delivery) => delivery.id === data.id)
    state.listDelivery.splice(index, 1, data)
  },
  DELETE_DELIVERY(state, data) {
    const index = state.listDelivery.findIndex((delivery) => delivery.id === data.id)
    state.listDelivery.splice(index, 1)
  },
  TOTAL_DELIVERIES(state, data) {
    state.totalDeliveries = data
  },
  DELIVERY_SUCCESS_INFO(state, data) {
    state.deliverySuccessInfo = data
  },
  SEARCH_OPTIONS_DELIVERY(state, data) {
    state.listOptionsDelivery = data
  },
  LIST_OPTIONS_DELIVERY(state, data) {
    const prev = state.listOptionsDelivery
    state.listOptionsDelivery = [...prev, ...data]
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  DELIVERY_INFO(state, data) {
    state.deliveryInfo = []
    state.deliveryInfo = data
  },
  LIST_DESIGNS(state, data) {
    const prev = state.listDesigns
    state.listDesigns = [...prev, ...data]
  },
  TOTAL_DESIGNS(state, data) {
    state.totalDesigns = data
  },
  CREATE_DETAIL(state, data) {
    state.listDetails.unshift(data)
  },
  LIST_DETAILS(state, data) {
    const prev = state.listDetails
    state.listDetails = [...prev, ...data]
  },
  TOTAL_DETAILS(state, data) {
    state.totalDetails = data
  },
  LIST_DETAIL_SKILLS(state, data) {
    state.listDetailSkills = data
  },
  LIST_TEMPLATES(state, data) {
    state.listTemplates = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  ERROR_MSGS_DESIGNS(state, data) {
    state.error_msgs_designs = data
  },
  ERROR_MSGS_DETAILS(state, data) {
    state.error_msgs_details = data
  },
  ERROR_MSGS_TEMPLATES(state, data) {
    state.error_msgs_templates = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  errorMsgResetDesigns({ commit }, data) {
    commit('ERROR_MSGS_DESIGNS', data)
  },
  errorMsgResetDetails({ commit }, data) {
    commit('ERROR_MSGS_DETAILS', data)
  },
  errorMsgResetTemplates({ commit }, data) {
    commit('ERROR_MSGS_TEMPLATES', data)
  },
  errorResetListDesignOptions({ commit }, data) {
    commit('LIST_DESIGNS', data)
  },
  async fetchDeliveries({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'delivery/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const totalDeliveries = res.data.data.total
          commit('TOTAL_DELIVERIES', totalDeliveries)

          const deliveryList = res.data.data.results.map((delivery) => delivery)

          const deliveryOptions = deliveryList.map((delivery) => ({ label: delivery.title, value: delivery.id, type: delivery._type }))

          if (payload.reset) {
            commit('SEARCH_DELIVERIES', deliveryList)
            commit('SEARCH_OPTIONS_DELIVERY', deliveryOptions)
          } else {
            commit('LIST_DELIVERIES', deliveryList)
            commit('LIST_OPTIONS_DELIVERY', deliveryOptions)
          }
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createDelivery({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: false,
      title: false,
      title_msg: '',
      _type: false,
      _type_msg: '',
      mailSubject: false,
      mailSubject_msg: '',
      designId: false,
      designId_msg: '',
      detailId: false,
      detailId_msg: '',
      emailTemplateId: false,
      emailTemplateId_msg: '',
      emailFromName: false,
      emailFromName_msg: ''
    })
    commit('STATUS_OF_API', true)
    commit('DELIVERY_SUCCESS_INFO', {})
    await axios
      .post(config.baseURLApi + 'delivery/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('CREATE_DELIVERY', res.data.data)
          commit('DELIVERY_SUCCESS_INFO', res.data)
          commit('ERROR_MSGS', {
            status: true,
            title: false,
            title_msg: '',
            _type: false,
            _type_msg: '',
            mailSubject: false,
            mailSubject_msg: '',
            designId: false,
            designId_msg: '',
            detailId: false,
            detailId_msg: '',
            emailTemplateId: false,
            emailTemplateId_msg: '',
            emailFromName: false,
            emailFromName_msg: ''
          })
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Delivery has been successfully created', type: 'positive', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('DELIVERY_SUCCESS_INFO', {})
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            title: false,
            title_msg: '',
            _type: false,
            _type_msg: '',
            mailSubject: false,
            mailSubject_msg: '',
            designId: false,
            designId_msg: '',
            detailId: false,
            detailId_msg: '',
            emailTemplateId: false,
            emailTemplateId_msg: '',
            emailFromName: false,
            emailFromName_msg: ''
          }
          if (error.response.data.message.title) {
            if (typeof error.response.data.message.title === 'object') {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title.toString()
            } else {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title
            }
          }
          if (error.response.data.message._type) {
            if (typeof error.response.data.message._type === 'object') {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type.toString()
            } else {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type
            }
          }
          if (error.response.data.message.mailSubject) {
            if (typeof error.response.data.message.mailSubject === 'object') {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject.toString()
            } else {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject
            }
          }
          if (error.response.data.message.designId) {
            if (typeof error.response.data.message.designId === 'object') {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId.toString()
            } else {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId
            }
          }
          if (error.response.data.message.emailTemplateId) {
            if (typeof error.response.data.message.emailTemplateId === 'object') {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId.toString()
            } else {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId
            }
          }
          if (error.response.data.message.emailFromName) {
            if (typeof error.response.data.message.emailFromName === 'object') {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName.toString()
            } else {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName
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
  async updateDelivery({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      status: false,
      title: false,
      title_msg: '',
      _type: false,
      _type_msg: '',
      mailSubject: false,
      mailSubject_msg: '',
      designId: false,
      designId_msg: '',
      detailId: false,
      detailId_msg: '',
      emailTemplateId: false,
      emailTemplateId_msg: '',
      emailFromName: false,
      emailFromName_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'delivery/update', payload, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          commit('UPDATE_DELIVERY', res.data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Badge has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            title: false,
            title_msg: '',
            _type: false,
            _type_msg: '',
            mailSubject: false,
            mailSubject_msg: '',
            designId: false,
            designId_msg: '',
            detailId: false,
            detailId_msg: '',
            emailTemplateId: false,
            emailTemplateId_msg: '',
            emailFromName: false,
            emailFromName_msg: ''
          }
          if (error.response.data.message.title) {
            if (typeof error.response.data.message.title === 'object') {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title.toString()
            } else {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title
            }
          }
          if (error.response.data.message._type) {
            if (typeof error.response.data.message._type === 'object') {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type.toString()
            } else {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type
            }
          }
          if (error.response.data.message.mailSubject) {
            if (typeof error.response.data.message.mailSubject === 'object') {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject.toString()
            } else {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject
            }
          }
          if (error.response.data.message.designId) {
            if (typeof error.response.data.message.designId === 'object') {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId.toString()
            } else {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId
            }
          }
          if (error.response.data.message.emailTemplateId) {
            if (typeof error.response.data.message.emailTemplateId === 'object') {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId.toString()
            } else {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId
            }
          }
          if (error.response.data.message.emailFromName) {
            if (typeof error.response.data.message.emailFromName === 'object') {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName.toString()
            } else {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName
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
  async fetchDelivery({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'delivery/get', payload)
      .then((res) => {
        if (res.data.success) {
          commit('DELIVERY_INFO', res.data.data)
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
  async deleteDelivery({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'delivery/delete', payload)
      .then((res) => {
        if (res.data.success) {
          commit('DELETE_DELIVERY', payload)
          Notify.create({ message: 'Delivery is deleted successfully.', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchlistDesigns({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'design/list', payload)
      .then((res) => {
        const listDesigns = res.data.data.results.map((design) => ({
          value: design.id,
          label: design.title
        }))
        const totalDesigns = res.data.data.total
        commit('LIST_DESIGNS', listDesigns)
        commit('TOTAL_DESIGNS', totalDesigns)
        commit('ERROR_MSGS_DESIGNS', { status: true })
      })
      .catch((error) => {
        commit('ERROR_MSGS_DESIGNS', { status: true })
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchlistDetails({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'details/list', payload)
      .then((res) => {
        const listDetails = res.data.data.results.map((details) => ({
          value: details.id,
          label: details.title
        }))
        const totalDetails = res.data.data.total
        commit('LIST_DETAILS', listDetails)
        commit('TOTAL_DETAILS', totalDetails)
        commit('ERROR_MSGS_DETAILS', { status: true })
      })
      .catch((error) => {
        commit('ERROR_MSGS_DETAILS', { status: true })
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchDetailSkills({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'detail/skills', payload)
      .then((res) => commit('LIST_DETAIL_SKILLS', res.data.data || []))
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async addDetail({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'detail/add', payload)
      .then((res) => {
        if (res.data.success) {
          const detail = {
            value: res.data.data.id,
            label: res.data.data.title
          }
          commit('CREATE_DETAIL', detail)
          Notify.create({ message: 'Detail was successfully added.', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchlistTemplates({ commit }) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'templates/list')
      .then((res) => {
        const listTemplates = res.data.data.results.map((temp) => ({
          value: temp.id,
          label: temp.title
        }))
        commit('LIST_TEMPLATES', listTemplates)
        commit('ERROR_MSGS_TEMPLATES', { status: true })
      })
      .catch((error) => {
        commit('ERROR_MSGS_TEMPLATES', { status: true })
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  badgePaginationKeyForward: (state) => state.paginationKey,
  deliverySuccessInfoGetter: (state) => state.deliverySuccessInfo,
  fetchDeliveryOptionsList: (state) => state.listOptionsDelivery,
  fetchDetailInfoGetter: (state) => state.detailInfo,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchErrorMsgsDesigns: (state) => state.error_msgs_designs,
  fetchErrorMsgsDetails: (state) => state.error_msgs_details,
  fetchErrorMsgsTemplates: (state) => state.error_msgs_templates,
  fetchlistDelivery: (state) => (state.listDelivery.length > 0 ? [...new Set(state.listDelivery)] : []),
  fetchStatusOfApi: (state) => state.statusOfApi,
  isLoading: (state) => state.loading,
  listDesignsOption: (state) => (state.listDesigns.length > 0 ? [...new Set(state.listDesigns)] : []),
  listDetailSkillsOption: (state) => (state.listDetailSkills.length > 0 ? [...new Set(state.listDetailSkills)] : []),
  listDetailsOption: (state) => (state.listDetails.length > 0 ? [...new Set(state.listDetails)] : []),
  listTemplatesOption: (state) => (state.listTemplates.length > 0 ? [...new Set(state.listTemplates)] : []),
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singledeliveryInfo: (state) => (Object.keys(state.deliveryInfo).length > 0 ? state.deliveryInfo : []),
  totalDeliveries: (state) => state.totalDeliveries,
  totalDetails: (state) => state.totalDetails,
  totalDesigns: (state) => state.totalDesigns
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
