<template>
  <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab" @click="tabInfo">
    <q-tab name="activePartners" label="Active" />
    <q-tab name="inActivePartners" label="Expired" />
  </q-tabs>
  <q-separator dark />
  <q-tab-panels animated v-model="tab">
    <q-tab-panel class="bg-dark text-white" dark name="activePartners">
      <PartnerTable
        v-if="!isCreate && !isDelete"
        @createPartner="showCreatePartner($event)"
        @deletePartner="showDeletePartner($event)"
        @updatePartner="showUpdatePartner($event)"
      />
    </q-tab-panel>
    <q-tab-panel class="bg-dark text-white" dark name="inActivePartners">
      <InActivePartnerTable
        @createPartner="showCreatePartner($event)"
        @deletePartner="showDeletePartner($event)"
        @updatePartner="showUpdatePartner($event)"
      />
    </q-tab-panel>
  </q-tab-panels>

  <CreatePartner
    v-if="isCreate && !isDelete"
    :id="updateId"
    v-model:name="typeCreate"
    :show="isCreate"
    @onCancel="cancelCreatePartner($event)"
  />
  <Delete
    v-if="isDelete"
    :show="isDelete"
    :header="'an Partner'"
    @confirmDelete="partnerConfirmDeletion($event)"
    @confirmDeleteCancel="partnerConfirmDeleteCancel($event)"
  />
</template>

<script setup>
import CreatePartner from 'components/partner/CreatePartner'
import PartnerTable from 'components/partner/PartnerTable'
import InActivePartnerTable from 'components/partner/PartnerTableInActive'
import Delete from 'components/shared/Delete.vue'
import { usePartnerStore } from 'stores/partner'
import { computed, onMounted, ref } from 'vue'

const partnerStore = usePartnerStore()

const tab = ref('activePartners')
const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const typeCreate = ref('')
const PartnerID = ref('')

const fetchlistPartners = computed(() => partnerStore.listPartners)
const searchByNameGetter = computed(() => partnerStore.searchByName)
const plansOptionsGetter = computed(() => (partnerStore.plansOptions.length > 0 ? [...new Set(partnerStore.plansOptions)] : []))
const fetchlistInActivePartners = computed(() => partnerStore.listInActivePartners)

onMounted(() => {
  if (fetchlistPartners.value.length === 0 && searchByNameGetter.value.length === 0) {
    const data = {
      pagination: {},
      reset: true
    }
    partnerStore.fetchPartners(data)
  }
})

const showCreatePartner = async (event) => {
  if (plansOptionsGetter.value.length === 0) {
    await partnerStore.fetchplansOptions({})
  }
  const errorMsgs = {
    partner_name: false,
    partner_name_msg: '',
    plans: false,
    plans_msg: '',
    start_date: false,
    start_date_msg: '',
    end_date: false,
    end_date_msg: '',
    num_users: false,
    num_users_msg: '',
    domains: false,
    domains_msg: ''
  }
  partnerStore.errorMsgReset(errorMsgs)
  if (event.show) {
    isCreate.value = !isCreate.value
    if (isCreate.value) {
      updateId.value = ''
    }
  }
}

const showUpdatePartner = async (event) => {
  if (plansOptionsGetter.value.length === 0) {
    await partnerStore.fetchplansOptions({})
  }
  const errorMsgs = {
    Partner_name: false,
    Partner_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  }
  partnerStore.errorMsgReset(errorMsgs)
  if (event.show) {
    isCreate.value = !isCreate.value
    if (isCreate.value) {
      updateId.value = event.id
      // await partnerStore.fetchPartner({ partner_id: event.id })
    }
  }
}

const showDeletePartner = (event) => {
  if (event.show) {
    isDelete.value = !isDelete.value
    if (isDelete.value) {
      PartnerID.value = event.id
    }
  }
}

const partnerConfirmDeletion = (event) => {
  if (event.show) {
    partnerStore.deletePartner({ partner_id: PartnerID.value })
    isDelete.value = false
  }
}

const tabInfo = () => {
  if (tab.value === 'inActivePartners' && fetchlistInActivePartners.value.length === 0) {
    partnerStore.fetchInActivePartners({ pagination: {}, reset: false })
  }
}

const partnerConfirmDeleteCancel = (event) => {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}

const cancelCreatePartner = (event) => {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
