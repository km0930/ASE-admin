<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 700px; max-width: 80vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Instructor' : 'Create Instructor' }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit.prevent="onSubmit">
        <q-card-section class="q-gutter-y-sm q-mx-md">
          <BaseInput autofocus label="Name *" required :rules="shortName" v-model="instructor_name" />
          <p v-if="fetchErrorMsgs.instructor_name" class="text-caption text-negative">{{ fetchErrorMsgs.instructor_name_msg }}</p>
          <BaseEditor label="About *" :rules="minLength(2)" v-model="about" />
          <p v-if="fetchErrorMsgs.about" class="text-caption text-negative">{{ fetchErrorMsgs.about_msg }}</p>
          <BaseFile
            accept=".jpg, image/*"
            hint="Use a square image for best result"
            label="Image File *"
            :max-files="1"
            :maxTotalSize="5000000"
            v-model="photo"
            @clear="onClear()"
            @update:model-value="onFileSelected($event)"
          />
          <p v-if="fetchErrorMsgs.photo" class="text-caption text-negative">{{ fetchErrorMsgs.photo_msg }}</p>
          <p v-if="fetchErrorMsgs.photo_name" class="text-caption text-negative">{{ fetchErrorMsgs.photo_name_msg }}</p>
          <q-avatar v-if="imageData" class="flex q-mt-sm q-mx-auto" size="200px">
            <q-img :src="imageData" height="auto" />
          </q-avatar>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn class="col-grow" color="positive" :disable="!instructor_name || !about || !imageData" type="submit">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseEditor from 'components/shared/BaseEditor.vue'
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import { useInstructorStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { minLength, shortName } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['id', 'show', 'title'])
const emit = defineEmits(['onCancel'])
const instructorStore = useInstructorStore()

const photoName = ref('')
const imageData = ref('')
const b64Photo = ref('')
const instructor_name = ref('')
const about = ref('')
const photo = ref(undefined)
const dataShow = ref(props.show)

const fetchlistInstructors = computed(() => instructorStore.listInstructors)
const fetchErrorMsgs = computed(() => instructorStore.error_msgs)
const fetchStatusOfApi = computed(() => instructorStore.statusOfApi)

onMounted(async () => {
  if (props.id) {
    const instructor = fetchlistInstructors.value.find((item) => item.id === props.id)
    instructor_name.value = instructor.instructor_name
    about.value = urlSafeBase64Decode(instructor.about)
    imageData.value = instructor.photo
    photo.value = [{ name: instructor.imageName }]
  }
})

function base64encode(str) {
  const encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
  return btoa(encode)
}

function onClear() {
  imageData.value = ''
}

function onFileSelected(file) {
  photoName.value = file?.name || ''
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

async function onSubmit() {
  const data = {
    instructor_name: instructor_name.value,
    about: base64encode(about.value)
  }
  if (photoName.value && b64Photo.value) {
    data.photo = b64Photo.value
    data.photo_name = photoName.value
  }
  if (props.id) {
    data.instructor_id = props.id
    const instructor = fetchlistInstructors.value.find((item) => item.id === props.id)
    await instructorStore.updateInstructor(compareFunction('instructor', data, instructor))
  } else {
    await instructorStore.createInstructor(data)
  }
  if (fetchStatusOfApi.value) {
    instructor_name.value = ''
    about.value = ''
    photoName.value = null
    imageData.value = null
    b64Photo.value = null
    onCancel()
  }
}

function onCancel() {
  emit('onCancel', { show: true })
}
</script>
