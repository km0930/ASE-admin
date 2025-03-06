<template>
  <q-field
    color="white"
    dark
    dense
    lazy-rules
    :maxlength="maxlength"
    outlined
    ref="editor"
    :rules="rules"
    stack-label
    :model-value="modelValue"
    @blur="!modelValue ? $refs.editor.resetValidation() : $refs.editor.validate()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template v-slot:control>
      <q-editor
        class="full-width"
        dark
        flat
        :hint="hintMessage"
        label-color="white"
        min-height="5rem"
        max-height="35vh"
        :toolbar="[['label'], ['bold', 'italic', 'underline'], ['quote', 'unordered', 'ordered'], ['undo', 'redo'], ['viewsource']]"
        toolbar-toggle-color="deep-orange-5"
        :model-value="modelValue"
        @update:model-value="$emit('update:model-value', $event)"
      >
        <template v-slot:label>{{ label }}&nbsp;&nbsp;</template>
      </q-editor>
    </template>
  </q-field>
</template>

<script setup>
defineProps({
  autofocus: { required: false, type: Boolean, default: false },
  hintMessage: { required: false, type: String, default: '' },
  label: { required: false, type: String, default: 'Name' },
  maxlength: { required: false, type: Number },
  modelValue: { required: false, type: String, default: '' },
  rules: { required: false, type: Array }
})
</script>

<style lang="scss">
.q-editor__toolbar {
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6) !important;
}
</style>
