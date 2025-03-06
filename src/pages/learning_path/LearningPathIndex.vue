<template>
  <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab">
    <q-tab name="learning_path" label="Learning Path" />
    <q-tab name="statistics" label="Statistics" />
  </q-tabs>
  <q-separator dark />
  <q-tab-panels animated dark v-model="tab">
    <q-tab-panel name="learning_path">
      <LearningPathTable
        v-if="!isCreate && !isDelete"
        @showLearningPathCreate="createNewLearningPath($event)"
        @showUpdateLearningPath="updateNewLearningPath($event)"
        @showDeleteLearningPath="deleteNewLearningPath($event)"
      />
      <CreateLearningPath
        v-if="isCreate && !isDelete"
        :id="updateId"
        :mapOptions="fetchlistPlans"
        :show="isCreate"
        v-model:name="typeCreate"
        @onCacel="cancelCreateLearningPath($event)"
      />
      <Delete
        v-if="isDelete"
        :header="'a Learning Path'"
        :show="isDelete"
        @confirmDelete="learningPathConfirmDeletion($event)"
        @confirmDeleteCancel="learningPathConfirmDeleteCancel($event)"
      />
    </q-tab-panel>

    <q-tab-panel name="statistics">
      <BarChartLp
        :barChartCategories="fetchLearningPathsCountsGetter.labels"
        :barChartData="fetchLearningPathsCountsGetter.data"
        barChartName="Popular Learning Paths"
        title="Popular Learning Paths"
      />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import BarChartLp from 'components/echarts-latest/bar-chart-vertical'
import CreateLearningPath from 'components/learning_path/CreateLearningPath'
import LearningPathTable from 'components/learning_path/LearningPathTable'
import Delete from 'components/shared/Delete.vue'
import { useLearningPathStore, useMapStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const learningPathStore = useLearningPathStore()
const mapStore = useMapStore()

const fetchLearningPathsCountsGetter = computed(() => learningPathStore.learningPathsEnrollmentCounts)
const learningPathList = computed(() =>
  learningPathStore.listLearningPath.length > 0 ? [...new Set(learningPathStore.listLearningPath)] : []
)
const searchByNameGetter = computed(() => learningPathStore.searchByName)
const searchFireActive = computed(() => learningPathStore.searchFire)
const fetchlistPlans = computed(() => mapStore.listPlans)

const isCreate = ref(false)
const isDelete = ref(false)
const updateId = ref('')
const title = ref('')
const learningPathId = ref('')
const typeCreate = ref('')
const tab = ref('learning_path')

onMounted(async () => {
  if (learningPathList.value.length === 0 && searchByNameGetter.value.length === 0 && !searchFireActive.value) {
    const data = {
      pagination: {},
      reset: false
    }
    await learningPathStore.fetchLearningPaths(data)
  }
  learningPathStore.fetchLearningPathsEnrollmentCounts()
})

async function createNewLearningPath(event) {
  learningPathStore.errorMsgReset({
    learning_path_name: false,
    learning_path_name_msg: '',
    description: false,
    description_msg: '',
    logo: false,
    logo_msg: '',
    price_id: false,
    price_id_msg: ''
  })
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      title.value = ''
      title.value = 'Create Learning Path'
      isCreate.value = true
      updateId.value = ''
    }
  }
}
function cancelCreateLearningPath(event) {
  if (event.show) {
    isCreate.value = false
  }
}
async function updateNewLearningPath(event) {
  learningPathStore.errorMsgReset({
    learning_path_name: false,
    learning_path_name_msg: '',
    description: false,
    description_msg: '',
    logo: false,
    logo_msg: '',
    price_id: false,
    price_id_msg: ''
  })
  if (event.show) {
    if (isCreate.value) {
      isCreate.value = false
    } else {
      updateId.value = event.id
      title.value = ''
      title.value = 'Update Learning Path'
      isCreate.value = true
    }
  }
}
function deleteNewLearningPath(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      learningPathId.value = ''
      learningPathId.value = event.id
    }
  }
}
function learningPathConfirmDeletion(event) {
  if (event.show) {
    const data = {
      learning_path_id: learningPathId.value
    }
    learningPathStore.deleteLearningPath(data)
    learningPathId.value = ''
    isDelete.value = false
  }
}
function learningPathConfirmDeleteCancel(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
    }
  }
}
</script>
