<script setup>
import Delete from 'components/shared/Delete.vue'
import Page from 'components/shared/Page.vue'
import { useJourneysStore } from 'src/stores/journeys'
import JourneyModal from './JourneyModal.vue'

import { computed, onMounted, ref } from 'vue'

const columns = [
  { name: 'title', label: 'Title', field: 'name', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right', sortable: true }
]

const journeysStore = useJourneysStore()

const search = ref('')
const isLoading = ref(true)
const isCreateOpen = ref(false)
const isEditOpen = ref(false)
const isDeleteOpen = ref(false)
const isActive = ref(true)

const selected = ref(null)
const deleteId = ref()

const paginationKey = computed(() => journeysStore.pagination)
const journeys = computed(() => {
  const data = journeysStore.journeys
  return data.filter((item) => item.name.toLowerCase().includes(search.value.toLowerCase()))
})
const showLoadMore = computed(() => {
  return paginationKey.value && !isLoading.value
})

onMounted(() => {
  loadData({ active: isActive.value })
})

async function loadData(payload = {}) {
  isLoading.value = true
  await journeysStore.fetchJourneys(payload)
  isLoading.value = false
}

function handleOpenEdit(data) {
  selected.value = data
  isEditOpen.value = true
}

function handleDeleteOpen(data) {
  isDeleteOpen.value = true
  deleteId.value = data?.sk
}

async function handleDelete() {
  await journeysStore.deleteJourney(deleteId.value)
  closeDeleteModal()
}

function closeDeleteModal() {
  isDeleteOpen.value = false
  deleteId.value = undefined
}

function handleUpdateActive() {
  journeysStore.resetPagination()
  loadData({ active: isActive.value })
}
</script>

<template>
  <Page isTable title="Journeys" v-model:search="search" @createPage="isCreateOpen = true" @clearSearchData="search = ''">
    <div class="bg-dark q-pa-sm">
      <q-checkbox dark size="sm" v-model="isActive" label="Active" @update:modelValue="handleUpdateActive" />
    </div>
    <q-table
      :columns="columns"
      dark
      :rows="journeys"
      flat
      hide-bottom
      :rows-per-page-options="[0]"
      style="max-height: 75vh"
      :loading="isLoading"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="warning" :disabled="!isActive" flat icon="edit" round size="sm" @click="handleOpenEdit(props.row)">
            <q-tooltip>Edit Journey</q-tooltip>
          </q-btn>
          <q-btn color="negative" :disabled="!isActive" flat icon="delete" round size="sm" @click="handleDeleteOpen(props.row)">
            <q-tooltip>Delete Journey</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div v-if="showLoadMore" class="text-center">
      <q-btn
        icon="keyboard_arrow_right"
        label="Load More"
        style="border: 2px solid white; margin: 7px 0px"
        @click="loadData({ pagination: paginationKey })"
      />
    </div>
  </Page>

  <JourneyModal v-if="isCreateOpen" v-model="isCreateOpen" />

  <JourneyModal v-if="isEditOpen" v-model="isEditOpen" editMode :data="selected" />

  <Delete
    v-if="isDeleteOpen"
    header="delete joruney"
    :show="isDeleteOpen"
    @confirmDelete="handleDelete"
    @confirmDeleteCancel="closeDeleteModal"
  />
</template>
