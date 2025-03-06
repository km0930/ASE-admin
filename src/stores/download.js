import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useDownloadStore = defineStore('download', () => {
  const apiStatus = ref(false)
  const downloadInfo = ref([])
  const error_msgs = ref({
    download_name_msg: '',
    download_name: false,
    download_url_msg: '',
    download_url: false,
    event_id_msg: '',
    event_id: false,
    logo_name_msg: '',
    logo_name: false,
    status: true,
    subject_id_msg: '',
    subject_id: false
  })
  const listDownloads = ref([])
  const loading = ref(false)
  const paginationKey = ref('')
  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_DOWNLOADS(data) {
    listDownloads.value = data
  }
  function DOWNLOAD_PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function STATUS_OF_API(data) {
    apiStatus.value = data
  }
  function FETCH_DOWNLOAD(data) {
    downloadInfo.value = []
    downloadInfo.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgResetDownload(data) {
    ERROR_MSGS(data)
  }
  function fetchDownloads(payload) {
    LOADING(true)
    api
      .post('download/list', payload)
      .then((res) => {
        if (res.data.success) {
          const downloadList = res.data.data.data.map((download) => ({
            name: download.download_name,
            id: download.sk,
            url: download.url
          }))
          LIST_DOWNLOADS(downloadList)
          DOWNLOAD_PAGINATION_KEY(res.data.data.last_value)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createDownload(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      download_name: false,
      download_name_msg: '',
      download_url: false,
      download_url_msg: '',
      logo_name: false,
      logo_name_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: ''
    })
    await api
      .post('download/create', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          const data = {
            subject_id: payload.subject_id
          }
          fetchDownloads(data)
          Notify.create({ message: 'Download has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          STATUS_OF_API(false)
          const errMsgs = {
            status: false,
            download_name: false,
            download_name_msg: '',
            download_url: false,
            download_url_msg: '',
            logo_name: false,
            logo_name_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.download_name) {
            if (typeof error.response.data.message.download_name === 'object') {
              errMsgs.download_name = true
              errMsgs.download_name_msg = error.response.data.message.download_name.toString()
            } else {
              errMsgs.download_name = true
              errMsgs.download_name_msg = error.response.data.message.download_name
            }
          }
          if (error.response.data.message.download_url) {
            if (typeof error.response.data.message.download_url === 'object') {
              errMsgs.download_url = true
              errMsgs.download_url_msg = error.response.data.message.download_url.toString()
            } else {
              errMsgs.download_url = true
              errMsgs.download_url_msg = error.response.data.message.download_url
            }
          }
          if (error.response.data.message.logo_name) {
            if (typeof error.response.data.message.logo_name === 'object') {
              errMsgs.logo_name = true
              errMsgs.logo_name_msg = error.response.data.message.logo_name.toString()
            } else {
              errMsgs.logo_name = true
              errMsgs.logo_name_msg = error.response.data.message.logo_name
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
  function updateDownload(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      download_name: false,
      download_name_msg: '',
      download_url: false,
      download_url_msg: '',
      logo_name: false,
      logo_name_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: ''
    })
    api
      .post('download/update', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          const data = {
            subject_id: payload.subject_id
          }
          fetchDownloads(data)
          Notify.create({ message: 'Download data has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          STATUS_OF_API(false)
          const errMsgs = {
            status: true,
            download_name: false,
            download_name_msg: '',
            download_url: false,
            download_url_msg: '',
            logo_name: false,
            logo_name_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.download_name) {
            if (typeof error.response.data.message.download_name === 'object') {
              errMsgs.download_name = true
              errMsgs.download_name_msg = error.response.data.message.download_name.toString()
            } else {
              errMsgs.download_name = true
              errMsgs.download_name_msg = error.response.data.message.download_name
            }
          }
          if (error.response.data.message.download_url) {
            if (typeof error.response.data.message.download_url === 'object') {
              errMsgs.download_url = true
              errMsgs.download_url_msg = error.response.data.message.download_url.toString()
            } else {
              errMsgs.download_url = true
              errMsgs.download_url_msg = error.response.data.message.download_url
            }
          }
          if (error.response.data.message.logo_name) {
            if (typeof error.response.data.message.logo_name === 'object') {
              errMsgs.logo_name = true
              errMsgs.logo_name_msg = error.response.data.message.logo_name.toString()
            } else {
              errMsgs.logo_name = true
              errMsgs.logo_name_msg = error.response.data.message.logo_name
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
  async function fetchDownloadById(payload) {
    LOADING(true)
    await api
      .post('download/get', payload)
      .then((res) => {
        if (res.data.success) {
          const downloadData = {
            download_name: res.data.data.download_name,
            download_url: urlSafeBase64Decode(res.data.data.download_url),
            download_id: res.data.data.sk,
            is_active: res.data.data.is_active !== undefined ? res.data.data.is_active : 'N/A'
          }
          FETCH_DOWNLOAD(downloadData)
          LOADING(false)
        }
      })
      .catch((error) => {
        LOADING(false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  return {
    apiStatus,
    downloadInfo,
    error_msgs,
    listDownloads,
    loading,
    paginationKey,
    loadingStatus,
    errorMsgResetDownload,
    createDownload,
    updateDownload,
    fetchDownloadById
  }
})
