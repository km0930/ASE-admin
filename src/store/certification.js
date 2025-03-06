import { Notify } from 'quasar'
import axios from 'src/utils/certification'
import { showLoader } from 'src/utils/loader'

const state = {
  descriptiveQuestions: [],
  chargesOptions: [],
  error_msgs: {
    name: '',
    charges: null,
    description: '',
    pass_percentage: '',
    duration: '',
    challenges: '',
    skills: null,
    persona: null,
    proficiency: ''
  },
  instructorInfo: {},
  instructorOptions: [],
  listCertification: [],
  loading: false,
  loadingProjects: false,
  paginationKey: {},
  projects: [],
  last_value: undefined,
  reports: [],
  searchByName: '',
  searchFire: false,
  statusOfApi: true,
  skillsOptions: [],
  top: [],
  topUsers: []
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LOADING_PROJECTS(state, data) {
    state.loadingProjects = data
  },
  RESET_DESCRIPTIVE_QUESTIONS(state, data) {
    state.descriptiveQuestions = data
  },
  LIST_DESCRIPTIVE_QUESTIONS(state, data) {
    state.descriptiveQuestions = state.descriptiveQuestions.concat(data)
  },
  ADD_DESCRIPTIVE_QUESTION(state, data) {
    state.descriptiveQuestions.push(data)
  },
  UPDATE_DESCRIPTIVE_QUESTION_LIST(state, data) {
    const index = state.descriptiveQuestions.findIndex((question) => question.sk === data.sk)
    state.descriptiveQuestions.splice(index, 1, data)
  },
  UPDATE_STATE_SCORES(state, data) {
    const reportIndex = state.reports.findIndex((report) => report.email === data.email)
    const questionIndex = state.reports[reportIndex].questions.findIndex((question) => question.id === data.question)
    state.reports[reportIndex].questions[questionIndex].ai_eval_result = data.result
  },
  DELETE_DESCRIPTIVE_QUESTION(state, data) {
    const index = state.descriptiveQuestions.findIndex((question) => question.sk === data.question)
    state.descriptiveQuestions.splice(index, 1)
  },
  LIST_CERTIFICATION(state, data) {
    state.listCertification = state.listCertification.concat(data)
  },
  RESET_LIST_CERTIFICATION(state, data) {
    state.listCertification = data
  },
  CREATE_CERTIFICATION(state, data) {
    state.listCertification.unshift(data)
  },
  UPDATE_CERTIFICATION(state, data) {
    const index = state.listCertification.findIndex((certification) => certification.sk === data.sk)
    state.listCertification.splice(index, 1, data)
  },
  DELETE_CERTIFICATION(state, data) {
    const index = state.listCertification.findIndex((certification) => certification.sk === data.sk)
    state.listCertification.splice(index, 1)
  },
  SKILLS_OPTIONS(state, data) {
    state.skillsOptions = data
  },
  CHARGES_OPTIONS(state, data) {
    state.chargesOptions = data
  },
  REPORTS(state, data) {
    state.reports = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  SET_LAST_VALUE(state, data) {
    state.last_value = data
  },
  FETCH_CERTIFICATION_INFO(state, data) {
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
  },
  TOP(state, data) {
    state.top = data
  },
  TOP_USERS(state, data) {
    state.topUsers = data
  },
  PROJECTS(state, data) {
    state.projects = data
  },
  PUSH_PROJECT(state, data) {
    state.projects.push(data)
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  isStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  async fetchCertifications({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          if (payload.reset) {
            commit('RESET_LIST_CERTIFICATION', res.data.data)
          } else {
            commit('LIST_CERTIFICATION', res.data.data)
          }
          commit('PAGINATION_KEY', res.data.data.last_value || {})
          commit('SEARCH_FIRE', false)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async searchCertification({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          commit('SEARCH_FIRE', true)
          if (payload.reset) {
            commit('RESET_LIST_CERTIFICATION', res.data.data)
          } else {
            commit('LIST_CERTIFICATION', res.data.data)
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
          Notify.create({
            message: error.response.data.message,
            color: 'red',
            position: 'top'
          })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async fetchSkills({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/skills', payload)
      .then((res) => {
        const skills = res.data.data.map((data) => ({ label: data, value: data }))
        commit('SKILLS_OPTIONS', skills)
      })
      .catch((error) => commit('IS_ERROR', error))
      .finally(() => commit('LOADING', false))
  },
  async fetchCharges({ commit }) {
    commit('LOADING', true)
    await axios
      .get('certifications/charges')
      .then((res) => {
        const charges = res.data.data.map((data) => ({ label: data.name, value: data.id }))
        commit('CHARGES_OPTIONS', charges)
      })
      .catch((error) => commit('IS_ERROR', error))
      .finally(() => commit('LOADING', false))
  },
  async createCertification({ commit, dispatch }, payload) {
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
      .post('certification/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('CREATE_CERTIFICATION', res.data.data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Certification has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          for (const errorInfo of error.response.data.errors) {
            if (errorInfo.attribute) {
              err_msgs[errorInfo.attribute] = true
              err_msgs[errorInfo.attribute + '_msg'] = errorInfo.value
            }
          }
          commit('ERROR_MSGS', err_msgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateCertification({ commit, dispatch }, payload) {
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
      .post('certification/update', payload)
      .then((res) => {
        if (res.data.success) {
          commit('UPDATE_CERTIFICATION', res.data.data)
          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Certification has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          for (const errorInfo of error.response.data.errors) {
            if (errorInfo.attribute) {
              err_msgs[errorInfo.attribute] = true
              err_msgs[errorInfo.attribute + '_msg'] = errorInfo.value
            }
          }
          commit('ERROR_MSGS', err_msgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async deleteCertification({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/remove', payload)
      .then((res) => {
        if (res.data.success) {
          commit('DELETE_CERTIFICATION', res.data.data)
          Notify.create({ message: 'Certification has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({
            message: error.response.data.message,
            color: 'red',
            position: 'top'
          })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async certificationReport({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/report', payload)
      .then((res) => {
        if (res.data.success) {
          commit('REPORTS', res.data.data)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async certificationTop({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/top', payload)
      .then((res) => {
        if (res.data.success) {
          commit('TOP', res.data.data)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async certificationTopUsers({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/top-users', payload)
      .then((res) => {
        if (res.data.success) {
          commit('TOP_USERS', res.data.data)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async createDescriptiveQuestion({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('dsq/create', payload)
      .then((res) => {
        commit('ADD_DESCRIPTIVE_QUESTION', res.data.data)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async listDescriptiveQuestion({ commit }, payload) {
    console.log(payload)
    commit('LOADING', true)
    await axios
      .post('dsq/list', payload)
      .then((res) => {
        if (payload.reset) {
          commit('RESET_DESCRIPTIVE_QUESTIONS', res.data.data)
        } else {
          commit('LIST_DESCRIPTIVE_QUESTIONS', res.data.data)
        }
        commit('SET_LAST_VALUE', res.data.last_value)
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async updateDescriptiveQuestion({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('dsq/update', payload)
      .then((res) => {
        commit('UPDATE_DESCRIPTIVE_QUESTION_LIST', res.data.data)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async deleteDescriptiveQuestion({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('dsq/remove', payload)
      .then((res) => {
        commit('DELETE_DESCRIPTIVE_QUESTION', payload)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async updateScores({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/update-score', payload)
      .then((res) => Notify.create({ message: res.data.message, color: 'green', position: 'top' }))
      .catch((error) => Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },
  async certificationIssue({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post('certification/issue', payload)
      .then((res) => {
        const report = state.reports.find((report) => report.email === payload.email)
        report.certified = true
        commit('REPORTS', state.reports)

        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' }))
      .finally(() => commit('LOADING', false))
  },

  async createProject({ commit }, payload) {
    try {
      commit('LOADING_PROJECTS', true)
      const res = await axios.post('project/create', payload)
      if (res.data?.success) {
        commit('PUSH_PROJECT', res.data?.data)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
      // Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    } finally {
      commit('LOADING_PROJECTS', false)
    }
  },

  async fetchAllProjects({ commit }, payload) {
    try {
      commit('LOADING_PROJECTS', true)
      const res = await axios.post('project/list', payload)
      if (res.data?.success) {
        commit('PROJECTS', res.data?.data)
      }
    } catch (error) {
      // Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    } finally {
      commit('LOADING_PROJECTS', false)
    }
  },

  async updateProject({ commit, state }, payload) {
    try {
      commit('LOADING_PROJECTS', true)
      const res = await axios.post('project/update', payload)
      if (res.data?.success) {
        const oldData = [...state.projects]
        const index = oldData?.findIndex((el) => el?.sk === payload.project)
        oldData[index] = res.data?.data

        commit('PROJECTS', oldData)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
      // Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    } finally {
      commit('LOADING_PROJECTS', false)
    }
  },

  async deleteProject({ commit }, payload) {
    try {
      commit('LOADING_PROJECTS', true)
      const res = await axios.post('project/remove', payload)
      if (res.data.success) {
        const oldData = state.projects?.filter((el) => el?.sk !== payload.project)
        commit('PROJECTS', oldData)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
    } finally {
      commit('LOADING_PROJECTS', false)
    }
  },
  async importProjects({ commit }, data) {
    try {
      const res = await axios.post('project/import', {
        projects: data ?? []
      })
      if (res.data.success) {
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
      console.log(error)
      Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    }
  },
  async importQuestions({ commit }, data) {
    try {
      const res = await axios.post('dsq/import', {
        questions: data ?? []
      })
      if (res.data.success) {
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
      console.log(error)
      Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    }
  }
}

const getters = {
  descriptiveQuestions: (state) => state.descriptiveQuestions,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchListCertifications: (state) => state.listCertification,
  fetchStatusOfApi: (state) => state.statusOfApi,
  fetchProjects: (state) => state.projects ?? [],
  instructorOption: (state) => (state.instructorOptions.length > 0 ? [...new Set(state.instructorOptions)] : []),
  instructorPaginationKeyForward: (state) => state.paginationKey,
  isLoading: (state) => state.loading,
  isLoadingProjects: (state) => state.loadingProjects,
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
