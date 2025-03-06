import { defineStore } from 'pinia'
import axiosPublic from 'axios'
import { Notify } from 'quasar'
import { api, injectApi, webSocketCheckApi } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { convertJsonToFormData, dateFormatReadable, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useCourseStore = defineStore('courseStore', () => {
  const attachedPlansToCourse = ref([])
  const courseInfo = ref([])
  const courseOptions = ref([])
  const instructionFolderOptions = ref([])
  const listCourses = ref([])
  const listEventCourses = ref([])
  const listNonEventCourses = ref([])
  const listUnPublishedCourses = ref([])
  const listUnPublishedEventCourses = ref([])
  const listNonIngestedCourses = ref([])
  const courseStatsInfo = ref({})
  const error_msgs = ref({
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
  })
  const error_msgs_plans = ref({
    status: false,
    status_msg: '',
    plan_ids: false,
    plan_ids_msg: '',
    event_id: false,
    event_id_msg: ''
  })
  const isGeneratingSkills = ref(false)
  const loading = ref(false)
  const paginationKey = ref({})
  const paginationKeyAllEventCourse = ref({})
  const paginationKeyNoneEventCourse = ref({})
  const paginationKeyNonIngestedCourse = ref({})
  const paginationKeyRating = ref({})
  const paginationKeyUnPublishedCourses = ref({})
  const paginationKeyUnPublishedEventCourses = ref({})
  const rating_feedback = ref([])
  const searchByName = ref('')
  const searchFire = ref(false)
  const showDesignData = ref({})
  const listMaps = ref([])
  const statusOfApi = ref(true)
  const statusOfS3 = ref(400)
  const verifyAllData = ref({
    lps: {},
    events: [],
    labs: {}
  })
  const ingestionStarted = ref(false)
  const injectStatus = ref('')
  const injectedJobId = ref([])
  const injectingJobId = ref([])
  const injectedJobName = ref([])
  const injectingJobName = ref([])

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function GENERATING_SKILLS(data) {
    isGeneratingSkills.value = data
  }
  function errorMsgReset(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function SHOW_DESIGN_DATA(data) {
    showDesignData.value = data
  }
  function LIST_COURSES(data) {
    const prev = listCourses.value
    listCourses.value = prev.concat(data)
  }
  function COURSE_STATS_INFO(data) {
    courseStatsInfo.value = data
  }
  function STATUS_S3(data) {
    statusOfS3.value = data
  }
  function ATTACHED_PLANS_TO_COURSE(data) {
    attachedPlansToCourse.value = data
  }
  function LIST_NON_EVENT_COURSES(data) {
    listNonEventCourses.value = listNonEventCourses.value.concat(data)
  }
  function LIST_NON_INGESTED_COURSES(data) {
    listNonIngestedCourses.value = data
  }
  function CREATE_NON_EVENT_COURSE(data) {
    listNonEventCourses.value.unshift(data)
  }
  function UPDATE_NON_EVENT_COURSE(data) {
    if (data.is_event) {
      const index = listEventCourses.value.findIndex((course) => course.sk === data.sk)
      listEventCourses.value.splice(index, 1, data)

      const otherListIndex = listNonEventCourses.value.findIndex((course) => course.sk === data.sk)
      if (otherListIndex !== -1) {
        listNonEventCourses.value.splice(otherListIndex, 1)
      }
    } else {
      const index = listNonEventCourses.value.findIndex((course) => course.sk === data.sk)
      listNonEventCourses.value.splice(index, 1, data)

      const otherListIndex = listEventCourses.value.findIndex((course) => course.sk === data.sk)
      if (otherListIndex !== -1) {
        listEventCourses.value.splice(otherListIndex, 1)
      }
    }
  }
  function DELETE_NON_EVENT_COURSE(data) {
    const index = listNonEventCourses.value.findIndex((course) => course.sk === data.sk)
    listNonEventCourses.value.splice(index, 1)
  }
  function LIST_UN_PUBLISHED_COURSES(data) {
    const prev = listUnPublishedCourses.value
    listUnPublishedCourses.value = prev.concat(data)
  }
  function LIST_UN_PUBLISHED_COURSES_RESET(data) {
    listUnPublishedCourses.value = data
  }
  function LIST_UN_PUBLISHED_EVENT_COURSES(data) {
    const prev = listUnPublishedEventCourses.value
    listUnPublishedEventCourses.value = prev.concat(data)
  }
  function LIST_UN_PUBLISHED_EVENT_COURSES_RESET(data) {
    listUnPublishedEventCourses.value = data
  }

  function RESET_LIST_NON_EVENT_COURSES(data) {
    listNonEventCourses.value = data
  }
  function LIST_EVENT_COURSES(data) {
    const prev = listEventCourses.value
    listEventCourses.value = prev.concat(data)
  }
  function RESET_LIST_EVENT_COURSES(data) {
    listEventCourses.value = data
  }
  function RESET_LIST_COURSES(data) {
    listCourses.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function PAGINATION_KEY_NONE_EVENT_COURSE(data) {
    paginationKeyNoneEventCourse.value = data
  }
  function PAGINATION_KEY_NON_INGESTED_COURSE(data) {
    paginationKeyNonIngestedCourse.value = data
  }
  function PAGINATION_KEY_UN_PUBLISHED_COURSES(data) {
    paginationKeyUnPublishedCourses.value = data
  }
  function PAGINATION_KEY_UN_PUBLISHED_EVENT_COURSES(data) {
    paginationKeyUnPublishedEventCourses.value = data
  }
  function PAGINATION_KEY_ALL_EVENT_COURSE(data) {
    paginationKeyAllEventCourse.value = data
  }
  function VERIFY_ALL_DATA(data) {
    verifyAllData.value = data
  }
  function INSTRUCTIONS_OPTIONS(data) {
    instructionFolderOptions.value = []
    instructionFolderOptions.value = data
  }
  function FETCH_COURSE(data) {
    courseInfo.value = []
    courseInfo.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function ERROR_MSGS_PLANS(data) {
    error_msgs_plans.value = Object.assign(error_msgs_plans.value, data)
  }
  function RATING_FEEDBACK(data) {
    const prev = rating_feedback.value
    rating_feedback.value = prev.concat(data)
  }
  function RESET_RATING_FEEDBACK(data) {
    rating_feedback.value = data
  }
  function PAGINATION_KEY_RATING(data) {
    paginationKeyRating.value = data
  }
  function SET_INGESTION_STARTED(data) {
    ingestionStarted.value = data
  }
  function SET_INJECTED_COURSE_NAME(data) {
    injectedJobName.value.push(data)
  }
  function SET_INJECTING_COURSE_NAME(data) {
    injectingJobName.value.push(data)
  }
  function REMOVE_INJECTING_COURSE_NAME(data) {
    injectingJobName.value.pop(data)
  }
  function SET_INJECT_STATE(data) {
    injectStatus.value = data
  }
  function SET_INJECTED_COURSE_ID(data) {
    injectedJobId.value.push(data)
  }
  function SET_INJECTING_COURSE_ID(data) {
    injectingJobId.value.push(data)
  }
  function REMOVE_INJECTING_COURSE_ID(data) {
    injectingJobId.value.pop(data)
  }

  async function fetchEventCourses() {
    LOADING(true)
    await api
      .get('event/option-lists')
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
        const prev = listEventCourses.value
        listEventCourses.value = prev.concat(data)
        LIST_EVENT_COURSES(listEventCourses.value)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => {
        LOADING(false)
      })
  }
  async function fetchDesigns() {
    LOADING(true)
    SHOW_DESIGN_DATA({})
    await api
      .get('design/get-path')
      .then((res) => {
        SHOW_DESIGN_DATA(res.data.data)
      })
      .catch((error) => {
        SHOW_DESIGN_DATA({})
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => {
        LOADING(false)
      })
  }
  async function fetchCourses(payload) {
    LOADING(true)
    await api
      .post('event/lists', payload.pagination)
      .then((res) => {
        const eventData = res.data.data.map((data) => ({
          ...data,
          avgMinutes: data.avg_minutes,
          id: data.sk,
          isActive: data.is_active,
          isEvent: data.is_event,
          name: data.event_name
        }))
        SEARCH_FIRE(false)
        if (payload.reset) {
          RESET_LIST_COURSES(eventData)
        } else {
          LIST_COURSES(eventData)
        }
        PAGINATION_KEY(res.data.data.last_value || {})
      })
      .catch((error) => {
        console.error(error)
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchCourses(payload) {
    LOADING(true)
    await api
      .post('list/search', payload.pagination)
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
          SEARCH_FIRE(true)

          if (payload.reset) {
            RESET_LIST_COURSES(eventData)
          } else {
            LIST_COURSES(eventData)
          }
          if (res.data.data.pagination) {
            PAGINATION_KEY(res.data.data.pagination)
          } else {
            PAGINATION_KEY({})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => {
        LOADING(false)
      })
  }
  async function fetchCopyCourse(payload) {
    LOADING(true)
    api
      .post('event/copy', payload)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function courseStatsData(payload) {
    LOADING(true)
    api
      .post('dashboard/get-course-stats', payload)
      .then((res) => {
        if (res.data.success) {
          COURSE_STATS_INFO(res.data.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function attachedPlansToCourses(payload) {
    LOADING(true)
    await api
      .post('dashboard/get-plans-for-course', payload)
      .then((res) => {
        if (res.data.success) {
          ATTACHED_PLANS_TO_COURSE(res.data.data.data.plans || [])
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function detachLpFromCourse(payload) {
    LOADING(true)
    api
      .post('event/detach-lp', payload)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function uploadCreateDesign(payload) {
    LOADING(true)
    return await api
      .post('design/add', payload)
      .then(async (res) => res.data)
      .catch((error) => console.error(error))
      .finally(() => LOADING(false))
  }
  async function S3UploadFile({ signedUrl, form }) {
    LOADING(true)
    STATUS_S3(400)
    await axiosPublic
      .post(signedUrl, convertJsonToFormData(form), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => STATUS_S3(res.status))
      .catch((error) => console.error(error))
      .finally(() => LOADING(false))
  }
  async function createCourse(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
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
    await api
      .post('event/create', payload)
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
          CREATE_NON_EVENT_COURSE(course)
          STATUS_OF_API(true)

          Notify.create({ message: 'Course has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          Notify.create({ message: JSON.stringify(error.response.data.message), color: 'red', position: 'top' })
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchInstructionDirectory() {
    LOADING(true)
    await api
      .get('instructions/list-options')
      .then((res) => {
        const instructionOptions = res.data.data.data.map((data) => ({ value: data, label: data }))
        instructionOptions.sort(function (a, b) {
          const nameA = a.label.toLowerCase(),
            nameB = b.label.toLowerCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
        INSTRUCTIONS_OPTIONS(instructionOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchRatingAndFeedback(payload) {
    LOADING(true)
    api
      .post('event/reviews', payload.pagination)
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
            RESET_RATING_FEEDBACK(ratingData)
          } else {
            RATING_FEEDBACK(ratingData)
          }
          PAGINATION_KEY_RATING(res.data.data.last_value || {})
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchCourse(payload) {
    LOADING(true)
    await api
      .post('event/get', payload)
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
          FETCH_COURSE(courseData)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updateCourse(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
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
    await api
      .post('event/update', payload)
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
          UPDATE_NON_EVENT_COURSE(course)
          STATUS_OF_API(true)

          Notify.create({ message: 'Course has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function deleteCourse(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    await api
      .post('event/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const course = {
            ...res.data.data
          }
          DELETE_NON_EVENT_COURSE(course)

          STATUS_OF_API(true)
          Notify.create({ message: 'Course has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(true)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function moveCourseToProdVerify(payload) {
    LOADING(true)
    await api
      .post('event/export/verify', payload)
      .then((res) => {
        VERIFY_ALL_DATA({
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
      .finally(() => LOADING(false))
  }
  async function moveCourseToProdSubmit(payload) {
    LOADING(true)
    await api
      .post('event/export', payload)
      .then((res) => {
        Notify.create({ message: 'Course has been successfully moved', color: 'green', position: 'top' })
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchEventCoursesOptions(payload) {
    LOADING(true)
    await api
      .post('course/list_active_eventcourses', payload.pagination)
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
          RESET_LIST_EVENT_COURSES(eventCourseOption)
        } else {
          LIST_EVENT_COURSES(eventCourseOption)
        }
        PAGINATION_KEY_ALL_EVENT_COURSE(res.data.data.last_value || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchNoneEventCoursesOptions(payload) {
    let nonIngestedOptions = []
    LOADING(true)
    await api
      .post('course/list_nonevent_courses', payload.pagination)
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
          .filter((data) => data.asegpt_ingestion_status !== 'Succeeded' && data.event_status === 'course')
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
        if (listNonIngestedCourses.value.length !== 0) {
          nonIngestedOptions = [...nonIngestedCourses, ...listNonIngestedCourses.value]
        } else {
          nonIngestedOptions = [...nonIngestedCourses]
        }
        eventCourseOption.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
        nonIngestedOptions.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
        if (payload.reset) {
          RESET_LIST_NON_EVENT_COURSES(eventCourseOption)
        } else {
          LIST_NON_INGESTED_COURSES(nonIngestedOptions)
          LIST_NON_EVENT_COURSES(eventCourseOption)
        }
        PAGINATION_KEY_NONE_EVENT_COURSE(res.data.last_value || {})
      })
      .catch((error) => {
        console.error(error)
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchIngestCoursesOptions(payload) {
    LOADING(true)
    await injectApi
      .post('asegpt/filter', payload.payload)
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
          RESET_LIST_INGESTED_COURSES(eventCourseOption)
        } else {
          LIST_NON_INGESTED_COURSES(eventCourseOption)
          PAGINATION_KEY_NON_INGESTED_COURSE(res.data.data.last_evaluated_key || {})
        }
      })
      .catch((error) => {
        console.error(error)
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchUnPublishedCoursesOptions(payload) {
    LOADING(true)
    await api
      .post('course/list_unpublished_noneventcourses', payload.pagination)
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
          LIST_UN_PUBLISHED_COURSES_RESET(eventCourseOption)
        } else {
          LIST_UN_PUBLISHED_COURSES(eventCourseOption)
        }

        PAGINATION_KEY_UN_PUBLISHED_COURSES(res.data.data.pagination || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchUnPublishedEventCoursesOptions(payload) {
    LOADING(true)
    api
      .post('course/list_unpublished_eventcourses', payload.pagination)
      .then((res) => {
        LOADING(false)
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
          LIST_UN_PUBLISHED_EVENT_COURSES_RESET(eventCourseOption)
        } else {
          LIST_UN_PUBLISHED_EVENT_COURSES(eventCourseOption)
        }
        PAGINATION_KEY_UN_PUBLISHED_EVENT_COURSES(res.data.data.pagination || {})
      })
      .catch((error) => {
        LOADING(false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  }
  async function addPlansToUnpublishedCourses(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS_PLANS({
      status: false,
      status_msg: '',
      plan_ids: false,
      plan_ids_msg: '',
      event_id: false,
      event_id_msg: ''
    })
    await api
      .post('event/publish', payload)
      .then((res) => {
        if (res.data.success) {
          ERROR_MSGS_PLANS({
            status: true,
            status_msg: '',
            plan_ids: false,
            plan_ids_msg: '',
            event_id: false,
            event_id_msg: ''
          })
          STATUS_OF_API(true)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS_PLANS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            ERROR_MSGS_PLANS({
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
      .finally(() => LOADING(false))
  }
  async function generateSkills(payload) {
    GENERATING_SKILLS(true)
    return await api
      .post('event/generate-skill', payload)
      .then((res) => {
        Notify.create({ message: 'Skills have been successfully generated', color: 'green', position: 'top' })
        return res.data.data
      })
      .catch(() => {
        Notify.create({ message: 'Please add skills manually', color: 'info', position: 'top' })
        Notify.create({ message: 'AI failed to generate skills', color: 'red', position: 'top' })
      })
      .finally(() => GENERATING_SKILLS(false))
  }
  async function injectStart(payload) {
    const data = {
      event_id: payload.event_id
    }
    await injectApi
      .post('asegpt/start-ingestion', data)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: payload.event_name + ' Course Ingestion Started.', color: 'green', position: 'top', timeout: 1000 })
          SET_INJECTING_COURSE_ID(payload.event_id)
          SET_INJECTING_COURSE_NAME(payload.event_name)
          SET_INGESTION_STARTED(true)
        }
      })
      .catch((error) => {
        STATUS_OF_API(true)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function checkStatus(payload) {
    const data = {
      event_id: payload.event_id
    }
    await webSocketCheckApi
      .post('asegpt/ingestion-status', data)
      .then((res) => {
        if (res.data.data) {
          SET_INGESTION_STARTED(false)
          SET_INJECT_STATE(res.data.data.status)
          REMOVE_INJECTING_COURSE_ID(res.data.data.sk) // pop injecting job id
          REMOVE_INJECTING_COURSE_NAME(payload.event_name)
          if (res.data.data.status === 'Succeeded') {
            SET_INJECTED_COURSE_ID(res.data.data.sk)
            SET_INJECTED_COURSE_NAME(payload.event_name)
            Notify.create({ message: 'Course injected successfully.', color: 'green', position: 'top' })
          } else {
            Notify.create({
              message: 'Course injection failed. Please try again later !',
              timeout: 1000,
              progress: true,
              color: 'red',
              position: 'top'
            })
          }
        } else {
          SET_INJECT_STATE('')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
  }
  async function fetchMaps(payload) {
    LOADING(false)
    const coursemapList = []
    let pageNumber = 1
    while (pageNumber > 0) {
      await api
        .post('coursemap/list', payload.pagination)
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
        })
        .finally(() => LOADING(false))
    }
    if (payload.reset) {
      listMaps.value = coursemapList
    } else {
      const prev = listMaps.value
      listMaps.value = prev.concat(coursemapList)
    }
  }
  return {
    listCourses,
    listEventCourses,
    courseOptions,
    verifyAllData,
    listNonIngestedCourses,
    paginationKey,
    courseStatsInfo,
    paginationKeyNoneEventCourse,
    paginationKeyNonIngestedCourse,
    paginationKeyAllEventCourse,
    searchByName,
    searchFire,
    listNonEventCourses,
    injectedJobName,
    injectingJobName,
    injectStatus,
    injectingJobId,
    ingestionStarted,
    injectedJobId,
    statusOfApi,
    error_msgs,
    error_msgs_plans,
    isGeneratingSkills,
    loading,
    rating_feedback,
    attachedPlansToCourse,
    showDesignData,
    statusOfS3,
    listUnPublishedCourses,
    paginationKeyUnPublishedCourses,
    listUnPublishedEventCourses,
    paginationKeyUnPublishedEventCourses,
    instructionFolderOptions,
    paginationKeyRating,
    courseInfo,
    SEARCH_BY_NAME,
    fetchUnPublishedCoursesOptions,
    fetchUnPublishedEventCoursesOptions,
    updateCourse,
    createCourse,
    detachLpFromCourse,
    fetchCourses,
    searchCourses,
    searchByNameAction,
    injectStart,
    SET_INGESTION_STARTED,
    fetchIngestCoursesOptions,
    fetchEventCoursesOptions,
    fetchNoneEventCoursesOptions,
    fetchMaps,
    addPlansToUnpublishedCourses,
    errorMsgReset,
    fetchEventCourses,
    fetchDesigns,
    fetchCopyCourse,
    generateSkills,
    checkStatus,
    courseStatsData,
    attachedPlansToCourses,
    uploadCreateDesign,
    S3UploadFile,
    fetchInstructionDirectory,
    fetchRatingAndFeedback,
    fetchCourse,
    deleteCourse,
    moveCourseToProdSubmit,
    moveCourseToProdVerify
  }
})
