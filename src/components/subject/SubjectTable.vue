<template>
  <div class="viewPages">
    <q-separator class="bg-primary" style="margin-top: 1%; margin-bottom: 1%" />
    <div class="q-gutter-md q-pb-md">
      <q-btn color="secondary" @click="createPage({ show: true })">Create</q-btn>
      <q-btn color="secondary" @click="publishCourseToPlan">Add Plans</q-btn>
      <q-btn color="secondary" @click="sendCertificate">Issue Certificate</q-btn>
    </div>
    <q-table
      :table-header-style="{ backgroundColor: '#191919' }"
      :rows="subjectsByEvent"
      :visible-columns="roleIsAdmin ? ['Name', 'Action'] : ['Name']"
      class="q-table th.sortable sticky-header-table"
      row-key="index"
      :columns="columns2"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: 70vh"
      hide-bottom
      dark
    >
      <template v-slot:body-cell-Name="props">
        <q-td :props="props" v-if="props.row.id">
          <q-item style="max-width: 500px">
            <q-item-section>
              <q-item-label class="cursor-pointer" @click="subjectInfo(props.row.id, title, props.row.name)">
                {{ props.row.name }}
                <q-tooltip>View Info Of {{ props.row.name }}</q-tooltip>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
      <template v-slot:body-cell-Action="props">
        <q-td :props="props" v-if="props.row.id">
          <q-btn round color="primary" icon="fas fa-sort" size="sm" @click="viewSortContents(props.row.id)" style="margin-right: 2%">
            <q-tooltip>Sort This Content</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="edit" size="sm" @click="updatePage(props.row.id)" style="margin-right: 2%">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="delete" size="sm" @click="deletePage(props.row.id)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div v-if="Object.keys(subjectsPaginationKeyForward).length > 0" class="q-py-sm text-center">
      <q-btn class="bordered" label="Load More" icon="keyboard_arrow_right" @click="loadMoreSubjects(subjectsPaginationKeyForward)" />
    </div>
  </div>
</template>

<script setup>
import { useLoginStore, useSubjectStore, useTrainingStore } from 'src/stores'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: { type: String, default: 'Header' },
  tableData: { required: false }
})
const emit = defineEmits(['createPage', 'publishCourseToPlan', 'updatePage', 'deletePage', 'subjectInfo', 'viewSortContents'])
const columns2 = ref([
  { name: 'Name', label: 'Name', field: 'name', sortable: true, align: 'left' },
  { name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' }
])
const title = ref(props.title)
const subjectStore = useSubjectStore()
const loginStore = useLoginStore()
const trainingStore = useTrainingStore()
const route = useRoute()

const subjectsByEvent = computed(() => (subjectStore.subjectsList.length > 0 ? [...new Set(subjectStore.subjectsList)] : []))
const subjectsPaginationKeyForward = computed(() => subjectStore.paginationKey)
const searchByNameGetter = computed(() => subjectStore.searchByName)
const searchFireActive = computed(() => subjectStore.searchFire)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

function createPage(event) {
  if (event.show) {
    emit('createPage', { show: true })
  }
}
function publishCourseToPlan(event) {
  emit('publishCourseToPlan', { show: true })
}
function updatePage(id) {
  emit('updatePage', { show: true, id: id })
}
function deletePage(id) {
  emit('deletePage', { show: true, id: id })
}
function subjectInfo(id, courseName, name) {
  emit('subjectInfo', {
    show: true,
    id: urlSafeBase64Encode(id),
    courseName: urlSafeBase64Encode(courseName),
    name: urlSafeBase64Encode(name)
  })
}
function viewSortContents(id) {
  emit('viewSortContents', { show: true, id: id })
}
function loadMoreSubjects(pagination) {
  const data = {
    pagination: {
      event_id: urlSafeBase64Decode(route.params.courseId),
      ...pagination
    },
    reset: false
  }
  if (searchByNameGetter.value && searchFireActive.value) {
    data.pagination.pk = 'subject'
    data.pagination.query = searchByNameGetter.value
    subjectStore.searchSubject(data)
  } else {
    subjectStore.fetchSubjectsByEvent(data)
  }
}
function sendCertificate() {
  const data = { event_id: urlSafeBase64Decode(route.params.courseId) }
  trainingStore.issueCertificate(data)
}
</script>
