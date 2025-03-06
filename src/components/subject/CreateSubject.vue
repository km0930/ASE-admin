<template>
  <Page :title="title">
    <q-form greedy @submit="onSubmit()">
      <q-list class="row">
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <BaseInput autofocus required :rules="required" v-model="subject.subject_name" />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <BaseInput label="Description" required :rules="required" type="textarea" v-model="subject.description" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-card-actions>
        <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
        <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
      </q-card-actions>
    </q-form>
  </Page>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import Page from 'components/shared/coursePage'
import { useSubjectStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { required } from 'src/utils/rules'
import { computed, ref, watch } from 'vue'

const props = defineProps(['id', 'title', 'subjectId'])
const subject = ref({
  subject_name: '',
  description: '',
  event_id: urlSafeBase64Decode(props.id),
  subject_id: ''
})

const subjectStore = useSubjectStore()
const singleSubjectInfo = computed(() => (Object.keys(subjectStore.subject).length > 0 ? subjectStore.subject : []))
watch(singleSubjectInfo, (newValue) => {
  if (newValue) {
    subject.value.subject_name = newValue.name
    subject.value.description = newValue.description
  }
})

async function onSubmit() {
  if (props.subjectId) {
    subject.value.subject_id = props.subjectId
    await subjectStore.updateSubject(subject.value)
  } else {
    await subjectStore.createSubject(subject.value)
  }
  subject.value = {}
  onCancel()
}
function onCancel() {
  emit('onCancel', { show: true })
}
</script>
