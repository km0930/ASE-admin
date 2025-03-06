import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCompanyUsersStore = defineStore('companyusers', () => {
  const router = useRouter()
  const error_msgs = ref({
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: ''
  })
  const errorMessage = ref('')
  const listUsers = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)
  const uiSearch = ref(false)

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function IS_CREATE_ERROR(data) {
    errorMessage.value = data
  }
  function USERS_LIST(data) {
    const prev = listUsers.value
    listUsers.value = prev.concat(data)
  }
  function RESET_USERS_LIST(data) {
    listUsers.value = data
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
  function STATUS_OF_API(data) {
    statusOfApi.value = data
  }
  function UI_SEARCH(data) {
    uiSearch.value = data
  }
  function ERROR_MSGS(data) {
    error_msgs.value = Object.assign(error_msgs.value, data)
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  function uiSearchAction(data) {
    UI_SEARCH(data)
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function createCompanyAdminUser(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: ''
    })
    await api
      .post('company/create-admin', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          Notify.create({ message: 'User is created successfully', color: 'green', position: 'top' })
          router.push(router.path)
          router.go(router.path)
        } else {
          STATUS_OF_API(false)
          IS_CREATE_ERROR('Please enter valid Information')
        }
      })
      .catch((error) => {
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const errMsgs = {
            email: false,
            email_msg: '',
            first_name: false,
            first_name_msg: '',
            last_name: false,
            last_name_msg: ''
          }
          if (error.response.data.message.email) {
            if (typeof error.response.data.message.email === 'object') {
              errMsgs.email = true
              errMsgs.email_msg = error.response.data.message.email.toString()
            } else {
              errMsgs.email = true
              errMsgs.email_msg = error.response.data.message.email
            }
          }
          if (error.response.data.message.first_name) {
            if (typeof error.response.data.message.first_name === 'object') {
              errMsgs.first_name = true
              errMsgs.first_name_msg = error.response.data.message.first_name.toString()
            } else {
              errMsgs.first_name = true
              errMsgs.first_name_msg = error.response.data.message.first_name
            }
          }
          if (error.response.data.message.last_name) {
            if (typeof error.response.data.message.last_name === 'object') {
              errMsgs.last_name = true
              errMsgs.last_name_msg = error.response.data.message.last_name.toString()
            } else {
              errMsgs.last_name = true
              errMsgs.last_name_msg = error.response.data.message.last_name
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
  async function fetchCompanyUsersList(payload) {
    LOADING(true)
    await api
      .post('company/users', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.data.map((user) => ({
            first_name: user.name,
            last_name: user.name,
            email: user.email,
            isAdmin: user.is_admin,
            isActive: user.is_active,
            last_login: user.last_login || 'Not yet logged'
          }))
          if (payload.reset) {
            RESET_USERS_LIST(listUsers)
          } else {
            USERS_LIST(listUsers)
          }
          if (res.data.data.pagination) {
            PAGINATION_KEY(res.data.data.pagination)
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
  function fetchToggleStatus(payload) {
    LOADING(true)
    api
      .post('company/user/toggle', payload)
      .then((res) => {
        if (res.data.success) {
          const searchIndex = listUsers.value
            .map(function (e) {
              return e.email
            })
            .indexOf(payload.email)
          const listFinal = listUsers.value
          const updateObj = listFinal[searchIndex]
          updateObj.isAdmin = res.data.data.is_admin
          listFinal[searchIndex] = updateObj
          RESET_USERS_LIST(listFinal)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchToggleStatusIsActive(payload) {
    LOADING(true)
    api
      .post('company/user/toggle', payload)
      .then((res) => {
        if (res.data.success) {
          const searchIndex = listUsers.value.map((e) => e.email).indexOf(payload.email)
          const listFinal = listUsers.value
          const updateObj = listFinal[searchIndex]
          updateObj.isActive = res.data.data.is_active
          listFinal[searchIndex] = updateObj
          RESET_USERS_LIST(listFinal)
        }
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchCompanyUsers(payload) {
    LOADING(true)
    api
      .post('list/search', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.users.map((user) => ({
            first_name: user.name,
            last_name: user.name,
            email: user.email,
            isAdmin: user.is_admin,
            last_login: user.last_login || 'Not yet logged'
          }))
          SEARCH_FIRE(true)

          if (payload.reset) {
            RESET_USERS_LIST(listUsers)
          } else {
            USERS_LIST(listUsers)
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
    error_msgs,
    errorMessage,
    listUsers,
    loading,
    paginationKey,
    searchByName,
    searchFire,
    statusOfApi,
    uiSearch,
    SEARCH_BY_NAME,
    loadingStatus,
    errorMsgReset,
    uiSearchAction,
    searchByNameAction,
    createCompanyAdminUser,
    fetchCompanyUsersList,
    fetchToggleStatus,
    fetchToggleStatusIsActive,
    searchCompanyUsers
  }
})
