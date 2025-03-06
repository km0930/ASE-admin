<template>
  <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab" @click="tabInfo">
    <q-tab name="activeCompanies" label="Active" />
    <q-tab name="inActiveCompanies" label="Expired" />
  </q-tabs>
  <q-separator dark />
  <q-tab-panels v-model="tab" animated>
    <q-tab-panel class="bg-dark text-white" dark name="activeCompanies">
      <CompanyTable
        v-if="!isCreate && !isCompanyDashboard"
        :tableData="companiesData"
        title="Company"
        @createPage="showCreateCompany"
        @deletePage="showCompanyDelete"
        @updatePage="showUpdateCompany"
        @viewCompany="showCompanyInfo"
        @viewCompanyInfo="showCompanyInfo"
      />
    </q-tab-panel>
    <q-tab-panel class="bg-dark text-white" dark name="inActiveCompanies">
      <InActiveCompanyTable
        v-if="!isCreate && !isCompanyDashboard"
        :tableData="companiesData"
        title="Company"
        @createPage="showCreateCompany"
        @deletePage="showCompanyDelete"
        @updatePage="showUpdateCompany"
        @viewCompany="showCompanyInfo"
        @viewCompanyInfo="showCompanyInfo"
      />
    </q-tab-panel>
  </q-tab-panels>

  <CreateCompany
    v-if="isCreate"
    :id="updateId"
    :show="isCreate"
    :title="'Create Company'"
    @openWarning="openDialogWarning"
    @onCacel="cancelCreateCompany"
  />
  <Delete
    v-if="isDelete"
    :show="isDelete"
    :header="'a Company'"
    @confirmDelete="companyConfirmDeletion"
    @confirmDeleteCancel="companyConfirmDeleteCancel"
  />
  <q-dialog v-model="showDialog" persistent style="min-width: 550px">
    <q-card style="min-width: 550px">
      <q-card-section class="bg-primary">
        <q-list class="row">
          <q-item class="col-12">
            <q-item-section class="text-subtitle1 text-weight-bold ase-roboto ase-black-light padding_12 text-center">
              {{ errorMessageDialogGetter.message }}
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right">
          <q-btn class="text-capitalize bg-primary text-white" @click="onCancelDialog()">Cancel</q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import CompanyTable from 'components/company/CompanyTable'
import CreateCompany from 'components/company/CreateCompany'
import InActiveCompanyTable from 'components/company/InActiveCompanyTable'
import Delete from 'components/shared/Delete.vue'
import { useCompanyStore } from 'src/stores'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const tab = ref('activeCompanies')
const isCompanyDashboard = ref(false)
const isCreate = ref(false)
const updateId = ref('')
const isDelete = ref(false)
const companyId = ref('')
const showDialog = ref(false)

const companyStore = useCompanyStore()
const router = useRouter()

const companiesData = computed(() => (companyStore.listCompanies.length > 0 ? [...new Set(companyStore.listCompanies)] : []))
const companiesDataInActive = computed(() => (companyStore.listInActiveCompanies.length > 0 ? [...new Set(companyStore.listInActiveCompanies)] : []))
const errorMessageDialogGetter = computed(() => companyStore.errorMessageDialog)
const searchByNameGetter = computed(() => companyStore.searchByName)
const searchByNameInActiveGetter = computed(() => companyStore.searchByNameInActive)
const searchFireActive = computed(() => companyStore.searchFire)
const searchFireActiveInActive = computed(() => companyStore.searchFireInActive)

onMounted(() => {
  if (companiesData.value.length === 0 && searchByNameGetter.value.length === 0 && !searchFireActive.value) {
    companyStore.fetchCompanies({ pagination: {}, reset: false })
  }
})

async function showCreateCompany(event) {
  companyStore.errorMsgReset({
    status: true,
    company_name: false,
    company_name_msg: '',
    monthly_minutes: false,
    monthly_minutes_msg: '',
    parent: false,
    parent_msg: '',
    is_event: false,
    is_event_msg: '',
    num_users: false,
    num_users_msg: '',
    minutes_per_user: false,
    minutes_per_user_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    payment_complete: false,
    payment_complete_msg: '',
    domains: false,
    domains_msg: '',
    events: false,
    events_msg: '',
    subscription: false,
    subscription_msg: '',
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    plans: false,
    plans_msg: ''
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
function onCancelDialog() {
  showDialog.value = false
}
function openDialogWarning() {
  showDialog.value = true
}
async function showUpdateCompany(event) {
  companyStore.errorMsgReset({
    status: true,
    company_name: false,
    company_name_msg: '',
    monthly_minutes: false,
    monthly_minutes_msg: '',
    parent: false,
    parent_msg: '',
    is_event: false,
    is_event_msg: '',
    num_users: false,
    num_users_msg: '',
    minutes_per_user: false,
    minutes_per_user_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    payment_complete: false,
    payment_complete_msg: '',
    domains: false,
    domains_msg: '',
    events: false,
    events_msg: '',
    subscription: false,
    subscription_msg: '',
    email: false,
    email_msg: '',
    first_name: false,
    first_name_msg: '',
    last_name: false,
    last_name_msg: '',
    plans: false,
    plans_msg: ''
  })
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      isCreate.value = true
      updateId.value = ''
      updateId.value = event.id
    }
  }
}
function showCompanyDelete(event) {
  if (event.show) {
    companyId.value = ''
    companyId.value = event.id
    isDelete.value = true
  }
}
function tabInfo() {
  if (
    tab.value === 'inActiveCompanies' &&
    companiesDataInActive.value.length === 0 &&
    searchByNameInActiveGetter.value.length === 0 &&
    !searchFireActiveInActive.value
  ) {
    companyStore.fetchInActiveCompanies({ pagination: {}, reset: true })
  }
}
function showCompanyInfo(event) {
  router.push({ path: `/portal/company/dashboard/${urlSafeBase64Encode(event.prop.id)}` })
}
function cancelCreateCompany(event) {
  if (event.show) {
    isCreate.value = !isCreate.value
  }
  if (event.dialog) {
    showDialog.value = true
  }
}
function companyConfirmDeletion(event) {
  if (event.show) {
    companyStore.deleteCompany({ company_id: companyId.value })
    companyId.value = ''
    isDelete.value = false
  }
}
function companyConfirmDeleteCancel(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
      companyId.value = ''
    } else {
      isDelete.value = true
    }
  }
}
</script>
