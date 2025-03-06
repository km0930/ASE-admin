import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { Notify } from 'quasar'

const state = {
  error_msgs: {
    instructor_name: false,
    instructor_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  },
  instructorInfo: {},
  instructorOptions: [],
  listInstructors: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  statusOfApi: true
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_INSTRUCTOR(state, data) {
    const prev = state.listInstructors
    state.listInstructors = prev.concat(data)
  },
  CREATE_INSTRUCTOR(state, data) {
    state.listInstructors.unshift(data)
  },
  UPDATE_INSTRUCTOR(state, data) {
    const index = state.listInstructors.findIndex((instructor) => instructor.id === data.id)
    state.listInstructors.splice(index, 1, data)
  },
  DELETE_INSTRUCTOR(state, data) {
    const index = state.listInstructors.findIndex((instructor) => instructor.id === data.instructor_id)
    state.listInstructors.splice(index, 1)
  },
  RESET_LIST_INSTRUCTOR(state, data) {
    state.listInstructors = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  FETCH_INSTRUCTOR_INFO(state, data) {
    state.instructorInfo = {}
    state.instructorInfo = data
  },
  OPTION_INSTRUCTOR(state, data) {
    state.instructorOptions = data
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
  async fetchInstructors({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'instructor/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const instructorList = res.data.data.data.map((instructor) => ({
            ...instructor,
            id: instructor.sk
          }))
          if (payload.reset) {
            commit('RESET_LIST_INSTRUCTOR', instructorList)
          } else {
            commit('LIST_INSTRUCTOR', instructorList)
          }
          commit('PAGINATION_KEY', res.data.data.last_value || {})
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
  async searchInstructor({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const instructorList = res.data.data.data.map((instructor) => ({
            name: instructor.instructor_name,
            id: instructor.sk,
            about: instructor.about,
            photo: instructor.photo
          }))

          commit('SEARCH_FIRE', true)
          if (payload.reset) {
            commit('RESET_LIST_INSTRUCTOR', instructorList)
          } else {
            commit('LIST_INSTRUCTOR', instructorList)
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
  async createInstructor({ commit }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      instructor_name: false,
      instructor_name_msg: '',
      about: false,
      about_msg: '',
      photo: false,
      photo_msg: '',
      photo_name: false,
      photo_name_msg: ''
    })
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'instructor/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('CREATE_INSTRUCTOR', res.data.data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Instructor has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('LOADING', false)
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            instructor_name: false,
            instructor_name_msg: '',
            about: false,
            about_msg: '',
            photo: false,
            photo_msg: '',
            photo_name: false,
            photo_name_msg: ''
          }
          if (error.response.data.message.about) {
            if (typeof error.response.data.message.about === 'object') {
              errMsgs.about = true
              errMsgs.about_msg = error.response.data.message.about.toString()
            } else {
              errMsgs.about = true
              errMsgs.about_msg = error.response.data.message.about
            }
          }
          if (error.response.data.message.instructor_name) {
            if (typeof error.response.data.message.instructor_name === 'object') {
              errMsgs.instructor_name = true
              errMsgs.instructor_name_msg = error.response.data.message.instructor_name.toString()
            } else {
              errMsgs.instructor_name = true
              errMsgs.instructor_name_msg = error.response.data.message.instructor_name
            }
          }
          if (error.response.data.message.photo) {
            if (typeof error.response.data.message.photo === 'object') {
              errMsgs.photo = true
              errMsgs.photo_msg = error.response.data.message.photo.toString()
            } else {
              errMsgs.photo = true
              errMsgs.photo_msg = error.response.data.message.photo
            }
          }
          if (error.response.data.message.photo_name) {
            if (typeof error.response.data.message.photo_name === 'object') {
              errMsgs.photo_name = true
              errMsgs.photo_name_msg = error.response.data.message.photo_name.toString()
            } else {
              errMsgs.photo_name = true
              errMsgs.photo_name_msg = error.response.data.message.photo_name
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
  async fetchInstructor({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'instructor/get', payload)
      .then((res) => {
        if (res.data.success) {
          const instructorInfo = {
            instructor_name: res.data.data.instructor_name,
            id: res.data.data.sk,
            about: res.data.data.about,
            instructorId: urlSafeBase64Encode(res.data.data.sk),
            image: res.data.data.photo + '?' + new Date(new Date().toUTCString()).toLocaleString(),
            imageName: res.data.data.photo_name
          }
          commit('FETCH_INSTRUCTOR_INFO', instructorInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateInstructor({ commit }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'instructor/update', payload)
      .then((res) => {
        if (res.data.success) {
          const instructorInfo = {
            ...res.data.data,
            id: res.data.data.sk
          }
          commit('UPDATE_INSTRUCTOR', instructorInfo)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Instructor has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  deleteInstructor({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'instructor/delete', payload)
      .then((res) => {
        if (res.data.success) {
          commit('DELETE_INSTRUCTOR', payload)
          Notify.create({ message: 'Instructor has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchInstructorOptions({ commit }) {
    commit('LOADING', true)
    axios
      .get(config.baseURLApi + 'instructor/option')
      .then((res) => {
        const instructorOptions = res.data.data.data.map((instructor) => ({
          value: instructor.sk,
          label: instructor.instructor_name,
          img: instructor.photo
        }))
        instructorOptions.sort((a, b) => {
          const nameA = a.label.toLowerCase()
          const nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        commit('OPTION_INSTRUCTOR', instructorOptions)
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
  fetchlistInstructors: (state) => state.listInstructors,
  fetchStatusOfApi: (state) => state.statusOfApi,
  instructorOption: (state) => (state.instructorOptions.length > 0 ? [...new Set(state.instructorOptions)] : []),
  instructorPaginationKeyForward: (state) => state.paginationKey,
  isLoading: (state) => state.loading,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singleInstructorInfo: (state) => (Object.keys(state.instructorInfo).length > 0 ? state.instructorInfo : [])
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
