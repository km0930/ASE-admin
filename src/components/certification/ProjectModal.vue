<script setup>
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'app/src/utils/reuseFunctions'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { maxLength, minLength } from 'src/utils/rules'

import { useCertificationStore, useLearningPathStore } from 'src/stores'
import { computed, onBeforeMount, ref, shallowRef } from 'vue'

const certificationStore = useCertificationStore()
const learningPathStore = useLearningPathStore()
const props = defineProps({
  selected: {
    type: Object,
    default: null
  }
})

const model = defineModel({ type: Boolean, required: true })

const formData = ref({
  title: '',
  description: '',
  learningPath: ''
})
const loading = shallowRef(false)

const learningPathOptions = computed(() =>
  learningPathStore.learningPathOptions.length > 0 ? [...new Set(learningPathStore.learningPathOptions)] : []
)

onBeforeMount(async () => {
  if (props.selected) {
    formData.value.title = props.selected?.title
    formData.value.description = urlSafeBase64Decode(props.selected?.description)
  }

  if (!learningPathOptions.value?.length) {
    await learningPathStore.fetchLearningPathOptions()
  }

  if (props.selected) {
    formData.value.learningPath = learningPathOptions.value?.find((learningPath) => {
      return learningPath.value === props.selected?.learning_path_id
    })
  }
})

async function onSubmit() {
  loading.value = true
  const payload = {
    ...formData.value,
    learning_path_id: formData.value.learningPath?.value,
    description: urlSafeBase64Encode(formData.value.description)
  }
  delete payload.learningPath

  const isUpdate = Boolean(props.selected && Object.keys(props.selected).length)
  if (isUpdate) {
    payload.project = props.selected?.sk
  }
  await (isUpdate ? certificationStore.updateProject(payload) : certificationStore.createProject(payload))
  model.value = false
  loading.value = false
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card style="width: 1000px; max-width: 80vw" dark>
      <q-card-section>
        <q-bar class="bg-transparent text-subtitle1 text-weight-normal">
          {{ selected ? 'Update' : 'Create' }} Projects
          <q-space />
          <q-btn flat icon="close" round @click="model = false" />
        </q-bar>
        <q-separator dark />
      </q-card-section>

      <q-card-section>
        <q-form greedy @submit="onSubmit">
          <q-card-section>
            <q-list class="row">
              <q-item class="col-12 q-px-none" style="padding-top: 20px">
                <q-item-section>
                  <BaseInput v-model="formData.title" :rules="[required, ...minLength(2), ...maxLength(100)]" label="Title *" required />
                </q-item-section>
              </q-item>
              <q-item class="col-12 q-px-none" style="padding-top: 20px">
                <q-item-section>
                  <BaseInput
                    v-model="formData.description"
                    type="textarea"
                    :rules="[required, ...minLength(2)]"
                    label="Description *"
                    required
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12 q-px-none q-pt-md">
                <q-item-section>
                  <BaseSelect
                    v-model="formData.learningPath"
                    label="Learning Path *"
                    :rules="[required]"
                    :bottomSlots="false"
                    :options="learningPathOptions"
                    required
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions class="justify-end q-px-md">
            <q-btn color="orange" outline @click="model = false">Cancel</q-btn>
            <q-btn color="positive" type="submit" :loading="loading" :disable="loading">
              {{ selected ? 'Update' : 'Create' }}
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
