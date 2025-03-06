import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const subject = ref('')
  const subjectHeader = ref({})
  const subjectsList = ref([])
  const subjectsListOrder = ref([])
  const uiSearch = ref(false)
  const loading = ref(false)
  const contentOptions = ref([])
  const filteredDetailedSubjectInfo = ref([])
  const error_msgs = ref({
    status: true,
    description: false,
    description_msg: '',
    subject_name: false,
    subject_name_msg: '',
    is_active: false,
    is_active_msg: ''
  })

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_SUBJECTS(data) {
    const prev = subjectsList.value
    subjectsList.value = prev.concat(data)
  }
  function RESET_LIST_SUBJECTS(data) {
    subjectsList.value = data
  }
  function LIST_SUBJECTS_ORDER(data) {
    subjectsListOrder.value = data
  }
  function FETCH_SUBJECT(data) {
    subject.value = data
  }
  function CONTENTS_OPTION(data) {
    contentOptions.value = []
    contentOptions.value = data
  }
  function SUB_HEADER(data) {
    subjectHeader.value = {}
    subjectHeader.value = data
  }
  function FILTERED_DETAILED_SUBJECT_INFO(data) {
    filteredDetailedSubjectInfo.value = data
  }
  function FILTERED_DETAILED_SUBJECT_INFO_LAB(payload) {
    const originalList = filteredDetailedSubjectInfo.value
    const listFinal = filteredDetailedSubjectInfo.value.lab
    const updateObj = listFinal[payload.index]
    updateObj.is_active = payload.status
    listFinal[payload.index] = updateObj
    originalList.lab = listFinal
    filteredDetailedSubjectInfo.value = originalList
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
  function UI_SEARCH(data) {
    uiSearch.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
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
  function resetDataSubjectLab(payload) {
    FILTERED_DETAILED_SUBJECT_INFO_LAB(payload)
  }
  function uiSearchAction(data) {
    UI_SEARCH(data)
  }
  async function fetchSubjectsByEvent(payload) {
    LOADING(true)
    await api
      .post('subject-list/event', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const subjectsByEventData = []
          const subOptions = []
          res.data.data.forEach((subject) => {
            const subDict = {
              name: subject.subject_name,
              description: subject.description,
              id: subject.sk,
              event_id: subject.event_id
            }
            const d = { label: subject.subject_name, code: subject.sk }
            subOptions.push(d)
            subjectsByEventData.push(subDict)
          })
          const optDict = {
            options: subOptions
          }
          subjectsByEventData.push(optDict)
          SEARCH_FIRE(false)
          if (payload.reset) {
            RESET_LIST_SUBJECTS(subjectsByEventData)
          } else {
            LIST_SUBJECTS(subjectsByEventData)
          }
          if (res.data.data.last_value) {
            PAGINATION_KEY(res.data.data.last_value)
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
  async function searchSubject(payload) {
    if (!uiSearch.value) {
      LOADING(true)
      api
        .post('list/search', payload.pagination)
        .then((res) => {
          if (res.data.success) {
            const subjectsByEventData = []
            const subOptions = []
            res.data.data.data.forEach((subject) => {
              const subDict = {
                name: subject.subject_name,
                description: subject.description,
                id: subject.sk,
                event_id: subject.event_id
              }
              const d = { label: subject.subject_name, code: subject.sk }
              subOptions.push(d)
              subjectsByEventData.push(subDict)
            })
            const optDict = {
              options: subOptions
            }
            subjectsByEventData.push(optDict)

            SEARCH_FIRE(true)
            if (payload.reset) {
              RESET_LIST_SUBJECTS(subjectsByEventData)
            } else {
              LIST_SUBJECTS(subjectsByEventData)
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
    } else {
      const searchList = subjectsList.value.filter((data) => data.name.toLowerCase().indexOf(payload.pagination.query.toLowerCase()) > -1)
      RESET_LIST_SUBJECTS(searchList)
      PAGINATION_KEY({})
      SEARCH_FIRE(false)
    }
  }
  function fetchSubjectsByEventOrder(payload) {
    LOADING(true)
    api
      .post('subject-list/event', payload)
      .then((res) => {
        if (res.data.success) {
          const subOptions = res.data.data.map((subject) => ({ label: subject.subject_name, code: subject.sk }))
          LIST_SUBJECTS_ORDER(subOptions)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchFilteredDetailedSubjectInformation(payload) {
    LOADING(true)
    await api
      .post('subject/items', payload)
      .then((res) => {
        if (res.data.success) {
          FILTERED_DETAILED_SUBJECT_INFO(res.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createSubject(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      description: false,
      description_msg: '',
      subject_name: false,
      subject_name_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    await api
      .post('subject/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {
              event_id: payload.event_id
            },
            reset: true
          }
          fetchSubjectsByEvent(data)
          Notify.create({ message: 'Subject has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            description: false,
            description_msg: '',
            subject_name: false,
            subject_name_msg: ''
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
          if (error.response.data.message.subject_name) {
            if (typeof error.response.data.message.subject_name === 'object') {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name.toString()
            } else {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name
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
  function createSubjectOrder(payload) {
    LOADING(true)
    api
      .post('subject/order', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Subject has been successfully ordered', color: 'green', position: 'top' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchSubject(payload) {
    LOADING(true)
    await api
      .post('subject/get', payload)
      .then(async (res) => {
        const subject = {
          name: res.data.data.subject_name,
          id: res.data.data.sk,
          eventId: res.data.data.event_id,
          description: res.data.data.description,
          is_active: res.data.data.is_active
        }
        FETCH_SUBJECT(subject)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updateSubject(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      description: false,
      description_msg: '',
      subject_name: false,
      subject_name_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    await api
      .post('subject/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {
              event_id: payload.event_id
            },
            reset: true
          }
          fetchSubjectsByEvent(data)
          Notify.create({ message: 'Subject has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            description: false,
            description_msg: '',
            subject_name: false,
            subject_name_msg: ''
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
          if (error.response.data.message.subject_name) {
            if (typeof error.response.data.message.subject_name === 'object') {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name.toString()
            } else {
              errMsgs.subject_name = true
              errMsgs.subject_name_msg = error.response.data.message.subject_name
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
  function deleteSubject(payload) {
    LOADING(true)
    api
      .post('subject/delete', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            pagination: {
              event_id: payload.event_id
            },
            reset: true
          }
          fetchSubjectsByEvent(data)
          Notify.create({ message: 'Subject has been successfully deleted', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function deleteGeneric(payload) {
    LOADING(true)
    await api
      .post(payload.url, payload.data)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Deleted successfully', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function subjectContentsList(payload) {
    LOADING(true)
    await api
      .post('subject/get-contents', payload)
      .then((res) => {
        if (res.data.success) {
          const subjectsHeader = {}
          const subOptions = []
          res.data.data.forEach((subject) => {
            const sub = subject.sk.split('#')
            subjectsHeader.name = sub[2]
            subjectsHeader.id = sub[1]
            const d = { label: sub[4], code: subject.sk }
            subOptions.push(d)
          })
          CONTENTS_OPTION(subOptions)
          SUB_HEADER(subjectsHeader)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createSubjectContentsOrder(payload) {
    LOADING(true)
    await api
      .post('subject/order-contents', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Subject Contents has been successfully ordered', color: 'green', position: 'top' })
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: res.data.message })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }

  return {
    error_msgs,
    filteredDetailedSubjectInfo,
    contentOptions,
    loading,
    searchByName,
    subject,
    subjectHeader,
    subjectsList,
    subjectsListOrder,
    paginationKey,
    loadingStatus,
    errorMsgReset,
    searchByNameAction,
    resetDataSubjectLab,
    uiSearchAction,
    fetchSubjectsByEvent,
    searchSubject,
    fetchSubjectsByEventOrder,
    fetchFilteredDetailedSubjectInformation,
    createSubject,
    createSubjectOrder,
    fetchSubject,
    updateSubject,
    deleteSubject,
    deleteGeneric,
    subjectContentsList,
    createSubjectContentsOrder,
    LIST_SUBJECTS_ORDER,
    CONTENTS_OPTION
  }
})
