<template>
  <div>
    <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab">
      <q-tab name="certification" label="Certification" />
      <q-tab name="statistics" label="Statistics" />
    </q-tabs>
    <q-separator dark />
    <q-tab-panels v-model="tab" animated dark>
      <q-tab-panel class="q-pa-none" name="certification">
        <CertificationTable
          v-if="!isCreate && !isDelete && !isReport && !isReportDetail"
          @createCertification="showCreateCertification($event)"
          @certificationReport="showCertificationReport($event)"
          @deleteCertification="showDeleteCertification($event)"
          @descriptiveQuestions="isDescriptiveQuestions = true"
          @openProject="isProjectsOpen = $event"
          @updateCertification="showUpdateCertification($event)"
        />
        <CreateCertification
          v-if="isCreate && !isDelete"
          :id="updateId"
          v-model="typeCreate"
          :show="isCreate"
          :title="updateId ? 'Update Certification' : 'Create Certification'"
          @onCancel="cancelCreateCertificate($event)"
        />
        <CreateDescriptiveQuestions
          v-if="isDescriptiveQuestions && !isDelete"
          :show="isDescriptiveQuestions"
          @onCancel="isDescriptiveQuestions = false"
        />
        <Delete
          v-if="isDelete"
          header="an Certification"
          :show="isDelete"
          @confirmDelete="certificationConfirmDeletion($event)"
          @confirmDeleteCancel="certificationConfirmDeleteCancel($event)"
        />
        <Reports v-if="isReport" :reportData="reportData" @onCancel="isReport = false" @reportDetail="viewDetail($event)" />
        <ReportDetail
          v-if="isReportDetail"
          :reportData="reportData"
          @onCloseDetail="closeDetail($event)"
          @reportDetail="viewDetail($event)"
        />
        <Projects v-if="isProjectsOpen" v-model="isProjectsOpen" />
      </q-tab-panel>
      <q-tab-panel name="statistics">
        <Statistics />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { useCertificationStore } from 'app/src/stores'
import Delete from 'components/shared/Delete.vue'

import CertificationTable from 'components/certification/CertificateTable'
import CreateCertification from 'components/certification/CreateCertificate'
import CreateDescriptiveQuestions from 'components/certification/CreateDescriptiveQuestions'
import Projects from 'components/certification/Projects.vue'
import ReportDetail from 'components/certification/ReportDetail.vue'
import Reports from 'components/certification/Reports.vue'
import Statistics from 'components/certification/Statistics.vue'
import { computed, onMounted, ref } from 'vue'

const certificationStore = useCertificationStore()

const isCreate = ref(false)
const isDelete = ref(false)
const isDescriptiveQuestions = ref(false)
const isReport = ref(false)
const isReportDetail = ref(false)
const updateId = ref('')
const typeCreate = ref('')
const title = ref('')
const certificationID = ref('')
const reportData = ref({})
const tab = ref('certification')
const isProjectsOpen = ref(false)

const listCertification = computed(() => certificationStore.listCertification)
const searchByNameGetter = computed(() => certificationStore.searchByName)

onMounted(async () => {
  if (!listCertification.value.length && !searchByNameGetter.value.length) {
    await certificationStore.fetchCertifications({ pagination: {}, reset: false })
  }
})

function showCreateCertification(event) {
  const errorMsgs = {
    certification_name: false,
    certification_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  }
  certificationStore.errorMsgReset(errorMsgs)
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      title.value = ''
      title.value = 'Create Certification'
      isCreate.value = true
      updateId.value = ''
    }
  }
}
async function showCertificationReport(event) {
  if (event.show) {
    await certificationStore.certificationReport({ test: event.data.sk })
    isReport.value = true
    reportData.value = event.data
  }
}
async function viewDetail(event) {
  if (event.show) {
    isReport.value = false
    isReportDetail.value = true
    reportData.value = event.row
  }
}
async function closeDetail(event) {
  if (!event.show) {
    isReportDetail.value = false
    isReport.value = true
  }
}
async function showUpdateCertification(event) {
  const errorMsgs = {
    certification_name: false,
    certification_name_msg: '',
    about: false,
    about_msg: '',
    photo: false,
    photo_msg: '',
    photo_name: false,
    photo_name_msg: ''
  }
  certificationStore.errorMsgReset(errorMsgs)
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      updateId.value = event.id
      title.value = ''
      title.value = 'Update Certification'
      isCreate.value = true
    }
  }
}
function showDeleteCertification(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      certificationID.value = ''
      certificationID.value = event.id
    }
  }
}
function certificationConfirmDeletion(event) {
  if (event.show) {
    const data = { certification: certificationID.value }
    certificationStore.deleteCertification(data)
    isDelete.value = false
  }
}
function certificationConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
function cancelCreateCertificate(event) {
  if (event.show) {
    isCreate.value = false
  }
}
</script>
