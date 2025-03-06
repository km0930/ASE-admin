<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="min-width: 700px" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="code" />
          Validator Script List
          <hr />
        </div>
      </q-card-section>
      <q-btn color="primary" class="q-ml-md" label="CREATE" @click="onCreate()" />
      <q-card-section>
        <q-table
          v-if="listValidatorScript"
          :columns="columns"
          dark
          :rows="listValidatorScript"
          flat
          hide-bottom
          row-key="name"
        >
          <template v-slot:body-cell-Date="props" class="q-table--horizontal-separator thead th">
            <q-td :props="props">
              {{ new Date(props.row.created_on).toLocaleString() }}
            </q-td>
          </template>
          <template v-slot:body-cell-Action="props" class="q-table--horizontal-separator thead th">
            <q-td :props="props">
              <q-btn round color="primary" class="q-mr-sm" icon="edit" size="sm" @click="onUpdate(props.row)">
                <q-tooltip>Update</q-tooltip>
              </q-btn>
              <q-btn round color="primary" icon="delete" size="sm" @click="onRemove(props.row)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
              <Delete
                v-if="isDelete"
                :header="'this Validator Script'"
                :show="isDelete"
                @confirmDelete="challengeConfirmDeletion($event)"
                @confirmDeleteCancel="challengeConfirmDeleteCancel($event)"
              />
            </q-td>
          </template>
        </q-table>
        <h6 class="text-center" v-else>NO DATA</h6>
      </q-card-section>
      <q-card-actions>
        <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import Delete from 'components/shared/Delete.vue'
import { useChallengeStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['id', 'show'])
const emit = defineEmits(['onCreate', 'onUpdate', 'onCancel'])

const isDelete = ref(false)
const columns = ref([
  { name: 'Name', label: 'Name', field: 'script_name', sortable: true, align: 'left' },
  { name: 'Date', label: 'Date', field: 'created_on', sortable: true, align: 'left' },
  { name: 'Action', label: 'Action', field: 'Action', sortable: false, align: 'right' }
])
const validatorScriptId = ref('')
const dataShow = ref(true)

const challengeStore = useChallengeStore()

onMounted(async () => {
  await challengeStore.fetchListValidatorScripts({ challenge_id: props.id })
})

const listValidatorScript = computed(() => challengeStore.listValidatorScripts.length > 0 ? [...new Set(challengeStore.listValidatorScripts)] : [])

function onCreate() {
  emit('onCreate', { show: true })
}
function onUpdate(row) {
  emit('onUpdate', row)
}
function onRemove(row) {
  isDelete.value = true
  validatorScriptId.value = row.sk
}
function onCancel() {
  emit('onCancel', { show: true })
}
function challengeConfirmDeletion(event) {
  if (event.show) {
    challengeStore.removeValidatorScript({ challenge_id: props.id, script_id: validatorScriptId.value })
    validatorScriptId.value = ''
    isDelete.value = false
  }
}
function challengeConfirmDeleteCancel(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
      return
    }
    isDelete.value = true
  }
}
</script>
