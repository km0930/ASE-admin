<template>
  <Page :isCreateIcon="roleIsAdmin" :showSearch="false" isTable title="Delivery" @createPage="createMap({ show: true })">
    <q-item-section>
      <div class="flex items-center" style="width: 100%">
        <q-input
          v-model="search"
          class="q-ml-auto q-mb-md"
          color="white"
          dark
          dense
          input-class="text-right"
          outlined
          style="max-width: 15rem"
          @update:modelValue="updateSearch"
        >
          <template v-slot:append>
            <q-icon v-if="search?.length > 0" name="clear" class="cursor-pointer" @click="clearSearch" />
            <q-btn round dense flat icon="search" />
          </template>
        </q-input>
        <BaseSelect
          autofocus
          label="Family Plan *"
          :options="fetchPlanTypes"
          required
          v-model="plan_family"
          class="dropdown"
          :clearable="false"
          @update:modelValue="updatePlan"
        />
      </div>
    </q-item-section>
    <q-table
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      dark
      :rows="planList"
      hide-bottom
      row-key="index"
      :rows-per-page-options="[0]"
      style="max-height: 80vh"
      virtual-scroll
      :visible-columns="roleIsAdmin ? ['name', 'actions'] : ['name']"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section>
              <q-item-label class="portal_font_family portal_md portal_font_color">
                {{ props.row.plan_name.replace('plan - ', '').replace('addon - ', '') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="warning" flat icon="edit" round size="sm" @click="updateMap(props.row.plan_id, props.row)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="deleteMap(props.row.id, props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template v-slot:bottom-row>
        <q-td v-if="Object.keys(mapPaginationKeyForward).length" class="text-center" colspan="2">
          <q-btn icon="chevron_right" label="Load More" style="border: 2px solid" @click="loadMoreMap(mapPaginationKeyForward)" />
        </q-td>
      </template>
    </q-table>
  </Page>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import Page from 'src/components/shared/Page.vue'
import { useLoginStore, useMapStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const mapStore = useMapStore()
const loginStore = useLoginStore()
const emit = defineEmits(['createMap', 'updateMap', 'deleteMap'])

const columns = ref([
  { name: 'name', label: 'Name', field: 'plan_name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])
const plan_family = ref('Individual')
const search = ref('')

const filteredListMaps = computed(() =>
  mapStore.listMaps.filter((item) => item.plan_name.toLowerCase().includes(mapStore.search.toLowerCase()))
)
const mapPaginationKeyForward = computed(() => mapStore.paginationKey)
const searchByNameGetter = computed(() => mapStore.searchByName)
const searchFireActive = computed(() => mapStore.paginationKey)
const fetchPlanTypes = computed(() => mapStore.planTypes)
const fetchSelectedPlan = computed(() => mapStore.selectedPlan)
const planList = computed(() => filteredListMaps.value.filter((data) => data.plan_family === plan_family.value))
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

onMounted(() => {
  plan_family.value = fetchSelectedPlan.value
})

function createMap(event) {
  if (event.show) {
    emit('createMap', { show: true })
  }
}
function updateMap(id, row) {
  emit('updateMap', { show: true, id: id, rowData: row })
}
function deleteMap(id, row) {
  emit('deleteMap', { show: true, id: id, rowData: row })
}
function loadMoreMap(pagination) {
  const data = { pagination: {}, reset: false }
  if (Object.keys(pagination).length) {
    data.pagination = { last_value: pagination }
    if (searchByNameGetter.value && searchFireActive.value) {
      data.pagination.pk = 'map'
      data.pagination.query = searchByNameGetter.value
      mapStore.searchMap(data)
      return
    }
  }
  mapStore.fetchMaps(data)
}
function updatePlan() {
  mapStore.SELECTED_PLAN_TYPE(plan_family.value)
}
function updateSearch() {
  mapStore.SEARCH_BY_PLAN_NAME(search.value)
}
function clearSearch() {
  mapStore.SEARCH_BY_PLAN_NAME('')
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
.dropdown
  position: absolute,
  right: 10px,
  top: -50px,
</style>
