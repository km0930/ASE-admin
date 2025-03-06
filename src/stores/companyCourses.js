import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useCompanyCoursesStore = defineStore('companycourses', () => {
  const errorMessage = ref('')
  const listCourses = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function IS_CREATE_ERROR(data) {
    errorMessage.value = data
  }
  function COURSES_LIST(data) {
    const prev = listCourses.value
    listCourses.value = prev.concat(data)
  }
  function RESET_COURSES_LIST(data) {
    listCourses.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function SEARCH_BY_NAME(data) {
    searchByName.value = data
  }
  function SEARCH_FIRE(data) {
    searchFire.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  function fetchCompanyCoursesList(payload) {
    LOADING(true)
    api
      .post('admin/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listCourses = res.data.data.users.map((user) => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }))
          if (payload.reset) {
            RESET_COURSES_LIST(listCourses)
          } else {
            COURSES_LIST(listCourses)
          }
          if (res.data.data.last_value) {
            PAGINATION_KEY(res.data.data.last_value)
          } else {
            PAGINATION_KEY({})
          }
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
  async function searchCompanyCourses(payload) {
    LOADING(true)
    api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listCourses = res.data.data.users.map((user) => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }))
          SEARCH_FIRE(true)

          if (payload.reset) {
            RESET_COURSES_LIST(listCourses)
          } else {
            COURSES_LIST(listCourses)
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
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  return {
    errorMessage,
    listCourses,
    loading,
    paginationKey,
    searchByName,
    searchFire,
    SEARCH_BY_NAME,
    loadingStatus,
    searchByNameAction,
    fetchCompanyCoursesList,
    searchCompanyCourses
  }
})
