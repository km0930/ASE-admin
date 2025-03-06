import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

export const useTagsStore = defineStore('tagsStore', () => {
  const tags = ref([])
  const isLoading = ref(false)
  function PUSH_SINGLE_ITEM(data) {
    tags.value.push(data)
  }
  function SET_LOADING(data) {
    isLoading.value = data
    showLoader(data)
  }
  function TEMP_REMOVE(data) {
    tags.value = tags.value.filter((item) => item.sk !== data.tag_id)
  }
  function PARTIAL_UPDATE(data) {
    tags.value.forEach((item) => {
      if (item.sk === data.tag_id) {
        item.search_name = data.payload.tag_name
        item.tag_name = data.payload.tag_name
      }
    })
  }
  async function getTagList(payload) {
    try {
      SET_LOADING(true)
      const res = await api.post('tags/search', payload)
      if (res.data.success) {
        tags.value = res.data.data.data
      }
    } catch (err) {
      console.log(err)
    } finally {
      SET_LOADING(false)
    }
  }
  async function createTag(payload) {
    try {
      SET_LOADING(true)
      const res = await api.post('tags', payload)
      if (res.data.success) {
        PUSH_SINGLE_ITEM(res.data.data)
        Notify.create({
          message: 'New tag created successfully',
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
      SET_LOADING(false)
    }
  }
  async function updateTag(data) {
    try {
      SET_LOADING(true)
      const res = await api.patch(`tags/${data.tag_id}`, data.payload)
      if (res.data.success) {
        PARTIAL_UPDATE(data)
        Notify.create({
          message: 'Tag updated successfully',
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
      SET_LOADING(false)
    }
  }
  async function deleteTag(payload) {
    try {
      SET_LOADING(true)
      const res = await api.delete(`tags/${payload.tag_id}`)
      if (res.data.success) {
        TEMP_REMOVE(payload)
        Notify.create({
          message: 'Tag deleted successfully',
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
      SET_LOADING(false)
    }
  }
  return {
    tags,
    getTagList,
    createTag,
    updateTag,
    deleteTag
  }
})
