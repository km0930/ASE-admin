<template>
  <MapTable
    v-if="!isCreate && !isDelete"
    @createMap="showCreateMap($event)"
    @deleteMap="showDeleteMap($event)"
    @updateMap="showUpdateMap($event)"
  />
  <CreateMap
    v-if="isCreate && !isDelete"
    :id="updateId"
    :rowData="mapRow"
    :show="isCreate"
    v-model:name="typeCreate"
    @onCancel="cancelCreateMap($event)"
  />
  <Delete
    v-if="isDelete"
    header="Map"
    :show="isDelete"
    @confirmDelete="mapConfirmDeletion($event)"
    @confirmDeleteCancel="mapConfirmDeleteCancel($event)"
  />
</template>

<script setup>
import { useMapStore } from 'app/src/stores'
import CreateMap from 'components/map/CreateMap'
import MapTable from 'components/map/MapTable'
import Delete from 'components/shared/Delete.vue'
import { computed, onMounted, ref } from 'vue'

const mapStore = useMapStore()

const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const typeCreate = ref('')
const mapID = ref('')
const mapRow = ref({})

const fetchlistMaps = computed(() => mapStore.listMaps)
const searchByNameGetter = computed(() => mapStore.searchByName)
const fetchlistEvents = computed(() => mapStore.listEvents)

onMounted(async () => {
  if (fetchlistMaps.value.length === 0 && searchByNameGetter.value.length === 0) {
    const data = { pagination: {}, reset: false }
    mapStore.fetchMaps(data)
  }
})

async function showCreateMap(event) {
  const errorMsgs = {
    plan_name: false,
    plan_name_msg: '',
    event: false,
    event_msg: ''
  }
  mapStore.errorMsgReset(errorMsgs)
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      isCreate.value = true
      updateId.value = ''
    }
    if (fetchlistEvents.value.length === 0) {
      const data = { pagination: {}, reset: true }
      mapStore.fetchEventOptions(data)
    }
    mapStore.fetchPlanOptions({})
  }
}

async function showUpdateMap(event) {
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      updateId.value = event.id
      const data = { plan_id: event.id }
      await mapStore.fetchMap(data)
      isCreate.value = true
    }
  }
  if (fetchlistEvents.value.length === 0) {
    const data = { pagination: {}, reset: true }
    await mapStore.fetchEventOptions(data)
  }
  await mapStore.fetchPlanOptions({ _a: '' })

  const errorMsgs = {
    plan_name: false,
    plan_name_msg: '',
    events: false,
    events_msg: ''
  }
  mapStore.errorMsgReset(errorMsgs)
}

function showDeleteMap(event) {
  mapRow.value = event.rowData
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      mapID.value = ''
      mapID.value = event.id
    }
  }
}

function mapConfirmDeletion(event) {
  if (event.show) {
    const data = { plan_id: mapRow.value.plan_id }
    mapStore.deleteMap(data)
    isDelete.value = false
  }
}

function mapConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}

function cancelCreateMap(event) {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
