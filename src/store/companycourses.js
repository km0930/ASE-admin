import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  errorMessage: '',
  listCourses: [],
  loading: false,
  paginationKey: {},
  searchByName: '',
  searchFire: false
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  IS_CREATE_ERROR(state, data) {
    state.errorMessage = data
  },
  COURSES_LIST(state, data) {
    const prev = state.listCourses
    state.listCourses = prev.concat(data)
  },
  RESET_COURSES_LIST(state, data) {
    state.listCourses = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
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
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  fetchCompanyCoursesList({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'admin/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listCourses = res.data.data.users.map((user) => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }))
          if (payload.reset) {
            commit('RESET_COURSES_LIST', listCourses)
          } else {
            commit('COURSES_LIST', listCourses)
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
  async searchCompanyCourses({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listCourses = res.data.data.users.map((user) => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }))
          commit('SEARCH_FIRE', true)

          if (payload.reset) {
            commit('RESET_COURSES_LIST', listCourses)
          } else {
            commit('COURSES_LIST', listCourses)
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
  }
}

const getters = {
  coursesCompanyPaginationKeyForward: (state) => state.paginationKey,
  getCompanyCoursesListGetter: (state) => (state.listCourses.length > 0 ? [...new Set(state.listCourses)] : []),
  isLoading: (state) => state.loading,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
