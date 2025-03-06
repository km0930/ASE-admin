<template>
  <div class="q-mb-sm q-pa-sm">
    <q-btn size="md" color="primary" @click="createPartner({ show: true })">Create</q-btn>
  </div>
  <div v-if="fetchlistPartners.length" class="row">
    <div v-for="data in fetchlistPartners" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="data.id">
      <div class="q-pa-sm">
        <BoxFlashCard
          :data="data"
          :expired="optionsFn(data.endDate)"
          @copySignUpURL="copySignUpURL(data.id, data)"
          @deletePartner="deletePartner(data.id)"
          @updatePage="updatePartner(data.id)"
        />
      </div>
    </div>
  </div>
  <h3 v-else class="text-center">No Data</h3>
  <div class="text-center" v-if="Object.keys(partnerPaginationKeyForward).length > 0">
    <q-btn
      label="Load More"
      icon="keyboard_arrow_right"
      style="border: 2px solid white; margin: 7px 0px"
      @click="loadMorePartners(partnerPaginationKeyForward)"
    />
  </div>
</template>

<script setup>
import BoxFlashCard from 'components/partner/BoxFlashCard'
import { Notify, copyToClipboard } from 'quasar'
import { DateValidations, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { usePartnerStore } from 'stores/partner'
import { computed } from 'vue'

const emit = defineEmits(['createPartner', 'updatePartner', 'deletePartner'])
const partnerStore = usePartnerStore()

const fetchlistPartners = computed(() => partnerStore.listPartners)
const partnerPaginationKeyForward = computed(() => partnerStore.paginationKey)

function createPartner(event) {
  if (event.show) {
    emit('createPartner', { show: true })
  }
}
function updatePartner(id) {
  emit('updatePartner', { show: true, id: id })
}
function copySignUpURL(id, rowData) {
  let urlPartner = `https://learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(rowData.name)}`
  if (window.location.origin === 'https://uat.admin.appsecengineer.com') {
    urlPartner = `https://uat.learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(rowData.name)}`
  } else if (window.location.origin === 'https://staging.admin.appsecengineer.com') {
    urlPartner = `https://staging.learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(
      rowData.name
    )}`
  } else if (window.location.origin !== 'https://admin.appsecengineer.com') {
    urlPartner = `https://uat.learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(rowData.name)}`
  }
  copyToClipboard(urlPartner)
    .then(() => {
      Notify.create({ message: 'Successfully Copied', color: 'green', position: 'top' })
    })
    .catch(() => {
      Notify.create({ message: 'Not able to copy', color: 'red', position: 'top' })
    })
}
function deletePartner(id) {
  emit('deletePartner', { show: true, id: id })
}
function loadMorePartners(pagination) {
  let data = {}
  if (Object.keys(pagination).length === 0) {
    data = {
      pagination: {},
      reset: false
    }
    partnerStore.fetchPartners(data)
  } else {
    data = {
      pagination: {
        pagination: pagination
      },
      reset: false
    }
    if (partnerStore.searchByName && partnerStore.searchFire) {
      data.pagination.pk = 'instructor'
      data.pagination.query = partnerStore.searchByName
      partnerStore.searchPartner(data)
    } else {
      partnerStore.fetchPartners(data)
    }
  }
}
function optionsFn(date) {
  return date >= DateValidations(new Date()).replaceAll('/', '-')
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
