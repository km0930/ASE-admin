import { copyToClipboard, Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import axiosUrlShortner from 'src/utils/urlShortner'

const state = {
  allInstructionsList: [],
  chitImageConfig: '',
  chitImageList: [],
  chitImageRegions: [],
  lab: '',
  labId: '',
  labList: [],
  loading: false,
  shortURL: '',
  subjectId: '',
  update_lab: {}
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  SELECTED_LAB(state, data) {
    state.update_lab = data
  },
  LIST_LABS(state, data) {
    state.labList = []
    state.labList = data
  },
  INSTRUCTION_OPTIONS(state, data) {
    state.allInstructionsList = []
    state.allInstructionsList = data
  },
  FETCH_CHIT_IMAGES(state, data) {
    state.chitImageList = []
    state.chitImageList = data
  },
  FETCH_CHIT_IMAGE_CONFIG(state, data) {
    state.chitImageConfig = ''
    state.chitImageConfig = data
  },
  FETCH_CHIT_IMAGE_REGION(state, data) {
    state.chitImageRegions = []
    state.chitImageRegions = data
  },
  LAB_ID(state, data) {
    state.labId = data
  },
  FETCH_LAB(state, data) {
    state.lab = data
  },
  SHORT_URL(state, data) {
    state.shortURL = ''
    state.shortURL = data
  },
  SUBJECT_ID(state, data) {
    state.subjectId = ''
    state.subjectId = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  updateSubjectID({ commit }, data) {
    commit('SUBJECT_ID', data)
  },
  updatingLab({ commit }, data) {
    commit('SELECTED_LAB', data)
    commit('LOADING', false)
  },
  fetchLabsBySubject({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'lab-list/subject', payload)
      .then((res) => {
        if (res.data.success) {
          const labsBySubjectData = []
          res.data.data.forEach((lab) => {
            const labSplitByname = lab.sk.split('#')
            labsBySubjectData.push({
              name: labSplitByname[4],
              id: labSplitByname[3],
              event_id: lab.pk,
              subject_id: labSplitByname[1],
              subject_name: labSplitByname[2]
            })
          })
          commit('LIST_LABS', labsBySubjectData)
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchInstructionsBySubject({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'subject/list-instructions', payload)
      .then((res) => {
        if (res.data.success) {
          const instructionsList = res.data.data.map((instruction) => ({
            value: instruction,
            label: instruction
          }))
          instructionsList.sort(function (a, b) {
            const nameA = a.label.toLowerCase(),
              nameB = b.label.toLowerCase()
            if (nameA < nameB) return -1
            if (nameA > nameB) return 1
            return 0
          })
          commit('INSTRUCTION_OPTIONS', instructionsList)
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchChitImages({ commit }, payload) {
    commit('LOADING', true)
    const data = {
      search: payload
    }
    commit('FETCH_CHIT_IMAGES', [])
    await axios
      .post(config.baseURLApi + 'lab/list-chit-images', data)
      .then((res) => {
        if (res.data.success) {
          const filteredData = []
          res.data.data.forEach((filterInfo) => {
            if (filterInfo.label && filterInfo.value) {
              filteredData.push({
                label: filterInfo.label,
                value: filterInfo.value
              })
            }
          })
          commit('FETCH_CHIT_IMAGES', filteredData)
        }
      })
      .catch((error) => {
        if (error.response.data.message === 'Server error! try again later') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        } else if (typeof error.response.data.message === 'string') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchChitImageConfig({ commit }, payload) {
    commit('LOADING', true)
    const data = {
      image_name: payload
    }
    await axios
      .post(config.baseURLApi + 'lab/get-chit-image', data)
      .then((res) => {
        if (res.data.success) {
          const regionsList = []
          res.data.data.forEach((image) => {
            commit('FETCH_CHIT_IMAGE_CONFIG', image.config)
            image.locations.forEach((region) => {
              regionsList.push({
                label: region,
                value: region
              })
            })
          })
          commit('FETCH_CHIT_IMAGE_REGION', regionsList)
        }
      })
      .finally(commit('LOADING', false))
  },
  createMetaData({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'lab/create-meta', payload)
      .then((res) => {
        if (res.data.success) {
          commit('LAB_ID', res.data.data.lab_id)
          commit('LOADING', false)
        }
        commit('LOADING', false)
      })
      .finally(() => commit('LOADING', false))
  },
  updateLabMetaInfo({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'lab/update-meta', payload)
      .then(async (res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab Meta Info has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createConfig({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/update-config', payload)
      .then((res) => this.$router.go(this.$router.path))
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          window.location.reload()
        }
      })
      .finally(() => commit('LOADING', false))
  },
  updateConfig({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'lab/update-config', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab Configuration has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createTag({ commit }, payload) {
    commit('LOADING', true)
    await axios.post(config.baseURLApi + 'lab/update-tags', payload).finally(() => commit('LOADING', false))
  },
  async createCloudConfig({ commit }, payload) {
    commit('LOADING', true)
    await axios.post(config.baseURLApi + 'lab/update-cloud-config', payload).finally(() => commit('LOADING', false))
  },
  async createAttachment({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/attach-subject', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab has been created successfully.', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          window.location.reload()
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async actionChangeLabStatus({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/attach/toggle', payload)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          window.location.reload()
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchLab({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/get', payload)
      .then((res) => {
        const labData = {
          id: res.data.data.sk,
          name: res.data.data.lab_name,
          approxTime: res.data.data.approx_time,
          labTtl: res.data.data.lab_ttl,
          labId: urlSafeBase64Encode(res.data.data.sk),
          regions: res.data.data.regions,
          description: res.data.data.description,
          eventId: res.data.data.event_id,
          configuration: res.data.data.configuration,
          imageId: res.data.data.image_id,
          docFile: res.data.data.documentation_filename,
          documentations: res.data.data.documentations || [],
          cloud_type: res.data.data.cloud_type,
          is_challenge_object: res.data.data.is_challenge_object || false,
          challenge_id: res.data.data.challenge_id,
          is_cloud: res.data.data.is_cloud,
          ou_id: res.data.data.ou_id,
          subjectId: res.data.data.subject_id
        }
        commit('FETCH_LAB', labData)
      })
      .finally(() => commit('LOADING', false))
  },
  shortenURL({ commit }, payload) {
    commit('LOADING', true)
    axiosUrlShortner
      .post('create-short', payload)
      .then((res) => {
        if (res.data.short_url) {
          commit('SHORT_URL', res.data.short_url)
          copyToClipboard(res.data.short_url)
            .then(() => {
              Notify.create({ message: 'Successfully Copied', color: 'green', position: 'top' })
            })
            .catch(() => {
              Notify.create({ message: 'Not able to copy', color: 'red', position: 'top' })
            })
        }
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  getChitImageConfig: (state) => state.chitImageConfig,
  getChitImagesList: (state) => (state.chitImageList.length > 0 ? state.chitImageList : []),
  getChitImagesRegions: (state) => (state.chitImageRegions.length > 0 ? state.chitImageRegions : []),
  getInstructionsList: (state) => (state.allInstructionsList.length > 0 ? state.allInstructionsList : []),
  getLabID: (state) => state.labId,
  isLoading: (state) => state.loading,
  labsBySubject: (state) => (state.labList.length > 0 ? [...new Set(state.labList)] : []),
  singleLabInfo: (state) => (Object.keys(state.lab).length > 0 ? state.lab : []),
  updateLab: (state) => state.update_lab
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
