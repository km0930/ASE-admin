<template>
  <div>
    <q-select
      filled
      use-input
      input-debounce="500"
      :options="options"
      @filter="filterFn"
      behavior="menu"
      v-model="model"
      color="white"
      dark
      :loading="loading"
      options-selected-class="text-orange"
      dense
      v-bind="$attrs"
      outlined
      :multiple="multiple"
      :label="label"
      :rules="rules"
      clearable
      @clear="removeEvent"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">No results</q-item-section>
        </q-item>
      </template>
      <template v-if="showMore" v-slot:after-options>
        <q-item>
          <q-item-section class="text-center" style="cursor: pointer" @click="$emit('loadMoreItems')">
            <label v-if="loading">...</label>
            <label v-else>
              <q-btn color="primary" label="Load more" size="sm" />
            </label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  options: Array,
  value: [String, Object, Number, Array],
  serverFiltering: { type: Boolean, default: false },
  filterCallBack: Function,
  showMore: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  label: { type: String, default: 'Name' },
  rules: Array,
  autofocus: { type: Boolean, default: false },
  avatar: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  disable: { type: Boolean, default: false },
  hideHint: { type: Boolean, default: false },
  hint: String,
  newValueMode: String,
  optionDisable: Array,
  searchable: { type: Boolean, default: false },
  sendButton: { type: Boolean, default: false }
})

const emit = defineEmits(['input', 'clear'])

const filterFn = async (val, update, abort) => {
  if (props.serverFiltering) {
    await props.filterCallBack(val)
    update(() => {})
  }
}

const removeEvent = (evt) => {
  emit('clear')
}

const model = computed({
  get: () => props.value,
  set: (value) => {
    emit('input', value)
  }
})
</script>