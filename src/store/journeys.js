import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'

export default {
  namespaced: true,
  state: {
    journeys: [],
    pagination: undefined
  },
  mutations: {
    SET_ALL_JOURNEYS(state, data) {
      state.journeys = data ?? []
    },
    PUSH_JOURNEY(state, data) {
      state.journeys.push(...data)
    },
    REMOVE_JOURNEY(state, id) {
      state.journeys = state.journeys?.filter((journey) => {
        return journey.sk !== id
      })
    },
    PARTIAL_UPDATE(state, data) {
      const obj = state.journeys?.find((journey) => journey.sk === data.sk)
      if (obj) {
        const keys = Object.keys(data?.payload ?? {})
        keys.forEach((key) => {
          obj[key] = data.payload[key]
        })
      }
    },
    SET_PAGINATION(state, data) {
      state.pagination = data
    }
  },
  actions: {
    async createJourney({ commit }, payload) {
      try {
        const res = await axios.post(`${config.baseURLApi}journey`, payload)
        if (res.data.success) {
          commit('PUSH_JOURNEY', [res.data?.data])
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
    },
    async fetchJourneys({ commit }, payload) {
      try {
        const res = await axios.post(`${config.baseURLApi}journey/search`, payload)
        if (res.data.success) {
          commit('SET_PAGINATION', res.data?.data?.pagination)
          if (payload.pagination) {
            commit('PUSH_JOURNEY', res.data?.data?.data)
          } else {
            commit('SET_ALL_JOURNEYS', res.data?.data?.data)
          }
        }
      } catch (error) {
        Notify.create({
          message: error?.response?.data?.message,
          color: 'red',
          position: 'top'
        })
      }
    },
    async updateJourney({ commit }, payload) {
      try {
        const journey_id = payload?.sk
        const res = await axios.patch(`${config.baseURLApi}journey/${journey_id}`, payload)
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
    },
    async deleteJourney({ commit }, delete_id) {
      try {
        const res = await axios.delete(`${config.baseURLApi}journey/${delete_id}`)
        if (res.data.success) {
          Notify.create({
            message: 'Journey deleted successfully',
            color: 'green',
            position: 'top'
          })
          commit('REMOVE_JOURNEY', delete_id)
        }
      } catch (error) {
        Notify.create({
          message: error?.response?.data?.message,
          color: 'red',
          position: 'top'
        })
      }
    },
    resetPagination({ commit }) {
      commit('SET_PAGINATION', undefined)
    }
  },
  getters: {
    allJourneys: (state) => state.journeys,
    pagination: (state) => state.pagination
  }
}
