import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'

const state = {
  tags: [],
  isLoading: false
}

const mutations = {
  SET_TAG_LIST(state, data) {
    state.tags = data
  },
  PUSH_SINGLE_ITEM(state, data) {
    state.tags.push(data)
  },
  SET_LOADING(state, data) {
    state.isLoading = data
    showLoader(data)
  },
  TEMP_REMOVE(state, data) {
    state.tags = state.tags.filter((item) => item.sk !== data.tag_id)
  },
  PARTIAL_UPDATE(state, data) {
    state.tags.forEach((item) => {
      if (item.sk === data.tag_id) {
        item.search_name = data.payload.tag_name
        item.tag_name = data.payload.tag_name
      }
    })
  }
}

const actions = {
  async getTagList({ commit }, payload) {
    try {
      commit('SET_LOADING', true)
      const res = await axios.post(`${config.baseURLApi}tags/search`, payload)
      res.data.success && commit('SET_TAG_LIST', res.data.data.data)
    } catch (err) {
      console.log(err)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async createTag({ commit }, payload) {
    try {
      commit('SET_LOADING', true)
      const res = await axios.post(`${config.baseURLApi}tags`, payload)
      if (res.data.success) {
        commit('PUSH_SINGLE_ITEM', res.data.data)
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
      commit('SET_LOADING', false)
    }
  },
  async updateTag({ commit }, data) {
    try {
      commit('SET_LOADING', true)
      const res = await axios.patch(`${config.baseURLApi}tags/${data.tag_id}`, data.payload)
      if (res.data.success) {
        commit('PARTIAL_UPDATE', data)
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
      commit('SET_LOADING', false)
    }
  },
  async deleteTag({ commit }, payload) {
    try {
      commit('SET_LOADING', true)
      const res = await axios.delete(`${config.baseURLApi}tags/${payload.tag_id}`)
      if (res.data.success) {
        commit('TEMP_REMOVE', payload)
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
      commit('SET_LOADING', false)
    }
  }
}
const getters = {
  fetchTagList: (state) => {
    return state.tags
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
