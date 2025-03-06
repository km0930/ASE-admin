import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import config from 'src/config'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useVideoStore = defineStore('video', () => {
  const error_msgs = ref({
    status: true,
    vid_name: false,
    vid_name_msg: '',
    vid_ttl: false,
    vid_ttl_msg: '',
    vid_url: false,
    vid_url_msg: '',
    subject_id: false,
    subject_id_msg: '',
    event_id: false,
    event_id_msg: '',
    is_active: false,
    is_active_msg: ''
  })
  const listVideo = ref([])
  const loading = ref(false)
  const nextRecords = ref('')
  const paginationKey = ref('')
  const showMore = ref(true)
  const showMoreLoading = ref(false)
  const videmoFolderOptions = ref([])
  const videmoVideoOptions = ref([])
  const videoInfo = ref([])
  const loadPage = ref(1)
  const totalPage = ref(0)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function SHOW_MORE_LOADING(data) {
    showMoreLoading.value = data
  }
  function OPTION_VIMEO_FOLDERS(data) {
    const prev = videmoFolderOptions.value
    videmoFolderOptions.value = [...prev, ...data]
  }
  function CLEAR_VIMEO_FOLDERS() {
    videmoFolderOptions.value = []
  }
  function OPTION_VIMEO_VIDEOS(data) {
    const prev = videmoVideoOptions.value
    videmoVideoOptions.value = prev.concat(data)
  }
  function RESET_OPTION_VIMEO_VIDEOS(data) {
    videmoVideoOptions.value = data
  }
  function VIDEO_PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function LIST_VIDEOS(data) {
    listVideo.value = []
    listVideo.value = data
  }
  function SHOW_MORE(data) {
    showMore.value = data
  }
  function NEXT_RECORDS(data) {
    nextRecords.value = data
  }
  function FETCH_VIDEO(data) {
    videoInfo.value = []
    videoInfo.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function SET_PAGE(page) {
    loadPage.value = page
  }
  function SET_TOTAL_PAGE(page) {
    totalPage.value = page
  }
  function errorMsgResetVideo(data) {
    ERROR_MSGS(data)
  }
  function fetchVideos(payload) {
    LOADING(true)
    api
      .post('vid/list', payload)
      .then((res) => {
        if (res.data.success) {
          const videoList = res.data.data.data.map((video) => ({
            name: video.vid_name,
            id: video.sk,
            url: video.url
          }))
          LIST_VIDEOS(videoList)
          VIDEO_PAGINATION_KEY(res.data.data.last_value)
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
      .finally(() => LOADING(false))
  }
  function createNewVideo(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      vid_name: false,
      vid_name_msg: '',
      vid_ttl: false,
      vid_ttl_msg: '',
      vid_url: false,
      vid_url_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    api
      .post('vid/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          fetchVideos(data)
          Notify.create({
            message: 'Video has been successfully created',
            color: 'green',
            position: 'top'
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // STATUS_OF_API(false)
          const errMsgs = {
            status: true,
            vid_name: false,
            vid_name_msg: '',
            vid_ttl: false,
            vid_ttl_msg: '',
            vid_url: false,
            vid_url_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.vid_name) {
            if (typeof error.response.data.message.vid_name === 'object') {
              errMsgs.vid_name = true
              errMsgs.vid_name_msg = error.response.data.message.vid_name.toString()
            } else {
              errMsgs.vid_name = true
              errMsgs.vid_name_msg = error.response.data.message.vid_name
            }
          }
          if (error.response.data.message.vid_ttl) {
            if (typeof error.response.data.message.vid_ttl === 'object') {
              errMsgs.vid_ttl = true
              errMsgs.vid_ttl_msg = error.response.data.message.vid_ttl.toString()
            } else {
              errMsgs.vid_ttl = true
              errMsgs.vid_ttl_msg = error.response.data.message.vid_ttl
            }
          }
          if (error.response.data.message.vid_url) {
            if (typeof error.response.data.message.vid_url === 'object') {
              errMsgs.vid_url = true
              errMsgs.vid_url_msg = error.response.data.message.vid_url.toString()
            } else {
              errMsgs.vid_url = true
              errMsgs.vid_url_msg = error.response.data.message.vid_url
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
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: error.response.data.message
            })
          }
        } else {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: error.response.data.message
          })
        }
      })
      .finally(() => LOADING(false))
  }
  function updateLearningPath(payload) {
    LOADING(true)
    api
      .post('learning-path/update', payload)
      .then((res) => {
        if (res.data.success) {
          // fetchLearningPaths()
          Notify.create({
            message: 'Learning Path has been successfully updated',
            color: 'green',
            position: 'top'
          })
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
      .finally(() => LOADING(false))
  }
  function deleteLearningPath(payload) {
    LOADING(true)
    api
      .post('learning-path/delete', payload)
      .then((res) => {
        if (res.data.success) {
          // fetchCourses()
          Notify.create({
            message: 'Learning Path has been successfully deleted',
            color: 'red',
            position: 'top'
          })
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
      .finally(() => LOADING(false))
  }
  function fetchVimeoFolders() {
    LOADING(true)
    api
      .get('folders/list?page=' + loadPage.value) // loadPage increases everytime press load more option
      .then((res) => {
        SET_TOTAL_PAGE(res.data.data.pagination.last)
        const vimeoFolders = res.data.data.folders.map((vfolder) => ({
          value: vfolder[1],
          label: vfolder[0]
        }))
        OPTION_VIMEO_FOLDERS(vimeoFolders)
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
      .finally(() => LOADING(false))
  }
  function fetchVideosByFolder(payload) {
    LOADING(true)
    api
      .post('folders/videos/get?per_page=50', payload)
      .then((res) => {
        if (res.data.success) {
          const vimeoVideos = res.data.data.map((vVideos) => ({
            value: vVideos[1],
            label: vVideos[0],
            ttl: vVideos[2]
          }))
          vimeoVideos.sort(function (a, b) {
            const nameA = a.label.toLowerCase(),
              nameB = b.label.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          RESET_OPTION_VIMEO_VIDEOS(vimeoVideos)
          if (res.data.next) {
            const splittedData = config.baseURLApi + 'folders/videos/get' + '?' + res.data.next
            NEXT_RECORDS(splittedData)
            SHOW_MORE(true)
          } else {
            SHOW_MORE(false)
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
      .finally(() => LOADING(false))
  }
  async function fetchVideosByFolderPaginations(payload) {
    LOADING(true)
    let url = ''
    if (showMore.value && nextRecords.value) {
      url = nextRecords.value
    } else {
      url = 'folders/videos/get?per_page=50'
    }
    SHOW_MORE_LOADING(true)
    await api
      .post(url, payload)
      .then((res) => {
        if (res.data.success) {
          const vimeoVideos = res.data.data.map((vVideos) => ({
            value: vVideos[1],
            label: vVideos[0],
            ttl: vVideos[2]
          }))
          if (res.data.next) {
            const splittedData = config.baseURLApi + 'folders/videos/get' + '?' + res.data.next
            NEXT_RECORDS(splittedData)
            SHOW_MORE(true)
          } else {
            SHOW_MORE(false)
          }
          vimeoVideos.sort(function (a, b) {
            const nameA = a.label.toLowerCase(),
              nameB = b.label.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          OPTION_VIMEO_VIDEOS(vimeoVideos)
          SHOW_MORE_LOADING(false)
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
      .finally(() => LOADING(false))
  }
  function updateVideo(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: true,
      vid_name: false,
      vid_name_msg: '',
      vid_ttl: false,
      vid_ttl_msg: '',
      vid_url: false,
      vid_url_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: ''
    })
    api
      .post('vid/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          fetchVideos(data)
          Notify.create({
            message: 'Video data has been successfully updated',
            color: 'green',
            position: 'top'
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // STATUS_OF_API(false)
          const errMsgs = {
            status: true,
            vid_name: false,
            vid_name_msg: '',
            vid_ttl: false,
            vid_ttl_msg: '',
            vid_url: false,
            vid_url_msg: '',
            subject_id: false,
            subject_id_msg: '',
            event_id: false,
            event_id_msg: ''
          }
          if (error.response.data.message.vid_name) {
            if (typeof error.response.data.message.vid_name === 'object') {
              errMsgs.vid_name = true
              errMsgs.vid_name_msg = error.response.data.message.vid_name.toString()
            } else {
              errMsgs.vid_name = true
              errMsgs.vid_name_msg = error.response.data.message.vid_name
            }
          }
          if (error.response.data.message.vid_ttl) {
            if (typeof error.response.data.message.vid_ttl === 'object') {
              errMsgs.vid_ttl = true
              errMsgs.vid_ttl_msg = error.response.data.message.vid_ttl.toString()
            } else {
              errMsgs.vid_ttl = true
              errMsgs.vid_ttl_msg = error.response.data.message.vid_ttl
            }
          }
          if (error.response.data.message.vid_url) {
            if (typeof error.response.data.message.vid_url === 'object') {
              errMsgs.vid_url = true
              errMsgs.vid_url_msg = error.response.data.message.vid_url.toString()
            } else {
              errMsgs.vid_url = true
              errMsgs.vid_url_msg = error.response.data.message.vid_url
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
            Notify.create({
              type: 'negative',
              position: 'top',
              progress: true,
              icon: 'warning',
              message: error.response.data.message
            })
          }
        } else {
          Notify.create({
            type: 'negative',
            position: 'top',
            progress: true,
            icon: 'warning',
            message: error.response.data.message
          })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchVideoById(payload) {
    const extractVideoId = (url) => {
      const regex = /(?:\/(?:videos?|event)\/|vimeo\.com\/)([0-9]+)/i
      const match = url.match(regex)
      return match ? match[1] : null
    }

    LOADING(true)
    await api
      .post('vid/get', payload)
      .then((res) => {
        if (res.data.success) {
          const videoData = {
            vid_name: res.data.data.vid_name,
            vid_url: urlSafeBase64Decode(res.data.data.vid_url),
            vid_ttl: res.data.data.vid_ttl,
            vid_id: res.data.data.sk,
            is_free: res.data.data.is_free || false,
            is_active: res.data.data.is_active !== undefined ? res.data.data.is_active : 'N/A',
            is_live: res.data.data.is_live || false
          }

          console.log('AAAA', videoData.vid_url)
          console.log('BBBBB', videoData.vid_ttl)

          const vidId = extractVideoId(urlSafeBase64Decode(res.data.data.vid_url))
          if (videoData.is_live) {
            videoData.vimeo_url = `https://vimeo.com/event/${vidId}/embed`
          } else {
            videoData.vimeo_url = `https://player.vimeo.com/video/${vidId}/?title=${true}&transparent=${0}&controls=${1}&background=${false}&byline=${true}&portrait=${true}`
          }
          FETCH_VIDEO(videoData)
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
      .finally(() => LOADING(false))
  }
  return {
    error_msgs,
    listVideo,
    loading,
    nextRecords,
    paginationKey,
    showMore,
    showMoreLoading,
    videmoFolderOptions,
    videmoVideoOptions,
    videoInfo,
    loadPage,
    totalPage,
    CLEAR_VIMEO_FOLDERS,
    SET_PAGE,
    SET_TOTAL_PAGE,
    errorMsgResetVideo,
    fetchVideos,
    createNewVideo,
    updateLearningPath,
    deleteLearningPath,
    fetchVimeoFolders,
    fetchVideosByFolder,
    fetchVideosByFolderPaginations,
    updateVideo,
    fetchVideoById
  }
})
