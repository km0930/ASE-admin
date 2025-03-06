import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { timeSince } from 'src/utils/reuseFunctions'

const state = {
  certificateInfo: {
    count: 0,
    data: []
  },
  error_msgs: {
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    role: false,
    role_msg: ''
  },
  errorMessage: '',
  event: null,
  listUsers: [],
  loading: false,
  paginationKey: {},
  paginationKeyPartner: {},
  paginationKeyTraining: {},
  partnersList: [],
  recentActivitiesData: [],
  searchByName: '',
  searchFire: false,
  statsCountInfo: {
    totalCourseCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    labCount: 0
  },
  statusOfApi: true,
  trainingList: [],
  uiSearch: false,
  user_info: {},
  usersASEList: []
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  IS_CREATE_ERROR(state, data) {
    state.errorMessage = data
  },
  STATS_COUNT_INFO(state, data) {
    state.statsCountInfo = data
  },
  CERTIFICATE_INFO(state, data) {
    state.certificateInfo = data
  },
  RECENT_ACTIVITIES_DATA(state, data) {
    state.recentActivitiesData = data
  },
  PARTNERS_LIST(state, data) {
    const prev = state.partnersList
    state.partnersList = prev.concat(data)
  },
  RESET_PARTNERS_LIST(state, data) {
    state.partnersList = data
  },
  TRAINING_LIST(state, data) {
    const prev = state.trainingList
    state.trainingList = prev.concat(data)
  },
  RESET_TRAINING_LIST(state, data) {
    state.trainingList = data
  },
  FETCH_USER_INFO(state, data) {
    state.user_info = data
  },
  ASE_USERS_LIST(state, data) {
    const prev = state.usersASEList
    state.usersASEList = prev.concat(data)
  },
  RESET_ASE_USERS_LIST(state, data) {
    state.usersASEList = data
  },
  USERS_LIST(state, data) {
    const prev = state.listUsers
    state.listUsers = prev.concat(data)
  },
  RESET_USERS_LIST(state, data) {
    state.listUsers = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  PAGINATION_KEY_PARTNER(state, data) {
    state.paginationKeyPartner = data
  },
  PAGINATION_KEY_TRAINING(state, data) {
    state.paginationKeyTraining = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
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
  uiSearchAction({ commit }, data) {
    commit('UI_SEARCH', data)
  },
  recentActivities({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post('admin/get-user-activity', payload)
      .then((res) => {
        if (res.data) {
          commit('STATS_COUNT_INFO', {
            totalCourseCount: res.data.data.data.count_info.total_course_count || 0,
            inProgressCount: res.data.data.data.count_info.course_inprogress_count || 0,
            completedCount: res.data.data.data.count_info.course_completed_count || 0,
            labCount: res.data.data.data.count_info.lab_count || 0
          })
          const ra = []
          res.data.data.data.course_lab_info.map((data) => {
            let createdOn = ''
            let endDate, startDate
            if (data.end_date) {
              const dt = new Date(data.end_date)
              const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
              endDate = timeSince(udt)
            }
            if (data.start_date) {
              const dt = new Date(data.start_date)
              const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
              startDate = timeSince(udt)
            }
            if (data.created_on) {
              const dt = new Date(data.created_on)
              const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
              createdOn = timeSince(udt)
            }
            let icon = ''
            const url = ''
            let name = ''
            let progress = 0
            let numMinutes = 0
            let completed = false
            let isActive = false
            let type = 'event'
            const action = data.in_progress === 100 ? 'completed' : 'pending'
            if (data.event_name) {
              icon = 'fas fa-video'
              name = data.event_name
              progress = data.in_progress
              completed = data.is_completed
              isActive = data.is_active
            } else if (data.lab_name) {
              icon = 'fas fa-flask'
              name = data.lab_name
              type = 'lab'
              numMinutes = data.num_minutes
            }
            return ra.push({
              createdOn: createdOn,
              startDate: startDate,
              action: action,
              endDate: endDate,
              progress: progress,
              isActive: isActive,
              numMinutes: numMinutes,
              name: name,
              icon: icon,
              completed: completed,
              url: url,
              type: type
            })
          })
          commit('RECENT_ACTIVITIES_DATA', ra)
        }
      })
      .finally(() => commit('LOADING', false))
  },
  certificateInfo({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post('admin/get-user-cert', payload)
      .then((res) => {
        if (res.data) {
          const certificateCount = res.data.data.data.cert_count
          commit('CERTIFICATE_INFO', {
            count: certificateCount || 0,
            data: res.data.data.data.cert_info
          })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async createUser({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: '',
      role: false,
      role_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'admin/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'User is created successfully', color: 'green', position: 'top' })
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchUsersList', data)
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
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
          if (error.response.data.message.role) {
            if (typeof error.response.data.message.role === 'object') {
              errMsgs.role = true
              errMsgs.role_msg = error.response.data.message.role.toString()
            } else {
              errMsgs.role = true
              errMsgs.role_msg = error.response.data.message.role
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
  async deleteUser({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'admin/delete', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'User deleted successfully', color: 'red', position: 'top' })
          const data = {
            pagination: {},
            reset: true
          }
          dispatch('fetchUsersList', data)
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchUsersList({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'admin/list', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.success) {
          const listUsers = res.data.data.users.map((user) => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role || ''
          }))
          if (payload.reset) {
            commit('RESET_USERS_LIST', listUsers)
          } else {
            commit('USERS_LIST', listUsers)
          }
          if (res.data.data.last_value) {
            commit('PAGINATION_KEY', res.data.data.last_value)
          } else {
            commit('PAGINATION_KEY', {})
          }
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchPartnerList({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'partner/users', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.data.partner_users.map((user) => ({
            name: user.name,
            email: user.email
          }))
          if (payload.reset) {
            commit('RESET_PARTNERS_LIST', listUsers)
          } else {
            commit('PARTNERS_LIST', listUsers)
          }
          if (res.data.data.last_value) {
            commit('PAGINATION_KEY_PARTNER', res.data.data.last_value)
          } else {
            commit('PAGINATION_KEY_PARTNER', {})
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
  fetchTrainingList({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'training/users', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.data.training_users.map((user) => ({
            name: user.name,
            email: user.email
          }))
          if (payload.reset) {
            commit('RESET_TRAINING_LIST', listUsers)
          } else {
            commit('TRAINING_LIST', listUsers)
          }
          if (res.data.data.last_value) {
            commit('PAGINATION_KEY_TRAINING', res.data.data.last_value)
          } else {
            commit('PAGINATION_KEY_TRAINING', {})
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
  updateUserType({ commit, state }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'admin/role/update', payload)
      .then((res) => {
        if (res.data.success) {
          const searchIndex = state.listUsers
            .map(function (e) {
              return e.email
            })
            .indexOf(payload.email)
          const listFinal = state.listUsers
          const updateObj = listFinal[searchIndex]
          updateObj.role = payload.role
          listFinal[searchIndex] = updateObj
          commit('USERS_LIST', listFinal)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchUserInfo({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'user/get', payload)
      .then((res) => {
        if (res.data.success) {
          const userInfo = {
            first_name: res.data.data.first_name,
            last_name: res.data.data.last_name,
            email: res.data.data.email,
            role: res.data.data.role
          }
          commit('FETCH_USER_INFO', userInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchASEUsersList({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'users/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          commit('SEARCH_FIRE', false)
          if (payload.reset) {
            commit('RESET_ASE_USERS_LIST', res.data.data.data)
          } else {
            commit('ASE_USERS_LIST', res.data.data.data)
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
  async searchASEUsers({ commit }, payload) {
    if (!state.uiSearch) {
      commit('LOADING', true)
      axios
        .post(config.baseURLApi + 'users/list', payload)
        .then((res) => {
          if (res.data.success) {
            commit('SEARCH_FIRE', true)
            if (payload.reset) {
              commit('RESET_ASE_USERS_LIST', res.data.data.data)
            } else {
              commit('ASE_USERS_LIST', res.data.data.data)
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
      const searchList = state.usersASEList.filter(
        (data) =>
          data.email.toLowerCase().indexOf(payload.search_key.toLowerCase()) > -1 ||
          data.first_name.toLowerCase().indexOf(payload.search_key.toLowerCase()) > -1
      )
      commit('RESET_ASE_USERS_LIST', searchList)
      commit('PAGINATION_KEY', {})
      commit('SEARCH_FIRE', false)
    }
  },
  async searchUsers({ commit }, payload) {
    if (!state.uiSearch) {
      commit('LOADING', true)
      axios
        .post(config.baseURLApi + 'list/search', payload.pagination)
        .then((res) => {
          if (res.data.success) {
            const listUsers = res.data.data.users.map((user) => ({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role || ''
            }))
            commit('SEARCH_FIRE', true)

            if (payload.reset) {
              commit('RESET_USERS_LIST', listUsers)
            } else {
              commit('USERS_LIST', listUsers)
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
      const searchList = state.listUsers.filter(
        (data) =>
          data.email.toLowerCase().indexOf(payload.pagination.query.toLowerCase()) > -1 ||
          data.first_name.toLowerCase().indexOf(payload.pagination.query.toLowerCase()) > -1
      )
      commit('RESET_USERS_LIST', searchList)
      commit('PAGINATION_KEY', {})
      commit('SEARCH_FIRE', false)
    }
  }
}

const getters = {
  fetchCertificateInfo: (state) => state.certificateInfo,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchRecentActivities: (state) => state.recentActivitiesData,
  fetchStatsData: (state) => state.statsCountInfo,
  fetchStatusOfApi: (state) => state.statusOfApi,
  getASEUsersList: (state) => (state.usersASEList.length > 0 ? [...new Set(state.usersASEList)] : []),
  getPartnersUsersList: (state) => state.partnersList,
  getTrainingUsersList: (state) => state.trainingList,
  getUsersList: (state) => (state.listUsers.length > 0 ? [...new Set(state.listUsers)] : []),
  isLoading: (state) => state.loading,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  singleUserInfo: (state) => state.user_info,
  usersPaginationKeyForward: (state) => state.paginationKey,
  usersPaginationKeyForwardPartner: (state) => state.paginationKeyPartner
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
