import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api, generateQuestionApi } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

const useLearningPathStore = defineStore('learningPathStore', () => {
  const error_msgs = ref({
    learning_path_name: false,
    learning_path_name_msg: '',
    description: false,
    description_msg: '',
    logo: false,
    logo_msg: '',
    price_id: false,
    price_id_msg: ''
  })
  const error_msgs_order = {
    status: false,
    order: false,
    order_msg: '',
    learning_path_id: false,
    learning_path_id_msg: ''
  }
  const learningPathEvents = ref([])
  const learningPathEventsDetailed = ref([])
  const learningPathInfo = ref({})
  const learningPathsEnrollmentCounts = ref({
    data: [],
    labels: []
  })
  const learningPathOptions = ref([])
  const listLearningPath = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)
  const descriptiveQuestion = ref([])

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_LEARNINGPATH(data) {
    const prev = listLearningPath.value
    listLearningPath.value = prev.concat(data)
  }
  function CREATE_LEARNINGPATH(data) {
    listLearningPath.value.unshift(data)
  }
  function UPDATE_LEARNINGPATH(data) {
    const index = listLearningPath.value.findIndex((lp) => lp.id === data.id)
    listLearningPath.value.splice(index, 1, data)
  }
  function DELETE_LEARNINGPATH(data) {
    const index = listLearningPath.value.findIndex((lp) => lp.id === data.learning_path_id)
    listLearningPath.value.splice(index, 1)
  }
  function ERROR_MSGS(data) {
    error_msgs.value = { ...error_msgs.value, ...data }
  }
  function ERROR_MSGS_ORDER(data) {
    error_msgs_order.value = { ...error_msgs_order.value, ...data }
  }
  function RESET_LIST_LEARNINGPATH(data) {
    listLearningPath.value = data
  }
  function FETCH_LEARNING_PATH(data) {
    learningPathInfo.value = {}
    learningPathInfo.value = data
  }
  function OPTION_LEARNING_PATH(data) {
    learningPathOptions.value = data
  }
  function LEARNING_PATHS_ENROLLMENT_COUNTS(data) {
    learningPathsEnrollmentCounts.value = data
  }
  function LEARNING_PATH_EVENTS(data) {
    learningPathEvents.value = data
  }
  function LEARNING_PATH_EVENTS_DETAILED(data) {
    learningPathEventsDetailed.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function SET_DESCRIPTIVE_QUESTION(data) {
    descriptiveQuestion.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function fetchLearningPaths(payload) {
    LOADING(true)
    await api
      .post('learning-path/list', payload.pagination)
      .then((res) => {
        const learningPathData = res.data.data.data.map((data) => ({
          ...data,
          id: data.sk,
          label: data.name || data.learning_path_name,
          value: data.sk
        }))
        SEARCH_FIRE(false)
        if (payload.reset) {
          RESET_LIST_LEARNINGPATH(learningPathData)
        } else {
          LIST_LEARNINGPATH(learningPathData)
        }
        PAGINATION_KEY(res.data.data.last_value || {})
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchIndividualLearningPathEvents(payload) {
    LOADING(true)
    await api
      .post('learning-path/events', payload)
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
        LEARNING_PATH_EVENTS(
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
      .finally(() => LOADING(false))
  }
  async function fetchIndividualLearningPathEventsDetailed(payload) {
    LOADING(true)
    await api
      .post('dashboard/get-courses-forlp', payload)
      .then((res) => LEARNING_PATH_EVENTS_DETAILED(res.data.data.data))
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchLpCoursesFilters(payload) {
    LOADING(true)
    await api
      .post('learning-path/events', payload)
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
        LEARNING_PATH_EVENTS(
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
      .finally(() => LOADING(false))
  }
  async function createEventsContentsOrder(payload) {
    LOADING(true)
    const errMsgs = {
      status: false,
      order: false,
      order_msg: '',
      learning_path_id: false,
      learning_path_id_msg: ''
    }
    ERROR_MSGS_ORDER(errMsgs)
    await api
      .post('learning-path/events/order', payload)
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
          ERROR_MSGS_ORDER(errMsgs)
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchLearningPath(payload) {
    LOADING(true)
    api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const learningPathData = res.data.data.data.map((data) => ({
            name: data.learning_path_name,
            id: data.sk,
            description: data.description
          }))
          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_LEARNINGPATH(learningPathData)
          } else {
            LIST_LEARNINGPATH(learningPathData)
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
      .finally(() => LOADING(false))
  }
  async function createLearningPath(payload) {
    LOADING(true)
    ERROR_MSGS({
      learning_path_name: false,
      learning_path_name_msg: '',
      description: false,
      description_msg: '',
      logo: false,
      logo_msg: '',
      price_id: false,
      price_id_msg: ''
    })
    STATUS_OF_API(true)
    await api
      .post('learning-path/create', payload)
      .then((res) => {
        if (res.data.success) {
          const learningPathData = {
            ...res.data.data,
            id: res.data.data.sk
          }
          CREATE_LEARNINGPATH(learningPathData)
          STATUS_OF_API(true)
          Notify.create({ message: 'Learning Path has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Something went wrong' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchLearningPath(payload) {
    LOADING(true)
    await api
      .post('learning-path/get', payload)
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
          FETCH_LEARNING_PATH(learningPathData)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchLearningPathsEnrollmentCounts() {
    api
      .get('dashboard/get-learning-path-counts')
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
          LEARNING_PATHS_ENROLLMENT_COUNTS({
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
  }
  async function updateLearningPath(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
      learning_path_name: false,
      learning_path_name_msg: '',
      description: false,
      description_msg: '',
      logo: false,
      logo_msg: '',
      price_id: false,
      price_id_msg: ''
    })
    await api
      .post('learning-path/update', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          const learningPathData = {
            ...res.data.data,
            id: res.data.data.sk
          }
          UPDATE_LEARNINGPATH(learningPathData)
          Notify.create({ message: 'Learning Path has been successfully updated', color: 'green', position: 'top' })
        } else {
          STATUS_OF_API(false)
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: 'Something went wrong' })
        }
      })
      .finally(() => LOADING(false))
  }
  function deleteLearningPath(payload) {
    LOADING(true)
    api
      .post('learning-path/delete', payload)
      .then((res) => {
        if (res.data.success) {
          DELETE_LEARNINGPATH(payload)
          Notify.create({ message: 'Learning Path has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchLearningPathOptions() {
    LOADING(true)
    await api
      .get('learning-path/list-options')
      .then((res) => {
        const learningPathOptions = res.data.data.data.map((data) => ({
          value: data.sk,
          label: data.learning_path_name
        }))
        OPTION_LEARNING_PATH(learningPathOptions)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function generatePathDetail() {
    LOADING(true)
    await generateQuestionApi
      .get('generate')
      .then((res) => {
        SET_DESCRIPTIVE_QUESTION(res.data.data)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  return {
    learningPathEventsDetailed,
    error_msgs,
    error_msgs_order,
    learningPathEvents,
    learningPathsEnrollmentCounts,
    statusOfApi,
    paginationKey,
    loading,
    listLearningPath,
    learningPathOptions,
    searchByName,
    searchFire,
    learningPathInfo,
    descriptiveQuestion,
    loadingStatus,
    errorMsgReset,
    searchByNameAction,
    fetchLearningPaths,
    fetchIndividualLearningPathEvents,
    fetchIndividualLearningPathEventsDetailed,
    fetchLpCoursesFilters,
    createEventsContentsOrder,
    searchLearningPath,
    createLearningPath,
    fetchLearningPath,
    fetchLearningPathsEnrollmentCounts,
    updateLearningPath,
    deleteLearningPath,
    fetchLearningPathOptions,
    generatePathDetail,
    LEARNING_PATH_EVENTS,
    SET_DESCRIPTIVE_QUESTION
  }
})
export { useLearningPathStore }
