<template>
  <p class="text-body2">{{ label }}</p>
  <div class="container">
    <q-skeleton v-if="loading" animation="blink" width="50%" height="150px" re style="border-radius: 8px" />
    <div v-else class="list">
      <input v-model="searchLeft" placeholder="Search" />
      <div v-for="item in filteredLeft" :key="item.id" @click="moveItemFromTo(item, left, right)" class="row justify-between items-center">
        <span>
          {{ item.label }}
        </span>

        <slot name="left_tool" :data="item" />
      </div>
    </div>

    <div class="controls">
      <button type="button" @click="moveAllFromTo(left, right)" :disabled="loading">&gt;&gt;</button>
      <button type="button" @click="swap" :disabled="loading">&lt;-&gt;</button>
      <button type="button" @click="moveAllFromTo(right, left)" :disabled="loading">&lt;&lt;</button>
    </div>

    <q-skeleton v-if="loading" animation="blink" width="50%" height="150px" re style="border-radius: 8px" />
    <div v-else class="list">
      <input v-model="searchRight" placeholder="Search" />
      <div v-for="item in filteredRight" :key="item.id" @click="moveItemFromTo(item, right, left)">
        {{ item.label }}
        <slot name="right_tool" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  label: { type: String, required: false },
  options: { type: Array, required: true, default: () => [] },
  modelValue: { type: Array, required: true, default: () => [] },
  loading: { type: Boolean, default: () => false }
})

const left = ref([...props.options])
const right = ref([...props.modelValue])

watch(
  () => props.options,
  (newValue) => {
    left.value = [...newValue]
  },
  { immediate: true }
)
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return
    right.value = [...newValue]
  },
  { immediate: true }
)

const searchLeft = ref('')
const searchRight = ref('')

const filteredLeft = computed(() => {
  return left.value.filter((item) => item?.label?.toLowerCase().includes(searchLeft.value?.toLowerCase()))
})

const filteredRight = computed(() => {
  return right.value.filter((item) => item?.label?.toLowerCase().includes(searchRight.value?.toLowerCase()))
})

const moveItemFromTo = (item, from, to) => {
  const index = from.indexOf(item)
  from.splice(index, 1)
  to.push(item)
  emits('update:modelValue', right.value)
}

const moveAllFromTo = (from, to) => {
  to.push(...from)
  from.splice(0)
}

const swap = () => {
  const removed = left.value.splice(0, left.value.length, ...right.value)
  right.value.splice(0, right.value.length, ...removed)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
}

.list {
  border: 1px solid hsla(0, 0%, 100%, 0.6);
  color: white;
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;

  & > input {
    background: transparent;
    border: none;
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.6);
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 1em;
    outline: none;
    padding: 5px;
    text-align: center;
    width: 100%;
  }

  & > div {
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.6);
    font-size: 0.9em;
    padding: 5px;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.07);
      cursor: pointer;
    }
  }
}

.controls {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 10px 10px;
  margin: auto;

  & > button {
    background: transparent;
    border: none;
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 1rem;

    &:hover {
      cursor: pointer;
      color: hsla(0, 0%, 100%, 0.8);
    }
  }
}
</style>
