<template>
  <q-toggle
    checked-icon="check"
    color="green"
    dark
    dense
    :disable="disable"
    :label="label"
    unchecked-icon="clear"
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
  />
</template>

<script setup>
defineProps({
  disable: { required: false, type: Boolean, default: false },
  label: { required: false, type: String },
  modelValue: { required: false, type: Boolean }
})
</script>
