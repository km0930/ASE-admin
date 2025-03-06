<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-up" transition-hide="flip-down">
    <q-card style="width: 720px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Lab' : 'Create Lab' }}
          <hr />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form greedy ref="formRef" @submit.prevent="finish()">
          <q-stepper active-color="white" alternative-labels animated dark done-color="positive" ref="stepper" v-model="step">
            <q-step :name="1" title="Basic Information" icon="article" :done="step > 1">
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput autofocus label="Name *" required :rules="minLength(2)" v-model="lab.name" />
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput
                      label="Approx Time (In Minutes) *"
                      :max="500"
                      :min="10"
                      required
                      :rules="[...min(10), ...max(500)]"
                      type="number"
                      v-model="lab.approxTime"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput
                      label="Disk Size (10-30) *"
                      :max="30"
                      :min="10"
                      required
                      :rules="[...min(10), ...max(30)]"
                      type="number"
                      v-model="lab.disk_size"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect
                      :disabled="!instructionFolderList.length"
                      hint="Please select the folder, click on the side button and choose documentation"
                      label="Choose folder"
                      :options="instructionFolderList"
                      sendButton
                      v-model="lab.event"
                      @send="findDocumentationByEvent"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-12" v-if="showDocs || (id ? singleLabInfo.documentations : showDocs)">
                  <q-item-section>
                    <BaseSelect
                      v-if="showDocs || (id ? singleLabInfo.documentations : showDocs)"
                      label="Documentations *"
                      multiple
                      :options="getInstructionsList"
                      :rules="required"
                      v-model="lab.documentation"
                    />
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Description *" :rules="minLength(5)" type="textarea" v-model="lab.description" />
                  </q-item-section>
                </q-item>
              </q-list>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow q-mr-sm" color="orange" label="Cancel" outline @click="cancelLabCreation()" />
                <q-btn
                  class="col-grow"
                  color="positive"
                  label="Next"
                  @click="$refs.formRef.validate().then((valid) => (valid ? (step = 2) : null))"
                />
              </q-stepper-navigation>
            </q-step>
            <q-step :name="2" title="Configuration" icon="build" :done="step > 2">
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Search Image *" required :rules="required" sendButton v-model="lab.findImage" @send="findImage" />
                  </q-item-section>
                </q-item>
                <q-item v-if="showImages" class="col-12">
                  <q-item-section>
                    <BaseSelect label="Image Name *" :options="getChitImagesList" :rules="required" v-model="imageName" />
                  </q-item-section>
                </q-item>
                <q-item v-if="showImages" class="col-12">
                  <q-item-section>
                    <BaseSelect label="Configuration *" :options="labConfigOptions" :rules="required" v-model="lab.configuration" />
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <Metadata v-model="lab.metadata" />
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseToggle label="Is Challenge Object" v-model="lab.is_challenge_object" />
                  </q-item-section>
                </q-item>
              </q-list>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow" color="orange" label="Cancel" outline @click="cancelLabCreation()" />
                <q-btn class="col-grow q-mx-sm" color="orange" label="Back" @click="step = 1" />
                <q-btn class="col-grow" color="positive" label="Next" @click="step = 3" />
              </q-stepper-navigation>
            </q-step>
            <q-step :name="3" title="Cloud Configuration" caption="Optional" icon="cloud" :done="step > 3">
              <q-item class="col-12">
                <q-item-section>
                  <BaseToggle label="is Cloud" v-model="isCloud" />
                </q-item-section>
              </q-item>
              <q-item class="col-12" v-if="isCloud">
                <q-item-section>
                  <BaseSelect label="Cloud Type *" :options="listCloudTypes" :rules="required" v-model="cloudType" />
                </q-item-section>
              </q-item>
              <q-item class="col-12" v-if="isCloud && (cloudType ? cloudType.value === 'aws' : false)">
                <q-item-section>
                  <BaseSelect label="Select OU *" :options="listAWSOU" :rules="required" v-model="awsOuId" />
                </q-item-section>
              </q-item>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow" color="orange" label="Cancel" outline @click="cancelLabCreation()" />
                <q-btn class="col-grow q-mx-sm" color="orange" label="Back" @click="step = 2" />
                <q-btn class="col-grow" color="positive" label="Next" @click="step = 4" />
              </q-stepper-navigation>
            </q-step>
            <q-step
              :name="4"
              title="Review"
              icon="list"
              :disable="(isCloud && !cloudType?.value) || (isCloud && cloudType?.value && cloudType.label === 'AWS' && !awsOuId)"
            >
              <TimeLine
                :cloudInfo="{ isCloud: isCloud, cloudType: cloudType, awsOuId: awsOuId }"
                :data="{ ...lab, ...{ imageName: imageName } }"
              />
              <q-stepper-navigation class="row">
                <q-btn class="col-grow" color="orange" label="Cancel" outline @click="cancelLabCreation()" />
                <q-btn class="col-grow q-mx-sm" color="orange" label="Back" @click="step = 3" />
                <q-btn class="col-grow" color="positive" label="Done" type="submit" />
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import TimeLine from 'components/lab/TimeLine.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseToggle from 'components/shared/BaseToggle.vue'
import Metadata from 'components/shared/Metadata.vue'
import { useCourseStore, useLabsStore } from 'src/stores'
import { max, min, minLength, required } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const labsStore = useLabsStore()
const courseStore = useCourseStore()
const props = defineProps(['id', 'show'])
const emit = defineEmits(['onCancel'])
const awsOuId = ref(null)
const cloudType = ref(null)
const imageName = ref(null)
const isCloud = ref(false)
const lab = ref({
  name: '',
  approxTime: undefined,
  event: null,
  documentation: undefined,
  description: '',
  findImage: null,
  update_lab_id: null,
  region: null,
  configuration: 'e2-small',
  metadata: undefined,
  is_challenge_object: false,
  disk_size: 10
})
const labConfigOptions = ref([
  { label: 'e2-small', value: 'e2-small' },
  { label: 'e2-medium', value: 'e2-medium' },
  { label: 'e2-standard-2', value: 'e2-standard-2' },
  { label: 'e2-standard-4', value: 'e2-standard-4' }
])
const listAWSOU = ref([])
const listCloudTypes = ref([
  { label: 'AWS', value: 'aws' },
  { label: 'Azure', value: 'azure' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'GCP', value: 'gcp' },
  { label: 'Runtime', value: 'runtime' }
])
const showDocs = ref(false)
const showImages = ref(false)
const step = ref(1)
const dataShow = ref(props.show)

const fetchListChallengeLabs = computed(() => (labsStore.listChallengeLabs.length > 0 ? [...new Set(labsStore.listChallengeLabs)] : []))
const fetchListLabs = computed(() => (labsStore.listLabs.length > 0 ? [...new Set(labsStore.listLabs)] : []))
const fetchStatusOfApi = computed(() => labsStore.statusOfApi)
const getChitImagesList = computed(() => (labsStore.chitImageList.length > 0 ? labsStore.chitImageList : []))
const getChitImageStatus = computed(() => labsStore.statusChitImages)
const getInstructionsList = computed(() => (labsStore.allInstructionsList.length > 0 ? labsStore.allInstructionsList : []))
const listOuIdInfoGetter = computed(() => labsStore.listOuIdInfo)
const singleLabInfo = computed(() => labsStore.labInfo)
const instructionFolderList = computed(() =>
  courseStore.instructionFolderOptions.length > 0 ? [...new Set(courseStore.instructionFolderOptions)] : []
)

onMounted(async () => {
  if (!instructionFolderList.value.length) {
    await courseStore.fetchInstructionDirectory()
  }

  if (!listOuIdInfoGetter.value.length) {
    await labsStore.fetchOuIDList()
  }
  listAWSOU.value = listOuIdInfoGetter.value.map((data) => ({ label: data.name, value: data.sk }))

  if (props.id) {
    const listLab =
      fetchListLabs.value.find((lab) => lab.sk === props.id) || fetchListChallengeLabs.value.find((lab) => lab.sk === props.id)
    lab.value.name = listLab.name
    lab.value.approxTime = parseInt(listLab.approx_time)
    lab.value.disk_size = listLab.disk_size ? parseInt(listLab.disk_size) : 10
    const documentations = Array.isArray(listLab.documentations)
      ? listLab.documentations
      : [listLab.documentations || listLab.documentation_filename]
    lab.value.documentation = documentations.map((infoData) => ({ label: infoData, value: infoData }))
    lab.value.event = instructionFolderList.value.find((data) =>
      [lab.value.documentation[0]?.value?.split('/')[0], listLab.documentation_filename?.split('/')[0]].includes(data.value)
    )
    findDocumentationByEvent(lab.value.event)
    lab.value.description = listLab.description

    lab.value.findImage = listLab.image_id
    if (lab.value.findImage) {
      findImage({ show: true, name: listLab.image_id })
    }
    imageName.value = { label: listLab.image_id, value: listLab.image_id }
    lab.value.configuration = listLab.configuration
    lab.value.metadata = listLab.metadata
    lab.value.is_challenge_object = listLab.is_challenge_object || false

    isCloud.value = listLab.is_cloud || false
    cloudType.value = { label: listLab.cloud_type, value: listLab.cloud_type }
    awsOuId.value = listAWSOU.value?.find((data) => data.value === listLab.ou_id)
    lab.value.update_lab_id = listLab.id
  }
})

async function findDocumentationByEvent(event) {
  if (event?.value) {
    showDocs.value = true
    await labsStore.fetchInstructionsBySubject({ select: event.value })
  }
}
async function finish() {
  const payload = {
    approx_time: parseInt(lab.value.approxTime),
    cloud_type: cloudType.value,
    configuration: lab.value.configuration?.value || lab.value.configuration,
    description: lab.value.description,
    documentations: lab.value?.documentation?.map((lb) => lb?.value),
    image_id: this.imageName?.value || this.imageName,
    is_challenge_object: lab.value.is_challenge_object,
    is_cloud: this.isCloud,
    lab_id: lab.value.update_lab_id,
    lab_name: lab.value.name,
    lab_ttl: parseInt(lab.value.approxTime * 60),
    disk_size: parseInt(lab.value.disk_size)
  }
  if (lab.value.metadata) {
    payload.metadata = lab.value.metadata
  }
  if (cloudType.value === 'aws') {
    payload.ou_id = awsOuId.value
  }
  if (props.id) {
    const listLab =
      fetchListLabs.value.find((lab) => lab.sk === props.id) || fetchListChallengeLabs.value.find((lab) => lab.sk === props.id)
    await labsStore.updateLab(compareFunction('labsUpdate', payload, listLab))
  } else {
    await labsStore.createLab(payload)
  }
  if (fetchStatusOfApi.value) {
    emit('onCancel', { show: true })
  } else {
    emit('onCancel', { show: false })
  }
}
function cancelLabCreation() {
  emit('onCancel', { show: true })
}
async function findImage(event) {
  const searchRecord = lab.value.findImage || event.Name
  await labsStore.fetchChitImages(searchRecord)
  if (getChitImageStatus.value && getChitImagesList.value.length > 0) {
    showImages.value = true
  } else {
    showImages.value = false
    if (lab.value.region) {
      lab.value.region = null
    }
    if (imageName.value) {
      imageName.value = ''
    }
  }
}
</script>
