<template>
  <section>
    <TrainingUsers
      v-if="!isCreate && !isDelete"
      :data="getTrainingUsersList"
      @createUser="showCreateUser"
      @issueCertificate="sendCertificateFn"
      @removeUser="showDeleteUser"
    />
    <create-user v-if="isCreate && !isDelete" :id="updateId" :show="isCreate" @onCacel="cancelCreateUser($event)">
      {{ title }}
    </create-user>
    <Delete
      v-if="isDelete"
      :header="'a user from event'"
      :show="isDelete"
      @confirmDelete="userConfirmDeletion($event)"
      @confirmDeleteCancel="userConfirmDeleteCancel($event)"
    />
  </section>
</template>

<script setup>
import CreateUser from 'components/aseUser/CreateUserTraining'
import TrainingUsers from 'components/aseUser/usersListTraining'
import Delete from 'components/shared/Delete.vue'
import { useTrainingStore, useUsersStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const userID = ref('')
const title = ref('Create Users')
const route = useRoute()

const usersStore = useUsersStore()
const trainingStore = useTrainingStore()

onMounted(async () => {
  await usersStore.fetchTrainingList({
    pagination: {
      training_id: urlSafeBase64Decode(route.params.eventId)
    },
    reset: true
  })
})

function showCreateUser(event) {
  trainingStore.errorMsgResetUser({
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: ''
  })
  isCreate.value = event.show ? !isCreate.value : isCreate.value
  updateId.value = ''
}
function showDeleteUser(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
    userID.value = isDelete.value ? event.info.email : ''
  }
}
async function userConfirmDeletion(event) {
  if (!event.show) return
  const data = {
    training_id: urlSafeBase64Decode(route.params.eventId),
    email: userID.value
  }
  await trainingStore.removeStatusUserTraining(data)
  if (fetchStatusOfApi.value) {
    await usersStore.fetchTrainingList({
      pagination: {
        training_id: urlSafeBase64Decode(route.params.eventId)
      },
      reset: true
    })
  }
  isDelete.value = false
}
function userConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
function cancelCreateUser(event) {
  if (event.show) {
    isCreate.value = false
  }
}
function sendCertificateFn() {
  const data = {
    training_id: urlSafeBase64Decode(route.params.eventId)
  }
  trainingStore.sendCertificate(data)
}

const getTrainingUsersList = computed(() => usersStore.trainingList)
const fetchStatusOfApi = computed(() => trainingStore.statusOfApi)
</script>
