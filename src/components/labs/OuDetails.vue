<template>
  <section class="q-pa-md">
    <q-btn class="q-mb-md" color="primary" @click="openDialog()">Create</q-btn>
    <q-table
      :columns="columns"
      dark
      :rows="listOuIdInfoGetter"
      hide-bottom
      :loading="isLoading"
      row-key="name"
      :rows-per-page-options="[0]"
      :table-header-style="{ backgroundColor: '#191919' }"
      virtual-scroll
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <p class="q-mb-none">{{ props.row.name }}</p>
          <label class="text-caption text-grey">{{ props.row.sk }}</label>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td class="q-gutter-x-sm" :props="props">
          <q-btn color="warning" flat icon="edit" round size="sm" @click="openDialog(props.row.sk)">
            <q-tooltip>Update</q-tooltip>
          </q-btn>
          <q-btn color="negative" flat icon="delete" round size="sm" @click="openDeleteDialog(props.row.sk)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog persistent v-model="isDialog" @hide="resetData">
      <q-card style="width: 600px; max-width: 90vw" transition-show="flip-up" transition-hide="flip-down" dark>
        <q-card-section>
          <div class="text-subtitle1 ase-roboto text-weight-normal">
            <q-icon name="create" />
            {{ isUpdate ? 'Update OU ID' : 'Create OU' }}
            <hr />
          </div>
        </q-card-section>
        <q-form greedy @submit.prevent="onSubmit()">
          <q-card-section class="q-gutter-y-md">
            <BaseInput
              autofocus
              :disable="isUpdate"
              label="ID *"
              :rules="[
                (val) => val.startsWith('ou-') || 'OU ID must start with \'ou-\'',
                (val) => isUpdate || listOuIdInfoGetter.every((item) => item.sk !== val) || 'OU ID already exists'
              ]"
              v-model="ouId"
            />
            <BaseInput
              label="Name *"
              :rules="[shortName, (val) => isUpdate || listOuIdInfoGetter.every((item) => item.name !== val) || 'OU Name already exists']"
              :maxlength="50"
              required
              v-model="name"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn class="col-grow" color="orange" label="Cancel" outline v-close-popup />
            <q-btn class="col-grow" color="positive" type="submit">Submit</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <Delete
      v-if="isDelete"
      :header="name"
      :show="isDelete"
      @confirmDelete="onSubmitDelete($event)"
      @confirmDeleteCancel="isDelete = false"
    />
  </section>
</template>

<script setup>
import { useLabsStore } from 'app/src/stores'
import BaseInput from 'components/shared/BaseInput.vue'
import Delete from 'components/shared/Delete.vue'
import { shortName } from 'src/utils/rules'
import { computed, ref, watch, onMounted } from 'vue'

const labsStore = useLabsStore()
const emit = defineEmits(['showDataBasedToggle'])
const isLoading = computed(() => labsStore.loading)
const getLabsOrChallenges = computed(() => labsStore.labsOrChallengesTable)
const listOuIdInfoGetter = computed(() => labsStore.listOuIdInfo)

const columns = ref([
  { name: 'name', label: 'Name + OU ID', field: 'name', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])
const isDialog = ref(false)
const isDelete = ref(false)
const isUpdate = ref(false)
const name = ref('')
const ouId = ref('')
const labsOrChallenges = ref('')

watch(labsOrChallenges, (value) => {
  if (value) {
    labsStore.saveStateLabsOrChallenges(value)
    emit('showDataBasedToggle', { type: value })
  }
})

onMounted(async () => {
  if (!listOuIdInfoGetter.value.length) {
    await labsStore.fetchOuIDList()
  }

  emit('showDataBasedToggle', { type: 'labsList' })
  emit('showDataBasedToggle', { type: 'challengesList' })
  labsOrChallenges.value = getLabsOrChallenges.value
})

function openDialog(id) {
  if (id) {
    isUpdate.value = true
    ouId.value = id
    name.value = listOuIdInfoGetter.value.find((item) => item.sk === id).name
  }
  isDialog.value = true
}
function resetData() {
  name.value = ''
  ouId.value = ''
  isUpdate.value = false
}
function openDeleteDialog(id) {
  ouId.value = id
  name.value = listOuIdInfoGetter.value.find((item) => item.sk === id).name
  isDelete.value = true
}
async function onSubmit() {
  const data = {
    ou_id: ouId.value,
    name: name.value
  }
  if (isUpdate.value) {
    await labsStore.UpdateOuIDList(data)
  } else {
    await labsStore.SaveOuList(data)
  }
  isDialog.value = false
  isUpdate.value = false
  await labsStore.fetchOuIDList()
}
async function onSubmitDelete() {
  const status = await labsStore.DeleteOuIDList(ouId.value)
  if (status.Success || status.success) {
    await labsStore.fetchOuIDList()
    isDelete.value = false
  }
}
</script>
