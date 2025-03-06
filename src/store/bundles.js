import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

export default {
  namespaced: true,
  state: { bundles: [], isLoading: false },
  mutations: {
    IS_LOADING(state, value) {
      state.isLoading = value
      showLoader(value)
    },
    SET_ALL_BUNDLES(state, data) {
      state.bundles = data
    },
    PUSH_ITEM(state, data) {
      state.bundles.push(data)
    },
    PARTIAL_UPDATE(state, data) {
      state.bundles.forEach((item, index) => {
        if (item.sk === data.bundle_id) {
          Object.keys(data).forEach((key) => {
            state.bundles[index][key] = data[key]
          })
        }
      })
    },
    TEMP_REMOVE(state, data) {
      state.bundles = state.bundles.filter((item) => item.sk !== data.bundle_id)
    }
  },
  actions: {
    async createBundle({ commit }, payload) {
      try {
        commit('IS_LOADING', true)
        const res = await axios.post(`${config.baseURLApi}bundles`, payload)
        if (res.data.success) {
          commit('PUSH_ITEM', res.data.data)
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
        commit('IS_LOADING', false)
      }
    },

    async searchAllBundle({ commit }) {
      try {
        commit('IS_LOADING', true)
        const res = await axios.post(`${config.baseURLApi}bundles/search`)
        res.data.success && commit('SET_ALL_BUNDLES', res.data.data.data)
      } catch (error) {
      } finally {
        commit('IS_LOADING', false)
      }
    },

    async updateBundle({ commit }, payload) {
      const bundle_id = payload.bundle_id
      delete payload.bundle_id
      try {
        commit('IS_LOADING', true)
        const res = await axios.patch(`${config.baseURLApi}bundles/${bundle_id}`, payload)
        if (res.data.success) {
          commit('PARTIAL_UPDATE', { ...payload, bundle_id })
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
        commit('IS_LOADING', false)
      }
    },

    async deleteBundle({ commit }, payload) {
      try {
        commit('IS_LOADING', true)
        const res = await axios.delete(`${config.baseURLApi}bundles/${payload.bundle_id}`, {
          data: payload
        })
        if (res.data.success) {
          commit('TEMP_REMOVE', payload)
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
        commit('IS_LOADING', false)
      }
    }
  },

  getters: {
    allBundles(state) {
      return state.bundles
    },
    fetchBundlesName(state) {
      return state.bundles.map((data) => ({ value: data.sk, label: data.bundle_name, course_maps: data.course_maps }))
    }
  }
}
