<template>
  <div>
    <ChallengeTable
      v-if="!isCreate"
      :title="'Challenge List'"
      :tableData="fetchListChallenges"
      @createPage="showCreateChallenge($event)"
      @solutionPage="showSolutionCard($event)"
      @vScriptPage="showValidatorScriptList($event)"
      @updatePage="showUpdateChallengeObject($event)"
      @deletePage="showChallengeObjectDelete($event)"
    />
    <template v-if="isCreate">
      <CreateChallenge :id="updateId" :show="isCreate" @onCancel="cancelCreateChallenge($event)" />
    </template>
    <template v-if="isSolutionCard">
      <SolutionCard :id="updateId" :show="isSolutionCard" @onCancel="cancelSolutionCard($event)" />
    </template>
    <template v-if="isValidatorScriptList">
      <ValidatorScriptList
        :id="updateId"
        :show="isValidatorScriptList"
        @onCreate="showCreateValidatorScript($event)"
        @onUpdate="showUpdateValidatorScript($event)"
        @onCancel="cancelValidatorScriptList($event)"
      />
    </template>
    <template v-if="isValidatorScript">
      <CreateValidatorScript :id="updateId" :data="updateData" :show="isValidatorScript" @onCancel="cancelValidatorScript($event)" />
    </template>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="'a Challenge'"
      @confirmDelete="challengeConfirmDeletion($event)"
      @confirmDeleteCancel="challengeConfirmDeleteCancel($event)"
    />
  </div>
</template>

<script setup>
import { useChallengeStore, useLabsStore } from 'app/src/stores'
import ChallengeTable from 'components/challenge_object/ChallengeTable'
import CreateChallenge from 'components/challenge_object/CreateChallenge'
import CreateValidatorScript from 'components/challenge_object/CreateValidatorScript'
import SolutionCard from 'components/challenge_object/SolutionCard'
import ValidatorScriptList from 'components/challenge_object/ValidatorScriptList'
import Delete from 'components/shared/Delete.vue'
import { computed, onBeforeMount, ref } from 'vue'

const challengeStore = useChallengeStore()
const labStore = useLabsStore()
const isCreate = ref(false)
const isSolutionCard = ref(false)
const isValidatorScript = ref(false)
const isValidatorScriptList = ref(false)
const updateData = ref({})
const updateId = ref('')
const isDelete = ref(false)
const challengeId = ref('')

onBeforeMount(async () => {
  if (fetchListChallenges.value.length === 0 && searchByNameGetter.value.length === 0 && !searchFireActive.value) {
    await challengeStore.fetchChallenges({ pagination: {}, reset: false })
  }
})

const fetchListChallenges = computed(() => (challengeStore.listChallenges.length > 0 ? [...new Set(challengeStore.listChallenges)] : []))
const searchByNameGetter = computed(() => challengeStore.searchByName)
const searchFireActive = computed(() => challengeStore.searchFire)

function showCreateChallenge(event) {
  labStore.addOptionsDocs([])
  updateId.value = ''
  challengeStore.errorMsgReset({
    status: true,
    company_name: false,
    company_name_msg: '',
    is_event: false,
    is_event_msg: '',
    num_users: false,
    num_users_msg: '',
    minutes_per_user: false,
    minutes_per_user_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    payment_complete: false,
    payment_complete_msg: '',
    domains: false,
    domains_msg: '',
    events: false,
    events_msg: '',
    is_poc: false,
    is_poc_msg: '',
    subscription_type: false,
    subscription_type_msg: ''
  })
  isCreate.value = event.show
}
async function showUpdateChallengeObject(event) {
  challengeStore.errorMsgReset({
    status: true,
    name: false,
    name_msg: '',
    description: false,
    description_msg: '',
    lab_id: false,
    lab_id_msg: '',
    approx_time: false,
    approx_time_msg: '',
    instructions: false,
    instructions_msg: '',
    nature: false,
    nature_msg: '',
    difficulty: false,
    difficulty_msg: '',
    learning_path_id: false,
    learning_path_id_msg: '',
    hints: false,
    hints_msg: '',
    tags: false,
    tags_msg: '',
    score: false,
    score_msg: '',
    is_active: false,
    is_active_msg: ''
  })
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      labStore.addOptionsDocs([])
      isCreate.value = true
      updateId.value = ''
      updateId.value = event.id
    }
  }
}
function showChallengeObjectDelete(event) {
  if (event.show) {
    challengeId.value = ''
    challengeId.value = event.id
    isDelete.value = true
  }
}
function cancelCreateChallenge() {
  isCreate.value = false
  isValidatorScriptList.value = false
  isValidatorScript.value = false
}
function showSolutionCard(event) {
  updateId.value = event.id
  isSolutionCard.value = true
}
function showValidatorScriptList(event) {
  console.log('123', event.id)
  updateId.value = event.id
  isValidatorScriptList.value = true
  isValidatorScript.value = false
}
function showCreateValidatorScript() {
  updateData.value = {}
  isValidatorScript.value = true
}
function showUpdateValidatorScript(event) {
  updateData.value = event
  isValidatorScript.value = true
}
function cancelSolutionCard() {
  isSolutionCard.value = false
}
function cancelValidatorScriptList() {
  isCreate.value = false
  isValidatorScriptList.value = false
  isValidatorScript.value = false
}
function cancelValidatorScript() {
  isCreate.value = false
  isValidatorScriptList.value = true
  isValidatorScript.value = false
}
function challengeConfirmDeletion(event) {
  if (event.show) {
    challengeStore.deleteChallenge({ challenge_id: challengeId.value })
    challengeId.value = ''
    isDelete.value = false
  }
}
function challengeConfirmDeleteCancel(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
      challengeId.value = ''
      return
    }
    isDelete.value = true
  }
}
</script>
