import axiosPublic from 'axios'
import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { convertJsonToFormData, dateFormatReadable, urlSafeBase64Encode } from 'src/utils/reuseFunctions'

const state = {
  attachedPlansToCourse: [],
  courseInfo: [],
  courseOptions: [],
  courseStatsInfo: {},
  error_msgs: {
    proficiency: false,
    proficiency_msg: '',
    description: false,
    description_msg: '',
    event_name: false,
    event_name_msg: '',
    event_status: false,
    event_status_msg: '',
    career: false,
    career_msg: '',
    logo: false,
    logo_msg: '',
    avg_minutes: false,
    avg_minutes_msg: '',
    documentation_path: false,
    documentation_path_msg: '',
    instructor_id: false,
    instructor_id_msg: '',
    roles: false,
    roles_msg: '',
    learning_path_id: false,
    learning_path_id_msg: '',
    badge_id: false,
    badge_id_msg: '',
    is_event: false,
    is_event_msg: '',
    is_active: false,
    is_active_msg: '',
    is_free: false,
    is_free_msg: '',
    delivery_id: false,
    delivery_id_msg: '',
    achievement_type: false,
    achievement_type_msg: '',
    issue_date: false,
    issue_date_msg: '',
    expiry_date: false,
    expiry_date_msg: ''
  },
  error_msgs_plans: {
    status: false,
    status_msg: '',
    plan_ids: false,
    plan_ids_msg: '',
    event_id: false,
    event_id_msg: ''
  },
  isGeneratingSkills: false,
  instructionFolderOptions: [],
  listCourses: [],
  listEventCourses: [],
  listNonEventCourses: [],
  listUnPublishedCourses: [],
  listUnPublishedEventCourses: [],
  listNonIngestedCourses: [],
  loading: false,
  paginationKey: {},
  paginationKeyAllEventCourse: {},
  paginationKeyNoneEventCourse: {},
  paginationKeyNonIngestedCourse: {},
  paginationKeyRating: {},
  paginationKeyUnPublishedCourses: {},
  paginationKeyUnPublishedEventCourses: {},
  rating_feedback: [],
  searchByName: '',
  searchFire: false,
  showDesignData: {},
  statusOfApi: true,
  statusOfS3: 400,
  verifyAllData: {
    lps: {},
    events: [],
    labs: {}
  },
  courseInjected: false,
  ingestionStarted: false,
  injectStatus: '',
  injectedJobId: [],
  injectingJobId: [],
  injectedJobName: [],
  injectingJobName: []
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  GENERATING_SKILLS(state, data) {
    state.isGeneratingSkills = data
  },
  SHOW_DESIGN_DATA(state, data) {
    state.showDesignData = data
  },
  LIST_COURSES(state, data) {
    const prev = state.listCourses
    state.listCourses = prev.concat(data)
  },
  COURSE_STATS_INFO(state, data) {
    state.courseStatsInfo = data
  },
  STATUS_S3(state, data) {
    state.statusOfS3 = data
  },
  ATTACHED_PLANS_TO_COURSE(state, data) {
    state.attachedPlansToCourse = data
  },
  LIST_NON_EVENT_COURSES(state, data) {
    const prev = state.listNonEventCourses
    state.listNonEventCourses = prev.concat(data)
  },
  LIST_NON_INGESTED_COURSES(state, data) {
    // const prev = state.listNonIngestedCourses
    // state.listNonIngestedCourses = prev.concat(data)
    state.listNonIngestedCourses = data
  },
  CREATE_NON_EVENT_COURSE(state, data) {
    state.listNonEventCourses.unshift(data)
  },
  UPDATE_NON_EVENT_COURSE(state, data) {
    if (data.is_event) {
      const index = state.listEventCourses.findIndex((course) => course.sk === data.sk)
      state.listEventCourses.splice(index, 1, data)

      const otherListIndex = state.listNonEventCourses.findIndex((course) => course.sk === data.sk)
      if (otherListIndex !== -1) {
        state.listNonEventCourses.splice(otherListIndex, 1)
      }
    } else {
      const index = state.listNonEventCourses.findIndex((course) => course.sk === data.sk)
      state.listNonEventCourses.splice(index, 1, data)

      const otherListIndex = state.listEventCourses.findIndex((course) => course.sk === data.sk)
      if (otherListIndex !== -1) {
        state.listEventCourses.splice(otherListIndex, 1)
      }
    }
  },
  DELETE_NON_EVENT_COURSE(state, data) {
    const index = state.listNonEventCourses.findIndex((course) => course.sk === data.sk)
    state.listNonEventCourses.splice(index, 1)
  },
  LIST_UN_PUBLISHED_COURSES(state, data) {
    const prev = state.listUnPublishedCourses
    state.listUnPublishedCourses = prev.concat(data)
  },
  LIST_UN_PUBLISHED_COURSES_RESET(state, data) {
    state.listUnPublishedCourses = data
  },
  LIST_UN_PUBLISHED_EVENT_COURSES(state, data) {
    const prev = state.listUnPublishedEventCourses
    state.listUnPublishedEventCourses = prev.concat(data)
  },
  LIST_UN_PUBLISHED_EVENT_COURSES_RESET(state, data) {
    state.listUnPublishedEventCourses = data
  },

  RESET_LIST_NON_EVENT_COURSES(state, data) {
    state.listNonEventCourses = data
  },
  LIST_EVENT_COURSES(state, data) {
    const prev = state.listEventCourses
    state.listEventCourses = prev.concat(data)
  },
  RESET_LIST_EVENT_COURSES(state, data) {
    state.listEventCourses = data
  },
  RESET_LIST_COURSES(state, data) {
    state.listCourses = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  PAGINATION_KEY_NONE_EVENT_COURSE(state, data) {
    state.paginationKeyNoneEventCourse = data
  },
  PAGINATION_KEY_NON_INGESTED_COURSE(state, data) {
    state.paginationKeyNonIngestedCourse = data
  },
  PAGINATION_KEY_UN_PUBLISHED_COURSES(state, data) {
    state.paginationKeyUnPublishedCourses = data
  },
  PAGINATION_KEY_UN_PUBLISHED_EVENT_COURSES(state, data) {
    state.paginationKeyUnPublishedEventCourses = data
  },
  PAGINATION_KEY_ALL_EVENT_COURSE(state, data) {
    state.paginationKeyAllEventCourse = data
  },
  VERIFY_ALL_DATA(state, data) {
    state.verifyAllData = data
  },
  INSTRUCTIONS_OPTIONS(state, data) {
    state.instructionFolderOptions = []
    state.instructionFolderOptions = data
  },
  FETCH_COURSE(state, data) {
    state.courseInfo = []
    state.courseInfo = data
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
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  ERROR_MSGS_PLANS(state, data) {
    state.error_msgs_plans = Object.assign(state.error_msgs_plans, data)
  },
  RATING_FEEDBACK(state, data) {
    const prev = state.rating_feedback
    state.rating_feedback = prev.concat(data)
  },
  RESET_RATING_FEEDBACK(state, data) {
    state.rating_feedback = data
  },
  PAGINATION_KEY_RATING(state, data) {
    state.paginationKeyRating = data
  },
  COURSE_INJECTION(state, data) {
    state.courseInjected = data
  },
  SET_INGESTION_STARTED(state, data) {
    state.ingestionStarted = data
  },
  SET_INJECTED_COURSE_NAME(state, data) {
    state.injectedJobName.push(data)
  },
  REMOVE_INJECTED_COURSE_NAME(state, data) {
    state.injectedJobName.pop(data)
  },
  SET_INJECTING_COURSE_NAME(state, data) {
    state.injectingJobName.push(data)
  },
  REMOVE_INJECTING_COURSE_NAME(state, data) {
    state.injectingJobName.pop(data)
  },
  SET_INJECT_STATE(state, data) {
    state.injectStatus = data
  },
  SET_INJECTED_COURSE_ID(state, data) {
    state.injectedJobId.push(data)
  },
  SET_INJECTING_COURSE_ID(state, data) {
    state.injectingJobId.push(data)
  },
  REMOVE_INJECTING_COURSE_ID(state, data) {
    state.injectingJobId.pop(data)
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  errorMsgResetPlans({ commit }, data) {
    commit('ERROR_MSGS_PLANS', data)
  },
  async fetchEventCourses({ state, commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'event/option-lists')
      .then((res) => {
        const eventData = []
        res.data.data.data.forEach((data) => {
          if (data.is_event === true) {
            eventData.push({
              name: data.event_name,
              id: data.sk,
              description: data.description,
              isActive: data.is_active,
              isEvent: data.is_event,
              avgMinutes: data.avg_minutes,
              logo: data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString()
            })
          }
        })
        const listEventCourses = eventData.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) === index
        })
        commit('LIST_EVENT_COURSES', listEventCourses)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchDesigns({ state, commit }) {
    commit('LOADING', true)
    commit('SHOW_DESIGN_DATA', {})
    await axios
      .get(config.baseURLApi + 'design/get-path')
      .then((res) => {
        commit('SHOW_DESIGN_DATA', res.data.data)
      })
      .catch((error) => {
        commit('SHOW_DESIGN_DATA', {})
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchCourses({ state, commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'event/lists', payload.pagination)
      .then((res) => {
        const eventData = res.data.data.map((data) => ({
          ...data,
          avgMinutes: data.avg_minutes,
          id: data.sk,
          isActive: data.is_active,
          isEvent: data.is_event,
          name: data.event_name
        }))
        commit('SEARCH_FIRE', false)
        if (payload.reset) {
          commit('RESET_LIST_COURSES', eventData)
        } else {
          commit('LIST_COURSES', eventData)
        }
        commit('PAGINATION_KEY', res.data.data.last_value || {})
      })
      .catch((error) => {
        console.error(error)
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchCourses({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const eventData = res.data.data.data.map((data) => ({
            ...data,
            avgMinutes: data.avg_minutes,
            id: data.sk,
            isActive: data.is_active,
            isEvent: data.is_event,
            name: data.event_name
          }))
          commit('SEARCH_FIRE', true)

          if (payload.reset) {
            commit('RESET_LIST_COURSES', eventData)
          } else {
            commit('LIST_COURSES', eventData)
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
  async fetchCopyCourse({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'event/copy', payload)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async courseStatsData({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'dashboard/get-course-stats', payload)
      .then((res) => {
        if (res.data.success) {
          commit('COURSE_STATS_INFO', res.data.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async attachedPlansToCourses({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'dashboard/get-plans-for-course', payload)
      .then((res) => {
        if (res.data.success) {
          commit('ATTACHED_PLANS_TO_COURSE', res.data.data.data.plans || [])
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async detachLpFromCourse({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'event/detach-lp', payload)
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
  async uploadCreateDesign({ commit }, payload) {
    commit('LOADING', true)
    return await axios
      .post(config.baseURLApi + 'design/add', payload)
      .then(async (res) => res.data)
      .catch((error) => console.error(error))
      .finally(() => commit('LOADING', false))
  },
  async S3UploadFile({ commit }, { signedUrl, form }) {
    commit('LOADING', true)
    commit('STATUS_S3', 400)
    await axiosPublic
      .post(signedUrl, convertJsonToFormData(form), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => commit('STATUS_S3', res.status))
      .catch((error) => console.error(error))
      .finally(() => commit('LOADING', false))
  },
  async createCourse({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      proficiency: false,
      proficiency_msg: '',
      description: false,
      description_msg: '',
      event_name: false,
      event_name_msg: '',
      event_status: false,
      event_status_msg: '',
      career: false,
      career_msg: '',
      logo: false,
      logo_msg: '',
      avg_minutes: false,
      avg_minutes_msg: '',
      documentation_path: false,
      documentation_path_msg: '',
      instructor_id: false,
      instructor_id_msg: '',
      roles: false,
      roles_msg: '',
      badge_id: false,
      badge_id_msg: '',
      is_event: false,
      is_event_msg: '',
      is_active: false,
      is_active_msg: '',
      is_free: false,
      is_free_msg: '',
      learning_path_id: false,
      learning_path_id_msg: '',
      delivery_id: false,
      delivery_id_msg: '',
      achievement_type: false,
      achievement_type_msg: '',
      issue_date: false,
      issue_date_msg: '',
      expiry_date: false,
      expiry_date_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'event/create', payload)
      .then((res) => {
        if (res.data.success) {
          const course = {
            ...res.data.data,
            avgMinutes: res.data.data.avg_minutes,
            id: res.data.data.sk,
            isActive: res.data.data.is_active,
            isEvent: res.data.data.is_event,
            label: res.data.data.event_name,
            logo: res.data.data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString(),
            name: res.data.data.event_name,
            value: res.data.data.sk
          }
          commit('CREATE_NON_EVENT_COURSE', course)
          commit('STATUS_OF_API', true)

          Notify.create({ message: 'Course has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            proficiency: false,
            proficiency_msg: '',
            description: false,
            description_msg: '',
            event_name: false,
            event_name_msg: '',
            event_status: false,
            event_status_msg: '',
            career: false,
            career_msg: '',
            logo: false,
            logo_msg: '',
            avg_minutes: false,
            avg_minutes_msg: '',
            documentation_path: false,
            documentation_path_msg: '',
            instructor_id: false,
            instructor_id_msg: '',
            roles: false,
            roles_msg: '',
            badge_id: false,
            badge_id_msg: '',
            is_event: false,
            is_event_msg: '',
            is_active: false,
            is_active_msg: '',
            is_free: false,
            is_free_msg: '',
            delivery_id: false,
            delivery_id_msg: '',
            achievement_type: false,
            achievement_type_msg: '',
            issue_date: false,
            issue_date_msg: '',
            expiry_date: false,
            expiry_date_msg: ''
          }
          if (error.response.data.message.proficiency) {
            if (typeof error.response.data.message.proficiency === 'object') {
              errMsgs.proficiency = true
              errMsgs.proficiency_msg = error.response.data.message.proficiency.toString()
            } else {
              errMsgs.proficiency = true
              errMsgs.proficiency_msg = error.response.data.message.proficiency
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
          if (error.response.data.message.event_name) {
            if (typeof error.response.data.message.event_name === 'object') {
              errMsgs.event_name = true
              errMsgs.event_name_msg = error.response.data.message.event_name.toString()
            } else {
              errMsgs.event_name = true
              errMsgs.event_name_msg = error.response.data.message.event_name
            }
          }
          if (error.response.data.message.event_status) {
            if (typeof error.response.data.message.event_status === 'object') {
              errMsgs.event_status = true
              errMsgs.event_status_msg = error.response.data.message.event_status.toString()
            } else {
              errMsgs.event_status = true
              errMsgs.event_status_msg = error.response.data.message.event_status
            }
          }
          if (error.response.data.message.career) {
            if (typeof error.response.data.message.career === 'object') {
              errMsgs.career = true
              errMsgs.career_msg = error.response.data.message.career.toString()
            } else {
              errMsgs.career = true
              errMsgs.career_msg = error.response.data.message.career
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
          if (error.response.data.message.avg_minutes) {
            if (typeof error.response.data.message.avg_minutes === 'object') {
              errMsgs.avg_minutes = true
              errMsgs.avg_minutes_msg = error.response.data.message.avg_minutes.toString()
            } else {
              errMsgs.avg_minutes = true
              errMsgs.avg_minutes_msg = error.response.data.message.avg_minutes
            }
          }
          if (error.response.data.message.documentation_path) {
            if (typeof error.response.data.message.documentation_path === 'object') {
              errMsgs.documentation_path = true
              errMsgs.documentation_path_msg = error.response.data.message.documentation_path.toString()
            } else {
              errMsgs.documentation_path = true
              errMsgs.documentation_path_msg = error.response.data.message.documentation_path
            }
          }
          if (error.response.data.message.instructor_id) {
            if (typeof error.response.data.message.instructor_id === 'object') {
              errMsgs.instructor_id = true
              errMsgs.instructor_id_msg = error.response.data.message.instructor_id.toString()
            } else {
              errMsgs.instructor_id = true
              errMsgs.instructor_id_msg = error.response.data.message.instructor_id
            }
          }
          if (error.response.data.message.roles) {
            if (typeof error.response.data.message.roles === 'object') {
              errMsgs.roles = true
              errMsgs.roles_msg = error.response.data.message.roles.toString()
            } else {
              errMsgs.roles = true
              errMsgs.roles_msg = error.response.data.message.roles
            }
          }
          if (error.response.data.message.badge_id) {
            if (typeof error.response.data.message.badge_id === 'object') {
              errMsgs.badge_id = true
              errMsgs.badge_id_msg = error.response.data.message.badge_id.toString()
            } else {
              errMsgs.badge_id = true
              errMsgs.badge_id_msg = error.response.data.message.badge_id
            }
          }
          if (error.response.data.message.is_event) {
            if (typeof error.response.data.message.is_event === 'object') {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event.toString()
            } else {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event
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
          if (error.response.data.message.is_free) {
            if (typeof error.response.data.message.is_free === 'object') {
              errMsgs.is_free = true
              errMsgs.is_free_msg = error.response.data.message.is_free.toString()
            } else {
              errMsgs.is_free = true
              errMsgs.is_free_msg = error.response.data.message.is_free
            }
          }
          if (error.response.data.message.delivery_id) {
            if (typeof error.response.data.message.delivery_id === 'object') {
              errMsgs.delivery_id = true
              errMsgs.delivery_id_msg = error.response.data.message.delivery_id.toString()
            } else {
              errMsgs.delivery_id = true
              errMsgs.delivery_id_msg = error.response.data.message.delivery_id
            }
          }
          if (error.response.data.message.achievement_type) {
            if (typeof error.response.data.message.achievement_type === 'object') {
              errMsgs.achievement_type = true
              errMsgs.achievement_type_msg = error.response.data.message.achievement_type.toString()
            } else {
              errMsgs.achievement_type = true
              errMsgs.achievement_type_msg = error.response.data.message.achievement_type
            }
          }
          if (error.response.data.message.issue_date) {
            if (typeof error.response.data.message.issue_date === 'object') {
              errMsgs.issue_date = true
              errMsgs.issue_date_msg = error.response.data.message.issue_date.toString()
            } else {
              errMsgs.issue_date = true
              errMsgs.issue_date_msg = error.response.data.message.issue_date
            }
          }
          if (error.response.data.message.expiry_date) {
            if (typeof error.response.data.message.expiry_date === 'object') {
              errMsgs.expiry_date = true
              errMsgs.expiry_date_msg = error.response.data.message.expiry_date.toString()
            } else {
              errMsgs.expiry_date = true
              errMsgs.expiry_date_msg = error.response.data.message.expiry_date
            }
          }
          commit('ERROR_MSGS', errMsgs)
          Notify.create({ message: JSON.stringify(error.response.data.message), color: 'red', position: 'top' })
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchInstructionDirectory({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'instructions/list-options')
      .then((res) => {
        const instructionOptions = res.data.data.data.map((data) => ({ value: data, label: data }))
        instructionOptions.sort(function (a, b) {
          const nameA = a.label.toLowerCase(),
            nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        commit('INSTRUCTIONS_OPTIONS', instructionOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchRatingAndFeedback({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'event/reviews', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const ratingData = res.data.data.items.map((ratingInfo) => ({
            Email: ratingInfo.sk,
            Rating: ratingInfo.rating,
            Progress: ratingInfo.progress + '%',
            'Created On': dateFormatReadable(ratingInfo.created_on),
            Description: ratingInfo.description
          }))
          if (payload.reset) {
            commit('RESET_RATING_FEEDBACK', ratingData)
          } else {
            commit('RATING_FEEDBACK', ratingData)
          }
          commit('PAGINATION_KEY_RATING', res.data.data.last_value || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchCourse({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'event/get', payload)
      .then((res) => {
        if (res.data.success) {
          const courseData = {
            ...res.data.data,
            name: res.data.data.event_name,
            id: res.data.data.sk,
            courseId: urlSafeBase64Encode(res.data.data.sk),
            avgMinutes: res.data.data.avg_minutes,
            freetier: res.data.data.is_free || false,
            isActive: res.data.data.is_active,
            isEvent: res.data.data.is_event,
            learningPaths: res.data.data.learning_paths,
            logo: res.data.data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString()
          }
          const instructorIds = []
          if (res.data.data.instructor_id) {
            res.data.data.instructor_id.forEach((ab) => {
              const instrData = ab.split('#')
              instructorIds.push({ value: instrData[0], label: instrData[1], img: instrData[2] })
            })
          }
          courseData.instructors = instructorIds
          const img = res.data.data.logo.split('/')
          courseData.logoName = img[img.length - 1]
          commit('FETCH_COURSE', courseData)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async updateCourse({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      proficiency: false,
      proficiency_msg: '',
      description: false,
      description_msg: '',
      event_name: false,
      event_name_msg: '',
      event_status: false,
      event_status_msg: '',
      career: false,
      career_msg: '',
      logo: false,
      logo_msg: '',
      avg_minutes: false,
      avg_minutes_msg: '',
      documentation_path: false,
      documentation_path_msg: '',
      instructor_id: false,
      instructor_id_msg: '',
      roles: false,
      roles_msg: '',
      badge_id: false,
      badge_id_msg: '',
      is_event: false,
      is_event_msg: '',
      is_active: false,
      is_active_msg: '',
      is_free: false,
      is_free_msg: '',
      delivery_id: false,
      delivery_id_msg: '',
      learning_path_id: false,
      learning_path_id_msg: '',
      achievement_type: false,
      achievement_type_msg: '',
      issue_date: false,
      issue_date_msg: '',
      expiry_date: false,
      expiry_date_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'event/update', payload)
      .then((res) => {
        if (res.data.success) {
          const course = {
            ...res.data.data,
            avgMinutes: res.data.data.avg_minutes,
            id: res.data.data.sk,
            isActive: res.data.data.is_active,
            isEvent: res.data.data.is_event,
            label: res.data.data.event_name,
            logo: res.data.data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString(),
            name: res.data.data.event_name,
            value: res.data.data.sk
          }
          commit('UPDATE_NON_EVENT_COURSE', course)
          commit('STATUS_OF_API', true)

          Notify.create({ message: 'Course has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            proficiency: false,
            proficiency_msg: '',
            description: false,
            description_msg: '',
            event_name: false,
            event_name_msg: '',
            event_status: false,
            event_status_msg: '',
            career: false,
            career_msg: '',
            logo: false,
            logo_msg: '',
            avg_minutes: false,
            avg_minutes_msg: '',
            documentation_path: false,
            documentation_path_msg: '',
            instructor_id: false,
            instructor_id_msg: '',
            roles: false,
            roles_msg: '',
            badge_id: false,
            badge_id_msg: '',
            is_event: false,
            is_event_msg: '',
            is_active: false,
            is_active_msg: '',
            is_free: false,
            is_free_msg: '',
            delivery_id: false,
            delivery_id_msg: '',
            achievement_type: false,
            achievement_type_msg: '',
            issue_date: false,
            issue_date_msg: '',
            expiry_date: false,
            expiry_date_msg: ''
          }
          if (error.response.data.message.proficiency) {
            if (typeof error.response.data.message.proficiency === 'object') {
              errMsgs.proficiency = true
              errMsgs.proficiency_msg = error.response.data.message.proficiency.toString()
            } else {
              errMsgs.proficiency = true
              errMsgs.proficiency_msg = error.response.data.message.proficiency
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
          if (error.response.data.message.event_status) {
            if (typeof error.response.data.message.event_status === 'object') {
              errMsgs.event_status = true
              errMsgs.event_status_msg = error.response.data.message.event_status.toString()
            } else {
              errMsgs.event_status = true
              errMsgs.event_status_msg = error.response.data.message.event_status
            }
          }
          if (error.response.data.message.career) {
            if (typeof error.response.data.message.career === 'object') {
              errMsgs.career = true
              errMsgs.career_msg = error.response.data.message.career.toString()
            } else {
              errMsgs.career = true
              errMsgs.career_msg = error.response.data.message.career
            }
          }
          if (error.response.data.message.event_name) {
            if (typeof error.response.data.message.event_name === 'object') {
              errMsgs.event_name = true
              errMsgs.event_name_msg = error.response.data.message.event_name.toString()
            } else {
              errMsgs.event_name = true
              errMsgs.event_name_msg = error.response.data.message.event_name
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
          if (error.response.data.message.avg_minutes) {
            if (typeof error.response.data.message.avg_minutes === 'object') {
              errMsgs.avg_minutes = true
              errMsgs.avg_minutes_msg = error.response.data.message.avg_minutes.toString()
            } else {
              errMsgs.avg_minutes = true
              errMsgs.avg_minutes_msg = error.response.data.message.avg_minutes
            }
          }
          if (error.response.data.message.documentation_path) {
            if (typeof error.response.data.message.documentation_path === 'object') {
              errMsgs.documentation_path = true
              errMsgs.documentation_path_msg = error.response.data.message.documentation_path.toString()
            } else {
              errMsgs.documentation_path = true
              errMsgs.documentation_path_msg = error.response.data.message.documentation_path
            }
          }
          if (error.response.data.message.instructor_id) {
            if (typeof error.response.data.message.instructor_id === 'object') {
              errMsgs.instructor_id = true
              errMsgs.instructor_id_msg = error.response.data.message.instructor_id.toString()
            } else {
              errMsgs.instructor_id = true
              errMsgs.instructor_id_msg = error.response.data.message.instructor_id
            }
          }
          if (error.response.data.message.roles) {
            if (typeof error.response.data.message.roles === 'object') {
              errMsgs.roles = true
              errMsgs.roles_msg = error.response.data.message.roles.toString()
            } else {
              errMsgs.roles = true
              errMsgs.roles_msg = error.response.data.message.roles
            }
          }
          if (error.response.data.message.badge_id) {
            if (typeof error.response.data.message.badge_id === 'object') {
              errMsgs.badge_id = true
              errMsgs.badge_id_msg = error.response.data.message.badge_id.toString()
            } else {
              errMsgs.badge_id = true
              errMsgs.badge_id_msg = error.response.data.message.badge_id
            }
          }
          if (error.response.data.message.is_event) {
            if (typeof error.response.data.message.is_event === 'object') {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event.toString()
            } else {
              errMsgs.is_event = true
              errMsgs.is_event_msg = error.response.data.message.is_event
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
          if (error.response.data.message.is_free) {
            if (typeof error.response.data.message.is_free === 'object') {
              errMsgs.is_free = true
              errMsgs.is_free_msg = error.response.data.message.is_free.toString()
            } else {
              errMsgs.is_free = true
              errMsgs.is_free_msg = error.response.data.message.is_free
            }
          }
          if (error.response.data.message.delivery_id) {
            if (typeof error.response.data.message.delivery_id === 'object') {
              errMsgs.delivery_id = true
              errMsgs.delivery_id_msg = error.response.data.message.delivery_id.toString()
            } else {
              errMsgs.delivery_id = true
              errMsgs.delivery_id_msg = error.response.data.message.delivery_id
            }
          }
          if (error.response.data.message.achievement_type) {
            if (typeof error.response.data.message.achievement_type === 'object') {
              errMsgs.achievement_type = true
              errMsgs.achievement_type_msg = error.response.data.message.achievement_type.toString()
            } else {
              errMsgs.achievement_type = true
              errMsgs.achievement_type_msg = error.response.data.message.achievement_type
            }
          }
          if (error.response.data.message.issue_date) {
            if (typeof error.response.data.message.issue_date === 'object') {
              errMsgs.issue_date = true
              errMsgs.issue_date_msg = error.response.data.message.issue_date.toString()
            } else {
              errMsgs.issue_date = true
              errMsgs.issue_date_msg = error.response.data.message.issue_date
            }
          }
          if (error.response.data.message.expiry_date) {
            if (typeof error.response.data.message.expiry_date === 'object') {
              errMsgs.expiry_date = true
              errMsgs.expiry_date_msg = error.response.data.message.expiry_date.toString()
            } else {
              errMsgs.expiry_date = true
              errMsgs.expiry_date_msg = error.response.data.message.expiry_date
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
  async deleteCourse({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    await axios
      .post(config.baseURLApi + 'event/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const course = {
            ...res.data.data
          }
          commit('DELETE_NON_EVENT_COURSE', course)

          commit('STATUS_OF_API', true)
          Notify.create({ message: 'Course has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', true)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async moveCourseToProdVerify({ state, commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'event/export/verify', payload)
      .then((res) => {
        commit('VERIFY_ALL_DATA', {
          labs: res.data.data.labs || {},
          lps: res.data.data.lps || {},
          events: res.data.data.events || []
        })
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async moveCourseToProdSubmit({ state, commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'event/export', payload)
      .then((res) => {
        Notify.create({ message: 'Course has been successfully moved', color: 'green', position: 'top' })
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchEventCoursesOptions({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'course/list_active_eventcourses', payload.pagination)
      .then((res) => {
        const eventCourseOption = res.data.data.map((data) => ({
          ...data,
          avgMinutes: data.avg_minutes,
          id: data.sk,
          is_event: data.is_event,
          isActive: data.is_active,
          isEvent: data.is_event,
          label: data.event_name,
          name: data.event_name,
          value: data.sk
        }))

        eventCourseOption.sort(function (a, b) {
          const nameA = a.label.toLowerCase(),
            nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        if (payload.reset) {
          commit('RESET_LIST_EVENT_COURSES', eventCourseOption)
        } else {
          commit('LIST_EVENT_COURSES', eventCourseOption)
        }
        commit('PAGINATION_KEY_ALL_EVENT_COURSE', res.data.data.last_value || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchNoneEventCoursesOptions({ commit, state }, payload) {
    let nonIngestedOptions = []
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'course/list_nonevent_courses', payload.pagination)
      .then((res) => {
        const eventCourseOption = res.data.data.map((data) => ({
          ...data,
          avgMinutes: data.avg_minutes,
          id: data.sk,
          isActive: data.is_active,
          isEvent: data.is_event,
          label: data.event_name,
          // logo: data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString(),
          name: data.event_name,
          value: data.sk
        }))
        const nonIngestedCourses = res.data.data
          .filter(data => data.asegpt_ingestion_status !== 'Succeeded' && data.event_status === 'course')
          .map((data) => ({
            ...data,
            avgMinutes: data.avg_minutes,
            id: data.sk,
            isActive: data.is_active,
            isEvent: data.is_event,
            label: data.event_name,
            // logo: data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString(),
            name: data.event_name,
            value: data.sk
          }))
        if (state.listNonIngestedCourses.length !== 0) {
          nonIngestedOptions = [...nonIngestedCourses, ...state.listNonIngestedCourses]
        } else {
          nonIngestedOptions = [...nonIngestedCourses]
        }
        eventCourseOption.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
        nonIngestedOptions.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
        if (payload.reset) {
          commit('RESET_LIST_NON_EVENT_COURSES', eventCourseOption)
        } else {
          commit('LIST_NON_INGESTED_COURSES', nonIngestedOptions)
          commit('LIST_NON_EVENT_COURSES', eventCourseOption)
        }
        commit('PAGINATION_KEY_NONE_EVENT_COURSE', res.data.last_value || {})
      })
      .catch((error) => {
        console.error(error)
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchIngestCoursesOptions({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.injectApi + 'asegpt/filter', payload.payload)
      .then((res) => {
        const eventCourseOption = res.data.data.courses.map((data) => ({
          ...data,
          avgMinutes: data.avg_minutes,
          id: data.sk,
          isActive: data.is_active,
          isEvent: data.is_event,
          label: data.event_name,
          name: data.event_name,
          value: data.sk,
          rating: data.rating
        }))
        eventCourseOption.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))

        if (payload.reset) {
          commit('RESET_LIST_INGESTED_COURSES', eventCourseOption)
        } else {
          commit('LIST_NON_INGESTED_COURSES', eventCourseOption)
          commit('PAGINATION_KEY_NON_INGESTED_COURSE', res.data.data.last_evaluated_key || {})
        }
      })
      .catch((error) => {
        console.error(error)
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchUnPublishedCoursesOptions({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'course/list_unpublished_noneventcourses', payload.pagination)
      .then((res) => {
        const eventCourseOption = res.data.data.data.map((data) => ({
          value: data.sk,
          label: data.event_name,
          is_event: data.is_event,
          name: data.event_name,
          id: data.sk,
          description: data.description,
          isActive: data.is_active,
          isEvent: data.is_event,
          avgMinutes: data.avg_minutes,
          logo: data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString()
        }))
        eventCourseOption.sort(function (a, b) {
          const nameA = a.label.toLowerCase(),
            nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        if (payload.reset) {
          commit('LIST_UN_PUBLISHED_COURSES_RESET', eventCourseOption)
        } else {
          commit('LIST_UN_PUBLISHED_COURSES', eventCourseOption)
        }

        commit('PAGINATION_KEY_UN_PUBLISHED_COURSES', res.data.data.pagination || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchUnPublishedEventCoursesOptions({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'course/list_unpublished_eventcourses', payload.pagination)
      .then((res) => {
        commit('LOADING', false)
        const eventCourseOption = []
        res.data.data.data.forEach((data) => {
          if (data.is_event === true) {
            eventCourseOption.push({
              value: data.sk,
              label: data.event_name,
              is_event: data.is_event,
              name: data.event_name,
              id: data.sk,
              description: data.description,
              isActive: data.is_active,
              isEvent: data.is_event,
              avgMinutes: data.avg_minutes,
              logo: data.logo + '?' + new Date(new Date().toUTCString()).toLocaleString()
            })
          }
        })
        eventCourseOption.sort(function (a, b) {
          const nameA = a.label.toLowerCase(),
            nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        if (payload.reset) {
          commit('LIST_UN_PUBLISHED_EVENT_COURSES_RESET', eventCourseOption)
        } else {
          commit('LIST_UN_PUBLISHED_EVENT_COURSES', eventCourseOption)
        }
        commit('PAGINATION_KEY_UN_PUBLISHED_EVENT_COURSES', res.data.data.pagination || {})
      })
      .catch((error) => {
        commit('LOADING', false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  },
  async addPlansToUnpublishedCourses({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS_PLANS', {
      status: false,
      status_msg: '',
      plan_ids: false,
      plan_ids_msg: '',
      event_id: false,
      event_id_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'event/publish', payload)
      .then((res) => {
        if (res.data.success) {
          commit('ERROR_MSGS_PLANS', {
            status: true,
            status_msg: '',
            plan_ids: false,
            plan_ids_msg: '',
            event_id: false,
            event_id_msg: ''
          })
          commit('STATUS_OF_API', true)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            status_msg: '',
            plan_ids: false,
            plan_ids_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.plan_ids) {
            if (typeof error.response.data.message.plan_ids === 'object') {
              errMsgs.plan_ids = true
              errMsgs.plan_ids_msg = error.response.data.message.plan_ids.toString()
            } else {
              errMsgs.plan_ids = true
              errMsgs.plan_ids_msg = error.response.data.message.plan_ids
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
          commit('ERROR_MSGS_PLANS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            commit('ERROR_MSGS_PLANS', {
              status: true,
              status_msg: '',
              plan_ids: false,
              plan_ids_msg: '',
              event_id: false,
              event_id_msg: ''
            })
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async generateSkills({ commit }, payload) {
    commit('GENERATING_SKILLS', true)
    return await axios
      .post(config.baseURLApi + 'event/generate-skill', payload)
      .then((res) => {
        Notify.create({ message: 'Skills have been successfully generated', color: 'green', position: 'top' })
        return res.data.data
      })
      .catch(() => {
        Notify.create({ message: 'Please add skills manually', color: 'info', position: 'top' })
        Notify.create({ message: 'AI failed to generate skills', color: 'red', position: 'top' })
      })
      .finally(() => commit('GENERATING_SKILLS', false))
  },
  async injectStart({ commit }, payload) {
    const data = {
      event_id: payload.event_id
    }
    console.log(payload)
    await axios
      .post(config.injectApi + 'asegpt/start-ingestion', data)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: payload.event_name + ' Course Ingestion Started.', color: 'green', position: 'top', timeout: 1000 })
          commit('SET_INJECTING_COURSE_ID', payload.event_id)
          commit('SET_INJECTING_COURSE_NAME', payload.event_name)
          commit('SET_INGESTION_STARTED', true)
        }
      })
      .catch((error) => {
        console.log('324')
        commit('STATUS_OF_API', true)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async checkStatus({ commit }, payload) {
    const data = {
      event_id: payload.event_id
    }
    await axios
      .post(config.webSocketCheckApi + 'asegpt/ingestion-status', data)
      .then((res) => {
        if (res.data.data) {
          commit('SET_INGESTION_STARTED', false)
          commit('SET_INJECT_STATE', res.data.data.status)
          commit('REMOVE_INJECTING_COURSE_ID', res.data.data.sk) // pop injecting job id
          commit('REMOVE_INJECTING_COURSE_NAME', payload.event_name)
          if (res.data.data.status === 'Succeeded') {
            commit('SET_INJECTED_COURSE_ID', res.data.data.sk)
            commit('SET_INJECTED_COURSE_NAME', payload.event_name)
            Notify.create({ message: 'Course injected successfully.', color: 'green', position: 'top' })
          } else {
            Notify.create({ message: 'Course injection failed. Please try again later !', timeout: 1000, progress: true, color: 'red', position: 'top' })
          }
        } else {
          console.log('123')
          commit('SET_INJECT_STATE', '')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  }
}

const getters = {
  coursePaginationKeyForward: (state) => state.paginationKey,
  coursesEventList: (state) => (state.listEventCourses.length > 0 ? [...new Set(state.listEventCourses)] : []),
  coursesList: (state) => (state.listCourses.length > 0 ? [...new Set(state.listCourses)] : []),
  coursesNoneEventList: (state) => (state.listNonEventCourses.length > 0 ? [...new Set(state.listNonEventCourses)] : []),
  coursesOption: (state) => (state.courseOptions.length > 0 ? [...new Set(state.courseOptions)] : []),
  coursesUnPublishedList: (state) => (state.listUnPublishedCourses.length > 0 ? [...new Set(state.listUnPublishedCourses)] : []),
  eventCoursesPaginationKeyForward: (state) => state.paginationKeyAllEventCourse,
  eventCoursesUnPublishedList: (state) =>
    state.listUnPublishedEventCourses.length > 0 ? [...new Set(state.listUnPublishedEventCourses)] : [],
  feedbackPaginationKeyForward: (state) => state.paginationKeyRating,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchErrorMsgsPlans: (state) => state.error_msgs_plans,
  fetchListRatingsFeedback: (state) => (state.rating_feedback.length > 0 ? [...new Set(state.rating_feedback)] : []),
  fetchStatusOfApi: (state) => state.statusOfApi,
  getAttachedPlansToCourse: (state) => state.attachedPlansToCourse,
  getCourseStatsInfo: (state) => state.courseStatsInfo,
  instructionFolderList: (state) => (state.instructionFolderOptions.length > 0 ? [...new Set(state.instructionFolderOptions)] : []),
  isGeneratingSkills: (state) => state.isGeneratingSkills,
  isLoading: (state) => state.loading,
  noneEventCoursesPaginationKeyForward: (state) => state.paginationKeyNoneEventCourse,
  nonIngestedCoursesPaginationKeyForward: (state) => state.paginationKeyNonIngestedCourse,
  ingestedCoursesPaginationKeyForward: (state) => state.paginationKeyIngestedCourse,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  showDesignDataGetter: (state) => state.showDesignData,
  singleCourseInfo: (state) => (Object.keys(state.courseInfo).length > 0 ? state.courseInfo : []),
  statusOfS3Getter: (state) => state.statusOfS3,
  unPublishedCoursesPaginationKeyForward: (state) => state.paginationKeyUnPublishedCourses,
  unPublishedEventCoursesPaginationKeyForward: (state) => state.paginationKeyUnPublishedEventCourses,
  verifyAllDataGetter: (state) => state.verifyAllData,
  courseInjectedState: (state) => state.courseInjected,
  ingestionStarted: (state) => state.ingestionStarted,
  ingestedCourseName: (state) => state.injectedJobName,
  ingestingCourseName: (state) => state.injectingJobName,
  injectStatus: (state) => state.injectStatus,
  ingestedCourseId: (state) => state.injectedJobId,
  ingestingCourseId: (state) => state.injectingJobId,
  nonIngestedCoursesList: (state) => (state.listNonIngestedCourses.length > 0 ? [...new Set(state.listNonIngestedCourses)] : [])
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
