<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="min-width: 700px" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="code" />
          Attach/Detach Solution
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit="onSubmit()">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-12 q-mb-md">
              <q-item-section>
                <BaseFile
                  label="Solution File *"
                  multiple
                  :rules="required"
                  v-model="solution.file"
                  @update:model-value="uploadFile($event)"
                />
                <p v-if="fetchErrorMsgs.file" class="text-caption text-negative">{{ fetchErrorMsgs.file_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item v-for="(url, index) in solution.url" class="col-12 q-py-none" :key="index">
              <q-item-section>
                <BaseInput copyButton label="URL" readonly :rules="required" :model-value="url" />
                <p v-if="fetchErrorMsgs.url" class="text-caption text-negative">{{ fetchErrorMsgs.url_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item v-if="solution.created_on" class="col-6">
              <q-item-section>Created On: {{ solution.created_on }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn v-if="solution.url.length" class="col-grow" color="negative" @click="onDetach()">Detach Solutions</q-btn>
          <q-btn v-if="solution.url.length" class="col-grow" color="positive" type="submit">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import { Notify } from 'quasar'
import { useChallengeStore, useCourseStore } from 'src/stores'
import { required } from 'src/utils/rules'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['id', 'show'])
const emit = defineEmits('onCancel')

const solution = ref({
  file: [],
  url: [],
  created_on: ''
})
const dataShow = ref(true)

const challengeStore = useChallengeStore()
const courseStore = useCourseStore()
const router = useRouter()

const fetchSolution = computed(() => challengeStore.solution)
const fetchErrorMsgs = computed(() => challengeStore.error_msgs)
const statusOfS3Getter = computed(() => courseStore.statusOfS3)

onMounted(async () => {
  await challengeStore.getSolution({ challenge_id: props.id }).then(() => {
    solution.value.url = fetchSolution.value.instructions
    solution.value.created_on = new Date(fetchSolution.value.created_at).toLocaleString()
  })
})

async function uploadFile(files) {
  solution.value.url = []
  for (const file of files) {
    let responsePost = {}
    await challengeStore.uploadSolution({ challenge_id: props.id, script_file: file.name }).then((res) => (responsePost = res.data))
    const showDesignDataGetter = responsePost.post_url
    if (showDesignDataGetter.url && showDesignDataGetter.fields.key) {
      const signedUrl = showDesignDataGetter.url
      const form = {}
      Object.entries(showDesignDataGetter.fields).forEach(([field, value]) => (form[field] = value))
      form.file = file
      await courseStore.S3UploadFile({ signedUrl, form })
      if (statusOfS3Getter.value === 204) {
        solution.value.url.push(responsePost.solution_url)
      }
      if (statusOfS3Getter.value === 400) {
        Notify.create({
          type: 'negative',
          position: 'top',
          progress: true,
          icon: 'warning',
          timeout: 1100,
          message: 'Session Expired!!!'
        })
        localStorage.removeItem('token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('breadcrumbs')
        router.push('/')
      }
    }
  }
}
async function onDetach() {
  await challengeStore.detachSolution({ challenge_id: props.id }).then(() => {
    solution.value.url = []
    solution.value.created_on = ''
  })
}
async function onSubmit() {
  const payload = {
    challenge_id: props.id,
    instructions: solution.value.url
  }
  await challengeStore.attachSolution(payload).then(() => onCancel())
}
function onCancel() {
  emit('onCancel', { show: true })
}
</script>
