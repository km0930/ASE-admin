<template>
  <InstructorTable
    @createInstructor="showCreateInstructor($event)"
    @deleteInstructor="showDeleteInstructor($event)"
    @updateInstructor="showUpdateInstructor($event)"
  />
  <CreateInstructor v-if="isCreate && !isDelete" :id="updateId" :show="isCreate" @onCancel="cancelCreateInstructor($event)" />
  <Delete
    v-if="isDelete"
    header="an Instructor"
    :show="isDelete"
    @confirmDelete="instructorConfirmDeletion($event)"
    @confirmDeleteCancel="instructorConfirmDeleteCancel($event)"
  />
</template>

<script setup>
import CreateInstructor from 'components/instructor/CreateInstructor'
import InstructorTable from 'components/instructor/InstructorTable'
import Delete from 'components/shared/Delete.vue'
import { useInstructorStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const instructorStore = useInstructorStore()

const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const title = ref('')
const instructorID = ref('')

const fetchlistInstructors = computed(() => instructorStore.listInstructors)
const searchByNameGetter = computed(() => instructorStore.searchByName)

onMounted(async () => {
  if (!fetchlistInstructors.value.length && !searchByNameGetter.value) {
    instructorStore.fetchInstructors({ pagination: {}, reset: false })
  }
})

function showCreateInstructor(event) {
  const errorMsgs = {
    instructor_name: false,
    instructor_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  }
  instructorStore.errorMsgReset(errorMsgs)
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      title.value = ''
      title.value = 'Create Instructor'
      isCreate.value = true
      updateId.value = ''
    }
  }
}
async function showUpdateInstructor(event) {
  const errorMsgs = {
    instructor_name: false,
    instructor_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  }
  instructorStore.errorMsgReset(errorMsgs)
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      updateId.value = event.id
      title.value = ''
      title.value = 'Update Instructor'
      isCreate.value = true
    }
  }
}
function showDeleteInstructor(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      instructorID.value = ''
      instructorID.value = event.id
    }
  }
}
function instructorConfirmDeletion(event) {
  if (event.show) {
    const data = { instructor_id: this.instructorID }
    instructorStore.deleteInstructor(data)
    isDelete.value = false
  }
}
function instructorConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
function cancelCreateInstructor(event) {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
