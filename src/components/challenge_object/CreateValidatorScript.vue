<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card dark style="width: 750px; max-width: 90vw">
      <q-card-section>
        <div class="text-subtitle1">
          <q-icon name="code" />
          {{ data.sk ? 'Update Validator Script' : 'Create Validator Script' }}
          <q-separator spaced dark />
        </div>
      </q-card-section>
      <q-form greedy @submit="onSubmit()">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput autofocus label="Script Name *" required :rules="minLength(2)" v-model="validator_script.name" />
                <p v-if="fetchErrorMsgs.name" class="text-caption text-negative">{{ fetchErrorMsgs.name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseSelect label="Script Type *" :options="script_type_options" :rules="required" v-model="validator_script.type" />
                <p v-if="fetchErrorMsgs.type" class="text-caption text-negative">{{ fetchErrorMsgs.type_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseFile clearable v-model="validator_script.file" @update:model-value="uploadFile($event)" />
                <p v-if="fetchErrorMsgs.file" class="text-caption text-negative">{{ fetchErrorMsgs.file_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseInput copyButton label="Script URL *" :maxlength="-1" readonly required v-model="validator_script.url" />
                <p v-if="fetchErrorMsgs.url" class="text-caption text-negative">{{ fetchErrorMsgs.url_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Invoke Order" type="number" v-model="validator_script.invoke_order" />
                <p v-if="fetchErrorMsgs.invoke_order" class="text-caption text-negative">{{ fetchErrorMsgs.invoke_order_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseInput label="Code Dir File" v-model="validator_script.code_dir_file" />
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseInput label="Target URI" v-model="validator_script.target_uri" />
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseInput label="Entrypoint" required v-model="validator_script.entrypoint" />
                <p v-if="fetchErrorMsgs.entrypoint" class="text-caption text-negative">{{ fetchErrorMsgs.entrypoint_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Output File *" required :rules="minLength(2)" v-model="validator_script.output_file" />
                <p v-if="fetchErrorMsgs.output_file" class="text-caption text-negative">{{ fetchErrorMsgs.output_file_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseInput label="Script Out File *" required :rules="minLength(2)" v-model="validator_script.script_out_file" />
                <p v-if="fetchErrorMsgs.script_out_file" class="text-caption text-negative">{{ fetchErrorMsgs.script_out_file_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Validate Query *" required :rules="minLength(2)" v-model="validator_script.validate_query" />
                <p v-if="fetchErrorMsgs.validate_query" class="text-caption text-negative">{{ fetchErrorMsgs.validate_query_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12" v-if="!isScriptTypeCallback">
              <q-item-section>
                <BaseInput label="Run Command *" required :rules="minLength(2)" v-model="validator_script.run_command" />
                <p v-if="fetchErrorMsgs.run_command" class="text-caption text-negative">{{ fetchErrorMsgs.run_command_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autogrow label="Valid Expr" :maxlength="-1" v-model="validator_script.valid_expr" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Back</q-btn>
          <q-btn class="col-grow" color="positive" @click="onSubmit()">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { Notify } from 'quasar'
import { useChallengeStore, useCourseStore } from 'src/stores'
import { replaceEmptyString } from 'src/utils/challenge'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { minLength, required } from 'src/utils/rules'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['data', 'id', 'show'])
const emit = defineEmits('onCancel')

const validator_script = ref({
  name: '',
  type: '',
  file: [],
  url: '',
  invoke_order: 0,
  code_dir_file: '',
  target_uri: '',
  entrypoint: '',
  output_file: '',
  script_out_file: '',
  validate_query: '',
  valid_expr: '',
  run_command: ''
})
const script_type_options = ref([
  { value: 'offensive', label: 'Offensive' },
  { value: 'defensive', label: 'Defensive' },
  { value: 'callback', label: 'Callback' }
])
const dataShow = ref(true)

const challengeStore = useChallengeStore()
const courseStore = useCourseStore()
const router = useRouter()

onMounted(() => {
  resetValidation()

  if (props.data.sk) {
    validator_script.value.name = props.data.script_name
    validator_script.value.type = props.data.script_type
    validator_script.value.file = props.data.file
    validator_script.value.url = props.data.script_url
    validator_script.value.invoke_order = props.data.invoke_order
    validator_script.value.code_dir_file = props.data.code_dir_file
    validator_script.value.target_uri = props.data.target_uri
    validator_script.value.entrypoint = props.data.entrypoint
    validator_script.value.output_file = props.data.output_file
    validator_script.value.script_out_file = props.data.script_out_file
    validator_script.value.validate_query = props.data.validate_query
    validator_script.value.run_command = props.data.run_command
    validator_script.value.valid_expr = urlSafeBase64Decode(props.data.valid_expr)
  }
})

const fetchStatusOfApi = computed(() => challengeStore.statusOfApi)
const fetchErrorMsgs = computed(() => challengeStore.error_msgs)
const statusOfS3Getter = computed(() => courseStore.statusOfS3)
const isScriptTypeCallback = computed(() => {
  return validator_script.value?.type?.value === 'callback' || validator_script.value?.type === 'callback'
})

function resetValidation() {
  const errorMsgs = {
    status: true,
    name: false,
    name_msg: '',
    type: false,
    type_msg: '',
    url: false,
    url_msg: '',
    entrypoint: false,
    entrypoint_msg: '',
    output_file: false,
    output_file_msg: '',
    script_out_file: false,
    script_out_file_msg: '',
    validate_query: false,
    validate_query_msg: '',
    run_command: false,
    run_command_msg: ''
  }
  challengeStore.errorMsgReset(errorMsgs)
}
async function uploadFile(file) {
  let responsePost = {}
  const payload = {
    challenge_id: props.id,
    script_file: file.name
  }
  await challengeStore.uploadValidatorScript(payload)
    .then((res) => {
      responsePost = res.data
      validator_script.value.url = res.data.script_url
    })
    .catch((err) => console.error(err))
  const showDesignDataGetter = responsePost.post_url
  if (showDesignDataGetter.url && showDesignDataGetter.fields.key) {
    const signedUrl = showDesignDataGetter.url
    const form = {}
    Object.entries(showDesignDataGetter.fields).forEach(([field, value]) => {
      form[field] = value
    })
    form.file = file
    validator_script.value.file = file.name
    await courseStore.S3UploadFile({ signedUrl, form })
    if (statusOfS3Getter.value === 204) {
      validator_script.value.file = file
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
function base64encode(str) {
  const encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
  return btoa(encode)
}
function getCallbackPayload(payload) {
  return {
    script_name: payload.script_name,
    script_type: payload.script_type,
    invoke_order: parseInt(payload.invoke_order),
    output_file: payload.output_file,
    valid_expr: payload.valid_expr,
    challenge_id: payload.challenge_id,
    validate_query: payload.validate_query
  }
}
async function onSubmit() {
  const payload = {
    challenge_id: props.id,
    script_name: validator_script.value.name,
    script_type: validator_script.value.type.value,
    script_url: validator_script.value.url,
    invoke_order: parseInt(validator_script.value.invoke_order),
    code_dir_file: validator_script.value.code_dir_file,
    target_uri: validator_script.value.target_uri,
    entrypoint: validator_script.value.entrypoint,
    output_file: validator_script.value.output_file,
    script_out_file: validator_script.value.script_out_file,
    validate_query: validator_script.value.validate_query,
    valid_expr: base64encode(validator_script.value.valid_expr),
    run_command: validator_script.value.run_command
  }

  replaceEmptyString(payload, ['target_uri'])

  const requestPayload = isScriptTypeCallback.value ? getCallbackPayload(payload) : payload

  if (props.data.sk) {
    requestPayload.script_id = props.data.sk
    await challengeStore.updateValidatorScript(requestPayload)
  } else {
    await challengeStore.addValidatorScript(requestPayload)
  }
  if (fetchStatusOfApi.value) {
    validator_script.value = {
      status: true,
      name: false,
      name_msg: '',
      type: false,
      type_msg: '',
      file: false,
      file_msg: '',
      url: false,
      url_msg: '',
      invoke_order: false,
      invoke_order_msg: '',
      code_dir_file: false,
      code_dir_file_msg: '',
      target_uri: false,
      target_uri_msg: '',
      entrypoint: false,
      entrypoint_msg: '',
      output_file: false,
      output_file_msg: '',
      script_out_file: false,
      script_out_file_msg: '',
      valid_expr: false,
      valid_expr_msg: '',
      run_command: false,
      run_command_msg: ''
    }
    challengeStore.fetchListValidatorScripts({ challenge_id: props.id })
    onCancel()
  }
}
function onCancel() {
  emit('onCancel', { show: true })
}
</script>
