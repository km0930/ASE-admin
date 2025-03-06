<template>
  <template v-if="idpStep === 1">
    <div class="row items-center justify-between q-mb-sm">
      <strong>Key</strong>
      <strong>Value</strong>
      <div></div>
    </div>
    <div v-for="(idpItem, index) in companyIdpData" :key="index" class="row items-center justify-between">
      <div>{{ idpItem[0] }}</div>
      <div>{{ idpItem[1] }}</div>
      <q-btn icon="content_copy" flat dense @click="($event) => copyText(idpItem[0], idpItem[1])"></q-btn>
    </div>
    <q-card-actions align="right" class="q-mt-md">
      <q-btn class="text-capitalize bg-primary text-white" @click="emit('closemodal')">
        {{ !companyIdpData.length ? 'Close' : 'Cancel' }}
      </q-btn>
      <q-btn v-if="companyIdpData.length" class="text-capitalize bg-primary text-white" @click="idpStep++" type="submit">next</q-btn>
    </q-card-actions>
  </template>

  <template v-if="idpStep === 2">
    <q-form @submit="submit()">
      <BaseInput
        label="Provider Name *"
        :rules="[(val) => (val ? true : 'Please enter provider name'), ...providerName]"
        v-model="idpFormData.providerName"
      />
      <BaseInput
        label="Domain Name *"
        :rules="[(val) => (val ? true : 'Please enter domain name'), ...domainName]"
        v-model="idpFormData.domainName"
      />
      <div class="q-pa-md">
        <div class="q-my-sm">Please fill in either the metadata URL or upload the metadata file *</div>
        <BaseFile
          label="Meta Data"
          v-model="idpFormData.metaDataFile"
          accept=".xml"
          :rules="[(val) => !((!idpFormData.metaDataUrl && !val) || (idpFormData.metaDataUrl && val)) || '']"
        />
        <div class="text-center">OR</div>
        <BaseInput
          label="Meta Data Url"
          v-model="idpFormData.metaDataUrl"
          :rules="[
            (val) => (val ? validHttpsUrl(val) || 'Please provide a valid https url' : true),
            (val) => !((!idpFormData.metaDataFile && !val) || (idpFormData.metaDataFile && val)) || ''
          ]"
        />
      </div>
      <q-card-actions align="right">
        <q-btn class="text-capitalize bg-primary text-white" @click="idpStep--">Back</q-btn>
        <q-btn class="text-capitalize bg-primary text-white" type="submit">Save</q-btn>
      </q-card-actions>
    </q-form>
  </template>
</template>

<script setup>
import { showLoader } from 'app/src/utils/loader'
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import { Notify } from 'quasar'
import { useCompanyStore } from 'src/stores'
import { getBase64EncodeString } from 'src/utils/reuseFunctions'
import { domainName, providerName, validHttpsUrl } from 'src/utils/rules'
import { onMounted, ref } from 'vue'

const emit = defineEmits(['closemodal'])
const props = defineProps({
  companyId: {
    type: String,
    required: true
  }
})

const companyStore = useCompanyStore()

const idpFormData = ref({
  providerName: '',
  domainName: '',
  metaDataFile: null,
  metaDataUrl: ''
})
const companyIdpData = ref([])
const idpStep = ref(1)

onMounted(async () => {
  showLoader(true)
  const { data } = await companyStore.fetchCompanyID()
  companyIdpData.value = Object.entries(data)
  showLoader(false)
})

async function submit() {
  showLoader(true)
  const payload = {
    provider_name: idpFormData.value.providerName,
    domain: idpFormData.value.domainName,
    company_id: props.companyId
  }
  if (idpFormData.value.metaDataFile) {
    const encString = await getBase64EncodeString(idpFormData.value.metaDataFile)
    payload.metadata_string = encString
  } else if (idpFormData.value.metaDataUrl) {
    payload.metadata_url = idpFormData.value.metaDataUrl
  }
  const success = await companyStore.createIdp(payload)
  Notify.create({
    type: success ? 'positive' : 'negative',
    position: 'top',
    progress: true,
    icon: success ? 'success' : 'error',
    timeout: 1100,
    message: success ? 'Successfully setup IDP' : 'Failed to setup IDP'
  })
  success && emit('closemodal')
  showLoader(false)
}

function copyText(key, value) {
  const ob = {}
  ob[key] = value
  navigator.clipboard.writeText(value)
  Notify.create({
    type: 'positive',
    position: 'top',
    timeout: 1100,
    message: 'Copied successfully'
  })
}
</script>
