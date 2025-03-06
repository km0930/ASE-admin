import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

const useInstructorStore = defineStore('instructorStore', () => {
  const error_msgs = ref({
    instructor_name: false,
    instructor_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  })
  const instructorInfo = ref({})
  const instructorOptions = ref([])
  const listInstructors = ref([])
  const loading = ref(false)
  const paginationKey = ref({})
  const searchByName = ref('')
  const searchFire = ref(false)
  const statusOfApi = ref(true)
  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function LIST_INSTRUCTOR(data) {
    const prev = listInstructors.value
    listInstructors.value = prev.concat(data)
  }
  function CREATE_INSTRUCTOR(data) {
    listInstructors.value.unshift(data)
  }
  function UPDATE_INSTRUCTOR(data) {
    const index = listInstructors.value.findIndex((instructor) => instructor.id === data.id)
    listInstructors.value.splice(index, 1, data)
  }
  function DELETE_INSTRUCTOR(data) {
    const index = listInstructors.value.findIndex((instructor) => instructor.id === data.instructor_id)
    listInstructors.value.splice(index, 1)
  }
  function RESET_LIST_INSTRUCTOR(data) {
    listInstructors.value = data
  }
  function PAGINATION_KEY(data) {
    paginationKey.value = data
  }
  function FETCH_INSTRUCTOR_INFO(data) {
    instructorInfo.value = {}
    instructorInfo.value = data
  }
  function OPTION_INSTRUCTOR(data) {
    instructorOptions.value = data
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
  function errorMsgReset(data) {
    ERROR_MSGS(data)
  }
  async function fetchInstructors(payload) {
    LOADING(true)
    try {
      const res = await api.post('instructor/list', payload.pagination)
      if (res.data.success) {
        const instructorList = res.data.data.data.map((instructor) => ({
          ...instructor,
          id: instructor.sk
        }))
        if (payload.reset) {
          RESET_LIST_INSTRUCTOR(instructorList)
        } else {
          LIST_INSTRUCTOR(instructorList)
        }
        PAGINATION_KEY(res.data.data.last_value || {})
        SEARCH_FIRE(false)
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function searchInstructor(payload) {
    LOADING(true)
    try {
      const res = await api.post('list/search', payload.pagination)
      if (res.data.success) {
        const instructorList = res.data.data.data.map((instructor) => ({
          name: instructor.instructor_name,
          id: instructor.sk,
          about: instructor.about,
          photo: instructor.photo
        }))

        SEARCH_FIRE(true)
        if (payload.reset) {
          RESET_LIST_INSTRUCTOR(instructorList)
        } else {
          LIST_INSTRUCTOR(instructorList)
        }
        if (res.data.data.pagination) {
          PAGINATION_KEY(res.data.data.pagination)
        } else {
          PAGINATION_KEY({})
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function searchByNameAction(payload) {
    SEARCH_BY_NAME(payload)
  }
  async function createInstructor(payload) {
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

    try {
      const res = await api.post('instructor/create', payload)
      if (res.data.success) {
        CREATE_INSTRUCTOR(res.data.data)
        STATUS_OF_API(true)
        Notify.create({ message: 'Instructor has been successfully created', color: 'green', position: 'top' })
      }
    } catch (error) {
      if (error.response.status === 400) {
        LOADING(false)
        STATUS_OF_API(false)
        if (error.response.status === 400) {
          const errMsgs = {
            instructor_name: false,
            instructor_name_msg: '',
            about: false,
            about_msg: '',
            photo: false,
            photo_msg: '',
            photo_name: false,
            photo_name_msg: ''
          }
          if (error.response.data.message.about) {
            if (typeof error.response.data.message.about === 'object') {
              errMsgs.about = true
              errMsgs.about_msg = error.response.data.message.about.toString()
            } else {
              errMsgs.about = true
              errMsgs.about_msg = error.response.data.message.about
            }
          }
          if (error.response.data.message.instructor_name) {
            if (typeof error.response.data.message.instructor_name === 'object') {
              errMsgs.instructor_name = true
              errMsgs.instructor_name_msg = error.response.data.message.instructor_name.toString()
            } else {
              errMsgs.instructor_name = true
              errMsgs.instructor_name_msg = error.response.data.message.instructor_name
            }
          }
          if (error.response.data.message.photo) {
            if (typeof error.response.data.message.photo === 'object') {
              errMsgs.photo = true
              errMsgs.photo_msg = error.response.data.message.photo.toString()
            } else {
              errMsgs.photo = true
              errMsgs.photo_msg = error.response.data.message.photo
            }
          }
          if (error.response.data.message.photo_name) {
            if (typeof error.response.data.message.photo_name === 'object') {
              errMsgs.photo_name = true
              errMsgs.photo_name_msg = error.response.data.message.photo_name.toString()
            } else {
              errMsgs.photo_name = true
              errMsgs.photo_name_msg = error.response.data.message.photo_name
            }
          }
          ERROR_MSGS(errMsgs)
          if (typeof error.response.data.message === 'string') {
            Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
          }
        } else {
          Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: error.response.data.message })
        }
      }
    } finally {
      LOADING(false)
    }
  }
  async function fetchInstructor(payload) {
    LOADING(true)
    try {
      const res = await api.post('instructor/get', payload)
      if (res.data.success) {
        const instructorInfo = {
          instructor_name: res.data.data.instructor_name,
          id: res.data.data.sk,
          about: res.data.data.about,
          instructorId: urlSafeBase64Encode(res.data.data.sk),
          image: res.data.data.photo + '?' + new Date(new Date().toUTCString()).toLocaleString(),
          imageName: res.data.data.photo_name
        }
        FETCH_INSTRUCTOR_INFO(instructorInfo)
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function updateInstructor(payload) {
    LOADING(true)
    STATUS_OF_API(true)
    try {
      const res = await api.post('instructor/update', payload)
      if (res.data.success) {
        const instructorInfo = {
          ...res.data.data,
          id: res.data.data.sk
        }
        UPDATE_INSTRUCTOR(instructorInfo)
        STATUS_OF_API(true)
        Notify.create({ message: 'Instructor has been successfully updated', color: 'green', position: 'top' })
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function deleteInstructor(payload) {
    LOADING(true)
    try {
      const res = await api.post('instructor/delete', payload)
      if (res.data.success) {
        DELETE_INSTRUCTOR(payload)
        Notify.create({ message: 'Instructor has been successfully deleted', color: 'red', position: 'top' })
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function fetchInstructorOptions() {
    LOADING(true)
    try {
      const res = await api.get('instructor/option')
      const instructorOptions = res.data.data.data.map((instructor) => ({
        value: instructor.sk,
        label: instructor.instructor_name,
        img: instructor.photo
      }))
      instructorOptions.sort((a, b) => {
        const nameA = a.label.toLowerCase()
        const nameB = b.label.toLowerCase()
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
      OPTION_INSTRUCTOR(instructorOptions)
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  return {
    error_msgs,
    listInstructors,
    statusOfApi,
    instructorOptions,
    paginationKey,
    loading,
    searchByName,
    searchFire,
    instructorInfo,
    SEARCH_BY_NAME,
    errorMsgReset,
    fetchInstructors,
    searchInstructor,
    searchByNameAction,
    createInstructor,
    fetchInstructor,
    updateInstructor,
    deleteInstructor,
    fetchInstructorOptions
  }
})
export { useInstructorStore }
