<template>
  <Page
    :isCreateIcon="roleIsAdmin"
    isTable
    v-model:search="searchByName"
    title="Settings"
    @createPage="createNewUser($event)"
    @clearSearchData="clearSearchData"
    @searchData="searchData"
  >
    <q-table
      class="q-table th.sortable sticky-header-table"
      :columns="columns"
      :rows="getUsersList"
      dark
      hide-bottom
      row-key="index"
      :rows-per-page-options="[0]"
      style="max-height: 70vh"
      :table-header-style="{ backgroundColor: '#191919' }"
      virtual-scroll
      :visible-columns="roleIsAdmin ? ['name', 'email', 'type', 'actions'] : ['name', 'email', 'type']"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">{{ props.row.first_name }}</q-td>
          <q-td key="email" :props="props">{{ props.row.email }}</q-td>
          <q-td key="type" :props="props">
            <label v-if="props.row.role.value">{{ props.row.role.value }}</label>
            <label v-else style="cursor: pointer">{{ props.row.role }}</label>
            <q-popup-edit
              v-if="props.row.email !== fetchUserInfo.email"
              color="white"
              dark
              :disable="fetchUserInfo.role !== 'Admin'"
              lazy-rule
              v-model="props.row.role"
            >
              <BaseSelect
                class="q-pa-xs"
                label="User Role *"
                :options="userTypeOptions"
                :model-value="props.row.role"
                @update:model-value="save_data(props.row, $event)"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              v-if="props.row.email !== fetchUserInfo.email"
              color="negative"
              flat
              icon="delete"
              round
              size="sm"
              @click="deleteNewUser(props.row.email)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div v-if="Object.keys(usersPaginationKeyForward).length > 0" class="text-center">
      <q-btn
        icon="keyboard_arrow_right"
        label="Load More"
        style="border: 2px solid white; margin: 7px 0px"
        @click="loadMoreUsers(usersPaginationKeyForward)"
      />
    </div>
  </Page>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import Page from 'components/shared/Page'
import { useLoginStore, useUsersStore } from 'stores'
import { computed, ref } from 'vue'

const emit = defineEmits(['createNewUser', 'deleteNewUser'])

const userTypeOptions = ref([
  { value: 'Admin', label: 'Admin' },
  { value: 'Analyst', label: 'Analyst' },
  { value: 'Creator', label: 'Creator' }
])
const columns = ref([
  { name: 'name', label: 'Name', field: 'first_name', sortable: true, align: 'left' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' },
  { name: 'type', label: 'Role', field: 'role', sortable: true, align: 'left' },
  { name: 'actions', label: '', field: 'actions', sortable: false, align: 'right' }
])
const usersStore = useUsersStore()
const loginStore = useLoginStore()

const getUsersList = computed(() => (usersStore.listUsers.length > 0 ? [...new Set(usersStore.listUsers)] : []))
const searchByNameGetter = computed(() => usersStore.searchByName)
const searchFireActive = computed(() => usersStore.searchFire)
const usersPaginationKeyForward = computed(() => usersStore.paginationKey)
const searchByName = computed({
  get() {
    return usersStore.searchByName
  },
  set(value) {
    usersStore.searchByNameAction(value)
  }
})
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)
const fetchUserInfo = computed(() => loginStore.fetchUserInfo)

function save_data(row, data) {
  const formData = {
    email: row.email,
    role: data.value
  }
  usersStore.updateUserType(formData)
}
function createNewUser(event) {
  if (event.show) {
    emit('createNewUser', { show: true })
  }
}
function loadMoreUsers(pagination) {
  const data = {
    pagination: pagination && { pagination },
    reset: false
  }

  if (searchByNameGetter.value && searchFireActive.value) {
    data.pagination.pk = 'users'
    data.pagination.query = searchByNameGetter.value
    usersStore.searchUsers(data)
  } else {
    usersStore.fetchUsersList(data)
  }
}
async function searchData() {
  const data = {
    pagination: {},
    reset: true
  }

  if (searchByNameGetter.value && searchByNameGetter.value.trim() !== '') {
    data.pagination.pk = 'users'
    data.pagination.query = searchByNameGetter.value
    await usersStore.searchUsers(data)
  } else {
    await usersStore.fetchUsersList(data)
  }
}
function clearSearchData() {
  const reset = ''
  usersStore.searchByNameAction(reset)
  const data = {
    pagination: {},
    reset: true
  }
  usersStore.fetchUsersList(data)
}
function deleteNewUser(id) {
  emit('deleteNewUser', { show: true, id: id })
}
</script>

<style lang="sass">
.sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
