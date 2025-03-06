import { defineStore } from 'pinia'
import { LocalStorage, Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useDeliveryStore = defineStore('delivery', () => {
  const deliveryInfo = ref([])
  const deliverySuccessInfo = ref({})
  const detailInfo = ref({})
  const error_msgs = ref({
    status: false,
    title: false,
    title_msg: '',
    _type: false,
    _type_msg: '',
    mailSubject: false,
    mailSubject_msg: '',
    designId: false,
    designId_msg: '',
    detailId: false,
    detailId_msg: '',
    details: {
      title: false,
      title_msg: '',
      duration: false,
      duration_msg: '',
      level: false,
      level_msg: '',
      duration_type: false,
      duration_type_msg: '',
      criteria: false,
      criteria_msg: '',
      skills: false,
      skills_msg: ''
    },
    emailTemplateId: false,
    emailTemplateId_msg: '',
    emailFromName: false,
    emailFromName_msg: '',
    step1: false,
    step1_msg: '',
    step2: false,
    step2_msg: '',
    step3: false,
    step3_msg: ''
  })
  const error_msgs_designs = ref({ status: true })
  const error_msgs_details = ref({ status: true })
  const error_msgs_templates = ref({ status: true })
  const listDelivery = ref([])
  const listDesigns = ref([])
  const listDetails = ref([])
  const listDetailSkills = ref([])
  const listOptionsDelivery = ref([])
  const listTemplates = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)
  const totalDeliveries = ref(0)
  const totalDetails = ref(0)
  const totalDesigns = ref(0)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function SEARCH_DELIVERIES(data) {
    listDelivery.value = data
  }
  function LIST_DELIVERIES(data) {
    const prev = listDelivery.value
    listDelivery.value = [...prev, ...data]
  }
  function CREATE_DELIVERY(data) {
    listDelivery.value.unshift(data)
  }
  function UPDATE_DELIVERY(data) {
    const index = listDelivery.value.findIndex((delivery) => delivery.id === data.id)
    listDelivery.value.splice(index, 1, data)
  }
  function DELETE_DELIVERY(data) {
    const index = listDelivery.value.findIndex((delivery) => delivery.id === data.id)
    listDelivery.value.splice(index, 1)
  }
  function TOTAL_DELIVERIES(data) {
    totalDeliveries.value = data
  }
  function DELIVERY_SUCCESS_INFO(data) {
    deliverySuccessInfo.value = data
  }
  function SEARCH_OPTIONS_DELIVERY(data) {
    listOptionsDelivery.value = data
  }
  function LIST_OPTIONS_DELIVERY(data) {
    const prev = listOptionsDelivery.value
    listOptionsDelivery.value = [...prev, ...data]
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function DELIVERY_INFO(data) {
    deliveryInfo.value = []
    deliveryInfo.value = data
  }
  function LIST_DESIGNS(data) {
    const prev = listDesigns.value
    listDesigns.value = [...prev, ...data]
  }
  function TOTAL_DESIGNS(data) {
    totalDesigns.value = data
  }
  function CREATE_DETAIL(data) {
    listDetails.value.unshift(data)
  }
  function LIST_DETAILS(data) {
    const prev = listDetails.value
    listDetails.value = [...prev, ...data]
  }
  function TOTAL_DETAILS(data) {
    totalDetails.value = data
  }
  function LIST_DETAIL_SKILLS(data) {
    listDetailSkills.value = data
  }
  function LIST_TEMPLATES(data) {
    listTemplates.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function ERROR_MSGS_DESIGNS(data) {
    error_msgs_designs.value = data
  }
  function ERROR_MSGS_DETAILS(data) {
    error_msgs_details.value = data
  }
  function ERROR_MSGS_TEMPLATES(data) {
    error_msgs_templates.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  function errorMsgResetDesigns(data) {
    ERROR_MSGS_DESIGNS(data)
  }
  function errorMsgResetDetails(data) {
    ERROR_MSGS_DETAILS(data)
  }
  function errorMsgResetTemplates(data) {
    ERROR_MSGS_TEMPLATES(data)
  }
  function errorResetListDesignOptions(data) {
    LIST_DESIGNS(data)
  }
  async function fetchDeliveries(payload) {
    LOADING(true)
    await api
      .post('delivery/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const totalDeliveries = res.data.data.total
          TOTAL_DELIVERIES(totalDeliveries)

          const deliveryList = res.data.data.results.map((delivery) => delivery)

          const deliveryOptions = deliveryList.map((delivery) => ({ label: delivery.title, value: delivery.id, type: delivery._type }))

          if (payload.reset) {
            SEARCH_DELIVERIES(deliveryList)
            SEARCH_OPTIONS_DELIVERY(deliveryOptions)
          } else {
            LIST_DELIVERIES(deliveryList)
            LIST_OPTIONS_DELIVERY(deliveryOptions)
          }
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function createDelivery(payload) {
    LOADING(true)
    ERROR_MSGS({
      status: false,
      title: false,
      title_msg: '',
      _type: false,
      _type_msg: '',
      mailSubject: false,
      mailSubject_msg: '',
      designId: false,
      designId_msg: '',
      detailId: false,
      detailId_msg: '',
      emailTemplateId: false,
      emailTemplateId_msg: '',
      emailFromName: false,
      emailFromName_msg: ''
    })
    STATUS_OF_API(true)
    DELIVERY_SUCCESS_INFO({})
    await api
      .post('delivery/create', payload)
      .then((res) => {
        if (res.data.success) {
          CREATE_DELIVERY(res.data.data)
          DELIVERY_SUCCESS_INFO(res.data)
          ERROR_MSGS({
            status: true,
            title: false,
            title_msg: '',
            _type: false,
            _type_msg: '',
            mailSubject: false,
            mailSubject_msg: '',
            designId: false,
            designId_msg: '',
            detailId: false,
            detailId_msg: '',
            emailTemplateId: false,
            emailTemplateId_msg: '',
            emailFromName: false,
            emailFromName_msg: ''
          })
          STATUS_OF_API(true)
          Notify.create({ message: 'Delivery has been successfully created', type: 'positive', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        DELIVERY_SUCCESS_INFO({})
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            title: false,
            title_msg: '',
            _type: false,
            _type_msg: '',
            mailSubject: false,
            mailSubject_msg: '',
            designId: false,
            designId_msg: '',
            detailId: false,
            detailId_msg: '',
            emailTemplateId: false,
            emailTemplateId_msg: '',
            emailFromName: false,
            emailFromName_msg: ''
          }
          if (error.response.data.message.title) {
            if (typeof error.response.data.message.title === 'object') {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title.toString()
            } else {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title
            }
          }
          if (error.response.data.message._type) {
            if (typeof error.response.data.message._type === 'object') {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type.toString()
            } else {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type
            }
          }
          if (error.response.data.message.mailSubject) {
            if (typeof error.response.data.message.mailSubject === 'object') {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject.toString()
            } else {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject
            }
          }
          if (error.response.data.message.designId) {
            if (typeof error.response.data.message.designId === 'object') {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId.toString()
            } else {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId
            }
          }
          if (error.response.data.message.emailTemplateId) {
            if (typeof error.response.data.message.emailTemplateId === 'object') {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId.toString()
            } else {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId
            }
          }
          if (error.response.data.message.emailFromName) {
            if (typeof error.response.data.message.emailFromName === 'object') {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName.toString()
            } else {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName
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
  async function updateDelivery(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
      status: false,
      title: false,
      title_msg: '',
      _type: false,
      _type_msg: '',
      mailSubject: false,
      mailSubject_msg: '',
      designId: false,
      designId_msg: '',
      detailId: false,
      detailId_msg: '',
      emailTemplateId: false,
      emailTemplateId_msg: '',
      emailFromName: false,
      emailFromName_msg: ''
    })
    await api
      .post('delivery/update', payload, {
        headers: {
          Authorization: LocalStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          UPDATE_DELIVERY(res.data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Badge has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const errMsgs = {
            status: false,
            title: false,
            title_msg: '',
            _type: false,
            _type_msg: '',
            mailSubject: false,
            mailSubject_msg: '',
            designId: false,
            designId_msg: '',
            detailId: false,
            detailId_msg: '',
            emailTemplateId: false,
            emailTemplateId_msg: '',
            emailFromName: false,
            emailFromName_msg: ''
          }
          if (error.response.data.message.title) {
            if (typeof error.response.data.message.title === 'object') {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title.toString()
            } else {
              errMsgs.title = true
              errMsgs.title_msg = error.response.data.message.title
            }
          }
          if (error.response.data.message._type) {
            if (typeof error.response.data.message._type === 'object') {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type.toString()
            } else {
              errMsgs._type = true
              errMsgs._type_msg = error.response.data.message._type
            }
          }
          if (error.response.data.message.mailSubject) {
            if (typeof error.response.data.message.mailSubject === 'object') {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject.toString()
            } else {
              errMsgs.mailSubject = true
              errMsgs.mailSubject_msg = error.response.data.message.mailSubject
            }
          }
          if (error.response.data.message.designId) {
            if (typeof error.response.data.message.designId === 'object') {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId.toString()
            } else {
              errMsgs.designId = true
              errMsgs.designId_msg = error.response.data.message.designId
            }
          }
          if (error.response.data.message.emailTemplateId) {
            if (typeof error.response.data.message.emailTemplateId === 'object') {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId.toString()
            } else {
              errMsgs.emailTemplateId = true
              errMsgs.emailTemplateId_msg = error.response.data.message.emailTemplateId
            }
          }
          if (error.response.data.message.emailFromName) {
            if (typeof error.response.data.message.emailFromName === 'object') {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName.toString()
            } else {
              errMsgs.emailFromName = true
              errMsgs.emailFromName_msg = error.response.data.message.emailFromName
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
  async function fetchDelivery(payload) {
    LOADING(true)
    await api
      .post('delivery/get', payload)
      .then((res) => {
        if (res.data.success) {
          DELIVERY_INFO(res.data.data)
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
  async function deleteDelivery(payload) {
    LOADING(true)
    await api
      .post('delivery/delete', payload)
      .then((res) => {
        if (res.data.success) {
          DELETE_DELIVERY(payload)
          Notify.create({ message: 'Delivery is deleted successfully.', color: 'red', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchlistDesigns(payload) {
    LOADING(true)
    await api
      .post('design/list', payload)
      .then((res) => {
        const listDesigns = res.data.data.results.map((design) => ({
          value: design.id,
          label: design.title
        }))
        const totalDesigns = res.data.data.total
        LIST_DESIGNS(listDesigns)
        TOTAL_DESIGNS(totalDesigns)
        ERROR_MSGS_DESIGNS({ status: true })
      })
      .catch((error) => {
        ERROR_MSGS_DESIGNS({ status: true })
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchlistDetails(payload) {
    LOADING(true)
    await api
      .post('details/list', payload)
      .then((res) => {
        const listDetails = res.data.data.results.map((details) => ({
          value: details.id,
          label: details.title
        }))
        const totalDetails = res.data.data.total
        LIST_DETAILS(listDetails)
        TOTAL_DETAILS(totalDetails)
        ERROR_MSGS_DETAILS({ status: true })
      })
      .catch((error) => {
        ERROR_MSGS_DETAILS({ status: true })
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchDetailSkills(payload) {
    LOADING(true)
    await api
      .post('detail/skills', payload)
      .then((res) => LIST_DETAIL_SKILLS(res.data.data || []))
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function addDetail(payload) {
    LOADING(true)
    await api
      .post('detail/add', payload)
      .then((res) => {
        if (res.data.success) {
          const detail = {
            value: res.data.data.id,
            label: res.data.data.title
          }
          CREATE_DETAIL(detail)
          Notify.create({ message: 'Detail was successfully added.', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchlistTemplates() {
    LOADING(true)
    await api
      .post('templates/list')
      .then((res) => {
        const listTemplates = res.data.data.results.map((temp) => ({
          value: temp.id,
          label: temp.title
        }))
        LIST_TEMPLATES(listTemplates)
        ERROR_MSGS_TEMPLATES({ status: true })
      })
      .catch((error) => {
        ERROR_MSGS_TEMPLATES({ status: true })
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  return {
    deliveryInfo,
    deliverySuccessInfo,
    detailInfo,
    error_msgs,
    error_msgs_designs,
    error_msgs_details,
    error_msgs_templates,
    listDelivery,
    listDesigns,
    listDetails,
    listDetailSkills,
    listOptionsDelivery,
    listTemplates,
    loading,
    paginationKey,
    searchByName,
    searchFire,
    statusOfApi,
    totalDeliveries,
    totalDetails,
    totalDesigns,
    PAGINATION_KEY,
    loadingStatus,
    errorMsgReset,
    errorMsgResetDesigns,
    errorMsgResetDetails,
    errorMsgResetTemplates,
    errorResetListDesignOptions,
    fetchDeliveries,
    createDelivery,
    updateDelivery,
    fetchDelivery,
    searchByNameAction,
    deleteDelivery,
    fetchlistDesigns,
    fetchlistDetails,
    fetchDetailSkills,
    addDetail,
    fetchlistTemplates
  }
})
