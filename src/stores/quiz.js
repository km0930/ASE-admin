import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const error_msgs = ref({
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
  const listQuizs = ref([])
  const loading = ref(false)
  const paginationKey = ref('')
  const quizInfo = ref([])

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_QUIZS(data) {
    listQuizs.value = data
  }
  function QUIZ_PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function FETCH_QUIZ(data) {
    quizInfo.value = []
    quizInfo.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgResetQuiz(data) {
    ERROR_MSGS(data)
  }
  function fetchQuiz(payload) {
    LOADING(true)
    api
      .post('quiz/list', payload)
      .then((res) => {
        if (res.data.success) {
          const quizList = res.data.data.data.map((quiz) => ({
            name: quiz.quiz_name,
            id: quiz.sk,
            url: quiz.url
          }))
          LIST_QUIZS(quizList)
          QUIZ_PAGINATION_KEY(res.data.data.last_value)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createNewQuiz(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    await api
      .post('quiz/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          fetchQuiz(data)
          Notify.create({ message: 'Quiz has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // STATUS_OF_API(false)
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
  async function updateQuiz(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    api
      .post('quiz/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          fetchQuiz(data)
          Notify.create({ message: 'Quiz has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          STATUS_OF_API(false)
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
  async function fetchQuizById(payload) {
    LOADING(true)
    await api
      .post('quiz/get', payload)
      .then((res) => {
        if (res.data.success) {
          const quizData = {
            ...res.data.data,
            quiz_url: urlSafeBase64Decode(res.data.data.quiz_url),
            is_active: res.data.data.is_active !== undefined ? res.data.data.is_active : 'N/A'
          }
          FETCH_QUIZ(quizData)
        }
      })
      .catch((error) => {
        console.log(error)
        Notify.create({ message: 'error', color: 'red', position: 'top' })
      })
      .finally(() => LOADING(false))
  }
  return {
    error_msgs,
    listQuizs,
    loading,
    paginationKey,
    quizInfo,
    loadingStatus,
    errorMsgResetQuiz,
    fetchQuiz,
    createNewQuiz,
    updateQuiz,
    fetchQuizById
  }
})
