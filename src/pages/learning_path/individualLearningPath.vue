<template>
  <q-page padding>
    <p class="text-h6">Filters</p>
    <FilterView @FilteredData="FilteredData" />
    <q-separator dark spaced />
    <div v-if="lpCourses" class="row">
      <div v-for="(data, index) in lpCourses" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" :key="index">
        <BoxView :data="data" :itemType="data.is_event ? 'Event' : 'Course'" />
      </div>
    </div>
    <div v-if="lpCourses.length === 0" class="q-py-md text-center">
      <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
    </div>
  </q-page>
</template>

<script setup>
import FilterView from 'components/learning_path/lpCoursesFilterView'
import BoxView from 'components/learning_path/lpCoursesListBox'
import { useLearningPathStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const learningPathStore = useLearningPathStore()
const router = useRoute()

const fetchDetailedLpCourses = computed(() => learningPathStore.learningPathEventsDetailed)
const lpCourses = ref(fetchDetailedLpCourses.value || [])
const lpId = ref(urlSafeBase64Decode(router.params.individualId))

onMounted(async () => {
  await learningPathStore.fetchIndividualLearningPathEventsDetailed({ learning_path_id: lpId.value })
  lpCourses.value = fetchDetailedLpCourses.value
})

function FilteredData(data) {
  const hasFilters = data.type.length > 0 || data.proficiency.length > 0 || data.subs.length > 0
  if (!hasFilters) {
    lpCourses.value = fetchDetailedLpCourses.value
    return
  }
  lpCourses.value = fetchDetailedLpCourses.value.filter(
    (info) =>
      (data.proficiency.length === 0 || data.proficiency.includes(info.proficiency)) &&
      (data.type.length === 0 || data.type.includes(info.is_event ? 'event' : 'course')) &&
      (data.subs.length === 0 || data.subs.includes(info.is_free ? 'free' : 'paid'))
  )
}
</script>
