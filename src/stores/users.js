import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { timeSince } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const certificateInfo = ref({
    count: 0,
    data: []
  })
  const error_msgs = ref({
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    role: false,
    role_msg: ''
  })
  const errorMessage = ref('')
  const event = ref(null)
  const listUsers = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const paginationKeyPartner = ref({})
  const paginationKeyTraining = ref({})
  const partnersList = ref([])
  const recentActivitiesData = ref([])
  const searchByName = ref('')
  const searchFire = ref(false)
  const statsCountInfo = ref({
    totalCourseCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    labCount: 0
  })
  const statusOfApi = ref(true)
  const trainingList = ref([])
  const uiSearch = ref(false)
  const user_info = ref({})
  const usersASEList = ref([])

  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function IS_CREATE_ERROR(data) {
    errorMessage.value = data
  }
  function STATS_COUNT_INFO(data) {
    statsCountInfo.value = data
  }
  function CERTIFICATE_INFO(data) {
    certificateInfo.value = data
  }
  function RECENT_ACTIVITIES_DATA(data) {
    recentActivitiesData.value = data
  }
  function TRAINING_LIST(data) {
    const prev = trainingList.value
    trainingList.value = prev.concat(data)
  }
  function RESET_TRAINING_LIST(data) {
    trainingList.value = data
  }
  function FETCH_USER_INFO(data) {
    user_info.value = data
  }
  function ASE_USERS_LIST(data) {
    const prev = usersASEList.value
    usersASEList.value = prev.concat(data)
  }
  function RESET_ASE_USERS_LIST(data) {
    usersASEList.value = data
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
  function PAGINATION_KEY_TRAINING(data) {
    paginationKeyTraining.value = data
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
  function RESET_PARTNERS_LIST(data) {
    partnersList.value = data
  }
  function PARTNERS_LIST(data) {
    const prev = partnersList.value
    partnersList.value = prev.concat(data)
  }
  function PAGINATION_KEY_PARTNER(data) {
    paginationKeyPartner.value = data
  }
  function recentActivities(payload) {
    LOADING(true)
    axios
      .post('admin/get-user-activity', payload)
      .then((res) => {
        if (res.data) {
          STATS_COUNT_INFO({
            totalCourseCount: res.data.data.data.count_info.total_course_count || 0,
            inProgressCount: res.data.data.data.count_info.course_inprogress_count || 0,
            completedCount: res.data.data.data.count_info.course_completed_count || 0,
            labCount: res.data.data.data.count_info.lab_count || 0
          })
          const ra = []
          res.data.data.data.course_lab_info.map((data) => {
            let createdOn = ''
            let endDate, startDate
            if (data.end_date) {
              const dt = new Date(data.end_date)
              const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
              endDate = timeSince(udt)
            }
            if (data.start_date) {
              const dt = new Date(data.start_date)
              const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
              startDate = timeSince(udt)
            }
            if (data.created_on) {
              const dt = new Date(data.created_on)
              const udt = new Date(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000)
              createdOn = timeSince(udt)
            }
            let icon = ''
            const url = ''
            let name = ''
            let progress = 0
            let numMinutes = 0
            let completed = false
            let isActive = false
            let type = 'event'
            const action = data.in_progress === 100 ? 'completed' : 'pending'
            if (data.event_name) {
              icon = 'fas fa-video'
              name = data.event_name
              progress = data.in_progress
              completed = data.is_completed
              isActive = data.is_active
            } else if (data.lab_name) {
              icon = 'fas fa-flask'
              name = data.lab_name
              type = 'lab'
              numMinutes = data.num_minutes
            }
            return ra.push({
              createdOn: createdOn,
              startDate: startDate,
              action: action,
              endDate: endDate,
              progress: progress,
              isActive: isActive,
              numMinutes: numMinutes,
              name: name,
              icon: icon,
              completed: completed,
              url: url,
              type: type
            })
          })
          RECENT_ACTIVITIES_DATA(ra)
        }
      })
      .finally(() => LOADING(false))
  }
  function certificateinfo(payload) {
    LOADING(true)
    axios
      .post('admin/get-user-cert', payload)
      .then((res) => {
        if (res.data) {
          const certificateCount = res.data.data.data.cert_count
          CERTIFICATE_INFO({
            count: certificateCount || 0,
            data: res.data.data.data.cert_info
          })
        }
      })
      .finally(() => LOADING(false))
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function createUser(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    ERROR_MSGS({
      email: false,
      email_msg: '',
      first_name: false,
      first_name_msg: '',
      last_name: false,
      last_name_msg: '',
      role: false,
      role_msg: ''
    })
    await api
      .post('admin/create', payload)
      .then((res) => {
        if (res.data.success) {
          STATUS_OF_API(true)
          Notify.create({ message: 'User is created successfully', color: 'green', position: 'top' })
          const data = {
            pagination: {},
            reset: true
          }
          fetchUsersList(data)
        } else {
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
          if (error.response.data.message.role) {
            if (typeof error.response.data.message.role === 'object') {
              errMsgs.role = true
              errMsgs.role_msg = error.response.data.message.role.toString()
            } else {
              errMsgs.role = true
              errMsgs.role_msg = error.response.data.message.role
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
  async function deleteUser(payload) {
    LOADING(true)
    await api
      .post('admin/delete', payload)
      .then((res) => {
        if (res.data.success) {
          Notify.create({ message: 'User deleted successfully', color: 'red', position: 'top' })
          const data = {
            pagination: {},
            reset: true
          }
          fetchUsersList(data)
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
  function fetchUsersList(payload) {
    LOADING(true)
    api
      .post('admin/list', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.users.map((user) => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role || ''
          }))
          if (payload.reset) {
            RESET_USERS_LIST(listUsers)
          } else {
            USERS_LIST(listUsers)
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
  async function fetchPartnerList(payload) {
    LOADING(true)
    await api
      .post('partner/users', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.data.partner_users.map((user) => ({
            name: user.name,
            email: user.email
          }))
          if (payload.reset) {
            RESET_PARTNERS_LIST(listUsers)
          } else {
            PARTNERS_LIST(listUsers)
          }
          if (res.data.data.last_value) {
            PAGINATION_KEY_PARTNER(res.data.data.last_value)
          } else {
            PAGINATION_KEY_PARTNER({})
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
  async function fetchTrainingList(payload) {
    LOADING(true)
    await api
      .post('training/users', payload.pagination, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then((res) => {
        if (res.data.success) {
          const listUsers = res.data.data.data.training_users.map((user) => ({
            name: user.name,
            email: user.email
          }))
          if (payload.reset) {
            RESET_TRAINING_LIST(listUsers)
          } else {
            TRAINING_LIST(listUsers)
          }
          if (res.data.data.last_value) {
            PAGINATION_KEY_TRAINING(res.data.data.last_value)
          } else {
            PAGINATION_KEY_TRAINING({})
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
  function updateUserType(payload) {
    LOADING(true)
    api
      .post('admin/role/update', payload)
      .then((res) => {
        if (res.data.success) {
          const searchIndex = state.listUsers
            .map(function (e) {
              return e.email
            })
            .indexOf(payload.email)
          const listFinal = state.listUsers
          const updateObj = listFinal[searchIndex]
          updateObj.role = payload.role
          listFinal[searchIndex] = updateObj
          USERS_LIST(listFinal)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  async function fetchUserInfo(payload) {
    LOADING(true)
    await api
      .post('user/get', payload)
      .then((res) => {
        if (res.data.success) {
          const userInfo = {
            first_name: res.data.data.first_name,
            last_name: res.data.data.last_name,
            email: res.data.data.email,
            role: res.data.data.role
          }
          FETCH_USER_INFO(userInfo)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => LOADING(false))
  }
  function fetchASEUsersList(payload) {
    LOADING(true)
    api
      .post('users/list', payload.pagination)
      .then((res) => {
        if (res.data.success) {
          SEARCH_FIRE(false)
          if (payload.reset) {
            RESET_ASE_USERS_LIST(res.data.data.data)
          } else {
            ASE_USERS_LIST(res.data.data.data)
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
  async function searchASEUsers(payload) {
    if (!state.uiSearch) {
      LOADING(true)
      api
        .post('users/list', payload)
        .then((res) => {
          if (res.data.success) {
            SEARCH_FIRE(true)
            if (payload.reset) {
              RESET_ASE_USERS_LIST(res.data.data.data)
            } else {
              ASE_USERS_LIST(res.data.data.data)
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
    } else {
      const searchList = state.usersASEList.filter(
        (data) =>
          data.email.toLowerCase().indexOf(payload.search_key.toLowerCase()) > -1 ||
          data.first_name.toLowerCase().indexOf(payload.search_key.toLowerCase()) > -1
      )
      RESET_ASE_USERS_LIST(searchList)
      PAGINATION_KEY({})
      SEARCH_FIRE(false)
    }
  }
  async function searchUsers(payload) {
    if (!uiSearch.value) {
      LOADING(true)
      api
        .post('list/search', payload.pagination)
        .then((res) => {
          if (res.data.success) {
            const listUsers = res.data.data.users.map((user) => ({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role || ''
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
    } else {
      const searchList = listUsers.value.filter(
        (data) =>
          data.email.toLowerCase().indexOf(payload.pagination.query.toLowerCase()) > -1 ||
          data.first_name.toLowerCase().indexOf(payload.pagination.query.toLowerCase()) > -1
      )
      RESET_USERS_LIST(searchList)
      PAGINATION_KEY({})
      SEARCH_FIRE(false)
    }
  }
  return {
    certificateInfo,
    error_msgs,
    errorMessage,
    event,
    listUsers,
    loading,
    paginationKey,
    paginationKeyPartner,
    paginationKeyTraining,
    partnersList,
    recentActivitiesData,
    searchByName,
    searchFire,
    statsCountInfo,
    statusOfApi,
    trainingList,
    uiSearch,
    user_info,
    usersASEList,
    loadingStatus,
    errorMsgReset,
    uiSearchAction,
    recentActivities,
    certificateinfo,
    searchByNameAction,
    createUser,
    deleteUser,
    fetchUsersList,
    fetchPartnerList,
    fetchTrainingList,
    updateUserType,
    fetchUserInfo,
    fetchASEUsersList,
    searchASEUsers,
    searchUsers
  }
})
