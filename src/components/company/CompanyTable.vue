<template>
  <section class="viewPages">
    <div class="row">
      <div class="col-6" style="padding: 1%">
        <q-btn size="md" color="primary" @click="createPage({ show: true })">Create</q-btn>
      </div>
      <div class="col-6" style="padding: 1%">
        <q-input
          bottom-slots
          class="q-ml-md float-right"
          dark
          dense
          label-color="white"
          outlined
          v-model="searchByName"
          @keydown.enter.prevent="searchData"
        >
          <template v-slot:append>
            <q-icon v-if="searchByName.length > 0" name="clear" class="cursor-pointer" @click="clearSearchData" />
            <q-btn round dense flat icon="search" @click="searchData" />
          </template>
        </q-input>
      </div>
    </div>

    <div v-if="companiesData" class="row">
      <div v-for="(data, index) in companiesData" class="col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="index">
        <div class="q-pa-sm full-height">
          <BoxView
            :data="data"
            :expired="optionsFn(data.endDate)"
            @copySignUpURL="copySignUpURL(data.id, data)"
            @showUpdateCourse="showUpdateCourse(data.id)"
            @updatePage="updatePage(data.id)"
            @viewCompanyInfo="viewCompanyInfo(data)"
          />
        </div>
      </div>
    </div>
    <p v-if="!isLoading && companiesData.length === 0" class="ase-black-light text-center text-h5 text-weight-bold">NO DATA</p>
    <div class="text-center" v-if="Object.keys(companyPaginationKeyForward).length > 0">
      <q-btn icon="chevron_right" label="Load More" style="border: 2px solid" @click="loadMoreCompany(companyPaginationKeyForward)" />
    </div>
  </section>
</template>

<script setup>
import BoxView from 'components/company/BoxFlashCard'
import { Notify, copyToClipboard } from 'quasar'
import { useCompanyStore } from 'src/stores'
import { DateValidations, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed } from 'vue'

const emit = defineEmits(['createPage', 'updatePage', 'viewCompanyInfo'])
// const props = defineProps({
//   title: { type: String, default: 'Header' },
//   tableData: { required: false }
// })

const companyStore = useCompanyStore()

const searchByName = computed({
  get: () => companyStore.searchByName,
  set: (value) => companyStore.SEARCH_BY_NAME(value)
})
const isLoading = computed(() => companyStore.loading)
const companiesData = computed(() => (companyStore.listCompanies.length > 0 ? [...new Set(companyStore.listCompanies)] : []))
const companyPaginationKeyForward = computed(() => companyStore.paginationKey)
const searchByNameGetter = computed(() => companyStore.searchByName)
const searchFireActive = computed(() => companyStore.searchFire)

function createPage(event) {
  if (event.show) {
    emit('createPage', { show: true })
  }
}
function optionsFn(date) {
  return DateValidations(new Date()).replaceAll('/', '-') > date
}
function updatePage(id) {
  emit('updatePage', { show: true, id: id })
}
function viewCompanyInfo(prop) {
  sessionStorage.setItem('companyInfo', JSON.stringify({}))
  emit('viewCompanyInfo', { show: true, prop: prop })
}
function loadMoreCompany(pagination) {
  const data = {
    pagination: {},
    reset: false
  }
  if (Object.keys(pagination).length === 0) {
    companyStore.fetchCompanies(data)
  } else {
    data.pagination = { pagination: pagination }
    if (searchByNameGetter.value && searchFireActive.value) {
      data.pagination.query = searchByNameGetter.value
      companyStore.searchCompanies(data)
    } else {
      data.pagination = { last_value: pagination }
      companyStore.fetchCompanies(data)
    }
  }
}
async function searchData() {
  const data = {
    pagination: {},
    reset: true
  }
  if (searchByNameGetter.value === ' ' || searchByNameGetter.value === '') {
    await companyStore.fetchCompanies(data)
  } else {
    data.pagination = { query: searchByNameGetter.value }
    await companyStore.searchCompanies(data)
  }
}
function clearSearchData() {
  companyStore.searchByNameAction('')
  companyStore.fetchCompanies({ pagination: {}, reset: true })
}
function copySignUpURL(id, rowData) {
  if (rowData.subscriptionType === 'Partner') {
    let urlPartner = `https://learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}`
    if (window.location.origin === 'https://uat.admin.appsecengineer.com') {
      urlPartner = `https://uat.learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}`
    } else if (window.location.origin === 'https://staging.admin.appsecengineer.com') {
      urlPartner = `https://staging.learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}`
    } else if (window.location.origin !== 'https://admin.appsecengineer.com') {
      urlPartner = `https://uat.learning.appsecengineer.com/signup/partner/${urlSafeBase64Encode(id)}`
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
  } else {
    let url = `https://learning.appsecengineer.com/signup/${urlSafeBase64Encode(id)}`
    if (window.location.origin === 'https://uat.admin.appsecengineer.com') {
      url = `https://uat.learning.appsecengineer.com/signup/${urlSafeBase64Encode(id)}`
    } else if (window.location.origin === 'https://staging.admin.appsecengineer.com') {
      url = `https://staging.learning.appsecengineer.com/signup/${urlSafeBase64Encode(id)}`
    } else if (window.location.origin !== 'https://admin.appsecengineer.com') {
      url = `https://uat.learning.appsecengineer.com/signup/${urlSafeBase64Encode(id)}`
    }
    copyToClipboard(url)
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
}
</script>

<style lang="sass" scoped>
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
