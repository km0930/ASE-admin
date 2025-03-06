<template>
  <q-card
    style="width: 760px; max-width: 90vw"
    dark
  >
    <q-card-section>
      <div class="text-subtitle1 ase-roboto text-weight-normal flex items-center q-gutter-sm">
        <q-icon name="create" />
        <p class="q-mb-none">{{ editMode ? 'Update Tag' : 'Create Tag' }}</p>
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm q-pb-lg">
      <q-form
        greedy
        @submit="onSubmit()"
      >
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item-section>
              <BaseInput
                autofocus
                label="Name *"
                v-model="tagName"
                :rules="[(val) => !!val || 'Please enter tag name', ...minLength(3)]"
              />
            </q-item-section>
          </q-list>
        </q-card-section>
        <div class="full-width flex q-px-md justify-end">
          <q-btn
            class="q-mr-sm"
            color="orange"
            outline
            @click="emit('closeModal')"
          >Cancel</q-btn>
          <q-btn
            color="positive"
            type="submit"
          >{{ editMode ? 'Save' : 'Add' }}</q-btn>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import { minLength } from 'src/utils/rules'
import { ref } from 'vue'
import { useTagsStore } from 'stores'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Object,
    default: null
  }
})

const tagName = ref(props.selected?.tag_name ?? '')

const emit = defineEmits(['closeModal'])
const tagsStore = useTagsStore()

async function onSubmit () {
  const payload = { tag_name: tagName.value }
  if (props.editMode) {
    tagName.value !== props.selected?.tag_name && (tagsStore.updateTag({ tag_id: props.selected.sk, payload }))
  } else {
    tagsStore.createTag(payload)
  }
  emit('closeModal')
}
</script>
<style></style>
