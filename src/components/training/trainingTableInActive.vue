<template>
  <div v-if="fetchlistTrainingsInActive" class="row">
    <div v-for="data in fetchlistTrainingsInActive" class="col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="data.id">
      <div class="q-pa-sm">
        <BoxFlashCard
          :expired="optionsFn(data.endDate)"
          :data="data"
          @copySignUpURL="copySignUpURL(data.id, data)"
          @updatePage="updateTraining(data.id)"
          @deleteTraining="deleteTraining(data.id)"
        />
      </div>
    </div>
  </div>
  <div v-if="Object.keys(trainingPaginationKeyForwardInActive).length > 0" class="text-center">
    <q-btn
      class="q-mt-sm"
      icon="keyboard_arrow_right"
      label="Load More"
      style="border: 2px solid white"
      @click="loadMoreTrainings(trainingPaginationKeyForwardInActive)"
    />
  </div>
</template>

<script setup>
import BoxFlashCard from 'components/training/BoxFlashCard'
import { Notify, copyToClipboard } from 'quasar'
import { DateValidations, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { useTrainingStore } from 'stores/training'
import { computed } from 'vue'

const emit = defineEmits(['updateTraining', 'deleteTraining'])
const trainingStore = useTrainingStore()

const trainingPaginationKeyForwardInActive = computed(() => trainingStore.paginationKeyInActive)
const fetchlistTrainingsInActive = computed(() => trainingStore.listTrainingInActive)

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
    .then(() => {
      Notify.create({
        message: 'Successfully Copied',
        color: 'green',
        position: 'top'
      })
    })
    .catch(() => {
      Notify.create({
        message: 'Not able to copy',
        color: 'red',
        position: 'top'
      })
    })
}
function loadMoreTrainings(pagination) {
  let data = {}
  if (Object.keys(pagination).length === 0) {
    data = {
      pagination: {},
      reset: false
    }
    trainingStore.fetchTrainingsInActive(data)
  } else {
    data = {
      pagination: {
        pagination: pagination
      },
      reset: false
    }
    if (trainingStore.searchByName && trainingStore.searchFire) {
      data.pagination.pk = 'instructor'
      data.pagination.query = trainingStore.searchByName
      trainingStore.searchTraining(data)
    } else {
      trainingStore.fetchTrainingsInActive(data)
    }
  }
}
</script>
<style lang="sass">
.sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
