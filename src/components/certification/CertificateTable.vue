<template>
  <Page>
    <section class="flex items-center justify-between q-mb-lg">
      <div class="q-gutter-x-md">
        <q-btn v-if="roleIsAdmin" color="primary" label="Create" @click="createCertification({ show: true })" />
        <q-btn v-if="roleIsAdmin" color="primary" label="Descriptive Questions" @click="descriptiveQuestions({ show: true })" />
        <q-btn v-if="roleIsAdmin" color="primary" label="Projects" @click="openProject" />
      </div>
      <q-input
        clearable
        color="white"
        dark
        dense
        label-color="white"
        outlined
        v-model="searchByName"
        @keyup.enter="searchData"
        @clear="clearSearchData"
      >
        <template v-slot:append>
          <q-btn dense flat icon="search" round @click="searchData" />
        </template>
      </q-input>
    </section>

    <q-table
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      dark
      :rows="fetchListCertifications"
      hide-bottom
      row-key="index"
      :rows-per-page-options="[0]"
      style="max-height: 70vh"
      :table-header-style="{ backgroundColor: '#191919' }"
      virtual-scroll
      :visible-columns="roleIsAdmin ? ['name', 'actions'] : ['name']"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ props.row.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="positive" flat icon="leaderboard" round size="sm" @click="certificationReport(props.row)">
            <q-tooltip>Report</q-tooltip>
          </q-btn>
          <q-btn color="warning" flat icon="edit" round size="sm" @click="updateCertification(props.row)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="deleteCertification(props.row.sk)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div v-if="!isLoading && fetchListCertifications.length === 0" class="q-mt-sm text-center">
      <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
    </div>
    <div class="text-center" v-if="Object.keys(certificationPaginationKeyForward).length > 0">
      <q-btn
        icon="keyboard_arrow_right"
        label="Load More"
        style="border: 2px solid white; margin: 7px 0px"
        @click="loadMoreCertification(certificationPaginationKeyForward)"
      />
    </div>
  </Page>
</template>

<script setup>
import Page from 'components/shared/Page'
import { useCertificationStore, useLoginStore } from 'src/stores'
import { computed, ref } from 'vue'

const certificationStore = useCertificationStore()
const loginStore = useLoginStore()
const emit = defineEmits([
  'createCertification',
  'descriptiveQuestions',
  'certificationReport',
  'updateCertification',
  'deleteCertification',
  'openProject'
])

const columns = ref([
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])
const searchByName = computed({
  get: () => certificationStore.searchByName,
  set: (value) => certificationStore.SEARCH_BY_NAME(value)
})

const fetchListCertifications = computed(() => certificationStore.listCertification)
const searchByNameGetter = computed(() => certificationStore.searchByName)
const isLoading = computed(() => certificationStore.loading)
const certificationPaginationKeyForward = computed(() => certificationStore.paginationKey)
const searchFireActive = computed(() => certificationStore.searchFire)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

function createCertification(event) {
  if (event.show) {
    emit('createCertification', { show: true })
  }
}
function descriptiveQuestions(event) {
  if (event.show) {
    emit('descriptiveQuestions', { show: true })
  }
}
function certificationReport(data) {
  emit('certificationReport', { show: true, data })
}
function updateCertification(data) {
  emit('updateCertification', { show: true, id: data.sk, data: data })
}
function deleteCertification(id) {
  emit('deleteCertification', { show: true, id: id })
}
function loadMoreCertification(pagination) {
  const data = {
    pagination: {},
    reset: false
  }
  if (Object.keys(pagination).length !== 0) {
    data.pagination = { pagination: pagination }
    if (searchByNameGetter.value && searchFireActive.value) {
      data.pagination.pk = 'certification'
      data.pagination.query = searchByNameGetter.value
    }
  }
  certificationStore.fetchCertifications(data)
}
async function searchData() {
  const data = { pagination: {}, reset: true }
  if (searchByNameGetter.value === ' ' || searchByNameGetter.value === '') {
    await certificationStore.fetchCertifications(data)
  } else {
    data.pagination = { query: searchByNameGetter.value }
    await certificationStore.searchCertification(data)
  }
}
function clearSearchData() {
  certificationStore.searchByNameAction('')
  const data = { pagination: {}, reset: true }
  certificationStore.fetchCertifications(data)
}
function openProject() {
  emit('openProject', true)
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
