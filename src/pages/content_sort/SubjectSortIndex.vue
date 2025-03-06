<template>
  <q-card class="q-px-lg q-py-md" flat dark>
    <q-card-section>
      <div class="text-subtitle1 ase-roboto text-weight-normal">Subject Order</div>
    </q-card-section>

    <q-card-section v-if="subjectsByEventOrder?.length > 0" style="max-height: 65vh; overflow: scroll">
      <draggable item-key="code" v-model="subjectsByEventOrder" @start="dragging = true" @end="dragging = false">
        <template #item="{ element }">
          <q-list bordered separator>
            <q-item class="bg-grey-10 q-my-xs" style="cursor: move" v-ripple>
              <q-item-section>{{ element.label }}</q-item-section>
            </q-item>
          </q-list>
        </template>
      </draggable>
    </q-card-section>

    <q-card-section v-if="!subjectsByEventOrder?.length">
      <div class="text-subtitle1 ase-roboto text-weight-normal">There are no subjects to sort.</div>
    </q-card-section>

    <q-card-actions>
      <q-btn class="col-grow" color="orange" outline @click="returnToCourses()">Cancel</q-btn>
      <q-btn v-if="subjectsByEventOrder?.length" class="col-grow" color="positive" @click="onSubmit()">Submit</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useSubjectStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import draggable from 'vuedraggable'

const router = useRouter()
const route = useRoute()
const selectedData = ref(null)
const dragging = ref(false)
const subjectStore = useSubjectStore()

const subjectsByEventOrder = computed({
  get: () => subjectStore.subjectsListOrder,
  set: (value) => subjectStore.LIST_SUBJECTS_ORDER(value)
})

onMounted(async () => {
  subjectStore.fetchSubjectsByEventOrder({ event_id: urlSafeBase64Decode(route.params.id) })
  selectedData.value = subjectsByEventOrder.value
})

watch(subjectsByEventOrder, (value) => {
  if (value) {
    selectedData.value = null
    selectedData.value = value
  }
})
function onSubmit() {
  const subjectData = selectedData.value.map((sub, i) => ({ id: sub.code, item_order: parseInt(i) }))
  subjectStore.createSubjectOrder({ subject_items: subjectData })
  router.push('/portal/courses')
}
function returnToCourses() {
  router.push('/portal/courses')
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
