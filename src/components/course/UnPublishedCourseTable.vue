<template>
  <Page v-model:search="searchByName" :title="'Unpublished Courses'" :isCreateIcon="roleIsAdmin" :isTable="false" :isCreate="false">
    <div class="bg-dark q-pa-sm">
      <BaseToggle label="Courses" v-model="noneEventCourses" />
      &nbsp;
      <BaseToggle label="Event" v-model="eventCourses" />
      <q-btn
        style="display: inline-block; margin-left: 2%"
        size="sm"
        color="primary"
        class="text-right"
        @click="$emit('markdownView', { show: true })"
      >
        How to publish course
      </q-btn>
    </div>
    <slot v-if="noneEventCourses">
      <div class="text-center" style="margin-top: 2%" v-if="coursesUnPublishedList.length === 0 && !isLoading">
        <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
      </div>
      <div v-if="noneEventCourses">
        <div class="row">
          <div v-for="(data, index) in coursesUnPublishedList" class="col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="index">
            <div style="padding: 7px">
              <BoxFlashCard
                :data="data"
                @moveToCourseInfo="goToCoursePage(data.id, data.name)"
                :itemType="data.isEvent ? 'Event' : 'Course'"
                @attachPlans="$emit('attachPlans', { data: data })"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <div class="text-center" v-if="eventCourses && Object.keys(unPublishedCoursesPaginationKeyForward).length > 0">
          <q-btn
            label="Load More"
            icon="keyboard_arrow_right"
            style="border: 2px solid white"
            @click="loadMoreCourses(unPublishedCoursesPaginationKeyForward)"
          />
        </div>
      </div>
    </slot>
    <slot v-if="eventCourses">
      <div class="text-center" style="margin-top: 2%" v-if="eventCoursesUnPublishedList.length === 0 && !isLoading">
        <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
      </div>
      <div v-if="eventCourses">
        <div class="row">
          <div v-for="(data, index) in eventCoursesUnPublishedList" class="col-lg-3 col-md-4 col-sm-6 col-xs-12" :key="index">
            <div class="q-pa-sm">
              <BoxFlashCard
                :data="data"
                :itemType="data.isEvent ? 'Event' : 'Course'"
                @attachPlans="$emit('attachPlans', { data: data })"
                @moveToCourseInfo="goToCoursePage(data.id, data.name)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-center" v-if="eventCourses && Object.keys(unPublishedEventCoursesPaginationKeyForward).length > 0">
        <q-btn
          icon="keyboard_arrow_right"
          label="Load More"
          style="border: 2px solid white"
          @click="loadMoreCourses(unPublishedEventCoursesPaginationKeyForward)"
        />
      </div>
    </slot>
  </Page>
  <Confirm
    :show="isConfirm"
    :header="'unpublished courses'"
    @confirmDelete="confirmSend($event)"
    @confirmDeleteCancel="confirmSendCancel($event)"
  />
</template>

<script setup>
import BoxFlashCard from 'components/course/BoxFlashCard'
import BaseToggle from 'components/shared/BaseToggle.vue'
import Confirm from 'components/shared/ConfirmationWindow'
import Page from 'components/shared/coursePage'
import { useCourseStore, useLoginStore } from 'src/stores'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const courseStore = useCourseStore()
const loginStore = useLoginStore()
const emit = defineEmits(['markdownView', 'attachPlans', 'showDataBasedToggle', 'update:modelValue'])

const noneEventCourses = ref(true)
const AllCourses = ref(false)
const isConfirm = ref(false)

const eventCourses = ref(false)

const isLoading = computed(() => courseStore.loading)
const coursesUnPublishedList = computed(() =>
  courseStore.listUnPublishedCourses.length > 0 ? [...new Set(courseStore.listUnPublishedCourses)] : []
)
const unPublishedCoursesPaginationKeyForward = computed(() => courseStore.paginationKeyUnPublishedCourses)
const eventCoursesUnPublishedList = computed(() =>
  courseStore.listUnPublishedEventCourses.length > 0 ? [...new Set(courseStore.listUnPublishedEventCourses)] : []
)
const unPublishedEventCoursesPaginationKeyForward = computed(() => courseStore.paginationKeyUnPublishedEventCourses)
const roleIsAdmin = computed(() => loginStore.roleIsAdmin)
const searchByName = computed({
  get: () => courseStore.searchByName,
  set: (value) => courseStore.SEARCH_BY_NAME(value)
})
const router = useRouter()

watch(eventCourses, (value) => {
  if (value) {
    noneEventCourses.value = false
    AllCourses.value = false
    eventCourses.value = value
    emit('showDataBasedToggle', { type: 'eventCourses' })
  }
})
watch(noneEventCourses, (value) => {
  if (value) {
    noneEventCourses.value = value
    AllCourses.value = false
    eventCourses.value = false
    emit('showDataBasedToggle', { type: 'noneEventCourses' })
  }
})
watch(AllCourses, (value) => {
  if (value) {
    noneEventCourses.value = false
    AllCourses.value = value
    eventCourses.value = false
    emit('showDataBasedToggle', { type: 'allCourses' })
  }
})
function goToCoursePage(id, name) {
  router.push(`/portal/subject/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(name)}`)
}
function confirmSendCancel() {
  isConfirm.value = false
}
function loadMoreCourses(pagination) {
  const data = {
    pagination: { pagination: pagination },
    reset: false
  }
  if (noneEventCourses.value) {
    courseStore.fetchUnPublishedCoursesOptions(data)
  } else {
    courseStore.fetchUnPublishedEventCoursesOptions(data)
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
