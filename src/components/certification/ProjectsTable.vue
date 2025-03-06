<script setup>
import Delete from 'components/shared/Delete.vue'
import { useCertificationStore } from 'src/stores'
import { computed, ref, shallowRef } from 'vue'
import ProjectModal from './ProjectModal.vue'

const certificationStore = useCertificationStore()
const columns = [
  { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left', sortable: true }
]

const isUpdateOpen = shallowRef(false)
const isDeleteOpen = shallowRef(false)
const selected = ref(null)

const fetchedProjects = computed(() => certificationStore.projects ?? [])
const loadingProjects = computed(() => certificationStore.loadingProjects)

function handleOpenUpdate(data) {
  selected.value = data
  isUpdateOpen.value = true
}

function handleOpenDelete(data) {
  selected.value = data
  isDeleteOpen.value = true
}

async function handleDelete() {
  const payload = { project: selected.value?.sk }
  await certificationStore.deleteProject(payload)
  isDeleteOpen.value = false
}
</script>

<template>
  <q-table
    :columns="columns"
    dark
    :rows="fetchedProjects"
    flat
    hide-bottom
    :rows-per-page-options="[0]"
    style="max-height: 30vh"
    :loading="loadingProjects"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn color="warning" flat icon="edit" round size="sm" @click="handleOpenUpdate(props.row)">
          <q-tooltip>Edit Project</q-tooltip>
        </q-btn>
        <q-btn color="negative" flat icon="delete" round size="sm" @click="handleOpenDelete(props.row)">
          <q-tooltip>Delete Project</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>

  <ProjectModal v-if="isUpdateOpen" v-model="isUpdateOpen" :selected="selected" />
  <Delete
    v-if="isDeleteOpen"
    header="this project"
    :show="isDeleteOpen"
    @confirmDelete="handleDelete"
    @confirmDeleteCancel="isDeleteOpen = false"
  />
</template>
