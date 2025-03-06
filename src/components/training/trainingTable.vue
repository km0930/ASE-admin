<template>
  <div class="q-mb-sm q-pa-sm">
    <q-btn color="primary" @click="createTraining({ show: true })">Create</q-btn>
  </div>
  <div v-if="fetchlistTrainings" class="row">
    <div v-for="data in fetchlistTrainings" class="col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="data.id">
      <div class="q-pa-sm">
        <BoxFlashCard
          :data="data"
          :expired="optionsFn(data.endDate)"
          @copySignUpURL="copySignUpURL(data.id, data)"
          @updatePage="updateTraining(data.id)"
          @showUpdateCourse="updateTraining(data.id)"
          @showDeleteTraining="deleteTraining(data.id)"
        />
      </div>
    </div>
  </div>
  <div v-if="Object.keys(trainingPaginationKeyForward).length > 0" class="text-center">
    <q-btn
      icon="keyboard_arrow_right"
      label="Load More"
      style="border: 2px solid white"
      @click="loadMoreTrainings(trainingPaginationKeyForward)"
    />
  </div>
</template>

<script setup>
import BoxFlashCard from 'components/training/BoxFlashCard'
import { Notify, copyToClipboard } from 'quasar'
import { DateValidations, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useTrainingStore } from 'stores/training'
import { computed } from 'vue'

const emit = defineEmits(['createTraining', 'updateTraining', 'deleteTraining'])

const trainingStore = useTrainingStore()

const fetchlistTrainings = computed(() => trainingStore.listTraining)
const trainingPaginationKeyForward = computed(() => trainingStore.paginationKey)

function createTraining(event) {
  if (event.show) {
    emit('createTraining', { show: true })
  }
}
function updateTraining(id) {
  emit('updateTraining', { show: true, id: id })
}
function deleteTraining(id) {
  emit('deleteTraining', { show: true, id: id })
}
function optionsFn(date) {
  return date >= DateValidations(new Date()).replaceAll('/', '-')
}
function copySignUpURL(id, rowData) {
  let urlPartner = `https://learning.appsecengineer.com/signup/training/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(rowData.name)}`
  if (window.location.origin === 'https://uat.admin.appsecengineer.com') {
    urlPartner = `https://uat.learning.appsecengineer.com/signup/training/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(rowData.name)}`
  } else if (window.location.origin === 'https://staging.admin.appsecengineer.com') {
    urlPartner = `https://staging.learning.appsecengineer.com/signup/training/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(
      rowData.name
    )}`
  } else if (window.location.origin !== 'https://admin.appsecengineer.com') {
    urlPartner = `https://uat.learning.appsecengineer.com/signup/training/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(rowData.name)}`
  }
  copyToClipboard(urlPartner)
    .then(() => Notify.create({ message: 'Successfully Copied', color: 'green', position: 'top' }))
    .catch(() => Notify.create({ message: 'Not able to copy', color: 'red', position: 'top' }))
}
function loadMoreTrainings(pagination) {
  let data = {}
  if (Object.keys(pagination).length === 0) {
    data = {
      last_value: {},
      reset: false
    }
    trainingStore.fetchTrainings(data)
  } else {
    data = {
      pagination: {
        last_value: pagination
      },
      reset: false
    }
    if (trainingStore.searchByName && trainingStore.searchFire) {
      data.pagination.pk = 'instructor'
      data.pagination.query = trainingStore.searchByName
      trainingStore.searchTraining(data)
    } else {
      trainingStore.fetchTrainings(data)
    }
  }
}
</script>
