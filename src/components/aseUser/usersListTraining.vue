<template>
  <div>
    <div class="flex justify-between q-pa-md">
      <q-btn size="md" color="primary" @click="$emit('createUser', { show: true })">Create</q-btn>
      <q-btn v-if="singleTrainingInfo.delivery_id" size="md" color="primary" @click="$emit('issueCertificate')">Issue Certificate</q-btn>
    </div>
    <div class="row">
      <div class="q-pa-md full-width text-white">
        <q-list dark bordered separator class="bg-primary">
          <q-item>
            <q-item-section avatar class="white text-subtitle2 ase-roboto">#</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">Name</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">Email</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto" align="right">Action</q-item-section>
          </q-item>
          <q-item v-for="(info, index) of props.data" :key="'companyUSERR' + info.name + '' + index + info.email">
            <q-item-section avatar class="white text-subtitle2 ase-roboto">{{ index + 1 }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">{{ info.name }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">{{ info.email }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto" align="right">
              <div>
                <q-btn color="dark" icon="delete" size="sm" @click="removeUser(info)" align="right">
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="text-center" style="padding-top: 2%; padding-bottom: 2%" v-if="props.data.length === 0">
          <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No Data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'app/src/utils/reuseFunctions'
import { useTrainingStore } from 'src/stores'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps(['id', 'show', 'data'])
const emit = defineEmits('removeUser')
const route = useRoute()
const trainingStore = useTrainingStore()
onMounted(async () => {
  await trainingStore.fetchTraining({ training_id: urlSafeBase64Decode(route.params.eventId) })
})
const singleTrainingInfo = computed(() => (Object.keys(trainingStore.trainingInfo).length > 0 ? trainingStore.trainingInfo : []))
function removeUser(info) {
  emit('removeUser', { show: true, info: info })
}
</script>
