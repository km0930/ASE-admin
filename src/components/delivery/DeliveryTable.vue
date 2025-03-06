<template>
  <Page
    :isCreateIcon="roleIsAdmin"
    isTable
    v-model:search="search"
    title="Delivery"
    @clearSearchData="clearSearchData"
    @createPage="createNewDelivery"
    @searchData="searchData"
  >
    <q-table
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      dark
      :rows="fetchlistDelivery"
      hide-bottom
      row-key="id"
      :rows-per-page-options="[0]"
      style="max-height: 75vh"
      :table-header-style="{ backgroundColor: '#191919' }"
      :visible-columns="roleIsAdmin ? ['title', 'actions'] : ['title']"
      virtual-scroll
    >
      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          <q-item style="max-width: 420px">
            <q-item-section avatar v-if="props.row.logo">
              <q-avatar>
                <img :src="props.row.logo" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="portal_font_family portal_md portal_font_color">
                {{ props.row.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="warning" flat icon="edit" round size="sm" @click="updateDelivery(props.row)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="deleteDelivery(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:bottom-row>
        <q-tr v-if="fetchlistDelivery.length < totalDeliveries">
          <q-td :colspan="2" style="padding: 0">
            <q-separator dark />
            <div class="q-pa-md text-center">
              <q-btn icon="chevron_right" label="Load More" style="border: 2px solid white" @click="loadMoreDeliveries" />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </Page>
</template>

<script setup>
import Page from 'components/shared/Page'
import { useDeliveryStore, useLoginStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['createNewDelivery', 'updateDelivery', 'deleteDelivery'])

const columns = [
  { name: 'title', label: 'Title', field: 'title', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
]
const search = ref('')
const deliveryStore = useDeliveryStore()
const loginStore = useLoginStore()

const fetchlistDelivery = computed(() => (deliveryStore.listDelivery.length > 0 ? [...new Set(deliveryStore.listDelivery)] : []))
const totalDeliveries = computed(() => deliveryStore.totalDeliveries)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

onMounted(async () => {
  await deliveryStore.fetchDeliveries({ pagination: { length: 80, startIndex: 0 } })
})

function createNewDelivery(event) {
  if (event.show) {
    emit('createNewDelivery', { show: true })
  }
}
function updateDelivery(row) {
  emit('updateDelivery', { show: true, row: row })
}
function deleteDelivery(row) {
  emit('deleteDelivery', { show: true, row: row })
}
async function loadMoreDeliveries() {
  const data = {
    pagination: {
      length: 80,
      startIndex: fetchlistDelivery.value.length,
      search_term: search.value
    }
  }
  await deliveryStore.fetchDeliveries(data)
}
async function searchData(query) {
  search.value = query
  const payload = {
    pagination: { length: 80, search_term: query },
    reset: true
  }
  await deliveryStore.fetchDeliveries(payload)
}
async function clearSearchData() {
  const data = {
    pagination: {
      length: 80,
      startIndex: 0
    }
  }
  await deliveryStore.fetchDeliveries(data)
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
