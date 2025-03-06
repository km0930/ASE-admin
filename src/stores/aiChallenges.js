import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { aiChallengeApi } from 'src/boot/axios'
import axios2 from 'src/utils/instance'
import { ref } from 'vue'
import { showLoader } from '../utils/loader'

export const useAiChallengesStore = defineStore('aiChallenges', () => {
  const listAiChallenges = ref([])
  const challengeDetails = ref([])
  const filteredChallenges = ref([])
  const pageInfo = ref([])
  const isLoading = ref(false)

  async function fetchAiChallenges(payload) {
    showLoader(true)
    await aiChallengeApi
      .get(`admin/custom-challenges?page=${payload.page}`)
      .then((res) => {
        pageInfo.value = res.data
        if (payload.reset) {
          listAiChallenges.value = res.data.data
        } else {
          listAiChallenges.value.push(...res.data.data)
        }
      })
      .finally(() => showLoader(false))
  }
  async function generateAiChallenges(payload) {
    isLoading.value = true
    await aiChallengeApi
      .post('admin/custom-challenge/generate', payload)
      .then((res) => {
        challengeDetails.value = res.data.data
      })
      .catch((error) => {
        Notify.create({
          color: 'negative',
          message: Object.keys(error.response.data.message)[0] + ': ' + Object.values(error.response.data.message)[0],
          position: 'top'
        })
        throw error
      })
      .finally(() => {
        isLoading.value = false
      })
  }
  async function saveAiChallenges(payload) {
    await aiChallengeApi.post('admin/custom-challenges', payload).then((res) => {
      listAiChallenges.value.unshift(res.data.data)
    })
  }
  async function deleteAiChallenges(payload) {
    showLoader(true)
    await aiChallengeApi
      .delete('admin/custom-challenges/', {
        data: payload
      })
      .finally(() => showLoader(false))
  }
  async function filterAiChallenges(payload) {
    showLoader(true)
    await aiChallengeApi
      .get('admin/custom-challenges', {
        params: {
          language: payload.language,
          framework: payload.framework,
          difficulty: payload.difficulty
        }
      })
      .then((res) => {
        filteredChallenges.value = res.data.data.map((challenge) => {
          return {
            ...challenge,
            value: challenge._key,
            label: challenge.name
          }
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => showLoader(false))
  }
  async function attachAiChallenges(payload) {
    showLoader(true)
    await axios2.post('aiquiz/create', payload).finally(() => showLoader(false))
  }
  return {
    listAiChallenges,
    challengeDetails,
    filteredChallenges,
    pageInfo,
    isLoading,
    fetchAiChallenges,
    generateAiChallenges,
    saveAiChallenges,
    deleteAiChallenges,
    filterAiChallenges,
    attachAiChallenges
  }
})
