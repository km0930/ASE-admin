<template>
  <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab" @click="tabInfo">
    <q-tab name="activeTrainings" label="Active" />
    <q-tab name="inActiveTrainings" label="Expired" />
  </q-tabs>
  <q-separator dark />
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel class="bg-dark text-white" dark name="activeTrainings">
      <TrainingTable
        @createTraining="showCreateTraining($event)"
        @deleteTraining="showDeleteTraining($event)"
        @updateTraining="showUpdateTraining($event)"
      />
    </q-tab-panel>
    <q-tab-panel class="bg-dark text-white" dark name="inActiveTrainings">
      <TrainingTableInActive
        @createTraining="showCreateTraining($event)"
        @deleteTraining="showDeleteTraining($event)"
        @updateTraining="showUpdateTraining($event)"
      />
    </q-tab-panel>
  </q-tab-panels>

  <CreateTraining
    v-if="isCreate && !isDelete"
    :id="updateId"
    v-model:name="typeCreate"
    :show="isCreate"
    @onCancel="cancelCreateTraining($event)"
  />
  <Delete
    v-if="isDelete"
    :show="isDelete"
    :header="'a Training'"
    @confirmDelete="trainingConfirmDeletion($event)"
    @confirmDeleteCancel="trainingConfirmDeleteCancel($event)"
  />
</template>

<script setup>
import Delete from 'components/shared/Delete.vue'
import CreateTraining from 'components/training/CreateTraining'
import TrainingTable from 'components/training/TrainingTable'
import TrainingTableInActive from 'components/training/TrainingTableInActive'
import { useTrainingStore } from 'stores/training'
import { computed, onMounted, ref } from 'vue'

const trainingStore = useTrainingStore()

const tab = ref('activeTrainings')
const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const typeCreate = ref('')
const trainingID = ref('')

const fetchlistTrainings = computed(() => trainingStore.listTraining)
const searchByNameGetter = computed(() => trainingStore.searchByName)
const plansOptionsGetter = computed(() => (trainingStore.plansOptions.length > 0 ? [...new Set(trainingStore.plansOptions)] : []))
const fetchlistTrainingsInActive = computed(() => trainingStore.listTrainingInActive)

onMounted(() => {
  if (fetchlistTrainings.value.length === 0 && searchByNameGetter.value.length === 0) {
    const data = {
      pagination: {},
      reset: true
    }
    trainingStore.fetchTrainings(data)
  }
  if (plansOptionsGetter.value.length === 0) {
    trainingStore.fetchplansOptions({})
  }
})

const showCreateTraining = (event) => {
  const errorMsgs = {
    partner_name: false,
    partner_name_msg: '',
    plans: false,
    plans_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    num_users: false,
    num_users_msg: '',
    domains: false,
    domains_msg: '',
    minutes_per_user: false,
    minutes_per_user_msg: ''
  }
  trainingStore.errorMsgReset(errorMsgs)
  if (event.show) {
    isCreate.value = !isCreate.value
    if (isCreate.value) {
      updateId.value = ''
    }
  }
}
const showUpdateTraining = async (event) => {
  const errorMsgs = {
    training_name: false,
    training_name_msg: '',
    plans: false,
    plans_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    num_users: false,
    num_users_msg: '',
    minutes_per_user: false,
    minutes_per_user_msg: '',
    domains: false,
    domains_msg: ''
  }
  trainingStore.errorMsgReset(errorMsgs)
  if (event.show) {
    isCreate.value = !isCreate.value
    if (isCreate.value) {
      updateId.value = event.id
      // await trainingStore.fetchTraining({ training_id: event.id })
    }
  }
}
const showDeleteTraining = (event) => {
  if (event.show) {
    isDelete.value = !isDelete.value
    if (isDelete.value) {
      trainingID.value = event.id
    }
  }
}
const tabInfo = () => {
  if (tab.value === 'inActiveTrainings' && fetchlistTrainingsInActive.value.length === 0) {
    trainingStore.fetchTrainingsInActive({
      pagination: {},
      reset: false
    })
  }
}
const trainingConfirmDeletion = (event) => {
  if (event.show) {
    trainingStore.deleteTraining({ training_id: trainingID.value })
    isDelete.value = false
  }
}
const trainingConfirmDeleteCancel = (event) => {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
const cancelCreateTraining = (event) => {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
