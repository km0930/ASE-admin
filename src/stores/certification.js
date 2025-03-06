import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { certificationApi } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useCertificationStore = defineStore('certificationStore', () => {
  const descriptiveQuestions = ref([])
  const chargesOptions = ref([])
  const error_msgs = ref({
    name: '',
    charges: null,
    description: '',
    pass_percentage: '',
    duration: '',
    challenges: '',
    skills: null,
    persona: null,
    proficiency: ''
  })
  const listCertification = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const reports = ref([])
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(false)
  const skillsOptions = ref([])
  const top = ref([])
  const loadingProjects = ref(false)
  const projects = ref([])
  const topUsers = ref([])
  const last_value = ref(undefined)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  function ADD_DESCRIPTIVE_QUESTION(data) {
    descriptiveQuestions.value.push(data)
  }
  function UPDATE_DESCRIPTIVE_QUESTION_LIST(data) {
    const index = descriptiveQuestions.value.findIndex((question) => question.sk === data.sk)
    descriptiveQuestions.value.splice(index, 1, data)
  }
  function UPDATE_STATE_SCORES(data) {
    const reportIndex = reports.value.findIndex((report) => report.email === data.email)
    const questionIndex = reports.value[reportIndex].questions.findIndex((question) => question.id === data.question)
    reports.value[reportIndex].questions[questionIndex].ai_eval_result = data.result
  }
  function DELETE_DESCRIPTIVE_QUESTION(data) {
    const index = descriptiveQuestions.value.findIndex((question) => question.sk === data.question)
    descriptiveQuestions.value.splice(index, 1)
  }
  function LIST_CERTIFICATION(data) {
    listCertification.value = listCertification.value.concat(data)
  }
  function RESET_LIST_CERTIFICATION(data) {
    listCertification.value = data
  }
  function CREATE_CERTIFICATION(data) {
    listCertification.value.unshift(data)
  }
  function UPDATE_CERTIFICATION(data) {
    const index = listCertification.value.findIndex((certification) => certification.sk === data.sk)
    listCertification.value.splice(index, 1, data)
  }
  function DELETE_CERTIFICATION(data) {
    const index = listCertification.value.findIndex((certification) => certification.sk === data.sk)
    listCertification.value.splice(index, 1)
  }
  function SKILLS_OPTIONS(data) {
    skillsOptions.value = data
  }
  function CHARGES_OPTIONS(data) {
    chargesOptions.value = data
  }
  function REPORTS(data) {
    reports.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function TOP(data) {
    top.value = data
  }
  function TOP_USERS(data) {
    topUsers.value = data
  }
  function LOADING_PROJECTS(data) {
    loadingProjects.value = data
  }
  function LIST_DESCRIPTIVE_QUESTIONS(data) {
    descriptiveQuestions.value = descriptiveQuestions.value.concat(data)
  }
  function SET_LAST_VALUE(data) {
    last_value.value = data
  }
  function PROJECTS(data) {
    projects.value = data
  }
  function PUSH_PROJECT(data) {
    projects.value.push(data)
  }
  function RESET_DESCRIPTIVE_QUESTIONS(data) {
    descriptiveQuestions.value = data
  }
  async function fetchCertifications(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          if (payload.reset) {
            RESET_LIST_CERTIFICATION(res.data.data)
          } else {
            LIST_CERTIFICATION(res.data.data)
          }
          PAGINATION_KEY(res.data.data.last_value || {})
          SEARCH_FIRE(false)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function searchCertification(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          SEARCH_FIRE(true)
          if (payload.reset) {
            RESET_LIST_CERTIFICATION(res.data.data)
          } else {
            LIST_CERTIFICATION(res.data.data)
          }
          if (res.data.data.pagination) {
            PAGINATION_KEY(res.data.data.pagination)
          } else {
            PAGINATION_KEY({})
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
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function fetchSkills(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/skills', payload)
      .then((res) => {
        const skills = res.data.data.map((data) => ({ label: data, value: data }))
        SKILLS_OPTIONS(skills)
      })
      .catch((error) => IS_ERROR(error))
      .finally(() => LOADING(false))
  }
  async function fetchCharges() {
    LOADING(true)
    await certificationApi
      .get('certifications/charges')
      .then((res) => {
        const charges = res.data.data.map((data) => ({ label: data.name, value: data.id }))
        CHARGES_OPTIONS(charges)
      })
      .catch((error) => IS_ERROR(error))
      .finally(() => LOADING(false))
  }
  async function createCertification(payload) {
    LOADING(true)
    ERROR_MSGS({
      instructor_name: false,
      instructor_name_msg: '',
      about: false,
      about_msg: '',
      photo: false,
      photo_msg: '',
      photo_name: false,
      photo_name_msg: ''
    })
    STATUS_OF_API(true)
    await certificationApi
      .post('certification/create', payload)
      .then((res) => {
        if (res.data.success) {
          CREATE_CERTIFICATION(res.data.data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Certification has been successfully created', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          for (const errorInfo of error.response.data.errors) {
            if (errorInfo.attribute) {
              err_msgs[errorInfo.attribute] = true
              err_msgs[errorInfo.attribute + '_msg'] = errorInfo.value
            }
          }
          ERROR_MSGS(err_msgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function updateCertification(payload) {
    LOADING(true)
    ERROR_MSGS({
      instructor_name: false,
      instructor_name_msg: '',
      about: false,
      about_msg: '',
      photo: false,
      photo_msg: '',
      photo_name: false,
      photo_name_msg: ''
    })
    STATUS_OF_API(true)
    await certificationApi
      .post('certification/update', payload)
      .then((res) => {
        if (res.data.success) {
          UPDATE_CERTIFICATION(res.data.data)
          STATUS_OF_API(true)
          Notify.create({ message: 'Certification has been successfully updated', color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const err_msgs = { status: false }
          Object.entries(payload).forEach(([key, value]) => {
            err_msgs[key] = false
            err_msgs[key + '_msg'] = ''
          })
          for (const errorInfo of error.response.data.errors) {
            if (errorInfo.attribute) {
              err_msgs[errorInfo.attribute] = true
              err_msgs[errorInfo.attribute + '_msg'] = errorInfo.value
            }
          }
          ERROR_MSGS(err_msgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      })
      .finally(() => LOADING(false))
  }
  async function deleteCertification(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/remove', payload)
      .then((res) => {
        if (res.data.success) {
          DELETE_CERTIFICATION(res.data.data)
          Notify.create({ message: 'Certification has been successfully deleted', color: 'red', position: 'top' })
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
  async function certificationReport(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/report', payload)
      .then((res) => {
        if (res.data.success) {
          REPORTS(res.data.data)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function certificationTop(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/top', payload)
      .then((res) => {
        if (res.data.success) {
          TOP(res.data.data)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function certificationTopUsers(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/top-users', payload)
      .then((res) => {
        if (res.data.success) {
          TOP_USERS(res.data.data)
        }
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function createDescriptiveQuestion(payload) {
    LOADING(true)
    await certificationApi
      .post('dsq/create', payload)
      .then((res) => {
        ADD_DESCRIPTIVE_QUESTION(res.data.data)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function listDescriptiveQuestion(payload) {
    LOADING(true)
    await certificationApi
      .post('dsq/list', payload)
      .then((res) => {
        if (payload.reset) {
          RESET_DESCRIPTIVE_QUESTIONS(res.data.data)
        } else {
          LIST_DESCRIPTIVE_QUESTIONS(res.data.data)
        }
        SET_LAST_VALUE(res.data.last_value)
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function updateDescriptiveQuestion(payload) {
    LOADING(true)
    await certificationApi
      .post('dsq/update', payload)
      .then((res) => {
        UPDATE_DESCRIPTIVE_QUESTION_LIST(res.data.data)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function deleteDescriptiveQuestion(payload) {
    LOADING(true)
    await certificationApi
      .post('dsq/remove', payload)
      .then((res) => {
        DELETE_DESCRIPTIVE_QUESTION(payload)
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function updateScores(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/update-score', payload)
      .then((res) => Notify.create({ message: res.data.message, color: 'green', position: 'top' }))
      .catch((error) => Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }
  async function certificationIssue(payload) {
    LOADING(true)
    await certificationApi
      .post('certification/issue', payload)
      .then((res) => {
        const report = reports.value.find((report) => report.email === payload.email)
        report.certified = true
        REPORTS(reports.value)

        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      })
      .catch((error) => Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' }))
      .finally(() => LOADING(false))
  }

  async function createProject(payload) {
    LOADING_PROJECTS(true)
    await certificationApi
      .post('project/create', payload)
      .then((res) => {
        if (res.data?.success) {
          PUSH_PROJECT(res.data?.data)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => LOADING_PROJECTS(false))
  }
  async function fetchAllProjects(payload) {
    LOADING_PROJECTS(true)
    await certificationApi
      .post('project/list', payload)
      .then((res) => {
        if (res.data?.success) {
          PROJECTS(res.data?.data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => LOADING_PROJECTS(false))
  }
  async function updateProject(payload) {
    LOADING_PROJECTS(true)
    await certificationApi
      .post('project/update', payload)
      .then((res) => {
        if (res.data?.success) {
          const oldData = [...projects.value]
          const index = oldData?.findIndex((el) => el?.sk === payload.project)
          oldData[index] = res.data?.data

          PROJECTS(oldData)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => LOADING_PROJECTS(false))
  }
  async function deleteProject(payload) {
    LOADING_PROJECTS(true)
    await certificationApi
      .post('project/remove', payload)
      .then((res) => {
        if (res.data?.success) {
          const oldData = projects.value?.filter((el) => el?.sk !== payload.project)
          PROJECTS(oldData)
          Notify.create({ message: res.data.message, color: 'green', position: 'top' })
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => LOADING_PROJECTS(false))
  }
  async function importProjects(data) {
    try {
      const res = await certificationApi.post('project/import', {
        projects: data ?? []
      })
      if (res.data.success) {
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
      console.log(error)
      Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    }
  }
  async function importQuestions(data) {
    try {
      const res = await certificationApi.post('dsq/import', {
        questions: data ?? []
      })
      if (res.data.success) {
        Notify.create({ message: res.data.message, color: 'green', position: 'top' })
      }
    } catch (error) {
      console.log(error)
      Notify.create({ message: error.response.data?.message, color: 'red', position: 'top' })
    }
  }
  return {
    fetchCertifications,
    searchCertification,
    SEARCH_BY_NAME,
    searchByNameAction,
    fetchSkills,
    fetchCharges,
    createCertification,
    updateCertification,
    deleteCertification,
    certificationReport,
    certificationTop,
    certificationTopUsers,
    createDescriptiveQuestion,
    listDescriptiveQuestion,
    updateDescriptiveQuestion,
    deleteDescriptiveQuestion,
    updateScores,
    certificationIssue,
    errorMsgReset,
    createProject,
    updateProject,
    fetchAllProjects,
    deleteProject,
    importProjects,
    importQuestions,
    UPDATE_STATE_SCORES,
    UPDATE_DESCRIPTIVE_QUESTION_LIST,
    last_value,
    listCertification,
    searchByName,
    top,
    topUsers,
    paginationKey,
    loading,
    searchFire,
    statusOfApi,
    chargesOptions,
    skillsOptions,
    descriptiveQuestions,
    reports,
    error_msgs,
    loadingProjects,
    projects
  }
})
