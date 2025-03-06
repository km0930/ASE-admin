import { defineStore } from 'pinia'
import { copyToClipboard, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import axiosUrlShortner from 'src/utils/urlShortner'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useLabStore = defineStore('lab', () => {
  const allInstructionsList = ref([])
  const chitImageConfig = ref('')
  const chitImageList = ref([])
  const chitImageRegions = ref([])
  const lab = ref('')
  const labId = ref('')
  const labList = ref([])
  const loading = ref(false)
  const shortURL = ref('')
  const subjectId = ref('')
  const update_lab = ref({})
  const router = useRouter()

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function SELECTED_LAB(data) {
    update_lab.value = data
  }
  function LIST_LABS(data) {
    labList.value = []
    labList.value = data
  }
  function INSTRUCTION_OPTIONS(data) {
    allInstructionsList.value = []
    allInstructionsList.value = data
  }
  function FETCH_CHIT_IMAGES(data) {
    chitImageList.value = []
    chitImageList.value = data
  }
  function FETCH_CHIT_IMAGE_CONFIG(data) {
    chitImageConfig.value = ''
    chitImageConfig.value = data
  }
  function FETCH_CHIT_IMAGE_REGION(data) {
    chitImageRegions.value = []
    chitImageRegions.value = data
  }
  function LAB_ID(data) {
    labId.value = data
  }
  function FETCH_LAB(data) {
    lab.value = data
  }
  function SHORT_URL(data) {
    shortURL.value = ''
    shortURL.value = data
  }
  function SUBJECT_ID(data) {
    subjectId.value = ''
    subjectId.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function updateSubjectID(data) {
    SUBJECT_ID(data)
  }
  function updatingLab(data) {
    SELECTED_LAB(data)
    LOADING(false)
  }
  function fetchLabsBySubject(payload) {
    LOADING(true)
    api
      .post('lab-list/subject', payload)
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
          LIST_LABS(labsBySubjectData)
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchInstructionsBySubject(payload) {
    LOADING(true)
    api
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
  async function fetchChitImages(payload) {
    LOADING(true)
    const data = {
      search: payload
    }
    FETCH_CHIT_IMAGES([])
    await api
      .post('lab/list-chit-images', data)
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
          FETCH_CHIT_IMAGES(filteredData)
        }
      })
      .catch((error) => {
        if (error.response.data.message === 'Server error! try again later') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        } else if (typeof error.response.data.message === 'string') {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchChitImageConfig(payload) {
    LOADING(true)
    const data = {
      image_name: payload
    }
    await api
      .post('lab/get-chit-image', data)
      .then((res) => {
        if (res.data.success) {
          const regionsList = []
          res.data.data.forEach((image) => {
            FETCH_CHIT_IMAGE_CONFIG(image.config)
            image.locations.forEach((region) => {
              regionsList.push({
                label: region,
                value: region
              })
            })
          })
          FETCH_CHIT_IMAGE_REGION(regionsList)
        }
      })
      .finally(LOADING(false))
  }
  function createMetaData(payload) {
    LOADING(true)
    api
      .post('lab/create-meta', payload)
      .then((res) => {
        if (res.data.success) {
          LAB_ID(res.data.data.lab_id)
          LOADING(false)
        }
        LOADING(false)
      })
      .finally(() => LOADING(false))
  }
  function updateLabMetaInfo(payload) {
    LOADING(true)
    api
      .post('lab/update-meta', payload)
      .then(async (res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab Meta Info has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createConfig(payload) {
    LOADING(true)
    await api
      .post('lab/update-config', payload)
      .then((res) => router.go(router.path))
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          window.location.reload()
        }
      })
      .finally(() => LOADING(false))
  }
  function updateConfig(payload) {
    LOADING(true)
    api
      .post('lab/update-config', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'Lab Configuration has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createTag(payload) {
    LOADING(true)
    await api.post('lab/update-tags', payload).finally(() => LOADING(false))
  }
  async function createCloudConfig(payload) {
    LOADING(true)
    await api.post('lab/update-cloud-config', payload).finally(() => LOADING(false))
  }
  async function createAttachment(payload) {
    LOADING(true)
    await api
      .post('lab/attach-subject', payload)
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
      .finally(() => LOADING(false))
  }
  async function actionChangeLabStatus(payload) {
    LOADING(true)
    await api
      .post('lab/attach/toggle', payload)
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
          window.location.reload()
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchLab(payload) {
    LOADING(true)
    await api
      .post('lab/get', payload)
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
        FETCH_LAB(labData)
      })
      .finally(() => LOADING(false))
  }
  function shortenURL(payload) {
    LOADING(true)
    axiosUrlShortner
      .post('create-short', payload)
      .then((res) => {
        if (res.data.short_url) {
          SHORT_URL(res.data.short_url)
          copyToClipboard(res.data.short_url)
            .then(() => {
              Notify.create({ message: 'Successfully Copied', color: 'green', position: 'top' })
            })
            .catch(() => {
              Notify.create({ message: 'Not able to copy', color: 'red', position: 'top' })
            })
        }
      })
      .finally(() => LOADING(false))
  }
  return {
    allInstructionsList,
    chitImageConfig,
    chitImageList,
    chitImageRegions,
    lab,
    labId,
    labList,
    loading,
    shortURL,
    subjectId,
    update_lab,
    loadingStatus,
    updateSubjectID,
    updatingLab,
    fetchLabsBySubject,
    fetchInstructionsBySubject,
    fetchChitImages,
    fetchChitImageConfig,
    createMetaData,
    updateLabMetaInfo,
    createConfig,
    updateConfig,
    createTag,
    createCloudConfig,
    createAttachment,
    actionChangeLabStatus,
    fetchLab,
    shortenURL
  }
})
