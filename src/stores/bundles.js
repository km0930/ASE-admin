import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import config from 'src/config'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useBundleStore = defineStore('bundleStore', () => {
  const bundles = ref([])
  const isLoading = ref(false)

  function IS_LOADING(value) {
    isLoading.value = value
    showLoader(value)
  }
  function SET_ALL_BUNDLES(data) {
    bundles.value = data
  }
  function PUSH_ITEM(data) {
    bundles.value.push(data)
  }
  function PARTIAL_UPDATE(data) {
    bundles.value.forEach((item, index) => {
      if (item.sk === data.bundle_id) {
        Object.keys(data).forEach((key) => {
          bundles.value[index][key] = data[key]
        })
      }
    })
  }
  function TEMP_REMOVE(data) {
    bundles.value = bundles.value.filter((item) => item.sk !== data.bundle_id)
  }

  async function createBundle(payload) {
    try {
      IS_LOADING(true)
      const res = await api.post(`${config.baseURLApi}bundles`, payload)
      if (res.data.success) {
        PUSH_ITEM(res.data.data)
        Notify.create({
          message: 'Bundle created successfully',
          type: 'positive',
          color: 'green',
          position: 'top'
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({
          message: error.response.data.message,
          color: 'red',
          position: 'top'
        })
      }
    } finally {
      IS_LOADING(false)
    }
  }
  async function searchAllBundle() {
    try {
      IS_LOADING(true)
      const res = await api.post(`${config.baseURLApi}bundles/search`)
      res.data.success && SET_ALL_BUNDLES(res.data.data.data)
    } catch (error) {
    } finally {
      IS_LOADING(false)
    }
  }
  async function updateBundle(payload) {
    const bundle_id = payload.bundle_id
    delete payload.bundle_id
    try {
      IS_LOADING(true)
      const res = await api.patch(`${config.baseURLApi}bundles/${bundle_id}`, payload)
      if (res.data.success) {
        PARTIAL_UPDATE({ ...payload, bundle_id })
        Notify.create({
          message: 'Bundle updated successfully',
          type: 'positive',
          color: 'green',
          position: 'top'
        })
      }
    } catch (error) {
      if (error.response?.status === 400) {
        Notify.create({
          message: error.response.data.message,
          color: 'red',
          position: 'top'
        })
      }
    } finally {
      IS_LOADING(false)
    }
  }
  async function deleteBundle(payload) {
    try {
      IS_LOADING(true)
      const res = await api.delete(`${config.baseURLApi}bundles/${payload.bundle_id}`, {
        data: payload
      })
      if (res.data.success) {
        TEMP_REMOVE(payload)
        Notify.create({
          message: 'Bundle deleted successfully',
          type: 'positive',
          color: 'green',
          position: 'top'
        })
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({
          message: error.response.data.message,
          color: 'red',
          position: 'top'
        })
      }
    } finally {
      IS_LOADING(false)
    }
  }
  return {
    bundles,
    createBundle,
    searchAllBundle,
    updateBundle,
    deleteBundle
  }
})
