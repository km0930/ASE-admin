import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

export const useJourneysStore = defineStore('journeys', () => {
  const journeys = ref([])
  const pagination = ref(undefined)

  function SET_ALL_JOURNEYS(data) {
    journeys.value = data ?? []
  }
  function PUSH_JOURNEY(data) {
    journeys.value.push(...data)
  }
  function REMOVE_JOURNEY(id) {
    journeys.value = journeys.value?.filter((journey) => {
      return journey.sk !== id
    })
  }
  function PARTIAL_UPDATE(data) {
    const obj = journeys.value?.find((journey) => journey.sk === data.sk)
    if (obj) {
      const keys = Object.keys(data?.payload ?? {})
      keys.forEach((key) => {
        obj[key] = data.payload[key]
      })
    }
  }
  function SET_PAGINATION(data) {
    pagination.value = data
  }
  async function createJourney(payload) {
    try {
      const res = await api.post('journey', payload)
      if (res.data.success) {
        PUSH_JOURNEY([res.data?.data])
        Notify.create({
          message: 'Journey created successfully',
          color: 'green',
          position: 'top'
        })
      }
    } catch (error) {
      Notify.create({
        message: error?.response?.data?.message,
        color: 'red',
        position: 'top'
      })
    }
  }
  async function fetchJourneys(payload) {
    try {
      const res = await api.post('journey/search', payload)
      if (res.data.success) {
        SET_PAGINATION(res.data?.data?.pagination)
        if (payload.pagination) {
          PUSH_JOURNEY(res.data?.data?.data)
        } else {
          SET_ALL_JOURNEYS(res.data?.data?.data)
        }
      }
    } catch (error) {
      Notify.create({
        message: error?.response?.data?.message,
        color: 'red',
        position: 'top'
      })
    }
  }
  async function updateJourney(payload) {
    try {
      const journey_id = payload?.sk
      const res = await api.patch(`journey/${journey_id}`, payload)
      if (res.data.success) {
        Notify.create({
          message: 'Journey updated successfully',
          color: 'green',
          position: 'top'
        })
        commit('PARTIAL_UPDATE', { sk: journey_id, payload: res.data?.data })
      }
    } catch (error) {
      Notify.create({
        message: error?.response?.data?.message,
        color: 'red',
        position: 'top'
      })
    }
  }
  async function deleteJourney(delete_id) {
    try {
      const res = await api.delete(`journey/${delete_id}`)
      if (res.data.success) {
        Notify.create({
          message: 'Journey deleted successfully',
          color: 'green',
          position: 'top'
        })
        REMOVE_JOURNEY(delete_id)
      }
    } catch (error) {
      Notify.create({
        message: error?.response?.data?.message,
        color: 'red',
        position: 'top'
      })
    }
  }
  function resetPagination() {
    SET_PAGINATION(undefined)
  }
  return {
    journeys,
    pagination,
    PARTIAL_UPDATE,
    SET_ALL_JOURNEYS,
    PUSH_JOURNEY,
    REMOVE_JOURNEY,
    createJourney,
    fetchJourneys,
    updateJourney,
    deleteJourney,
    resetPagination
  }
})
