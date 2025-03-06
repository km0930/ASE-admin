<template>
  <q-select
    :autofocus="autofocus"
    bottom-slots
    :clearable="clearable"
    color="white"
    dark
    dense
    :disable="disable"
    fill-input
    :hide-dropdown-icon="Boolean(newValueMode)"
    :hide-selected="!multiple"
    :hide-hint="hideHint"
    :hint="hint"
    input-debounce="0"
    :label="label"
    label-color="white"
    lazy-rules
    :loading="loading"
    :multiple="multiple"
    :new-value-mode="newValueMode"
    outlined
    :option-disable="(item) => (item.value || item ? optionsListData(item.value || item) : true)"
    :options="selectOption"
    options-selected-class="text-orange"
    ref="selectRef"
    :rules="rules"
    use-input
    :model-value="modelValue"
    @clear="onClear"
    @filter="onFilter"
    @filter-abort="onFilterAbort"
    @popup-show="onPopupShow"
    @remove="onRemove"
    @update:model-value="$emit('update:model-value', $event)"
    @virtual-scroll="$emit('virtual-scroll', $event)"
    v-bind="$attrs"
  >
    <template v-if="!Boolean(newValueMode)" v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">No data</q-item-section>
      </q-item>
    </template>
    <template v-if="multiple || Boolean(newValueMode)" v-slot:selected-item="scope">
      <q-chip color="white" dense removable :tabindex="scope.tabindex" text-color="secondary" @remove="scope.removeAtIndex(scope.index)">
        <q-avatar v-if="avatar" color="secondary" text-color="white">
          <img :src="scope.opt.img" alt="avatar image" />
        </q-avatar>
        {{ scope.opt.label || scope.opt }}
      </q-chip>
    </template>
    <template v-slot:append>
      <q-icon v-if="searchable" class="cursor_pointer" name="search" @click="onSearch" />
    </template>
    <template v-if="sendButton" v-slot:after>
      <q-btn dense flat icon="send" round @click="$emit('send', { show: true, value: modelValue.value })" />
    </template>
    <template v-if="showMore" v-slot:after-options>
      <q-item clickable>
        <q-item-section class="text-center" style="cursor: pointer" @click="$emit('loadMoreItems')">
          <q-item-label class="text-overline text-bold">{{ loading ? '...' : 'LOAD MORE' }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  autofocus: { required: false, type: Boolean, default: false },
  avatar: { required: false, type: Boolean, default: false },
  clearable: { required: false, type: Boolean, default: true },
  disable: { required: false, type: Boolean, default: false },
  hideHint: { required: false, type: Boolean, default: false },
  hint: { required: false, type: String },
  label: { required: false, type: String, default: 'Name' },
  loading: { required: false, type: Boolean, default: false },
  modelValue: { required: false },
  multiple: { required: false, type: Boolean, default: false },
  newValueMode: { required: false, type: String },
  optionDisable: { required: false, type: Array },
  options: { required: false, type: Array, default: () => [] },
  rules: { required: false, type: Array },
  searchable: { required: false, type: Boolean, default: false },
  sendButton: { required: false, type: Boolean, default: false },
  showMore: { required: false, type: Boolean, default: false }
})

const emit = defineEmits([
  'clear',
  'filter',
  'filter-abort',
  'loadMoreItems',
  'popup-show',
  'remove',
  'search',
  'send',
  'update:model-value',
  'virtual-scroll'
])

const search = ref('')
const selectOption = ref(props.options)
const selectRef = ref(null)

watchEffect(() => {
  if (props.options.length > 0) {
    selectOption.value = props.options
  }
})

const onClear = () => {
  search.value = ''
  selectOption.value = props.options
  emit('clear')
}

const onFilter = (val, update) => {
  search.value = val
  update(() => {
    if (!val) {
      emit('filter')
      selectOption.value = props.options
    } else {
      const needle = val.toLowerCase()
      selectOption.value = props.options.filter((v) => v.label?.toLowerCase().indexOf(needle) > -1)
    }
  })
  if (selectOption.value.length > 0) {
    update()
    return
  }
  if (props.options.length === 0) {
    emit('filter')
    selectOption.value = props.options
  }
  if (!val) {
    setTimeout(() => update(() => (selectOption.value = props.options)), 1500)
    setTimeout(() => update(() => (selectOption.value = props.options)), 3000)
  }
}

const onFilterAbort = () => {
  search.value = ''
  selectOption.value = props.options
  emit('filter-abort')
}

const onPopupShow = () => {
  if (props.searchable) {
    selectRef.value.focus()
  }
  emit('popup-show')
}

const onRemove = (val) => {
  emit('remove', val)
}

const onSearch = () => {
  emit('search', search.value)
  setTimeout(() => selectRef.value.showPopup(), 1500)
}

const optionsListData = (value) => {
  if (props.optionDisable) {
    return Boolean(props.optionDisable.indexOf(value) !== -1)
  }
}
</script>
