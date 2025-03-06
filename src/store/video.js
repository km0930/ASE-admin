import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

const state = {
  error_msgs: {
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
  },
  listVideo: [],
  loading: false,
  nextRecords: '',
  paginationKey: '',
  showMore: true,
  showMoreLoading: false,
  videmoFolderOptions: [],
  videmoVideoOptions: [],
  videoInfo: [],
  loadPage: 1,
  totalPage: 0
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  SHOW_MORE_LOADING(state, data) {
    state.showMoreLoading = data
  },
  OPTION_VIMEO_FOLDERS(state, data) {
    const prev = state.videmoFolderOptions
    state.videmoFolderOptions = [...prev, ...data]
  },
  CLEAR_VIMEO_FOLDERS(state) {
    state.videmoFolderOptions = []
  },
  OPTION_VIMEO_VIDEOS(state, data) {
    const prev = state.videmoVideoOptions
    state.videmoVideoOptions = prev.concat(data)
  },
  RESET_OPTION_VIMEO_VIDEOS(state, data) {
    state.videmoVideoOptions = data
  },

  VIDEO_PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  LIST_VIDEOS(state, data) {
    state.listVideo = []
    state.listVideo = data
  },
  SHOW_MORE(state, data) {
    state.showMore = data
  },
  NEXT_RECORDS(state, data) {
    state.nextRecords = data
  },
  FETCH_VIDEO(state, data) {
    state.videoInfo = []
    state.videoInfo = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  SET_PAGE(state, page) {
    state.loadPage = page
  },
  SET_TOTAL_PAGE(state, page) {
    state.totalPage = page
  }
}

const actions = {
  errorMsgResetVideo({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  fetchVideos({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'vid/list', payload)
      .then((res) => {
        if (res.data.success) {
          const videoList = res.data.data.data.map((video) => ({
            name: video.vid_name,
            id: video.sk,
            url: video.url
          }))
          commit('LIST_VIDEOS', videoList)
          commit('VIDEO_PAGINATION_KEY', res.data.data.last_value)
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
  createNewVideo({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
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
    axios
      .post(config.baseURLApi + 'vid/create', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          dispatch('fetchVideos', data)
          Notify.create({
            message: 'Video has been successfully created',
            color: 'green',
            position: 'top'
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('STATUS_OF_API', false)
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
          commit('ERROR_MSGS', errMsgs)
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
      .finally(() => commit('LOADING', false))
  },
  updateLearningPath({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'learning-path/update', payload)
      .then((res) => {
        if (res.data.success) {
          dispatch('fetchLearningPaths')
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
      .finally(() => commit('LOADING', false))
  },
  deleteLearningPath({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'learning-path/delete', payload)
      .then((res) => {
        if (res.data.success) {
          dispatch('fetchCourses')
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
      .finally(() => commit('LOADING', false))
  },
  fetchVimeoFolders({ commit, state }) {
    commit('LOADING', true)
    axios
      .get(config.baseURLApi + 'folders/list?page=' + state.loadPage) // loadPage increases everytime press load more option
      .then((res) => {
        commit('SET_TOTAL_PAGE', res.data.data.pagination.last)
        const vimeoFolders = res.data.data.folders.map((vfolder) => ({
          value: vfolder[1],
          label: vfolder[0]
        }))
        commit('OPTION_VIMEO_FOLDERS', vimeoFolders)
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
  fetchVideosByFolder({ commit, state }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'folders/videos/get?per_page=50', payload)
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
          commit('RESET_OPTION_VIMEO_VIDEOS', vimeoVideos)
          if (res.data.next) {
            const splittedData = config.baseURLApi + 'folders/videos/get' + '?' + res.data.next
            commit('NEXT_RECORDS', splittedData)
            commit('SHOW_MORE', true)
          } else {
            commit('SHOW_MORE', false)
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
  async fetchVideosByFolderPaginations({ commit, state }, payload) {
    commit('LOADING', true)
    let url = ''
    if (state.showMore && state.nextRecords) {
      url = state.nextRecords
    } else {
      url = config.baseURLApi + 'folders/videos/get?per_page=50'
    }
    commit('SHOW_MORE_LOADING', true)
    await axios
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
            commit('NEXT_RECORDS', splittedData)
            commit('SHOW_MORE', true)
          } else {
            commit('SHOW_MORE', false)
          }
          vimeoVideos.sort(function (a, b) {
            const nameA = a.label.toLowerCase(),
              nameB = b.label.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          commit('OPTION_VIMEO_VIDEOS', vimeoVideos)
          commit('SHOW_MORE_LOADING', false)
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
  updateVideo({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
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
    axios
      .post(config.baseURLApi + 'vid/update', payload)
      .then((res) => {
        if (res.data.success) {
          const data = {
            subject_id: payload.subject_id
          }
          dispatch('fetchVideos', data)
          Notify.create({
            message: 'Video data has been successfully updated',
            color: 'green',
            position: 'top'
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('STATUS_OF_API', false)
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
          commit('ERROR_MSGS', errMsgs)
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
      .finally(() => commit('LOADING', false))
  },
  async fetchVideoById({ commit }, payload) {
    const extractVideoId = (url) => {
      const regex = /(?:\/(?:videos?|event)\/|vimeo\.com\/)([0-9]+)/i
      const match = url.match(regex)
      return match ? match[1] : null
    }

    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'vid/get', payload)
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
          commit('FETCH_VIDEO', videoData)
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
  }
}

const getters = {
  fetchErrorMsgs: (state) => state.error_msgs,
  listVideos: (state) => (state.listVideo.length > 0 ? [...new Set(state.listVideo)] : []),
  listVimeoFolders: (state) => (state.videmoFolderOptions.length > 0 ? [...new Set(state.videmoFolderOptions)] : []),
  listVimeoVideos: (state) => (state.videmoVideoOptions.length > 0 ? [...new Set(state.videmoVideoOptions)] : []),
  showMoreGetter: (state) => state.showMore,
  showMoreLoadingGetter: (state) => state.showMoreLoading,
  singleVideoInfo: (state) => (Object.keys(state.videoInfo).length > 0 ? state.videoInfo : [])
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
