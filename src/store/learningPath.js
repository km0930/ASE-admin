import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

const state = {
  error_msgs: {
    learning_path_name: false,
    learning_path_name_msg: '',
    description: false,
    description_msg: '',
    logo: false,
    logo_msg: '',
    price_id: false,
    price_id_msg: ''
  },
  error_msgs_order: {
    status: false,
    order: false,
    order_msg: '',
    learning_path_id: false,
    learning_path_id_msg: ''
  },
  learningPathEvents: [],
  learningPathEventsDetailed: [],
  learningPathInfo: {},
  learningPathsEnrollmentCounts: {
    data: [],
    labels: []
  },
  learningPathOptions: [],
  listLearningPath: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false,
  statusOfApi: true,
  descriptiveQuestion: []
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_LEARNINGPATH(state, data) {
    const prev = state.listLearningPath
    state.listLearningPath = prev.concat(data)
  },
  CREATE_LEARNINGPATH(state, data) {
    state.listLearningPath.unshift(data)
  },
  UPDATE_LEARNINGPATH(state, data) {
    const index = state.listLearningPath.findIndex((lp) => lp.id === data.id)
    state.listLearningPath.splice(index, 1, data)
  },
  DELETE_LEARNINGPATH(state, data) {
    const index = state.listLearningPath.findIndex((lp) => lp.id === data.learning_path_id)
    state.listLearningPath.splice(index, 1)
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  ERROR_MSGS_ORDER(state, data) {
    state.error_msgs_order = Object.assign(state.error_msgs_order, data)
  },
  RESET_LIST_LEARNINGPATH(state, data) {
    state.listLearningPath = data
  },
  FETCH_LEARNING_PATH(state, data) {
    state.learningPathInfo = {}
    state.learningPathInfo = data
  },
  OPTION_LEARNING_PATH(state, data) {
    state.learningPathOptions = data
  },
  LEARNING_PATHS_ENROLLMENT_COUNTS(state, data) {
    state.learningPathsEnrollmentCounts = data
  },
  LEARNING_PATH_EVENTS(state, data) {
    state.learningPathEvents = data
  },
  LEARNING_PATH_EVENTS_DETAILED(state, data) {
    state.learningPathEventsDetailed = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
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
  SET_DESCRIPTIVE_QUESTION(state, data) {
    state.descriptiveQuestion = data
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
  async fetchLearningPaths({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'learning-path/list', payload.pagination)
      .then((res) => {
        const learningPathData = res.data.data.data.map((data) => ({
          ...data,
          id: data.sk,
          label: data.name || data.learning_path_name,
          value: data.sk
        }))
        commit('SEARCH_FIRE', false)
        if (payload.reset) {
          commit('RESET_LIST_LEARNINGPATH', learningPathData)
        } else {
          commit('LIST_LEARNINGPATH', learningPathData)
        }
        commit('PAGINATION_KEY', res.data.data.last_value || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchIndividualLearningPathEvents({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'learning-path/events', payload)
      .then((res) => {
        const eventsList = []
        res.data.data.forEach((data) => {
          Object.entries(data).forEach(([key, value]) => {
            eventsList.push({
              name: value.name,
              id: key,
              order: value.order
            })
          })
        })
        commit(
          'LEARNING_PATH_EVENTS',
          eventsList.sort(function (a, b) {
            return a.order - b.order
          })
        )
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchIndividualLearningPathEventsDetailed({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'dashboard/get-courses-forlp', payload)
      .then((res) => commit('LEARNING_PATH_EVENTS_DETAILED', res.data.data.data))
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchLpCoursesFilters({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'learning-path/events', payload)
      .then((res) => {
        const eventsList = []
        res.data.data.forEach((data) => {
          Object.entries(data).forEach(([key, value]) => {
            eventsList.push({
              name: value.name,
              id: key,
              order: value.order
            })
          })
        })
        commit(
          'LEARNING_PATH_EVENTS',
          eventsList.sort(function (a, b) {
            return a.order - b.order
          })
        )
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createEventsContentsOrder({ commit }, payload) {
    commit('LOADING', true)
    const errMsgs = {
      status: false,
      order: false,
      order_msg: '',
      learning_path_id: false,
      learning_path_id_msg: ''
    }
    commit('ERROR_MSGS_ORDER', errMsgs)
    await axios
      .post(config.baseURLApi + 'learning-path/events/order', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Events Contents has been successfully ordered', color: 'green', position: 'top' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const errMsgs = {
            status: true,
            order: false,
            order_msg: '',
            learning_path_id: false,
            learning_path_id_msg: ''
          }
          if (error.response.data.message.order) {
            if (typeof error.response.data.message.order === 'object') {
              let stringData = ''
              Object.entries(error.response.data.message.order).forEach(([key, value]) => {
                if (typeof value === 'object') {
                  Object.entries(value).forEach(([subkey, subvalue]) => {
                    if (typeof subvalue === 'object') {
                      Object.entries(subvalue).map(([subsubkey, subsubvalue]) => (stringData += `Order=> ${subkey}: ${subsubvalue},`))
                    } else {
                      stringData += ` Order=> ${subkey}: ${subvalue},`
                    }
                  })
                } else {
                  stringData += `Order => ${key}: ${value},`
                }
              })
              errMsgs.order = true
              errMsgs.order_msg = stringData
            } else {
              errMsgs.order = true
              errMsgs.order_msg = error.response.data.message.order
            }
          }
          if (error.response.data.message.learning_path_id) {
            if (typeof error.response.data.message.learning_path_id === 'object') {
              errMsgs.learning_path_id = true
              errMsgs.learning_path_id_msg = error.response.data.message.learning_path_id.toString()
            } else {
              errMsgs.learning_path_id = true
              errMsgs.learning_path_id_msg = error.response.data.message.learning_path_id
            }
          }
          if (typeof error.response.data.message === 'string') {
            errMsgs.status = false
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
          commit('ERROR_MSGS_ORDER', errMsgs)
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchLearningPath({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const learningPathData = res.data.data.data.map((data) => ({
            name: data.learning_path_name,
            id: data.sk,
            description: data.description
          }))
          commit('SEARCH_FIRE', true)

          if (payload.reset) {
            commit('RESET_LIST_LEARNINGPATH', learningPathData)
          } else {
            commit('LIST_LEARNINGPATH', learningPathData)
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
  async createLearningPath({ commit }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      learning_path_name: false,
      learning_path_name_msg: '',
      description: false,
      description_msg: '',
      logo: false,
      logo_msg: '',
      price_id: false,
      price_id_msg: ''
    })
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'learning-path/create', payload)
      .then((res) => {
        if (res.data.success) {
          const learningPathData = {
            ...res.data.data,
            id: res.data.data.sk
          }
          commit('CREATE_LEARNINGPATH', learningPathData)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Learning Path has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response?.status === 400) {
          const errMsgs = {
            learning_path_name: false,
            learning_path_name_msg: '',
            description: false,
            description_msg: '',
            logo: false,
            logo_msg: ''
          }
          if (error.response.data.message.learning_path_name) {
            if (typeof error.response.data.message.learning_path_name === 'object') {
              errMsgs.learning_path_name = true
              errMsgs.learning_path_name_msg = error.response.data.message.learning_path_name.toString()
            } else {
              errMsgs.learning_path_name = true
              errMsgs.learning_path_name_msg = error.response.data.message.learning_path_name
            }
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
          if (error.response.data.message.price_id) {
            if (typeof error.response.data.message.price_id === 'object') {
              errMsgs.price_id = true
              errMsgs.price_id_msg = error.response.data.message.price_id.toString()
            } else {
              errMsgs.price_id = true
              errMsgs.price_id_msg = error.response.data.message.price_id
            }
          }
          if (error.response.data.message.logo) {
            if (typeof error.response.data.message.logo === 'object') {
              errMsgs.logo = true
              errMsgs.logo_msg = error.response.data.message.logo.toString()
            } else {
              errMsgs.logo = true
              errMsgs.logo_msg = error.response.data.message.logo
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Something went wrong' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchLearningPath({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'learning-path/get', payload)
      .then((res) => {
        if (res.data.success) {
          const learningPathData = {
            name: res.data.data.learning_path_name,
            id: res.data.data.sk,
            description: res.data.data.description,
            learningPathId: urlSafeBase64Encode(res.data.data.sk),
            price_id: res.data.data.price_id || ''
          }
          if (res.data.data.logo) {
            learningPathData.logo = res.data.data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString()
          }
          commit('FETCH_LEARNING_PATH', learningPathData)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchLearningPathsEnrollmentCounts({ commit }) {
    axios
      .get(config.baseURLApi + 'dashboard/get-learning-path-counts')
      .then((res) => {
        if (res.data.success) {
          const color = ['#246590', '#5AB049', '#F5B041', '#45B39D', '#f08a5d', '#FF5733', '#6f4a8e', '#3282b8', '#00c698', '#0097A7']
          let index = 0
          const learningPathData = []
          const learningPathLabels = []
          res.data.data.data.forEach((data) => {
            learningPathData.push({
              name: data.learning_path_name,
              value: data.count,
              itemStyle: { color: color[index] }
            })
            learningPathLabels.push(data.learning_path_name)
            index += 1
          })
          commit('LEARNING_PATHS_ENROLLMENT_COUNTS', {
            data: learningPathData,
            labels: learningPathLabels
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  },
  async updateLearningPath({ commit }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      learning_path_name: false,
      learning_path_name_msg: '',
      description: false,
      description_msg: '',
      logo: false,
      logo_msg: '',
      price_id: false,
      price_id_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'learning-path/update', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          const learningPathData = {
            ...res.data.data,
            id: res.data.data.sk
          }
          commit('UPDATE_LEARNINGPATH', learningPathData)
          Notify.create({ message: 'Learning Path has been successfully updated', color: 'green', position: 'top' })
        } else {
          commit('STATUS_OF_API', false)
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response?.status === 400) {
          const errMsgs = {
            learning_path_name: false,
            learning_path_name_msg: '',
            description: false,
            description_msg: '',
            logo: false,
            logo_msg: ''
          }
          if (error.response.data.message.learning_path_name) {
            if (typeof error.response.data.message.learning_path_name === 'object') {
              errMsgs.learning_path_name = true
              errMsgs.learning_path_name_msg = error.response.data.message.learning_path_name.toString()
            } else {
              errMsgs.learning_path_name = true
              errMsgs.learning_path_name_msg = error.response.data.message.learning_path_name
            }
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
          if (error.response.data.message.price_id) {
            if (typeof error.response.data.message.price_id === 'object') {
              errMsgs.price_id = true
              errMsgs.price_id_msg = error.response.data.message.price_id.toString()
            } else {
              errMsgs.price_id = true
              errMsgs.price_id_msg = error.response.data.message.price_id
            }
          }
          if (error.response.data.message.logo) {
            if (typeof error.response.data.message.logo === 'object') {
              errMsgs.logo = true
              errMsgs.logo_msg = error.response.data.message.logo.toString()
            } else {
              errMsgs.logo = true
              errMsgs.logo_msg = error.response.data.message.logo
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Something went wrong' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  deleteLearningPath({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'learning-path/delete', payload)
      .then((res) => {
        if (res.data.success) {
          commit('DELETE_LEARNINGPATH', payload)
          Notify.create({ message: 'Learning Path has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchLearningPathOptions({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'learning-path/list-options')
      .then((res) => {
        const learningPathOptions = res.data.data.data.map((data) => ({
          value: data.sk,
          label: data.learning_path_name
        }))
        commit('OPTION_LEARNING_PATH', learningPathOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async generatePathDetail({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.generateQuestionApi + 'generate')
      .then((res) => {
        commit('SET_DESCRIPTIVE_QUESTION', res.data.data)
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
  fetchDetailedLpCourses: (state) => state.learningPathEventsDetailed,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchErrorMsgsOrder: (state) => state.error_msgs_order,
  fetchLearningPathEvents: (state) => state.learningPathEvents,
  fetchLearningPathsCountsGetter: (state) => state.learningPathsEnrollmentCounts,
  fetchStatusOfApi: (state) => state.statusOfApi,
  instructorPathPaginationKeyForward: (state) => state.paginationKey,
  isLoading: (state) => state.loading,
  learningPathList: (state) => (state.listLearningPath.length > 0 ? [...new Set(state.listLearningPath)] : []),
  learningPathOption: (state) => (state.learningPathOptions.length > 0 ? [...new Set(state.learningPathOptions)] : []),
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singleLearningPathInfo: (state) => (Object.keys(state.learningPathInfo).length > 0 ? state.learningPathInfo : {})
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
