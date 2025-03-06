<template>
  <q-file
    :accept="accept"
    :autofocus="autofocus"
    :bottom-slots="bottomSlots"
    clearable
    color="white"
    :counter="counter"
    dark
    dense
    :disable="disable"
    :hint="hint"
    :label="label"
    label-color="white"
    :max-files="maxFiles"
    :max-total-size="maxTotalSize"
    :multiple="multiple"
    outlined
    ref="file"
    :rules="rules"
    :model-value="modelValue"
    @blur="!modelValue ? $refs.file.resetValidation() : $refs.file.validate()"
    @clear="$emit('clear', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template v-slot:prepend>
      <q-icon name="cloud_upload" @click.stop />
    </template>
  </q-file>
</template>

<script setup>
defineEmits(['clear', 'update:model-value'])
defineProps({
  accept: { type: String, default: '' },
  autofocus: { required: false, type: Boolean, default: false },
  bottomSlots: { required: false, type: Boolean, default: true },
  counter: { required: false, type: Boolean, default: true },
  disable: { required: false, type: Boolean, default: false },
  hint: { required: false, type: String },
  label: { required: false, type: String, default: 'File' },
  maxFiles: { required: false, type: Number },
  maxTotalSize: { required: false, type: Number },
  modelValue: { required: false },
  multiple: { required: false, type: Boolean, default: false },
  rules: { required: false, type: Array }
})
</script>
