<template>
  <q-input
    :autofocus="autofocus"
    :autogrow="autogrow"
    :bottom-slots="bottomSlots"
    :clearable="clearable"
    color="white"
    dark
    :debounce="debounce"
    dense
    :disable="disable"
    :hide-hint="hideHint"
    :hint="hint"
    :label="label"
    label-color="white"
    lazy-rules
    :max="max"
    :maxlength="maxlength"
    :min="min"
    outlined
    :prefix="prefix"
    :readonly="readonly"
    ref="input"
    :required="required"
    :rules="rules"
    :suffix="suffix"
    :type="['date', 'time'].includes(type) ? 'text' : type"
    :model-value="modelValue"
    @blur="!modelValue ? $refs.input.resetValidation() : $refs.input.validate()"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template v-slot:append>
      <q-icon v-if="type === 'date'" name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date mask="YYYY/MM/DD" :options="options" :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
      <q-icon v-if="type === 'time'" name="access_time" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-time format24h :model-value="modelValue" @update:model-value="$emit('update:model-value', $event)">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
      <q-btn v-if="copyButton" round flat icon="content_copy" size="sm" @click="copyText" />
    </template>
    <template v-if="sendButton" v-slot:after>
      <q-btn round dense flat icon="send" @click="$emit('send', { show: true, name: modelValue })" />
    </template>
  </q-input>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

defineEmits(['update:model-value', 'send'])

const props = defineProps({
  autofocus: { required: false, type: Boolean, default: false },
  autogrow: { required: false, type: Boolean, default: false },
  bottomSlots: { required: false, type: Boolean, default: true },
  clearable: { required: false, type: Boolean, default: false },
  copyButton: { required: false, type: Boolean, default: false },
  debounce: { required: false, type: Number, default: 0 },
  disable: { required: false, type: Boolean, default: false },
  hideHint: { required: false, type: Boolean, default: true },
  hint: { required: false, type: String },
  label: { required: false, type: String, default: 'Name' },
  max: { required: false, type: Number },
  maxlength: { required: false, type: Number },
  min: { required: false, type: Number },
  modelValue: { required: false },
  options: { required: false, type: Function },
  prefix: { required: false, type: String },
  readonly: { required: false, type: Boolean, default: false },
  required: { required: false, type: Boolean, default: false },
  rules: { required: false, type: Array },
  sendButton: { required: false, type: Boolean, default: false },
  suffix: { required: false, type: String },
  type: { required: false, type: String, default: 'text' }
})

function copyText() {
  navigator.clipboard.writeText(props.modelValue)
  $q.notify({ color: 'positive', icon: 'check_circle', message: 'Copied to clipboard', position: 'top' })
}
</script>
