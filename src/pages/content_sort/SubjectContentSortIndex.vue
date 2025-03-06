<template>
  <q-card class="q-px-lg q-py-md" flat dark>
    <q-card-section>
      <div class="text-subtitle1 ase-roboto text-weight-normal">Sorting {{ subjectContentHeader.name }} Subject Contents</div>
    </q-card-section>

    <q-card-section v-if="fetchSubjectContentsList?.length" style="max-height: 65vh; overflow: scroll">
      <draggable item-key="code" v-model="fetchSubjectContentsList" @start="dragging = true" @end="dragging = false">
        <template #item="{ element }">
          <q-list bordered separator>
            <q-item class="bg-grey-10 q-my-xs" style="cursor: move" v-ripple>
              <q-item-section side>
                <q-icon v-if="element.code.split('#')[3].split('_')[0] === 'lab'" name="fas fa-flask" size="14px" color="white" />
                <q-icon v-if="element.code.split('#')[3].split('_')[0] === 'vid'" color="white" name="fas fa-video" size="14px" />
                <q-icon v-if="element.code.split('#')[3].split('_')[0] === 'quiz'" color="white" name="fas fa-question" size="14px" />
                <q-icon v-if="element.code.split('#')[3].split('_')[0] === 'download'" color="white" name="fas fa-download" size="14px" />
                <q-icon v-if="element.code.split('#')[3].split('_')[0] === 'media'" color="white" name="fas fa-photo-video" size="14px" />
              </q-item-section>
              <q-item-section>
                {{ element.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </draggable>
    </q-card-section>

    <q-card-section v-if="!fetchSubjectContentsList?.length">
      <div class="text-subtitle1 ase-roboto text-weight-normal">There are no content to sort</div>
    </q-card-section>

    <q-card-actions>
      <q-btn class="col-grow" color="orange" outline @click="$router.go(-1)">Cancel</q-btn>
      <q-btn v-if="fetchSubjectContentsList?.length" class="col-grow" color="positive" @click="onSubmit(subjectContentHeader.id)">
        Submit
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useSubjectStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

const router = useRoute()
const subjectStore = useSubjectStore()
const selectedData = ref(null)
const dragging = ref(false)
const param = ref('')
const subjectId = ref('')

onMounted(async () => {
  param.value = urlSafeBase64Decode(router.params.courseId)
  subjectId.value = urlSafeBase64Decode(router.params.subjectId)
  subjectStore.subjectContentsList({ event_id: param.value, subject_id: subjectId.value })
})
const subjectContentHeader = computed(() => (Object.keys(subjectStore.subjectHeader).length > 0 ? subjectStore.subjectHeader : []))
const fetchSubjectContentsList = computed({
  get: () => subjectStore.contentOptions,
  set: (value) => subjectStore.CONTENTS_OPTION(value)
})
watch(fetchSubjectContentsList, (value) => {
  if (value) {
    selectedData.value = null
    selectedData.value = value
  }
})
async function onSubmit(id) {
  const subjectData = selectedData.value.map((sub, i) => ({ id: sub.code, item_order: parseInt(i) }))
  await subjectStore.createSubjectContentsOrder({ subject_id: id, subject_items: subjectData })
  await subjectStore.subjectContentsList({ event_id: param.value, subject_id: subjectId.value })
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px grey;
  border-radius: 12px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff754c;
  border-radius: 12px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ff754c;
}
</style>
