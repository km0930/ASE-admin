import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'

const state = {
  apiStatus: false,
  downloadInfo: [],
  error_msgs: {
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
  },
  listDownloads: [],
  loading: false,
  paginationKey: ''
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_DOWNLOADS(state, data) {
    state.listDownloads = data
  },
  DOWNLOAD_PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  STATUS_OF_API(state, data) {
    state.apiStatus = data
  },
  FETCH_DOWNLOAD(state, data) {
    state.downloadInfo = []
    state.downloadInfo = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgResetDownload({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  fetchDownloads({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'download/list', payload)
      .then((res) => {
        if (res.data.success) {
          const downloadList = res.data.data.data.map((download) => ({
            name: download.download_name,
            id: download.sk,
            url: download.url
          }))
          commit('LIST_DOWNLOADS', downloadList)
          commit('DOWNLOAD_PAGINATION_KEY', res.data.data.last_value)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createDownload({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
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
    await axios
      .post(config.baseURLApi + 'download/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          const data = {
            subject_id: payload.subject_id
          }
          dispatch('fetchDownloads', data)
          Notify.create({ message: 'Download has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('STATUS_OF_API', false)
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
  updateDownload({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
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
    axios
      .post(config.baseURLApi + 'download/update', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          const data = {
            subject_id: payload.subject_id
          }
          dispatch('fetchDownloads', data)
          Notify.create({ message: 'Download data has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          commit('STATUS_OF_API', false)
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
  async fetchDownloadById({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'download/get', payload)
      .then((res) => {
        if (res.data.success) {
          const downloadData = {
            download_name: res.data.data.download_name,
            download_url: urlSafeBase64Decode(res.data.data.download_url),
            download_id: res.data.data.sk,
            is_active: res.data.data.is_active !== undefined ? res.data.data.is_active : 'N/A'
          }
          commit('FETCH_DOWNLOAD', downloadData)
          commit('LOADING', false)
        }
      })
      .catch((error) => {
        commit('LOADING', false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchListDownloads: (state) => (state.listDownloads.length > 0 ? [...new Set(state.listDownloads)] : []),
  isLoading: (state) => state.loading,
  singleDownloadInfo: (state) => (Object.keys(state.downloadInfo).length > 0 ? state.downloadInfo : []),
  statusOfAPI: (state) => state.statusOfAPI
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
