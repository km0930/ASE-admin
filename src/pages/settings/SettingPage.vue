<template>
  <div>
    <UserTable v-if="!isCreate && !isDelete" @createNewUser="showCreateUser($event)" @deleteNewUser="showDeleteUser($event)" />
    <CreateUser v-if="isCreate && !isDelete" :id="updateId" :show="isCreate" @onCancel="cancelCreateUser($event)">
      {{ title }}
    </CreateUser>
    <Delete
      v-if="isDelete"
      :show="isDelete"
      :header="'a User'"
      @confirmDelete="userConfirmDeletion($event)"
      @confirmDeleteCancel="userConfirmDeleteCancel($event)"
    />
  </div>
</template>

<script setup>
import CreateUser from 'components/setting/CreateUser'
import UserTable from 'components/setting/UserTable'
import Delete from 'components/shared/Delete.vue'
import { useUsersStore } from 'stores/users'
import { computed, onMounted, ref } from 'vue'

const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const userID = ref('')
const title = ref('Create Users')

const usersStore = useUsersStore()

const getUsersList = computed(() => (usersStore.listUsers.length > 0 ? [...new Set(usersStore.listUsers)] : []))
const searchByNameGetter = computed(() => usersStore.searchByName)

onMounted(() => {
  usersStore.uiSearchAction(true)
  if (getUsersList.value.length === 0 && searchByNameGetter.value.length === 0) {
    const data = {
      pagination: {},
      reset: false
    }
    usersStore.fetchUsersList(data)
  }
})
function showCreateUser(event) {
  usersStore.errorMsgReset({
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    role: false,
    role_msg: ''
  })
  if (event.show) {
    isCreate.value = !isCreate.value
    if (isCreate.value) {
      updateId.value = ''
    }
  }
}
function showDeleteUser(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
    if (isDelete.value) {
      userID.value = ''
      userID.value = event.id
    }
  }
}
async function userConfirmDeletion(event) {
  if (event.show) {
    const data = { email: userID.value }
    await usersStore.deleteUser(data)
    isDelete.value = false
  }
}
function userConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
function cancelCreateUser(event) {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
