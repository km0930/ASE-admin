<template>
  <Page isTable title="Tag" v-model:search="search" @createPage="addUpdateModal = true" @clearSearchData="clearSearchData">
    <q-table
      v-if="tags.length"
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      :rows="tags"
      dark
      hide-bottom
      row-key="index"
      style="max-height: 70vh"
      :table-header-style="{ backgroundColor: '#191919' }"
      virtual-scroll
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-tag_name="props">
        <q-td :props="props">
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2">{{ props.row.tag_name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="warning" flat icon="edit" round size="sm" @click="handleOpenEdit(props.row)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="openDeleteConfirm(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <h6 v-else class="text-center">NO DATA</h6>
  </Page>

  <q-dialog v-model="addUpdateModal">
    <TagsModal :editMode="Boolean(selected)" :selected="selected" @closeModal="closeAddUpdateModal" />
  </q-dialog>
  <q-dialog v-model="deleteModal">
    <DeleteTags @confirm="handleDelete" @cancel="closeDeleteModal" />
  </q-dialog>
</template>

<script setup>
import Page from 'components/shared/Page.vue'
import DeleteTags from 'components/tags/DeleteTags.vue'
import TagsModal from 'components/tags/TagsModal.vue'
import { useTagsStore } from 'stores'
import { computed, ref } from 'vue'

const search = ref('')
const addUpdateModal = ref(false)
const deleteModal = ref(false)
const selected = ref(null)
const columns = ref([
  { name: 'tag_name', label: 'Name', field: 'tag_name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])

const tagsStore = useTagsStore()

const tags = computed(() => {
  return tagsStore.tags.filter((item) => item.tag_name.toLowerCase().includes(search.value.toLowerCase()))
})

function handleDelete() {
  tagsStore.deleteTag({ tag_id: selected.value.sk })
  closeDeleteModal()
}
function openDeleteConfirm(item) {
  selected.value = item
  deleteModal.value = true
}
function handleOpenEdit(item) {
  addUpdateModal.value = true
  selected.value = item
}
function closeAddUpdateModal() {
  addUpdateModal.value = false
  selected.value = null
}
function closeDeleteModal() {
  deleteModal.value = false
  selected.value = null
}
function clearSearchData() {
  search.value = ''
}
</script>
<style></style>
