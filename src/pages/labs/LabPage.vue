<template>
  <LabTable @createNewlab="showCreateLab" @deleteLab="showDeleteLab" @updateLab="showUpdateLab" />
  <CreateLab v-if="isCreate && !isDelete" :id="updateId" v-model:name="typeCreate" :show="isCreate" @onCancel="cancelCreateLab" />
  <Delete
    v-if="isDelete"
    header="this Lab"
    :show="isDelete"
    @confirmDelete="labConfirmDeletion"
    @confirmDeleteCancel="labConfirmDeleteCancel"
  />
</template>

<script setup>
import CreateLab from 'components/labs/CreateLab'
import LabTable from 'components/labs/LabTable'
import Delete from 'components/shared/Delete.vue'
import { useLabsStore } from 'src/stores'
import { ref } from 'vue'

const labStore = useLabsStore()
const isCreate = ref(false)
const isDelete = ref(false)
const labIdField = ref('')
const updateId = ref('')
const typeCreate = ref('')

function showCreateLab(event) {
  labStore.errorMsgReset({
    badge_name: false,
    badge_name_msg: '',
    about: false,
    about_msg: '',
    logo: false,
    logo_msg: '',
    skills: false,
    skills_msg: ''
  })
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      isCreate.value = true
      updateId.value = ''
    }
  }
}
async function showUpdateLab(event) {
  labStore.errorMsgReset({
    badge_name: false,
    badge_name_msg: '',
    about: false,
    about_msg: '',
    logo: false,
    logo_msg: '',
    skills: false,
    skills_msg: ''
  })
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      updateId.value = event.id
      isCreate.value = true
    }
  }
}
function showDeleteLab(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      labIdField.value = ''
      labIdField.value = event.id
    }
  }
}
function labConfirmDeletion(event) {
  if (event.show) {
    const data = {
      lab_id: labIdField.value
    }
    labStore.deleteLab(data)
    labIdField.value = ''
    isDelete.value = false
  }
}
function labConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
function cancelCreateLab(event) {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
