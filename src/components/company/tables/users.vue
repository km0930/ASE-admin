<template>
  <Page
    :isCreateIcon="true && roleIsAdmin"
    isTable
    title="Users List"
    v-model:search="searchByName"
    @createPage="createNewUser"
    @clearSearchData="clearSearchData"
    @searchData="searchData"
  >
    <q-table
      :columns="columns"
      dark
      hide-bottom
      row-key="email"
      :rows="rows"
      :rows-per-page-options="[0]"
      style="max-height: 50vh"
      virtual-scroll
      :visible-columns="roleIsAdmin ? ['Name', 'Email', 'Last Login', 'Update', 'isActive', 'Action'] : ['Name', 'Email', 'Last Login']"
    >
      <template v-slot:body-cell-isActive="props">
        <q-td :props="props" class="cursor_pointer">
          <BaseToggle v-model="props.row.isActive" @update:model-value="toggleDataActive(props.row.email, props.row.isActive)" />
        </q-td>
      </template>
      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <BaseToggle v-model="props.row.isAdmin" @update:model-value="toggleData(props.row.email, props.row.isAdmin)" />
        </q-td>
      </template>
      <template v-slot:bottom-row>
        <q-tr v-if="Object.keys(usersCompanyPaginationKeyForward).length > 0">
          <q-td class="text-center" colspan="5">
            <q-separator dark />
            <q-btn
              label="Load More"
              icon="keyboard_arrow_right"
              style="border: 2px solid white; margin: 7px 0px"
              @click="loadMoreUsers(usersCompanyPaginationKeyForward)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="col-md-12 col-sm-12 col-xs-12">
      <div class="text-center" style="padding-top: 2%; padding-bottom: 2%" v-if="getCompanyUsersListGetter.length === 0">
        <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No data</p>
      </div>
    </div>
  </Page>

  <CreateUser v-if="isCreate" :show="isCreate" @onCacel="cancelCreateUser($event)">{{ title }}</CreateUser>
</template>

<script setup>
import CreateUser from 'components/company/tables/CreateUser'
import BaseToggle from 'components/shared/BaseToggle.vue'
import Page from 'components/shared/Page'
import { useCompanyUsersStore, useLoginStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  companyId: {
    required: false
  }
})

const columns = ref([
  { name: 'Name', label: 'Name', field: 'first_name', sortable: true, align: 'left' },
  { name: 'Email', label: 'Email', field: 'email', sortable: true, align: 'left' },
  { name: 'Last Login', label: 'Last login', field: 'last_login', sortable: true, align: 'left' },
  { name: 'isActive', label: 'is Active', field: 'isActive', align: 'right' },
  { name: 'Action', label: 'Is Admin', field: 'Action', align: 'right' }
])
const rows = ref([])
const stateOfUser = ref(false)
const isCreate = ref(false)

const companyUsersStore = useCompanyUsersStore()
const loginStore = useLoginStore()
const route = useRoute()

const searchByName = computed({
  get: () => companyUsersStore.searchByName,
  set: (value) => companyUsersStore.SEARCH_BY_NAME(value)
})
const getCompanyUsersListGetter = computed(() => (companyUsersStore.listUsers.length > 0 ? [...new Set(companyUsersStore.listUsers)] : []))
const searchByNameGetter = computed(() => companyUsersStore.searchByName)
const searchFireActive = computed(() => companyUsersStore.searchFire)
const usersCompanyPaginationKeyForward = computed(() => companyUsersStore.paginationKey)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

onMounted(async () => {
  companyUsersStore.uiSearchAction(true)
  const data = {
    pagination: {
      company_id: urlSafeBase64Decode(props.companyId)
    },
    reset: true
  }
  await companyUsersStore.fetchCompanyUsersList(data)
  rows.value = Array.from(getCompanyUsersListGetter.value, (item) => Object.assign({}, item))
})

function createNewUser(event) {
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      isCreate.value = true
      updateId.value = ''
    }
  }
}
function cancelCreateUser(event) {
  if (event.show) {
    isCreate.value = false
  }
}
async function loadMoreUsers(pagination) {
  const data = {
    pagination: {
      pagination: pagination
    },
    reset: false
  }

  if (searchByNameGetter.value && searchFireActive.value) {
    data.pagination.pk = 'users'
    data.pagination.query = searchByNameGetter.value
  } else {
    data.pagination.company_id = urlSafeBase64Decode(route.params.companyid)
  }

  if (Object.keys(pagination).length === 0) {
    data.pagination.company_id = urlSafeBase64Decode(route.params.companyid)
  }

  if (searchByNameGetter.value && searchFireActive.value) {
    companyUsersStore.searchCompanyUsers(data)
  } else {
    await companyUsersStore.fetchCompanyUsersList(data)
  }

  rows.value = Array.from(getCompanyUsersListGetter.value, (item) => ({ ...item }))
}
async function searchData() {
  if (searchByNameGetter.value === ' ' || searchByNameGetter.value === '') {
    const data = {
      pagination: { company_id: urlSafeBase64Decode(route.params.companyid) },
      reset: true
    }
    await companyUsersStore.fetchCompanyUsersList(data)
  } else {
    const data = {
      pagination: { pk: 'users', query: searchByNameGetter.value },
      reset: true
    }
    await companyUsersStore.searchCompanyUsers(data)
  }
}
function clearSearchData() {
  const reset = ''
  companyUsersStore.searchByNameAction(reset)
  const data = {
    pagination: {
      company_id: urlSafeBase64Decode(route.params.companyid)
    },
    reset: true
  }
  companyUsersStore.fetchCompanyUsersList(data)
}
async function toggleData(email, oldStatus) {
  let action_type = 'admin'
  if (oldStatus) {
    action_type = 'admin'
  }
  stateOfUser.value = !stateOfUser.value
  const data = {
    email: email,
    company_id: urlSafeBase64Decode(route.params.companyid),
    action_type: action_type
  }
  await companyUsersStore.fetchToggleStatus(data)
}
async function toggleDataActive(email, oldStatus) {
  let action_type = 'active'
  if (oldStatus) {
    action_type = 'active'
  }
  const data = {
    email: email,
    company_id: urlSafeBase64Decode(route.params.companyid),
    action_type: action_type
  }
  await companyUsersStore.fetchToggleStatusIsActive(data)
}
</script>
