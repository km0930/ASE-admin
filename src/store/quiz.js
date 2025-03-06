import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

const state = {
  error_msgs: {
    status: true,
    quiz_name: false,
    quiz_name_msg: '',
    quiz_url: false,
    quiz_url_msg: '',
    quiz_ttl: false,
    quiz_ttl_msg: '',
    subject_id: false,
    subject_id_msg: '',
    event_id: false,
    event_id_msg: '',
    is_active: false,
    is_active_msg: ''
  },
  listQuizs: [],
  loading: false,
  paginationKey: '',
  quizInfo: []
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_QUIZS(state, data) {
    state.listQuizs = data
  },
  QUIZ_PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  FETCH_QUIZ(state, data) {
    state.quizInfo = []
    state.quizInfo = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgResetQuiz({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  fetchQuiz({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'quiz/list', payload)
      .then((res) => {
        if (res.data.success) {
          const quizList = res.data.data.data.map((quiz) => ({
            name: quiz.quiz_name,
            id: quiz.sk,
            url: quiz.url
          }))
          commit('LIST_QUIZS', quizList)
          commit('QUIZ_PAGINATION_KEY', res.data.data.last_value)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createNewQuiz({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      quiz_name: false,
      quiz_name_msg: '',
      quiz_url: false,
      quiz_url_msg: '',
      quiz_ttl: false,
      quiz_ttl_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'quiz/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          dispatch('fetchQuiz', data)
          Notify.create({ message: 'Quiz has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('STATUS_OF_API', false)
          const errMsgs = {
            status: false,
            quiz_name: false,
            quiz_name_msg: '',
            quiz_url: false,
            quiz_url_msg: '',
            quiz_ttl: false,
            quiz_ttl_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: '',
            is_active: false,
            is_active_msg: ''
          }
          if (error.response.data.message.quiz_name) {
            if (typeof error.response.data.message.quiz_name === 'object') {
              errMsgs.quiz_name = true
              errMsgs.quiz_name_msg = error.response.data.message.quiz_name.toString()
            } else {
              errMsgs.quiz_name = true
              errMsgs.quiz_name_msg = error.response.data.message.quiz_name
            }
          }
          if (error.response.data.message.quiz_url) {
            if (typeof error.response.data.message.quiz_url === 'object') {
              errMsgs.quiz_url = true
              errMsgs.quiz_url_msg = error.response.data.message.quiz_url.toString()
            } else {
              errMsgs.quiz_url = true
              errMsgs.quiz_url_msg = error.response.data.message.quiz_url
            }
          }
          if (error.response.data.message.quiz_ttl) {
            if (typeof error.response.data.message.quiz_ttl === 'object') {
              errMsgs.quiz_ttl = true
              errMsgs.quiz_ttl_msg = error.response.data.message.quiz_ttl.toString()
            } else {
              errMsgs.quiz_ttl = true
              errMsgs.quiz_ttl_msg = error.response.data.message.quiz_ttl
            }
          }
          if (error.response.data.message.subject_id) {
            if (typeof error.response.data.message.subject_id === 'object') {
              errMsgs.subject_id = true
              errMsgs.subject_id_msg = error.response.data.message.subject_id.toString()
            } else {
              errMsgs.subject_id = true
              errMsgs.subject_id_msg = error.response.data.message.subject_id
            }
          }
          if (error.response.data.message.event_id) {
            if (typeof error.response.data.message.event_id === 'object') {
              errMsgs.event_id = true
              errMsgs.event_id_msg = error.response.data.message.event_id.toString()
            } else {
              errMsgs.event_id = true
              errMsgs.event_id_msg = error.response.data.message.event_id
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
  async updateQuiz({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: true,
      quiz_name: false,
      quiz_name_msg: '',
      quiz_url: false,
      quiz_url_msg: '',
      quiz_ttl: false,
      quiz_ttl_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    axios
      .post(config.baseURLApi + 'quiz/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          dispatch('fetchQuiz', data)
          Notify.create({ message: 'Quiz has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('STATUS_OF_API', false)
          const errMsgs = {
            status: false,
            quiz_name: false,
            quiz_name_msg: '',
            quiz_url: false,
            quiz_url_msg: '',
            quiz_ttl: false,
            quiz_ttl_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: '',
            is_active: false,
            is_active_msg: ''
          }
          if (error.response.data.message.quiz_name) {
            if (typeof error.response.data.message.quiz_name === 'object') {
              errMsgs.quiz_name = true
              errMsgs.quiz_name_msg = error.response.data.message.quiz_name.toString()
            } else {
              errMsgs.quiz_name = true
              errMsgs.quiz_name_msg = error.response.data.message.quiz_name
            }
          }
          if (error.response.data.message.quiz_url) {
            if (typeof error.response.data.message.quiz_url === 'object') {
              errMsgs.quiz_url = true
              errMsgs.quiz_url_msg = error.response.data.message.quiz_url.toString()
            } else {
              errMsgs.quiz_url = true
              errMsgs.quiz_url_msg = error.response.data.message.quiz_url
            }
          }
          if (error.response.data.message.quiz_ttl) {
            if (typeof error.response.data.message.quiz_ttl === 'object') {
              errMsgs.quiz_ttl = true
              errMsgs.quiz_ttl_msg = error.response.data.message.quiz_ttl.toString()
            } else {
              errMsgs.quiz_ttl = true
              errMsgs.quiz_ttl_msg = error.response.data.message.quiz_ttl
            }
          }
          if (error.response.data.message.subject_id) {
            if (typeof error.response.data.message.subject_id === 'object') {
              errMsgs.subject_id = true
              errMsgs.subject_id_msg = error.response.data.message.subject_id.toString()
            } else {
              errMsgs.subject_id = true
              errMsgs.subject_id_msg = error.response.data.message.subject_id
            }
          }
          if (error.response.data.message.event_id) {
            if (typeof error.response.data.message.event_id === 'object') {
              errMsgs.event_id = true
              errMsgs.event_id_msg = error.response.data.message.event_id.toString()
            } else {
              errMsgs.event_id = true
              errMsgs.event_id_msg = error.response.data.message.event_id
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
  async fetchQuizById({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'quiz/get', payload)
      .then((res) => {
        if (res.data.success) {
          const quizData = {
            ...res.data.data,
            quiz_url: urlSafeBase64Decode(res.data.data.quiz_url),
            is_active: res.data.data.is_active !== undefined ? res.data.data.is_active : 'N/A'
          }
          commit('FETCH_QUIZ', quizData)
        }
      })
      .catch((error) => {
        console.log(error)
        Notify.create({ message: 'error', color: 'red', position: 'top' })
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchListQuizs: (state) => (state.listQuizs.length > 0 ? [...new Set(state.listQuizs)] : []),
  isLoading: (state) => state.loading,
  singleQuizInfo: (state) => (Object.keys(state.quizInfo).length > 0 ? state.quizInfo : [])
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
