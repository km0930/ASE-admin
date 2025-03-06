<template>
  <div v-if="fetchlistInActivePartners" class="row">
    <div v-for="data in fetchlistInActivePartners" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="data.id">
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
  <div class="text-center" v-if="Object.keys(partnerPaginationKeyInActiveForward).length > 0">
    <q-btn
      icon="keyboard_arrow_right"
      label="Load More"
      style="border: 2px solid white; margin: 7px 0px"
      @click="loadMorePartners(partnerPaginationKeyInActiveForward)"
    />
  </div>
</template>

<script setup>
import BoxFlashCard from 'components/partner/BoxFlashCard'
import { Notify, copyToClipboard } from 'quasar'
import { DateValidations, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { usePartnerStore } from 'stores/partner'
import { computed } from 'vue'

const emit = defineEmits(['updatePartner', 'deletePartner'])
const partnerStore = usePartnerStore()

const partnerPaginationKeyInActiveForward = computed(() => partnerStore.paginationKeyInActive)
const fetchlistInActivePartners = computed(() => partnerStore.listInActivePartners)

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
  const data = {
    pagination: {},
    reset: false
  }
  if (Object.keys(pagination).length === 0) {
    partnerStore.fetchInActivePartners(data)
  } else {
    data.pagination = {
      pagination: pagination
    }
    if (partnerStore.searchByName && partnerStore.searchFire) {
      data.pagination.pk = 'instructor'
      data.pagination.query = partnerStore.searchByName
      partnerStore.searchPartnerInActive(data)
    } else {
      partnerStore.fetchInActivePartners(data)
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
