<template>
  <Page
    v-model:search="searchByName"
    :title="'Users'"
    @clearSearchData="clearSearchData"
    @searchData="searchData"
    :isCreateIcon="roleIsAdmin"
    :isTable="true"
  >
    <q-table
      :rows="getCompanyAdminUsersListGetter"
      :visible-columns="roleIsAdmin ? ['Name', 'Email', 'Action'] : ['Name', 'Email']"
      :columns="columns"
      row-key="index"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: 70vh"
      hide-bottom
      dark
    >
      <template v-slot:body-cell-Action="props">
        <q-td :props="props">
          <q-btn round color="primary" icon="delete" size="sm" @click="deleteNewUser(props.row.email)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <div class="col-md-12 col-sm-12 col-xs-12">
      <div class="text-center" style="padding-top: 2%; padding-bottom: 2%" v-if="getCompanyAdminUsersListGetter.length === 0">
        <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No data</p>
      </div>
    </div>
    <div v-if="!adminUsersCompanyPaginationKeyForward.pk" class="text-center">
      <q-btn
        label="Load More"
        icon="keyboard_arrow_right"
        style="border: 2px solid white; margin: 7px 0px 7px 0px"
        @click="loadMoreInstructorsPath(adminUsersCompanyPaginationKeyForward)"
      />
    </div>
  </Page>
</template>

<script setup>
import Page from 'components/shared/Page'
import { useCompanyUsersStore, useLoginStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const columns = ref([
  {
    name: 'Name',
    label: 'Name',
    field: 'first_name',
    sortable: true,
    align: 'left'
  },
  {
    name: 'Email',
    label: 'Email',
    field: 'email',
    sortable: true,
    align: 'left'
  },
  {
    name: 'Action',
    label: 'Action',
    field: 'Action',
    sortable: false,
    align: 'center'
  }
])

const companyUsersStore = useCompanyUsersStore()
const loginStore = useLoginStore()

const searchByName = computed({
  get: () => companyUsersStore.searchByName,
  set: (value) => companyUsersStore.SEARCH_BY_NAME(value)
})
// const isLoading = computed(() => companyUsersStore.loading)
const getCompanyAdminUsersListGetter = computed(() => (companyUsersStore.listUsers.length > 0 ? [...new Set(companyUsersStore.listUsers)] : []))
const searchByNameGetter = computed(() => companyUsersStore.searchByName)
const searchFireActive = computed(() => companyUsersStore.searchFire)
const adminUsersCompanyPaginationKeyForward = computed(() => companyUsersStore.paginationKey)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

onMounted(() => {
  if (getCompanyAdminUsersListGetter.value.length === 0 && searchByNameGetter.value.length === 0 && !searchFireActive.value) {
    const data = {
      pagination: {},
      reset: false
    }
    companyUsersStore.fetchCompanyUsersList(data)
  }
})
// function loadMoreUsers(pagination) {
//   let data = {}
//   if (Object.keys(pagination).length === 0) {
//     data = {
//       pagination: {},
//       reset: false
//     }
//     companyUsersStore.fetchCompanyUsersList(data)
//   } else {
//     data = {
//       pagination: {
//         pagination: pagination
//       },
//       reset: false
//     }
//     if (searchByNameGetter.value && searchFireActive.value) {
//       data.pagination.pk = 'users'
//       data.pagination.query = searchByNameGetter.value
//       companyUsersStore.searchCompanyUsers(data)
//     } else {
//       companyUsersStore.fetchCompanyUsersList(data)
//     }
//   }
// }
async function searchData() {
  if (searchByNameGetter.value === ' ' || searchByNameGetter.value === '') {
    const data = {
      pagination: {},
      reset: true
    }
    await companyUsersStore.fetchCompanyUsersList(data)
  } else {
    const data = {
      pagination: {
        pk: 'users',
        query: searchByNameGetter.value
      },
      reset: true
    }
    await companyUsersStore.searchCompanyUsers(data)
  }
}
function clearSearchData() {
  const reset = ''
  companyUsersStore.searchByNameAction(reset)
  const data = {
    pagination: {},
    reset: true
  }
  companyUsersStore.fetchCompanyUsersList(data)
}
function deleteNewUser(id) {}
</script>
