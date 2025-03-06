import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  error_msgs: {
    status: true,
    description: false,
    description_msg: '',
    subject_name: false,
    subject_name_msg: '',
    is_active: false,
    is_active_msg: ''
  },
  contentOptions: [],
  filteredDetailedSubjectInfo: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  subject: '',
  subjectHeader: {},
  subjectsList: [],
  subjectsListOrder: [],
  uiSearch: false
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_SUBJECTS(state, data) {
    const prev = state.subjectsList
    state.subjectsList = prev.concat(data)
  },
  RESET_LIST_SUBJECTS(state, data) {
    state.subjectsList = data
  },
  LIST_SUBJECTS_ORDER(state, data) {
    state.subjectsListOrder = data
  },
  FETCH_SUBJECT(state, data) {
    state.subject = data
  },
  CONTENTS_OPTION(state, data) {
    state.contentOptions = []
    state.contentOptions = data
  },
  SUB_HEADER(state, data) {
    state.subjectHeader = {}
    state.subjectHeader = data
  },
  FILTERED_DETAILED_SUBJECT_INFO(state, data) {
    state.filteredDetailedSubjectInfo = data
  },
  FILTERED_DETAILED_SUBJECT_INFO_LAB(state, payload) {
    const originalList = state.filteredDetailedSubjectInfo
    const listFinal = state.filteredDetailedSubjectInfo.lab
    const updateObj = listFinal[payload.index]
    updateObj.is_active = payload.status
    listFinal[payload.index] = updateObj
    originalList.lab = listFinal
    state.filteredDetailedSubjectInfo = originalList
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  },
  UI_SEARCH(state, data) {
    state.uiSearch = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  resetDataSubjectLab({ commit }, payload) {
    commit('FILTERED_DETAILED_SUBJECT_INFO_LAB', payload)
  },
  uiSearchAction({ commit }, data) {
    commit('UI_SEARCH', data)
  },
  async fetchSubjectsByEvent({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'subject-list/event', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const subjectsByEventData = []
          const subOptions = []
          res.data.data.forEach((subject) => {
            const subDict = {
              name: subject.subject_name,
              description: subject.description,
              id: subject.sk,
              event_id: subject.event_id
            }
            const d = { label: subject.subject_name, code: subject.sk }
            subOptions.push(d)
            subjectsByEventData.push(subDict)
          })
          const optDict = {
            options: subOptions
          }
          subjectsByEventData.push(optDict)
          commit('SEARCH_FIRE', false)
          if (payload.reset) {
            commit('RESET_LIST_SUBJECTS', subjectsByEventData)
          } else {
            commit('LIST_SUBJECTS', subjectsByEventData)
          }
          if (res.data.data.last_value) {
            commit('PAGINATION_KEY', res.data.data.last_value)
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
  async searchSubject({ state, commit }, payload) {
    if (!state.uiSearch) {
      commit('LOADING', true)
      axios
        .post(config.baseURLApi + 'list/search', payload.pagination)
        .then((res) => {
          if (res.data.success) {
            const subjectsByEventData = []
            const subOptions = []
            res.data.data.data.forEach((subject) => {
              const subDict = {
                name: subject.subject_name,
                description: subject.description,
                id: subject.sk,
                event_id: subject.event_id
              }
              const d = { label: subject.subject_name, code: subject.sk }
              subOptions.push(d)
              subjectsByEventData.push(subDict)
            })
            const optDict = {
              options: subOptions
            }
            subjectsByEventData.push(optDict)

            commit('SEARCH_FIRE', true)
            if (payload.reset) {
              commit('RESET_LIST_SUBJECTS', subjectsByEventData)
            } else {
              commit('LIST_SUBJECTS', subjectsByEventData)
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
    } else {
      const searchList = state.subjectsList.filter((data) => data.name.toLowerCase().indexOf(payload.pagination.query.toLowerCase()) > -1)
      commit('RESET_LIST_SUBJECTS', searchList)
      commit('PAGINATION_KEY', {})
      commit('SEARCH_FIRE', false)
    }
  },
  fetchSubjectsByEventOrder({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'subject-list/event', payload)
      .then((res) => {
        if (res.data.success) {
          const subOptions = res.data.data.map((subject) => ({ label: subject.subject_name, code: subject.sk }))
          commit('LIST_SUBJECTS_ORDER', subOptions)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },

  async fetchFilteredDetailedSubjectInformation({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'subject/items', payload)
      .then((res) => {
        if (res.data.success) {
          commit('FILTERED_DETAILED_SUBJECT_INFO', res.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createSubject({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      description: false,
      description_msg: '',
      subject_name: false,
      subject_name_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'subject/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {
              event_id: payload.event_id
            },
            reset: true
          }
          dispatch('fetchSubjectsByEvent', data)
          Notify.create({ message: 'Subject has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            description: false,
            description_msg: '',
            subject_name: false,
            subject_name_msg: ''
          }
          if (error.response.data.message.description) {
            if (typeof error.response.data.message.description === 'object') {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description.toString()
            } else {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description
            }
          }
          if (error.response.data.message.subject_name) {
            if (typeof error.response.data.message.subject_name === 'object') {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name.toString()
            } else {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name
            }
          }
          if (error.response.data.message.is_active) {
            if (typeof error.response.data.message.is_active === 'object') {
              errMsgs.is_active = true
              errMsgs.is_active_msg = error.response.data.message.is_active.toString()
            } else {
              errMsgs.is_active = true
              errMsgs.is_active_msg = error.response.data.message.is_active
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
  createSubjectOrder({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'subject/order', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Subject has been successfully ordered', color: 'green', position: 'top' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchSubject({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'subject/get', payload)
      .then(async (res) => {
        const subject = {
          name: res.data.data.subject_name,
          id: res.data.data.sk,
          eventId: res.data.data.event_id,
          description: res.data.data.description,
          is_active: res.data.data.is_active
        }
        commit('FETCH_SUBJECT', subject)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateSubject({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      description: false,
      description_msg: '',
      subject_name: false,
      subject_name_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'subject/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {
              event_id: payload.event_id
            },
            reset: true
          }
          dispatch('fetchSubjectsByEvent', data)
          Notify.create({ message: 'Subject has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            description: false,
            description_msg: '',
            subject_name: false,
            subject_name_msg: ''
          }
          if (error.response.data.message.description) {
            if (typeof error.response.data.message.description === 'object') {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description.toString()
            } else {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description
            }
          }
          if (error.response.data.message.subject_name) {
            if (typeof error.response.data.message.subject_name === 'object') {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name.toString()
            } else {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name
            }
          }
          if (error.response.data.message.is_active) {
            if (typeof error.response.data.message.is_active === 'object') {
              errMsgs.is_active = true
              errMsgs.is_active_msg = error.response.data.message.is_active.toString()
            } else {
              errMsgs.is_active = true
              errMsgs.is_active_msg = error.response.data.message.is_active
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
  deleteSubject({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'subject/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {
              event_id: payload.event_id
            },
            reset: true
          }
          dispatch('fetchSubjectsByEvent', data)
          Notify.create({ message: 'Subject has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async deleteGeneric({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + payload.url, payload.data)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Deleted successfully', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async subjectContentsList({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'subject/get-contents', payload)
      .then((res) => {
        if (res.data.success) {
          const subjectsHeader = {}
          const subOptions = []
          res.data.data.forEach((subject) => {
            const sub = subject.sk.split('#')
            subjectsHeader.name = sub[2]
            subjectsHeader.id = sub[1]
            const d = { label: sub[4], code: subject.sk }
            subOptions.push(d)
          })
          commit('CONTENTS_OPTION', subOptions)
          commit('SUB_HEADER', subjectsHeader)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createSubjectContentsOrder({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'subject/order-contents', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Subject Contents has been successfully ordered', color: 'green', position: 'top' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
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
  fetchFilterDetailedSubjectGetter: (state) => state.filteredDetailedSubjectInfo,
  fetchSubjectContentsList: (state) => (state.contentOptions.length > 0 ? [...new Set(state.contentOptions)] : []),
  isLoading: (state) => state.loading,
  searchByNameGetter: (state) => state.searchByName,
  singleSubjectInfo: (state) => (Object.keys(state.subject).length > 0 ? state.subject : []),
  subjectContentHeader: (state) => (Object.keys(state.subjectHeader).length > 0 ? state.subjectHeader : []),
  subjectsByEvent: (state) => (state.subjectsList.length > 0 ? [...new Set(state.subjectsList)] : []),
  subjectsByEventOrder: (state) => (state.subjectsListOrder.length > 0 ? [...new Set(state.subjectsListOrder)] : []),
  subjectsPaginationKeyForward: (state) => state.paginationKey
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
