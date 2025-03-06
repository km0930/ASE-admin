import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useLabsStore = defineStore('labsStore', () => {
  const allInstructionsList = ref([])
  const chitImageConfig = ref([])
  const chitImageList = ref([])
  const chitImageRegions = ref([])
  const disableLabIds = ref([])
  const error_msgs = ref({
    status: false,
    subject_id: false,
    subject_id_msg: '',
    event_id: false,
    event_id_msg: ''
  })
  const labInfo = ref({})
  const labsOrChallengesTable = ref('lab')
  const listChallengeLabs = ref([])
  const listLabs = ref([])
  const listLabsOptions = ref([])
  const listOuIdInfo = ref([])
  const loading = ref(false)
  const loadMoreTypeLab = ref('lab')
  const paginationKey = ref({})
  const paginationKeyChallenge = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const searchFireChallenge = ref(false)
  const showMore = ref(false)
  const showMoreChallenges = ref(false)
  const showMoreLoading = ref(false)
  const statusChitImages = ref(false)
  const statusOfApi = ref(true)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_OU_ID_INFO(data) {
    listOuIdInfo.value = data
  }
  function STATUS_CHIT_IMAGES(data) {
    statusChitImages.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function DISABLE_LAB_IDS(data) {
    disableLabIds.value = data
  }
  function LOAD_MORE_TYPE_LAB(data) {
    loadMoreTypeLab.value = data
  }
  function LIST_LABS(data) {
    const prev = listLabs.value
    listLabs.value = prev.concat(data)
  }
  function CREATE_LAB(data) {
    if (data.is_challenge_object) {
      listChallengeLabs.value.unshift(data)
    } else {
      listLabs.value.unshift(data)
    }
  }
  function UPDATE_LAB(data) {
    if (data.is_challenge_object) {
      const index = listChallengeLabs.value.findIndex((lab) => lab.sk === data.sk)
      listChallengeLabs.value.splice(index, 1, data)

      const otherListIndex = listLabs.value.findIndex((lab) => lab.sk === data.sk)
      if (otherListIndex !== -1) {
        listLabs.value.splice(otherListIndex, 1)
      }
    } else {
      const index = listLabs.value.findIndex((lab) => lab.sk === data.sk)
      listLabs.value.splice(index, 1, data)

      const otherListIndex = listChallengeLabs.value.findIndex((lab) => lab.sk === data.sk)
      if (otherListIndex !== -1) {
        listChallengeLabs.value.splice(otherListIndex, 1)
      }
    }
  }
  function DELETE_LAB(data) {
    const challengeLab = listChallengeLabs.value.find((lab) => lab.id === data.lab_id)
    const lab = listLabs.value.find((lab) => lab.id === data.lab_id)

    if (challengeLab) {
      const index = listChallengeLabs.value.findIndex((lab) => lab.id === data.lab_id)
      listChallengeLabs.value.splice(index, 1)
    }
    if (lab) {
      const index = listLabs.value.findIndex((lab) => lab.id === data.lab_id)
      listLabs.value.splice(index, 1)
    }
  }
  function LIST_LABS_OPTIONS(data) {
    const prev = listLabsOptions.value
    listLabsOptions.value = prev.concat(data)
  }
  function SHOW_MORE(data) {
    showMore.value = data
  }
  function SHOW_MORE_CHALLENGE(data) {
    showMoreChallenges.value = data
  }
  function FETCH_CHIT_IMAGES(data) {
    chitImageList.value = []
    chitImageList.value = data
  }
  function FETCH_CHIT_IMAGE_REGION(data) {
    chitImageRegions.value = []
    chitImageRegions.value = data
  }
  function INSTRUCTION_OPTIONS(data) {
    allInstructionsList.value = []
    allInstructionsList.value = data
  }
  function RESET_LIST_LABS(data) {
    listLabs.value = data
  }
  function RESET_LIST_CHALLENGE_LABS(data) {
    listChallengeLabs.value = data
  }
  function LIST_CHALLENGE_LABS(data) {
    const prev = listChallengeLabs.value
    listChallengeLabs.value = prev.concat(data)
  }
  function RESET_LIST_LABS_OPTIONS(data) {
    listLabsOptions.value = data
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function PAGINATION_KEY_CHALLENGE(data) {
    paginationKeyChallenge.value = data
  }
  function LAB_INFO(data) {
    labInfo.value = []
    labInfo.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function SEARCH_FIRE_CHALLENGE(data) {
    searchFireChallenge.value = data
  }
  function FETCH_CHIT_IMAGE_CONFIG(data) {
    chitImageConfig.value = ''
    chitImageConfig.value = data
  }
  function SHOW_MORE_LOADING(data) {
    showMoreLoading.value = data
  }
  function LABS_OR_CHALLENGES_TABLE(data) {
    labsOrChallengesTable.value = data
  }

  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  function resetToLab(data) {
    LOAD_MORE_TYPE_LAB(data)
  }
  function resetLabsList() {
    RESET_LIST_LABS_OPTIONS([])
  }
  function fetchLabs(payload) {
    LOADING(true)
    SHOW_MORE_LOADING(true)
    api
      .post('lab/list', payload.pagination)
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
          SEARCH_FIRE(false)
          if (payload.reset) {
            RESET_LIST_LABS(labList)
            RESET_LIST_LABS_OPTIONS(labListOptions)
          } else {
            LIST_LABS(labList)
            LIST_LABS_OPTIONS(labListOptions)
          }
          if (payload.pagination.pk === 'challenge') {
            SHOW_MORE_CHALLENGE(Boolean(res.data.data.pagination))
            PAGINATION_KEY_CHALLENGE(res.data.data.pagination || {})
          } else {
            SHOW_MORE(Boolean(res.data.data.pagination))
            PAGINATION_KEY(res.data.data.pagination || {})
          }
        }
        SHOW_MORE_LOADING(false)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchChallengeLabs(payload) {
    LOADING(true)
    const url = 'lab/list'
    api
      .post(url, payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const labList = res.data.data.data.map((labData) => ({
            ...labData,
            name: labData.lab_name,
            id: labData.sk
          }))
          SEARCH_FIRE_CHALLENGE(false)
          if (payload.reset) {
            RESET_LIST_CHALLENGE_LABS(labList)
          } else {
            LIST_CHALLENGE_LABS(labList)
          }
          if ([payload.pagination.pk, payload.pagination.query, payload.pagination.type].includes('challenge')) {
            SHOW_MORE_CHALLENGE(Boolean(res.data.data.pagination))
            PAGINATION_KEY_CHALLENGE(res.data.data.pagination || {})
          } else {
            SHOW_MORE(Boolean(res.data.data.pagination))
            PAGINATION_KEY(res.data.data.pagination || {})
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
  async function fetchSearchLabs(payload) {
    LOADING(true)
    SHOW_MORE_LOADING(true)
    await api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          LOAD_MORE_TYPE_LAB('search')
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
          SEARCH_FIRE(false)
          if (payload.reset) {
            if (payload.pagination.pk === 'challenge') {
              LIST_LABS_OPTIONS(labList)
              RESET_LIST_CHALLENGE_LABS(labList)
            } else {
              RESET_LIST_LABS(labList)
              RESET_LIST_LABS_OPTIONS(labListOptions)
            }
          } else {
            LIST_LABS(labList)
            LIST_LABS_OPTIONS(labListOptions)
          }
          if (payload.pagination.pk === 'challenge') {
            SHOW_MORE_CHALLENGE(Boolean(res.data.data.pagination))
            PAGINATION_KEY_CHALLENGE(res.data.data.pagination || {})
          } else {
            SHOW_MORE(Boolean(res.data.data.pagination))
            PAGINATION_KEY(res.data.data.pagination || {})
          }
        }
        SHOW_MORE_LOADING(false)
      })
      .catch((error) => {
        SHOW_MORE_LOADING(false)
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message.toString(), color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchInstructionsBySubject(payload) {
    LOADING(true)
    await api
      .post('subject/list-instructions', payload)
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
          INSTRUCTION_OPTIONS(instructionsList)
        }
      })
      .finally(() => LOADING(false))
  }
  function addOptionsDocs(payload) {
    INSTRUCTION_OPTIONS(payload)
  }
  async function fetchChitImages(payload) {
    LOADING(true)
    STATUS_CHIT_IMAGES(false)
    const data = {
      search: payload
    }
    FETCH_CHIT_IMAGES([])
    await api
      .post('lab/list-chit-images', data)
      .then((res) => {
        if (res.data.success) {
          STATUS_CHIT_IMAGES(true)
          const filteredData = []
          res.data.data.forEach((filterInfo) => {
            if (filterInfo.label && filterInfo.value) {
              filteredData.push({
                label: filterInfo.label,
                value: filterInfo.value
              })
            }
          })
          FETCH_CHIT_IMAGES(filteredData)
        }
      })
      .catch((error) => {
        STATUS_CHIT_IMAGES(false)
        if (error.response.data.message === 'Server error! try again later') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        } else if (typeof error.response.data.message === 'string') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createLab(payload) {
    LOADING(true)
    ERROR_MSGS({
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
    STATUS_OF_API(false)
    await api
      .post('lab/create', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          ERROR_MSGS({
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
          CREATE_LAB(lab)
          Notify.create({ message: 'Lab has been successfully created', type: 'positive', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
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
  async function updateLab(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
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
    await api
      .post('lab/update', payload, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          const lab = {
            ...res.data.data,
            name: res.data.data.lab_name,
            id: res.data.data.sk
          }
          UPDATE_LAB(lab)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
          ERROR_MSGS({
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
        STATUS_OF_API(false)
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
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response?.data?.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchLab(payload) {
    LOADING(true)
    await api
      .post('lab/get', payload, {
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
          LAB_INFO(labData)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function disableLabsWithSameId(payload) {
    LOADING(true)
    await api
      .post('event/labs', payload, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          DISABLE_LAB_IDS(res.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function searchLabs(payload) {
    LOADING(true)
    api
      .post('list/search', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        SEARCH_FIRE(true)
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
              RESET_LIST_CHALLENGE_LABS(labList)
            } else {
              RESET_LIST_LABS(labList)
              RESET_LIST_LABS_OPTIONS(labListOptions)
            }
          } else {
            LIST_LABS(labList)
            LIST_LABS_OPTIONS(labListOptions)
          }
          if (payload.pagination.pk === 'challenge') {
            SHOW_MORE_CHALLENGE(Boolean(res.data.data.pagination))
            PAGINATION_KEY_CHALLENGE(res.data.data.pagination || {})
          } else {
            SHOW_MORE(Boolean(res.data.data.pagination))
            PAGINATION_KEY(res.data.data.pagination || {})
          }
        }
        SHOW_MORE_LOADING(false)
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function deleteLab(payload) {
    LOADING(true)
    api
      .post('lab/delete', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab deleted successfully!', color: 'red', position: 'top' })
          DELETE_LAB(payload)
        } else {
          IS_CREATE_ERROR('Please enter valid Information')
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function attachLabToSubject(payload) {
    LOADING(true)
    await api
      .post('lab/attach', payload)
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
      .finally(() => LOADING(false))
  }
  async function detachLabToSubject(payload) {
    LOADING(true)
    await api
      .post('lab/detach', payload)
      .then((res) => {
        if (res.data.success) {
          LOADING(false)
          Notify.create({ message: 'Lab is detached successfully.', color: 'green', position: 'top' })
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
  function saveStateLabsOrChallenges(payload) {
    LABS_OR_CHALLENGES_TABLE(payload)
  }
  async function fetchOuIDList() {
    LOADING(true)
    return await api
      .get('lab_ou_id')
      .then(async (res) => LIST_OU_ID_INFO(res.data.data))
      .catch(async (error) => error)
      .finally(() => LOADING(false))
  }
  async function SaveOuList(payload) {
    LOADING(true)
    return await api
      .post('lab_ou_id', payload)
      .then(async (res) => Notify.create({ message: res.data.message, color: 'green', position: 'top' }))
      .catch(async (error) => error)
      .finally(() => LOADING(false))
  }
  async function UpdateOuIDList(payload) {
    LOADING(true)
    return await api
      .put('lab_ou_id', payload)
      .then(async (res) => Notify.create({ message: res.data.message, color: 'green', position: 'top' }))
      .catch(async (error) => error)
      .finally(() => LOADING(false))
  }
  async function DeleteOuIDList(key) {
    LOADING(true)
    return await api
      .delete(`lab_ou_id?sk=${key}`)
      .then(async (res) => {
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        return res.data
      })
      .catch(async (error) => error)
      .finally(() => LOADING(false))
  }
  return {
    paginationKeyChallenge,
    disableLabIds,
    error_msgs,
    listChallengeLabs,
    listLabs,
    listLabsOptions,
    loadMoreTypeLab,
    statusOfApi,
    chitImageConfig,
    chitImageList,
    chitImageRegions,
    statusChitImages,
    allInstructionsList,
    labsOrChallengesTable,
    loading,
    paginationKey,
    listOuIdInfo,
    searchByName,
    searchFire,
    showMore,
    showMoreChallenges,
    showMoreLoading,
    labInfo,
    fetchLabs,
    fetchChallengeLabs,
    fetchSearchLabs,
    fetchInstructionsBySubject,
    addOptionsDocs,
    fetchChitImages,
    createLab,
    updateLab,
    fetchLab,
    disableLabsWithSameId,
    searchByNameAction,
    searchLabs,
    deleteLab,
    attachLabToSubject,
    detachLabToSubject,
    saveStateLabsOrChallenges,
    fetchOuIDList,
    SaveOuList,
    UpdateOuIDList,
    DeleteOuIDList,
    FETCH_CHIT_IMAGE_CONFIG,
    FETCH_CHIT_IMAGE_REGION,
    loadingStatus,
    errorMsgReset,
    resetToLab,
    resetLabsList,
    SEARCH_BY_NAME
  }
})
