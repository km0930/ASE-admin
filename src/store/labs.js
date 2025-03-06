import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'

const state = {
  allInstructionsList: [],
  chitImageConfig: [],
  chitImageList: [],
  chitImageRegions: [],
  disableLabIds: [],
  error_msgs: {
    status: false,
    subject_id: false,
    subject_id_msg: '',
    event_id: false,
    event_id_msg: ''
  },
  labId: '',
  labInfo: {},
  labsOrChallengesTable: 'lab',
  listChallengeLabs: [],
  listLabs: [],
  listLabsOptions: [],
  listOuIdInfo: [],
  loading: false,
  loadMoreTypeLab: 'lab',
  paginationKey: {},
  paginationKeyChallenge: {},
  searchByName: '',
  searchFire: false,
  searchFireChallenge: false,
  showMore: false,
  showMoreChallenges: false,
  showMoreLoading: false,
  statusChitImages: false,
  statusOfApi: true
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  LIST_OU_ID_INFO(state, data) {
    state.listOuIdInfo = data
  },
  STATUS_CHIT_IMAGES(state, data) {
    state.statusChitImages = data
  },
  ERROR_MSGS(state, data) {
    state.error_msgs = Object.assign(state.error_msgs, data)
  },
  DISABLE_LAB_IDS(state, data) {
    state.disableLabIds = data
  },
  LOAD_MORE_TYPE_LAB(state, data) {
    state.loadMoreTypeLab = data
  },
  LIST_LABS(state, data) {
    const prev = state.listLabs
    state.listLabs = prev.concat(data)
  },
  CREATE_LAB(state, data) {
    if (data.is_challenge_object) {
      state.listChallengeLabs.unshift(data)
    } else {
      state.listLabs.unshift(data)
    }
  },
  UPDATE_LAB(state, data) {
    if (data.is_challenge_object) {
      const index = state.listChallengeLabs.findIndex((lab) => lab.sk === data.sk)
      state.listChallengeLabs.splice(index, 1, data)

      const otherListIndex = state.listLabs.findIndex((lab) => lab.sk === data.sk)
      if (otherListIndex !== -1) {
        state.listLabs.splice(otherListIndex, 1)
      }
    } else {
      const index = state.listLabs.findIndex((lab) => lab.sk === data.sk)
      state.listLabs.splice(index, 1, data)

      const otherListIndex = state.listChallengeLabs.findIndex((lab) => lab.sk === data.sk)
      if (otherListIndex !== -1) {
        state.listChallengeLabs.splice(otherListIndex, 1)
      }
    }
  },
  DELETE_LAB(state, data) {
    const challengeLab = state.listChallengeLabs.find((lab) => lab.id === data.lab_id)
    const lab = state.listLabs.find((lab) => lab.id === data.lab_id)

    if (challengeLab) {
      const index = state.listChallengeLabs.findIndex((lab) => lab.id === data.lab_id)
      state.listChallengeLabs.splice(index, 1)
    }
    if (lab) {
      const index = state.listLabs.findIndex((lab) => lab.id === data.lab_id)
      state.listLabs.splice(index, 1)
    }
  },
  LIST_LABS_OPTIONS(state, data) {
    const prev = state.listLabsOptions
    state.listLabsOptions = prev.concat(data)
  },
  SHOW_MORE(state, data) {
    state.showMore = data
  },
  SHOW_MORE_CHALLENGE(state, data) {
    state.showMoreChallenges = data
  },
  FETCH_CHIT_IMAGES(state, data) {
    state.chitImageList = []
    state.chitImageList = data
  },
  FETCH_CHIT_IMAGE_REGION(state, data) {
    state.chitImageRegions = []
    state.chitImageRegions = data
  },
  INSTRUCTION_OPTIONS(state, data) {
    state.allInstructionsList = []
    state.allInstructionsList = data
  },
  RESET_LIST_LABS(state, data) {
    state.listLabs = data
  },
  RESET_LIST_CHALLENGE_LABS(state, data) {
    state.listChallengeLabs = data
  },
  LIST_CHALLENGE_LABS(state, data) {
    const prev = state.listChallengeLabs
    state.listChallengeLabs = prev.concat(data)
  },
  RESET_LIST_LABS_OPTIONS(state, data) {
    state.listLabsOptions = data
  },
  STATUS_OF_API(state, data) {
    state.statusOfApi = data
  },
  PAGINATION_KEY(state, data) {
    state.paginationKey = data
  },
  PAGINATION_KEY_CHALLENGE(state, data) {
    state.paginationKeyChallenge = data
  },
  LAB_INFO(state, data) {
    state.labInfo = []
    state.labInfo = data
  },
  SEARCH_BY_NAME(state, data) {
    state.searchByName = data
  },
  SEARCH_FIRE(state, data) {
    state.searchFire = data
  },
  SEARCH_FIRE_CHALLENGE(state, data) {
    state.searchFireChallenge = data
  },
  FETCH_CHIT_IMAGE_CONFIG(state, data) {
    state.chitImageConfig = ''
    state.chitImageConfig = data
  },
  SHOW_MORE_LOADING(state, data) {
    state.showMoreLoading = data
  },
  LABS_OR_CHALLENGES_TABLE(state, data) {
    state.labsOrChallengesTable = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  errorMsgReset({ commit }, data) {
    commit('ERROR_MSGS', data)
  },
  resetToLab({ commit }, data) {
    commit('LOAD_MORE_TYPE_LAB', data)
  },
  resetLabsList({ commit }) {
    commit('RESET_LIST_LABS_OPTIONS', [])
  },
  fetchLabs({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE_LOADING', true)
    axios
      .post(config.baseURLApi + 'lab/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const labList = []
          const labListOptions = []
          res.data.data.data.forEach((labData) => {
            labList.push({
              ...labData,
              name: labData.lab_name,
              id: labData.sk
            })
            labListOptions.push({
              label: labData.lab_name,
              value: labData.sk
            })
          })
          commit('SEARCH_FIRE', false)
          if (payload.reset) {
            commit('RESET_LIST_LABS', labList)
            commit('RESET_LIST_LABS_OPTIONS', labListOptions)
          } else {
            commit('LIST_LABS', labList)
            commit('LIST_LABS_OPTIONS', labListOptions)
          }
          if (payload.pagination.pk === 'challenge') {
            commit('SHOW_MORE_CHALLENGE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY_CHALLENGE', res.data.data.pagination || {})
          } else {
            commit('SHOW_MORE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY', res.data.data.pagination || {})
          }
        }
        commit('SHOW_MORE_LOADING', false)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  fetchChallengeLabs({ commit }, payload) {
    commit('LOADING', true)
    const url = 'lab/list'
    axios
      .post(config.baseURLApi + url, payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const labList = res.data.data.data.map((labData) => ({
            ...labData,
            name: labData.lab_name,
            id: labData.sk
          }))
          commit('SEARCH_FIRE_CHALLENGE', false)
          if (payload.reset) {
            commit('RESET_LIST_CHALLENGE_LABS', labList)
          } else {
            commit('LIST_CHALLENGE_LABS', labList)
          }
          if ([payload.pagination.pk, payload.pagination.query, payload.pagination.type].includes('challenge')) {
            commit('SHOW_MORE_CHALLENGE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY_CHALLENGE', res.data.data.pagination || {})
          } else {
            commit('SHOW_MORE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY', res.data.data.pagination || {})
          }
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchSearchLabs({ commit }, payload) {
    commit('LOADING', true)
    commit('SHOW_MORE_LOADING', true)
    await axios
      .post(config.baseURLApi + 'list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          commit('LOAD_MORE_TYPE_LAB', 'search')
          const labList = []
          const labListOptions = []
          res.data.data.data.forEach((labData) => {
            labList.push({
              ...labData,
              name: labData.lab_name,
              sk: labData.sk,
              isChallenge: labData.is_challenge_object || false,
              challenge_id: labData.challenge_id,
              label: labData.lab_name,
              value: labData.sk
            })
            labListOptions.push({
              label: labData.lab_name,
              value: labData.sk
            })
          })
          commit('SEARCH_FIRE', false)
          if (payload.reset) {
            if (payload.pagination.pk === 'challenge') {
              commit('LIST_LABS_OPTIONS', labList)
              commit('RESET_LIST_CHALLENGE_LABS', labList)
            } else {
              commit('RESET_LIST_LABS', labList)
              commit('RESET_LIST_LABS_OPTIONS', labListOptions)
            }
          } else {
            commit('LIST_LABS', labList)
            commit('LIST_LABS_OPTIONS', labListOptions)
          }
          if (payload.pagination.pk === 'challenge') {
            commit('SHOW_MORE_CHALLENGE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY_CHALLENGE', res.data.data.pagination || {})
          } else {
            commit('SHOW_MORE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY', res.data.data.pagination || {})
          }
        }
        commit('SHOW_MORE_LOADING', false)
      })
      .catch((error) => {
        commit('SHOW_MORE_LOADING', false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message.toString(), color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchInstructionsBySubject({ commit }, payload) {
    commit('LOADING', true)
    await axios
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
  addOptionsDocs({ commit }, payload) {
    commit('INSTRUCTION_OPTIONS', payload)
  },
  async fetchChitImages({ commit }, payload) {
    commit('LOADING', true)
    commit('STATUS_CHIT_IMAGES', false)
    const data = {
      search: payload
    }
    commit('FETCH_CHIT_IMAGES', [])
    await axios
      .post(config.baseURLApi + 'lab/list-chit-images', data)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_CHIT_IMAGES', true)
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
        commit('STATUS_CHIT_IMAGES', false)
        if (error.response.data.message === 'Server error! try again later') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        } else if (typeof error.response.data.message === 'string') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async createLab({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('ERROR_MSGS', {
      status: false,
      lab_name: false,
      lab_name_msg: '',
      lab_ttl: false,
      lab_ttl_msg: '',
      regions: false,
      regions_msg: '',
      approx_time: false,
      approx_time_msg: '',
      image_id: false,
      image_id_msg: '',
      documentations: false,
      documentations_msg: '',
      configuration: false,
      configuration_msg: '',
      description: false,
      description_msg: '',
      is_cloud: false,
      is_cloud_msg: '',
      cloud_type: false,
      cloud_type_msg: '',
      lab_id: false,
      lab_id_msg: '',
      ou_id: false,
      ou_id_msg: ''
    })
    commit('STATUS_OF_API', false)
    await axios
      .post(config.baseURLApi + 'lab/create', payload)
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          commit('ERROR_MSGS', {
            status: true,
            lab_name: false,
            lab_name_msg: '',
            lab_ttl: false,
            lab_ttl_msg: '',
            regions: false,
            regions_msg: '',
            approx_time: false,
            approx_time_msg: '',
            image_id: false,
            image_id_msg: '',
            documentations: false,
            documentations_msg: '',
            configuration: false,
            configuration_msg: '',
            description: false,
            description_msg: '',
            is_cloud: false,
            is_cloud_msg: '',
            cloud_type: false,
            cloud_type_msg: '',
            lab_id: false,
            lab_id_msg: '',
            ou_id: false,
            ou_id_msg: ''
          })
          const lab = {
            ...res.data.data,
            name: res.data.data.lab_name,
            id: res.data.data.sk
          }
          commit('CREATE_LAB', lab)
          Notify.create({ message: 'Lab has been successfully created', type: 'positive', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            lab_name: false,
            lab_name_msg: '',
            lab_ttl: false,
            lab_ttl_msg: '',
            regions: false,
            regions_msg: '',
            approx_time: false,
            approx_time_msg: '',
            image_id: false,
            image_id_msg: '',
            documentations: false,
            documentations_msg: '',
            configuration: false,
            configuration_msg: '',
            description: false,
            description_msg: '',
            is_cloud: false,
            is_cloud_msg: '',
            cloud_type: false,
            cloud_type_msg: '',
            lab_id: false,
            lab_id_msg: '',
            ou_id: false,
            ou_id_msg: ''
          }
          if (error.response.data.message.lab_name) {
            if (typeof error.response.data.message.lab_name === 'object') {
              errMsgs.lab_name = true
              errMsgs.lab_name_msg = error.response.data.message.lab_name.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_name.toString()
              })
            } else {
              errMsgs.lab_name = true
              errMsgs.lab_name_msg = error.response.data.message.lab_name
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_name
              })
            }
          }
          if (error.response.data.message.lab_ttl) {
            if (typeof error.response.data.message.lab_ttl === 'object') {
              errMsgs.lab_ttl = true
              errMsgs.lab_ttl_msg = error.response.data.message.lab_ttl.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_ttl.toString()
              })
            } else {
              errMsgs.lab_ttl = true
              errMsgs.lab_ttl_msg = error.response.data.message.lab_ttl
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_ttl
              })
            }
          }
          if (error.response.data.message.regions) {
            if (typeof error.response.data.message.regions === 'object') {
              errMsgs.regions = true
              errMsgs.regions_msg = error.response.data.message.regions.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.regions.toString()
              })
            } else {
              errMsgs.regions = true
              errMsgs.regions_msg = error.response.data.message.regions
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.regions
              })
            }
          }
          if (error.response.data.message.approx_time) {
            if (typeof error.response.data.message.approx_time === 'object') {
              errMsgs.approx_time = true
              errMsgs.approx_time_msg = error.response.data.message.approx_time.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.approx_time.toString()
              })
            } else {
              errMsgs.approx_time = true
              errMsgs.approx_time_msg = error.response.data.message.approx_time
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.approx_time
              })
            }
          }
          if (error.response.data.message.image_id) {
            if (typeof error.response.data.message.image_id === 'object') {
              errMsgs.image_id = true
              errMsgs.image_id_msg = error.response.data.message.image_id.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.image_id.toString()
              })
            } else {
              errMsgs.image_id = true
              errMsgs.image_id_msg = error.response.data.message.image_id
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.image_id
              })
            }
          }
          if (error.response.data.message.documentations) {
            if (typeof error.response.data.message.documentations === 'object') {
              errMsgs.documentations = true
              errMsgs.documentations_msg = error.response.data.message.documentations.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.documentations.toString()
              })
            } else {
              errMsgs.documentations = true
              errMsgs.documentations_msg = error.response.data.message.documentations
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.documentations
              })
            }
          }
          if (error.response.data.message.configuration) {
            if (typeof error.response.data.message.configuration === 'object') {
              errMsgs.configuration = true
              errMsgs.configuration_msg = error.response.data.message.configuration.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.configuration.toString()
              })
            } else {
              errMsgs.configuration = true
              errMsgs.configuration_msg = error.response.data.message.configuration
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.configuration
              })
            }
          }
          if (error.response.data.message.description) {
            if (typeof error.response.data.message.description === 'object') {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.description.toString()
              })
            } else {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.description
              })
            }
          }
          if (error.response.data.message.is_cloud) {
            if (typeof error.response.data.message.is_cloud === 'object') {
              errMsgs.is_cloud = true
              errMsgs.is_cloud_msg = error.response.data.message.is_cloud.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.is_cloud.toString()
              })
            } else {
              errMsgs.is_cloud = true
              errMsgs.is_cloud_msg = error.response.data.message.is_cloud
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.is_cloud
              })
            }
          }
          if (error.response.data.message.cloud_type) {
            if (typeof error.response.data.message.cloud_type === 'object') {
              errMsgs.cloud_type = true
              errMsgs.cloud_type_msg = error.response.data.message.cloud_type.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.cloud_type.toString()
              })
            } else {
              errMsgs.cloud_type = true
              errMsgs.cloud_type_msg = error.response.data.message.cloud_type
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.cloud_type
              })
            }
          }
          if (error.response.data.message.lab_id) {
            if (typeof error.response.data.message.lab_id === 'object') {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_id.toString()
              })
            } else {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_id
              })
            }
          }
          if (error.response.data.message.ou_id) {
            if (typeof error.response.data.message.ou_id === 'object') {
              errMsgs.ou_id = true
              errMsgs.ou_id_msg = error.response.data.message.ou_id.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.ou_id.toString()
              })
            } else {
              errMsgs.ou_id = true
              errMsgs.ou_id_msg = error.response.data.message.ou_id
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.ou_id
              })
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
  async updateLab({ commit, dispatch }, payload) {
    commit('LOADING', true)
    commit('STATUS_OF_API', true)
    commit('ERROR_MSGS', {
      status: false,
      lab_name: false,
      lab_name_msg: '',
      lab_ttl: false,
      lab_ttl_msg: '',
      regions: false,
      regions_msg: '',
      approx_time: false,
      approx_time_msg: '',
      image_id: false,
      image_id_msg: '',
      documentations: false,
      documentations_msg: '',
      configuration: false,
      configuration_msg: '',
      description: false,
      description_msg: '',
      is_cloud: false,
      is_cloud_msg: '',
      cloud_type: false,
      cloud_type_msg: '',
      lab_id: false,
      lab_id_msg: '',
      ou_id: false,
      ou_id_msg: ''
    })
    await axios
      .post(config.baseURLApi + 'lab/update', payload, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          commit('STATUS_OF_API', true)
          const lab = {
            ...res.data.data,
            name: res.data.data.lab_name,
            id: res.data.data.sk
          }
          commit('UPDATE_LAB', lab)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
          commit('ERROR_MSGS', {
            status: true,
            lab_name: false,
            lab_name_msg: '',
            lab_ttl: false,
            lab_ttl_msg: '',
            regions: false,
            regions_msg: '',
            approx_time: false,
            approx_time_msg: '',
            image_id: false,
            image_id_msg: '',
            documentations: false,
            documentations_msg: '',
            configuration: false,
            configuration_msg: '',
            description: false,
            description_msg: '',
            is_cloud: false,
            is_cloud_msg: '',
            cloud_type: false,
            cloud_type_msg: '',
            lab_id: false,
            lab_id_msg: '',
            ou_id: false,
            ou_id_msg: ''
          })
        }
      })
      .catch((error) => {
        commit('STATUS_OF_API', false)
        if (error.response?.status === 400) {
          const errMsgs = {
            status: false,
            lab_name: false,
            lab_name_msg: '',
            lab_ttl: false,
            lab_ttl_msg: '',
            regions: false,
            regions_msg: '',
            approx_time: false,
            approx_time_msg: '',
            image_id: false,
            image_id_msg: '',
            documentations: false,
            documentations_msg: '',
            configuration: false,
            configuration_msg: '',
            description: false,
            description_msg: '',
            is_cloud: false,
            is_cloud_msg: '',
            cloud_type: false,
            cloud_type_msg: '',
            lab_id: false,
            lab_id_msg: '',
            ou_id: false,
            ou_id_msg: ''
          }
          if (error.response.data.message.lab_name) {
            if (typeof error.response.data.message.lab_name === 'object') {
              errMsgs.lab_name = true
              errMsgs.lab_name_msg = error.response.data.message.lab_name.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_name.toString()
              })
            } else {
              errMsgs.lab_name = true
              errMsgs.lab_name_msg = error.response.data.message.lab_name
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_name
              })
            }
          }
          if (error.response.data.message.lab_ttl) {
            if (typeof error.response.data.message.lab_ttl === 'object') {
              errMsgs.lab_ttl = true
              errMsgs.lab_ttl_msg = error.response.data.message.lab_ttl.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_ttl.toString()
              })
            } else {
              errMsgs.lab_ttl = true
              errMsgs.lab_ttl_msg = error.response.data.message.lab_ttl
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_ttl
              })
            }
          }
          if (error.response.data.message.regions) {
            if (typeof error.response.data.message.regions === 'object') {
              errMsgs.regions = true
              errMsgs.regions_msg = error.response.data.message.regions.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.regions.toString()
              })
            } else {
              errMsgs.regions = true
              errMsgs.regions_msg = error.response.data.message.regions
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.regions
              })
            }
          }
          if (error.response.data.message.approx_time) {
            if (typeof error.response.data.message.approx_time === 'object') {
              errMsgs.approx_time = true
              errMsgs.approx_time_msg = error.response.data.message.approx_time.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.approx_time.toString()
              })
            } else {
              errMsgs.approx_time = true
              errMsgs.approx_time_msg = error.response.data.message.approx_time
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.approx_time
              })
            }
          }
          if (error.response.data.message.image_id) {
            if (typeof error.response.data.message.image_id === 'object') {
              errMsgs.image_id = true
              errMsgs.image_id_msg = error.response.data.message.image_id.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.image_id.toString()
              })
            } else {
              errMsgs.image_id = true
              errMsgs.image_id_msg = error.response.data.message.image_id
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.image_id
              })
            }
          }
          if (error.response.data.message.documentations) {
            if (typeof error.response.data.message.documentations === 'object') {
              errMsgs.documentations = true
              errMsgs.documentations_msg = error.response.data.message.documentations.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.documentations.toString()
              })
            } else {
              errMsgs.documentations = true
              errMsgs.documentations_msg = error.response.data.message.documentations
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.documentations
              })
            }
          }
          if (error.response.data.message.configuration) {
            if (typeof error.response.data.message.configuration === 'object') {
              errMsgs.configuration = true
              errMsgs.configuration_msg = error.response.data.message.configuration.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.configuration.toString()
              })
            } else {
              errMsgs.configuration = true
              errMsgs.configuration_msg = error.response.data.message.configuration
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.configuration
              })
            }
          }
          if (error.response.data.message.description) {
            if (typeof error.response.data.message.description === 'object') {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.description.toString()
              })
            } else {
              errMsgs.description = true
              errMsgs.description_msg = error.response.data.message.description
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.description
              })
            }
          }
          if (error.response.data.message.is_cloud) {
            if (typeof error.response.data.message.is_cloud === 'object') {
              errMsgs.is_cloud = true
              errMsgs.is_cloud_msg = error.response.data.message.is_cloud.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.is_cloud.toString()
              })
            } else {
              errMsgs.is_cloud = true
              errMsgs.is_cloud_msg = error.response.data.message.is_cloud
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.is_cloud
              })
            }
          }
          if (error.response.data.message.cloud_type) {
            if (typeof error.response.data.message.cloud_type === 'object') {
              errMsgs.cloud_type = true
              errMsgs.cloud_type_msg = error.response.data.message.cloud_type.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.cloud_type.toString()
              })
            } else {
              errMsgs.cloud_type = true
              errMsgs.cloud_type_msg = error.response.data.message.cloud_type
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.cloud_type
              })
            }
          }
          if (error.response.data.message.lab_id) {
            if (typeof error.response.data.message.lab_id === 'object') {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_id.toString()
              })
            } else {
              errMsgs.lab_id = true
              errMsgs.lab_id_msg = error.response.data.message.lab_id
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.lab_id
              })
            }
          }
          if (error.response.data.message.ou_id) {
            if (typeof error.response.data.message.ou_id === 'object') {
              errMsgs.ou_id = true
              errMsgs.ou_id_msg = error.response.data.message.ou_id.toString()
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.ou_id.toString()
              })
            } else {
              errMsgs.ou_id = true
              errMsgs.ou_id_msg = error.response.data.message.ou_id
              Notify.create({
                type: 'negative',
                position: 'top',
                progress: true,
                icon: 'warning',
                message: error.response.data.message.ou_id
              })
            }
          }
          commit('ERROR_MSGS', errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response?.data?.message })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchLab({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/get', payload, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const labData = {
            id: res.data.data.sk,
            name: res.data.data.lab_name,
            approxTime: res.data.data.approx_time,
            labTtl: res.data.data.lab_ttl / 60,
            labId: urlSafeBase64Encode(res.data.data.sk),
            regions: res.data.data.regions,
            description: res.data.data.description,
            eventId: res.data.data.event_id,
            configuration: res.data.data.configuration,
            metadata: res.data.data.metadata,
            imageId: res.data.data.image_id,
            docFile: res.data.data.documentation_filename || res.data.data.documentations || [],
            documentations: res.data.data.documentation_filename || res.data.data.documentations || [],
            cloud_type: res.data.data.cloud_type,
            is_cloud: res.data.data.is_cloud,
            ou_id: res.data.data.ou_id,
            is_challenge_object: res.data.data.is_challenge_object || false,
            challenge_id: res.data.data.challenge_id,
            subjectId: res.data.data.subject_id
          }
          commit('LAB_INFO', labData)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async disableLabsWithSameId({ commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'event/labs', payload, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          commit('DISABLE_LAB_IDS', res.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async searchByNameAction({ commit }, payload) {
    commit('SEARCH_BY_NAME', payload)
  },
  async searchLabs({ commit }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'list/search', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        commit('SEARCH_FIRE', true)
        if (res.data.success) {
          const labList = []
          const labListOptions = []
          res.data.data.data.forEach((labData) => {
            labList.push({
              ...labData,
              name: labData.lab_name,
              id: labData.sk
            })
            labListOptions.push({
              label: labData.lab_name,
              value: labData.sk
            })
          })
          if (payload.reset) {
            if (payload.pagination.pk === 'challenge') {
              commit('RESET_LIST_CHALLENGE_LABS', labList)
            } else {
              commit('RESET_LIST_LABS', labList)
              commit('RESET_LIST_LABS_OPTIONS', labListOptions)
            }
          } else {
            commit('LIST_LABS', labList)
            commit('LIST_LABS_OPTIONS', labListOptions)
          }
          if (payload.pagination.pk === 'challenge') {
            commit('SHOW_MORE_CHALLENGE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY_CHALLENGE', res.data.data.pagination || {})
          } else {
            commit('SHOW_MORE', Boolean(res.data.data.pagination))
            commit('PAGINATION_KEY', res.data.data.pagination || {})
          }
        }
        commit('SHOW_MORE_LOADING', false)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  deleteLab({ commit, dispatch }, payload) {
    commit('LOADING', true)
    axios
      .post(config.baseURLApi + 'lab/delete', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab deleted successfully!', color: 'red', position: 'top' })
          commit('DELETE_LAB', payload)
        } else {
          commit('IS_CREATE_ERROR', 'Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async attachLabToSubject({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/attach', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab is attached successfully.', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async detachLabToSubject({ commit, dispatch }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'lab/detach', payload)
      .then((res) => {
        if (res.data.success) {
          commit('LOADING', false)
          Notify.create({ message: 'Lab is detached successfully.', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        commit('LOADING', false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  saveStateLabsOrChallenges({ commit }, payload) {
    commit('LABS_OR_CHALLENGES_TABLE', payload)
  },
  async fetchOuIDList({ commit }) {
    commit('LOADING', true)
    return await axios
      .get('lab_ou_id')
      .then(async (res) => commit('LIST_OU_ID_INFO', res.data.data))
      .catch(async (error) => error)
      .finally(() => commit('LOADING', false))
  },
  async SaveOuList({ commit }, payload) {
    commit('LOADING', true)
    return await axios
      .post('lab_ou_id', payload)
      .then(async (res) => Notify.create({ message: res.data.message, color: 'green', position: 'top' }))
      .catch(async (error) => error)
      .finally(() => commit('LOADING', false))
  },
  async UpdateOuIDList({ commit }, payload) {
    commit('LOADING', true)
    return await axios
      .put('lab_ou_id', payload)
      .then(async (res) => Notify.create({ message: res.data.message, color: 'green', position: 'top' }))
      .catch(async (error) => error)
      .finally(() => commit('LOADING', false))
  },
  async DeleteOuIDList({ commit }, key) {
    commit('LOADING', true)
    return await axios
      .delete(`lab_ou_id?sk=${key}`)
      .then(async (res) => {
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        return res.data
      })
      .catch(async (error) => error)
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  challengeLabPaginationKeyForward: (state) => state.paginationKeyChallenge,
  disableLabIdsGetter: (state) => state.disableLabIds,
  fetchErrorMsgs: (state) => state.error_msgs,
  fetchListChallengeLabs: (state) => (state.listChallengeLabs.length > 0 ? [...new Set(state.listChallengeLabs)] : []),
  fetchListLabs: (state) => (state.listLabs.length > 0 ? [...new Set(state.listLabs)] : []),
  fetchListLabsOptions: (state) => (state.listLabsOptions.length > 0 ? [...new Set(state.listLabsOptions)] : []),
  fetchLoadMoreTypeLabGetter: (state) => state.loadMoreTypeLab,
  fetchStatusOfApi: (state) => state.statusOfApi,
  getChitImageConfig: (state) => state.chitImageConfig,
  getChitImagesList: (state) => (state.chitImageList.length > 0 ? state.chitImageList : []),
  getChitImagesRegions: (state) => (state.chitImageRegions.length > 0 ? state.chitImageRegions : []),
  getChitImageStatus: (state) => state.statusChitImages,
  getInstructionsList: (state) => (state.allInstructionsList.length > 0 ? state.allInstructionsList : []),
  getLabID: (state) => state.labId,
  getLabsOrChallenges: (state) => state.labsOrChallengesTable,
  isLoading: (state) => state.loading,
  labPaginationKeyForward: (state) => state.paginationKey,
  listOuIdInfoGetter: (state) => state.listOuIdInfo,
  searchByNameGetter: (state) => state.searchByName,
  searchFireActive: (state) => state.searchFire,
  showMoreGetterLabs: (state) => state.showMore,
  showMoreGetterChallenges: (state) => state.showMoreChallenges,
  showMoreLoadingGetterLabs: (state) => state.showMoreLoading,
  singleLabInfo: (state) => state.labInfo
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
