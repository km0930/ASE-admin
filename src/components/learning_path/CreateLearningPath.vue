<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Learning Path' : 'Create Learning Path' }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit.prevent="onSubmit()">
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autofocus label="Name *" required :rules="shortName" v-model="learningPath.name" />
                <p v-if="fetchErrorMsgs.name_msg" class="text-caption text-negative">{{ fetchErrorMsgs.name_msg_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Description *" required :rules="minLength(5)" type="textarea" v-model="learningPath.description" />
                <p v-if="fetchErrorMsgs.description" class="text-caption text-negative">{{ fetchErrorMsgs.description_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseFile
                  accept=".jpg, image/*"
                  hint="Use a square image for best result"
                  label="Image *"
                  :max-files="1"
                  :maxTotalSize="5000000"
                  v-model="learningPath.logo"
                  @clear="onClear()"
                  @update:model-value="onFileSelected($event)"
                />
                <p v-if="fetchErrorMsgs.logo" class="text-caption text-negative">{{ fetchErrorMsgs.logo_msg }}</p>
                <div v-if="imageData" class="flex q-mt-sm q-mx-auto">
                  <q-img :src="imageData" :ratio="1" width="150px" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn class="col-grow" color="positive" :disable="!learningPath.name || !learningPath.description || !imageData" type="submit">
            Save
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import { useLearningPathStore } from 'src/stores'
import { minLength, shortName } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, defineEmits, onMounted, ref } from 'vue'

const learningPathStore = useLearningPathStore()
const props = defineProps(['id', 'show', 'mapOptions'])
const logoName = ref('')
const imageData = ref('')
const b64Photo = ref('')
const learningPath = ref({
  name: '',
  description: ''
})
const dataShow = ref(props.show)
const emit = defineEmits(['onCacel'])

const fetchErrorMsgs = computed(() => learningPathStore.error_msgs)
const fetchStatusOfApi = computed(() => learningPathStore.statusOfApi)
const singleLearningPathInfo = computed(() =>
  Object.keys(learningPathStore.learningPathInfo).length > 0 ? learningPathStore.learningPathInfo : {}
)
const learningPathList = computed(() =>
  learningPathStore.listLearningPath.length > 0 ? [...new Set(learningPathStore.listLearningPath)] : []
)

onMounted(async () => {
  if (props.id) {
    const showLearningPath = learningPathList.value.find((item) => item.id === props.id)
    learningPath.value = {
      name: showLearningPath.name,
      description: showLearningPath.description
    }
    imageData.value = showLearningPath.value.logo ? showLearningPath.value.logo : null
  }
})
const onClear = () => {
  imageData.value = ''
}
const onFileSelected = (file) => {
  logoName.value = file?.name || ''
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageData.value = e.target.result
      const imageSplit = e.target.result.split(';')
      const getOnlyB64Val = imageSplit[1].split(',')
      b64Photo.value = getOnlyB64Val[1]
    }
    reader.readAsDataURL(file)
  }
}
const onSubmit = async () => {
  const data = {
    learning_path_name: learningPath.value.name,
    description: learningPath.value.description
  }
  if (b64Photo.value && logoName.value) {
    data.logo = b64Photo.value
    data.logo_name = logoName.value
  }
  if (props.id) {
    await learningPathStore.updateLearningPath(compareFunction('learningPathUpdate', data, singleLearningPathInfo.value))
  } else {
    await learningPathStore.createLearningPath(data)
  }
  if (fetchStatusOfApi.value) {
    learningPath.value = { name: '', description: '' }
    imageData.value = null
    b64Photo.value = null
    onCancel()
  }
}
const onCancel = () => {
  emit('onCacel', { show: true })
}
</script>
