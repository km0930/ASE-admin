<template>
  <Page
    :isCreateIcon="roleIsAdmin"
    isTable
    title="Challenge"
    v-model:search="search"
    @clearSearchData="clearSearchData"
    @createPage="createPage"
    @searchData="searchData"
  >
    <q-table
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      dark
      hide-bottom
      row-key="index"
      :rows="tableData"
      :rows-per-page-options="[0]"
      style="max-height: 70vh"
      :table-header-style="{ backgroundColor: '#191919' }"
      virtual-scroll
      :visible-columns="roleIsAdmin ? ['name', 'actions'] : ['name']"
      v-if="props.tableData.length > 0"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section>
              <q-item-label class="portal_font_family portal_md portal_font_color">
                {{ props.row.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="positive" flat icon="lightbulb_outline" round size="sm" @click="solutionPage(props.row.sk)">
            <q-tooltip>Solution</q-tooltip>
          </q-btn>
          <q-btn color="blue" flat icon="code" round size="sm" @click="vScriptPage(props.row.sk)">
            <q-tooltip>Validator Script</q-tooltip>
          </q-btn>
          <q-btn color="warning" flat icon="edit" round size="sm" @click="updatePage(props.row.id || props.row.sk)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="deletePage(props.row.id || props.row.sk)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <h6 class="text-center" v-else>NO DATA</h6>
    <div class="text-center" v-if="Object.keys(challengePaginationKeyForward).length > 0">
      <q-btn
        icon="keyboard_arrow_right"
        label="Load More"
        style="border: 2px solid white; margin: 7px 0px"
        @click="loadMoreChallenges(challengePaginationKeyForward)"
      />
    </div>
  </Page>
</template>

<script setup>
import Page from 'components/shared/Page'
import { useChallengeStore, useLoginStore } from 'src/stores'
import { computed, ref } from 'vue'

const props = defineProps({
  tableData: { required: false }
})
const emit = defineEmits(['createPage', 'solutionPage', 'vScriptPage', 'updatePage', 'deletePage'])
const columns = ref([
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])
const search = ref('')

const loginStore = useLoginStore()
const challengeStore = useChallengeStore()

const roleIsAdmin = computed(() => loginStore.roleIsAdmin)
const challengePaginationKeyForward = computed(() => challengeStore.paginationKey || {})

function createPage(event) {
  if (event.show) {
    emit('createPage', { show: true })
  }
}
function solutionPage(id) {
  emit('solutionPage', { show: true, id })
}
function vScriptPage(id) {
  emit('vScriptPage', { show: true, id })
}
function updatePage(id) {
  emit('updatePage', { show: true, id })
}
function deletePage(id) {
  emit('deletePage', { show: true, id })
}
function loadMoreChallenges(pagination) {
  const data = {
    pagination: {},
    reset: false
  }
  if (Object.keys(pagination).length !== 0) {
    data.pagination = { last_value: pagination }
  }
  challengeStore.fetchChallenges(data)
}
function searchData(event) {
  const data = {
    pagination: { query: event },
    reset: true
  }
  challengeStore.fetchChallenges(data)
}
function clearSearchData() {
  const reset = ''
  challengeStore.searchByNameAction(reset)
  const data = {
    pagination: {},
    reset: true
  }
  challengeStore.fetchChallenges(data)
  search.value = ''
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
