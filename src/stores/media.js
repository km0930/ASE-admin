import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useMediaStore = defineStore('media', () => {
  const error_msgs = ref({
    embed_size_msg: '',
    embed_size: false,
    event_id_msg: '',
    event_id: false,
    is_active_msg: '',
    is_active: false,
    media_name_msg: '',
    media_name: false,
    media_ttl_msg: '',
    media_ttl: false,
    media_url_msg: '',
    media_url: false,
    status: true,
    subject_id_msg: '',
    subject_id: false
  })
  const listMedias = ref([])
  const loading = ref(false)
  const mediaInfo = ref([])
  const paginationKey = ref('')
  const statusOfApi = ref(true)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_MEDIAS(data) {
    listMedias.value = data
  }
  function MEDIA_PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function FETCH_MEDIA(data) {
    mediaInfo.value = []
    mediaInfo.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function errorMsgResetMedia(data) {
    ERROR_MSGS(data)
  }
  async function fetchMedia(payload) {
    LOADING(true)
    api
      .post('media/list', payload)
      .then((res) => {
        if (res.data.success) {
          const meidaList = res.data.data.data.map((media) => ({
            name: media.media_name,
            id: media.sk,
            url: media.url
          }))
          LIST_MEDIAS(meidaList)
          MEDIA_PAGINATION_KEY(res.data.data.last_value)
          LOADING(false)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createNewMedia(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      media_name: false,
      media_name_msg: '',
      media_url: false,
      media_url_msg: '',
      media_ttl: false,
      media_ttl_msg: '',
      embed_size: false,
      embed_size_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    await api
      .post('media/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          fetchMedia(data)
          Notify.create({ message: 'Media has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          STATUS_OF_API(false)
          const errMsgs = {
            status: false,
            media_name: false,
            media_name_msg: '',
            media_url: false,
            media_url_msg: '',
            media_ttl: false,
            media_ttl_msg: '',
            embed_size: false,
            embed_size_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.media_name) {
            if (typeof error.response.data.message.media_name === 'object') {
              errMsgs.media_name = true
              errMsgs.media_name_msg = error.response.data.message.media_name.toString()
            } else {
              errMsgs.media_name = true
              errMsgs.media_name_msg = error.response.data.message.media_name
            }
          }
          if (error.response.data.message.media_url) {
            if (typeof error.response.data.message.media_url === 'object') {
              errMsgs.media_url = true
              errMsgs.media_url_msg = error.response.data.message.media_url.toString()
            } else {
              errMsgs.media_url = true
              errMsgs.media_url_msg = error.response.data.message.media_url
            }
          }
          if (error.response.data.message.media_ttl) {
            if (typeof error.response.data.message.media_ttl === 'object') {
              errMsgs.media_ttl = true
              errMsgs.media_ttl_msg = error.response.data.message.media_ttl.toString()
            } else {
              errMsgs.media_ttl = true
              errMsgs.media_ttl_msg = error.response.data.message.media_ttl
            }
          }
          if (error.response.data.message.embed_size) {
            if (typeof error.response.data.message.embed_size === 'object') {
              errMsgs.embed_size = true
              errMsgs.embed_size_msg = error.response.data.message.embed_size.toString()
            } else {
              errMsgs.embed_size = true
              errMsgs.embed_size_msg = error.response.data.message.embed_size
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
  async function updateMedia(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      media_name: false,
      media_name_msg: '',
      media_url: false,
      media_url_msg: '',
      media_ttl: false,
      media_ttl_msg: '',
      embed_size: false,
      embed_size_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: ''
    })
    await api
      .post('media/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          fetchMedia(data)
          Notify.create({ message: 'Media has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          STATUS_OF_API(false)
          const errMsgs = {
            status: false,
            media_name: false,
            media_name_msg: '',
            media_url: false,
            media_url_msg: '',
            media_ttl: false,
            media_ttl_msg: '',
            embed_size: false,
            embed_size_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.media_name) {
            if (typeof error.response.data.message.media_name === 'object') {
              errMsgs.media_name = true
              errMsgs.media_name_msg = error.response.data.message.media_name.toString()
            } else {
              errMsgs.media_name = true
              errMsgs.media_name_msg = error.response.data.message.media_name
            }
          }
          if (error.response.data.message.media_url) {
            if (typeof error.response.data.message.media_url === 'object') {
              errMsgs.media_url = true
              errMsgs.media_url_msg = error.response.data.message.media_url.toString()
            } else {
              errMsgs.media_url = true
              errMsgs.media_url_msg = error.response.data.message.media_url
            }
          }
          if (error.response.data.message.media_ttl) {
            if (typeof error.response.data.message.media_ttl === 'object') {
              errMsgs.media_ttl = true
              errMsgs.media_ttl_msg = error.response.data.message.media_ttl.toString()
            } else {
              errMsgs.media_ttl = true
              errMsgs.media_ttl_msg = error.response.data.message.media_ttl
            }
          }
          if (error.response.data.message.embed_size) {
            if (typeof error.response.data.message.embed_size === 'object') {
              errMsgs.embed_size = true
              errMsgs.embed_size_msg = error.response.data.message.embed_size.toString()
            } else {
              errMsgs.embed_size = true
              errMsgs.embed_size_msg = error.response.data.message.embed_size
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
  async function fetchMediaById(payload) {
    LOADING(true)
    await api
      .post('media/get', payload)
      .then((res) => {
        if (res.data.success) {
          const mediaData = {
            media_name: res.data.data.media_name,
            media_url: urlSafeBase64Decode(res.data.data.media_url),
            media_ttl: res.data.data.media_ttl,
            embed_size: res.data.data.embed_size,
            media_id: res.data.data.sk,
            is_active: res.data.data.is_active !== undefined ? res.data.data.is_active : 'N/A'
          }
          FETCH_MEDIA(mediaData)
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
    listMedias,
    loading,
    mediaInfo,
    paginationKey,
    statusOfApi,
    errorMsgResetMedia,
    fetchMedia,
    createNewMedia,
    updateMedia,
    fetchMediaById
  }
})
