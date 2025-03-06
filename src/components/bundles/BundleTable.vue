<template>
  <Page isTable v-model:search="search" @createPage="addUpdateModal = true" @clearSearchData="clearSearchData">
    <q-table
      v-if="bundles"
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      :rows="bundles"
      dark
      hide-bottom
      row-key="index"
      style="max-height: 70vh"
      :table-header-style="{ backgroundColor: '#191919' }"
      virtual-scroll
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-bundle_name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">
                {{ props.row.bundle_name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="warning" flat icon="edit" round size="sm" @click="handleOpenEdit(props.row)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn
            color="negative"
            flat
            icon="delete"
            round
            size="sm"
            @click="openDeleteConfirm(props.row)"
            @confirmDeleteCancel="closeDeleteModal"
          >
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <h6 v-else class="text-center">NO DATA</h6>
  </Page>

  <BundleModal v-if="addUpdateModal" :editMode="Boolean(selected)" :selected="selected" v-model:show="addUpdateModal" />
  <Delete
    v-if="deleteModal"
    header="Delete Bundle"
    :show="deleteModal"
    @confirmDelete="handleDelete"
    @confirmDeleteCancel="closeDeleteModal"
  />
</template>
<script setup>
import BundleModal from 'components/bundles/BundleModal.vue'
import Delete from 'components/shared/Delete.vue'
import Page from 'components/shared/Page.vue'
import { useBundleStore } from 'src/stores'
import { computed, ref, watch } from 'vue'

const bundleStore = useBundleStore()

const bundles = computed(() => {
  const data = bundleStore.bundles
  return data.filter((item) => item.search_name.includes(search.value.toLowerCase()))
})

const columns = ref([
  { name: 'bundle_name', label: 'Name', field: 'bundle_name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])
const search = ref('')
const addUpdateModal = ref(false)
const deleteModal = ref(false)
const selected = ref(null)

function openDeleteConfirm(item) {
  selected.value = item
  deleteModal.value = true
}

function handleOpenEdit(item) {
  addUpdateModal.value = true
  selected.value = item
}

watch(addUpdateModal, (newValue) => {
  if (!newValue) {
    addUpdateModal.value = false
    selected.value = null
  }
})

function closeDeleteModal() {
  deleteModal.value = false
  selected.value = null
}

function handleDelete() {
  bundleStore.deleteBundle({ bundle_id: selected.value?.sk })
  closeDeleteModal()
}

function clearSearchData() {
  search.value = ''
}
</script>
