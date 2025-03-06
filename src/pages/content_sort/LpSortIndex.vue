<template>
  <div>
    <q-card class="q-px-lg q-py-md" flat dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">Sorting: {{ lpName }}</div>
      </q-card-section>

      <q-card-section v-if="fetchLearningPathEvents?.length" style="max-height: 65vh; overflow: scroll">
        <draggable item-key="code" v-model="fetchLearningPathEvents" @start="dragging = true" @end="dragging = false">
          <template #item="{ element }">
            <q-list bordered separator>
              <q-item class="bg-grey-10 q-my-xs" style="cursor: move" v-ripple>
                <q-item-section>{{ element.name }}</q-item-section>
              </q-item>
            </q-list>
          </template>
        </draggable>
      </q-card-section>
      <q-card-section v-if="!fetchLearningPathEvents?.length">
        <div class="text-subtitle1 ase-roboto text-weight-normal">There are no content to sort</div>
      </q-card-section>

      <q-card-actions>
        <q-btn class="col-grow" color="orange" outline @click="router.go(-1)">Cancel</q-btn>
        <q-btn v-if="fetchLearningPathEvents?.length" class="col-grow" color="positive" @click="onSubmit()">Submit</q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="showDialogInformation" persistent>
      <q-card style="min-width: 450px" transition-show="flip-up" transition-hide="flip-down" dark>
        <q-card-section>
          <div class="portal_lg">Status order</div>
        </q-card-section>
        <q-separator />
        <br />
        <q-card-section class="q-pt-none">
          {{ fetchErrorMsgsOrder.order_msg }}
        </q-card-section>
        <q-card-section class="error_msg_color"></q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="primary" size="sm" label="Cancel" @click="confirmStatusCancel()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useLearningPathStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

const router = useRoute()
const learningPathStore = useLearningPathStore()
const selectedData = ref(null)
const dragging = ref(false)
const showDialogInformation = ref(false)
const lpId = ref(urlSafeBase64Decode(router.params.lpId))
const lpName = ref(urlSafeBase64Decode(router.params.lpName))
onMounted(async () => {
  learningPathStore.fetchIndividualLearningPathEvents({ lp_id: lpId.value })
})

const fetchLearningPathEvents = computed({
  get: () => learningPathStore.learningPathEvents,
  set: (value) => learningPathStore.LEARNING_PATH_EVENTS(value)
})
const fetchErrorMsgsOrder = computed(() => learningPathStore.error_msgs_order)

watch(fetchLearningPathEvents, (newData) => {
  selectedData.value = newData
})

async function onSubmit() {
  const eventsData = {}
  for (const [i, eve] of selectedData.value.entries()) {
    eventsData[eve.id] = parseInt(i)
  }
  await learningPathStore.createEventsContentsOrder({ learning_path_id: lpId.value, order: eventsData })
  showDialogInformation.value = Boolean(fetchErrorMsgsOrder.value.status)

  if (!fetchErrorMsgsOrder.value.status) {
    await learningPathStore.fetchIndividualLearningPathEvents({ lp_id: lpId.value })
  }
}
function confirmStatusCancel() {
  showDialogInformation.value = false
}
</script>
<style scoped>
::-webkit-scrollbar {
  width: 5px;
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
