<template>
  <Page
    :isCreateIcon="roleIsAdmin"
    isTable
    v-model:search="searchByName"
    title="Instructor"
    @clearSearchData="clearSearchData"
    @createPage="createInstructor($event)"
    @searchData="searchData"
  >
    <q-table
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      dark
      hide-bottom
      row-key="index"
      :rows="fetchlistInstructors"
      :rows-per-page-options="[0]"
      style="max-height: 70vh"
      virtual-scroll
      :visible-columns="roleIsAdmin ? ['instructor_name', 'actions'] : ['instructor_name']"
    >
      <template v-slot:body-cell-instructor_name="props">
        <q-td :props="props">
          <q-item style="max-width: 420px">
            <q-item-section avatar v-if="props.row.photo">
              <q-avatar>
                <img :src="props.row.photo" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-white text-subtitle2">
                {{ props.row.instructor_name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="warning" flat icon="edit" round size="sm" @click="updateInstructor(props.row.id)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="deleteInstructor(props.row.id)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:bottom-row>
        <q-tr v-if="Object.keys(instructorPaginationKeyForward).length > 0">
          <q-td :colspan="2" style="padding: 0">
            <q-separator dark />
            <div class="q-pa-md text-center">
              <q-btn
                icon="chevron_right"
                label="Load More"
                style="border: 2px solid white"
                @click="loadMoreInstructors(instructorPaginationKeyForward)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <template v-if="!isLoading && fetchlistInstructors.value?.length === 0">
      <div class="q-mt-sm text-center">
        <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
      </div>
    </template>
  </Page>
</template>

<script setup>
import Page from 'components/shared/Page'
import { useInstructorStore, useLoginStore } from 'src/stores'
import { computed, ref } from 'vue'

const emit = defineEmits(['createInstructor', 'updateInstructor', 'deleteInstructor'])
const instructorStore = useInstructorStore()
const loginStore = useLoginStore()

// const pagination = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 8 })
const columns = ref([
  { name: 'instructor_name', label: 'Name', field: 'instructor_name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])

const searchByNameGetter = computed(() => instructorStore.searchByName)
const searchFireActive = computed(() => instructorStore.searchFire)
const fetchlistInstructors = computed(() => instructorStore.listInstructors)
const isLoading = computed(() => instructorStore.loading)
const instructorPaginationKeyForward = computed(() => instructorStore.paginationKey)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)
const searchByName = computed({
  get() {
    return instructorStore.searchByName
  },
  set(value) {
    instructorStore.SEARCH_BY_NAME(value)
  }
})

function createInstructor(event) {
  if (event.show) {
    emit('createInstructor', { show: true })
  }
}
function updateInstructor(id) {
  emit('updateInstructor', { show: true, id: id })
}
function deleteInstructor(id) {
  emit('deleteInstructor', { show: true, id: id })
}
function loadMoreInstructors(pagination) {
  const data = {
    pagination: {},
    reset: false
  }
  if (Object.keys(pagination).length !== 0) {
    data.pagination = { pagination: pagination }
    if (searchByNameGetter.value && searchFireActive.value) {
      data.pagination.pk = 'instructor'
      data.pagination.query = searchByNameGetter.value
    }
  }
  instructorStore.fetchInstructors(data)
}
async function searchData() {
  if (searchByNameGetter.value === ' ' || searchByNameGetter.value === '') {
    const data = {
      pagination: {},
      reset: true
    }
    await instructorStore.fetchInstructors(data)
  } else {
    const data = {
      pagination: { pk: 'instructor', query: searchByNameGetter.value },
      reset: true
    }
    await instructorStore.searchInstructor(data)
  }
}
function clearSearchData() {
  instructorStore.searchByNameAction('')
  const data = { pagination: {}, reset: true }
  instructorStore.fetchInstructors(data)
}
</script>

<style lang="sass">
.sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    background-color: #191919
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
