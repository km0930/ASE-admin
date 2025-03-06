<template>
  <Page :isCreateIcon="roleIsAdmin" v-model:search="search" :title="title" @createPage="createPage($event)" :isTable="false">
    <div class="q-pa-md" v-if="roleIsAdmin">
      <q-btn color="white" icon="add" label="Menu" outline>
        <q-menu dark fit auto-close>
          <q-list>
            <q-item v-for="(action, index) in actionItems" clickable :key="index" v-ripple @click="actionItem(action.value)">
              <q-item-section>{{ action.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <q-list v-for="[key, value] in Object.entries(tableData)" :key="key" dark padding bordered class="rounded-borders">
      <q-expansion-item group="somegroup" :label="key.replace('vid', 'Video')" class="padding_7">
        <q-card class="bg-grey-9">
          <q-card-section>
            <SubjectCard
              v-for="(val, index) in value"
              :key="val.id"
              :roleIsAdmin="roleIsAdmin"
              :value="value[index]"
              @actionItemDelete="actionItemDelete(key, val.id)"
              @actionItemInfo="actionItemInfo(key, val.id)"
            >
              <template #action v-if="key === 'lab'">
                <div class="text-grey-6 q-gutter-xs">
                  <q-toggle
                    checked-icon="check"
                    color="green"
                    dark
                    dense
                    indeterminate-value="N/A"
                    label-color="white"
                    label="Is Active"
                    outlined
                    unchecked-icon="clear"
                    :model-value="val.is_active"
                    @update:model-value="changeLabStatus(val.id, $event)"
                  />
                  <q-btn class="gt-xs primary" size="12px" flat dense round icon="remove" @click="actionItemDetach(key, val.id)" />
                </div>
              </template>
            </SubjectCard>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </Page>
  <Delete
    v-if="isDelete"
    :header="typeO"
    :show="isDelete"
    @confirmDelete="confirmDeletion($event)"
    @confirmDeleteCancel="deleteCancel($event)"
  />
  <Detach
    v-if="isDetach"
    :header="typeO"
    :show="isDetach"
    @confirmDetach="confirmDetach($event)"
    @confirmDetachCancel="detachCancel($event)"
  />
</template>

<script setup>
import Delete from 'components/shared/Delete.vue'
import Detach from 'components/shared/Detach'
import Page from 'components/shared/coursePage'
import { useLoginStore } from 'src/stores'
import { computed, ref } from 'vue'
import SubjectCard from './SubjectCard.vue'

const emit = defineEmits(['createPage', 'actionItem', 'actionItemCrud', 'actionItemDelete', 'actionItemDetachData', 'changeLabStatus'])
const props = defineProps({
  title: { type: String, default: 'Header' },
  tableData: { required: false }
})
const title = ref(props.title)
const tableData = ref(props.tableData)
const actionItems = ref([
  { label: 'Downloads', value: 'downloads', icon: 'delete' },
  { label: 'Lab', value: 'lab', icon: 'print' },
  { label: 'Media', value: 'createMedia', icon: 'format_size' },
  { label: 'Quiz', value: 'quiz', icon: 'print' },
  { label: 'Videos', value: 'vedios', icon: 'format_size' }
])
const isDelete = ref(false)
const isDetach = ref(false)
const saveTypeId = ref({ type: '', id: '' })
const search = ref('')
const typeDetach = ref('')
const typeO = ref('')

const loginStore = useLoginStore()
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

function createPage(event) {
  if (event.show) {
    emit('createPage', { show: true })
  }
}
function actionItem(data) {
  emit('actionItem', data)
}
function actionItemInfo(type, id) {
  emit('actionItemCrud', { type: type, id: id })
}
function actionItemDelete(type, id) {
  typeO.value = type.replace('vid', 'Video').replace('download', 'Download')
  saveTypeId.value.type = type
  saveTypeId.value.id = id
  isDelete.value = true
}
function actionItemDetach(type, id) {
  typeO.value = type.replace('vid', 'Video').replace('download', 'Download')
  saveTypeId.value.type = type
  saveTypeId.value.id = id
  isDetach.value = true
  typeDetach.value = null
}
function confirmDeletion(event) {
  if (event.show) {
    emit('actionItemDelete', saveTypeId.value)
  }
  isDelete.value = false
}
function confirmDetach(event) {
  if (event.show) {
    emit('actionItemDetachData', saveTypeId.value)
  } else {
    typeDetach.value = null
  }
  isDetach.value = false
}
function changeLabStatus(id, toggleStatus) {
  emit('changeLabStatus', { status: id, is_active: toggleStatus })
}
function detachCancel(event) {
  if (event.show) {
    isDetach.value = !isDetach.value
    saveTypeId.value = isDetach.value ? {} : saveTypeId.value
  }
}
function deleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
    saveTypeId.value = isDelete.value ? {} : saveTypeId.value
  }
}
</script>
