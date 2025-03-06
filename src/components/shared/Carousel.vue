<template>
  <q-carousel
    animated
    arrows
    class="bg-primary q-mt-md rounded-borders shadow-1 text-white"
    control-color="white"
    height="20rem"
    infinite
    padding
    swipeable
    navigation
    navigation-active-icon="radio_button_checked"
    navigation-icon="radio_button_unchecked"
    transition-prev="scale"
    transition-next="scale"
    :model-value="data"
    v-model="slide"
  >
    <q-carousel-slide v-for="(item, index) of data" class="q-px-none" :key="index" :name="index">
      <q-scroll-area class="fit">
        <div class="flex items-center justify-center" style="height: 15.25rem">
          <q-markdown no-line-numbers>{{ item }}</q-markdown>
        </div>
      </q-scroll-area>
    </q-carousel-slide>
    <q-carousel-slide :name="data.length" class="column no-wrap flex-center">
      <q-btn flat icon="add" round size="2rem" @click="openDialog('add')" />
    </q-carousel-slide>

    <template v-slot:control v-if="slide !== data.length">
      <q-carousel-control class="q-gutter-sm" position="bottom-right" :offset="[18, 18]">
        <q-btn color="white" dense icon="edit" round size="sm" text-color="primary" @click="openDialog('edit')" />
        <q-btn color="white" dense icon="delete" round size="sm" text-color="primary" @click="deleteSlide" />
      </q-carousel-control>
    </template>
  </q-carousel>

  <q-dialog v-model="dialog" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card dark style="width: 35rem; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">{{ editing ? 'Edit Hint' : 'Add Hint' }}</div>
      </q-card-section>
      <q-form @submit.prevent="onSubmit">
        <q-card-section class="q-pt-none">
          <BaseInput
            autofocus
            dark
            dense
            outlined
            required
            :rules="[(val) => val?.length >= 2 || 'Please enter at least 2 characters']"
            type="textarea"
            v-model="text"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" label="Cancel" outline v-close-popup />
          <q-btn class="col-grow" color="positive" :label="editing ? 'Update' : 'Add Hint'" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps(['modelValue'])

const data = ref([...props.modelValue])
const dialog = ref(false)
const editing = ref(false)
const slide = ref(0)
const text = ref(null)

const openDialog = (mode) => {
  dialog.value = true
  editing.value = mode === 'edit'
  text.value = data.value[slide.value]
}

const onSubmit = async () => {
  if (editing.value) {
    data.value[slide.value] = text.value
  } else {
    data.value.push(text.value)
  }
  emits('update:modelValue', data.value)
  dialog.value = false
  slide.value++
  await new Promise((resolve) => setTimeout(resolve, 100))
  slide.value--
}

const deleteSlide = () => {
  data.value.splice(slide.value, 1)
  slide.value = 0
  emits('update:modelValue', data.value)
}
</script>
