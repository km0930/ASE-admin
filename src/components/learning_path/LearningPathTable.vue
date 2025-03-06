<template>
  <div class="q-mb-sm q-pa-sm">
    <q-btn v-if="roleIsAdmin" color="primary" @click="showLearningPathCreate({ show: true })">Create</q-btn>
  </div>
  <div v-if="learningPathList">
    <div class="row">
      <div v-for="(data, index) in learningPathList" :key="index" class="col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm">
        <BoxFlashCard
          :data="data"
          @showUpdateLearningPath="showUpdateLearningPath(data.id)"
          @showDeleteLearningPath="showDeleteLearningPath(data.id)"
        />
      </div>
    </div>
    <div v-if="!isLoading && learningPathList.length === 0" class="q-mt-sm text-center">
      <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
    </div>
    <div v-if="Object.keys(instructorPathPaginationKeyForward).length > 0" class="text-center">
      <q-btn
        icon="keyboard_arrow_right"
        label="Load More"
        style="border: 2px solid white; margin: 7px 0px"
        @click="loadMoreInstructorsPath(instructorPathPaginationKeyForward)"
      />
    </div>
  </div>
</template>

<script setup>
import BoxFlashCard from 'components/learning_path/BoxFlashCard'
import { useLearningPathStore, useLoginStore } from 'src/stores'
import { computed, defineEmits } from 'vue'

const emit = defineEmits(['showLearningPathCreate', 'showUpdateLearningPath', 'showDeleteLearningPath'])
const learningPathStore = useLearningPathStore()
const loginStore = useLoginStore()

const instructorPathPaginationKeyForward = computed(() => learningPathStore.paginationKey)
const isLoading = computed(() => learningPathStore.loading)
const learningPathList = computed(() =>
  learningPathStore.listLearningPath.length > 0 ? [...new Set(learningPathStore.listLearningPath)] : []
)
const searchByNameGetter = computed(() => learningPathStore.searchByName)
const searchFireActive = computed(() => learningPathStore.searchFire)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)

function showLearningPathCreate(event) {
  if (event.show) {
    emit('showLearningPathCreate', { show: true })
  }
}
function showUpdateLearningPath(id) {
  emit('showUpdateLearningPath', { show: true, id: id })
}
function showDeleteLearningPath(id) {
  emit('showDeleteLearningPath', { show: true, id: id })
}
function loadMoreInstructorsPath(pagination) {
  let data = {}
  if (Object.keys(pagination).length === 0) {
    data = {
      pagination: {},
      reset: false
    }
    learningPathStore.fetchLearningPaths(data)
  } else {
    data = {
      pagination: { pagination: pagination },
      reset: false
    }
    if (searchByNameGetter.value && searchFireActive.value) {
      data.pagination.pk = 'learningpath'
      data.pagination.query = searchByNameGetter.value
      learningPathStore.searchLearningPath(data)
    } else {
      learningPathStore.fetchLearningPaths(data)
    }
  }
}
</script>

<style lang="sass">
.sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
