<template>
  <div class="flex q-mb-md q-gutter-md">
    <BaseFile
      accept=".json,.yml"
      :bottom-slots="false"
      class="col-grow"
      :counter="false"
      label="Metadata"
      v-model="metadataFile"
      @update:model-value="onCodeSelected"
    />
    <q-btn color="white" icon="download" :label="language.toUpperCase()" outline @click="onDownloadValue" />
  </div>
  <Codemirror
    :extensions="extensions"
    :style="{ minHeight: '10rem', maxHeight: '30rem', maxWidth: '100%' }"
    :tab-size="2"
    v-model="value"
  />
</template>

<script setup>
import { json } from '@codemirror/lang-json'
import { StreamLanguage } from '@codemirror/language'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import BaseFile from './BaseFile.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

let extensions = [undefined, oneDark]
const metadataFile = ref(null)

const language = computed(() => {
  const valueStart = value.value?.trim().charAt(0)
  const newExtensions = [...extensions]

  if (['{', '[', "'", '"', '`'].includes(valueStart) || /^(true|false|null|undefined|NaN|Infinity|-Infinity)/.test(value.value)) {
    newExtensions[0] = json()
    extensions = newExtensions
    return 'json'
  }
  newExtensions[0] = StreamLanguage.define(yaml)
  extensions = newExtensions
  return 'yaml'
})

const value = computed({
  get() {
    return isBase64(props.modelValue) ? urlSafeBase64Decode(props.modelValue) : JSON.stringify(props.modelValue, null, 2) || ''
  },
  set(value) {
    emit('update:modelValue', urlSafeBase64Encode(value))
  }
})

onMounted(() => {
  value.value = isBase64(props.modelValue) ? urlSafeBase64Decode(props.modelValue) : JSON.stringify(props.modelValue, null, 2) || ''
})

function isBase64(str) {
  try {
    return btoa(atob(str)) === str
  } catch (e) {
    return false
  }
}

function onCodeSelected(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    value.value = urlSafeBase64Decode(e.target.result.split(/base64,/)[1])
  }
  reader.readAsDataURL(file)
}

function onDownloadValue() {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(value.value))
  element.setAttribute('download', `metadata.${language.value}`)

  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>
