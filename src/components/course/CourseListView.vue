<template>
  <div class="viewPages">
    <div class="row inject-course">
      <div class="col-md-3 col-sm-3 col-xs-3 q-pa-sm course-create">
        <q-btn size="md" color="primary" @click="showCourseCreate({ show: true })">Create</q-btn>
      </div>
      <div class="col-md-5 col-sm-5 col-xs-5 q-pa-sm injected-course">
        <div v-for="(course, index) in ingestingCourseName" :key="index">
          <q-badge color="green" size="xl" class="ase-roboto" v-if="!showInjectingBadge[course]">
            <!-- <q-badge color="green" size="xl" class="ase-roboto" v-if="this.ingestionStarted && !this.injectStatus && this.injectingBadge"> -->
            <span>Injecting</span>
            <span class="coure-name">&nbsp;{{ course }}&nbsp;</span>
            <span>course.... Please wait</span>
            &nbsp;
            <q-icon name="close" class="close-icon" @click="closeBadge(injectingStatus, course)" />
          </q-badge>
        </div>
        <div v-for="(course, index) in ingestedCourseName" :key="index">
          <q-badge color="green" size="xl" class="ase-roboto" v-if="showInjectedBadge[course]">
            Injected course:
            <span class="coure-name">&nbsp;{{ course }}&nbsp;</span>
            <q-icon name="close" class="close-icon" @click="closeBadge(injectedStatus, course)" />
          </q-badge>
        </div>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-4 float-right q-pa-sm search" style="display: flex; align-items: baseline">
        <div class="ingestion-description">
          <span class="label">Ingestion Succeeded</span>
          <q-icon name="done" color="green" />
        </div>
        <div class="ingestion-description">
          <span>Pending</span>
          <q-icon name="pending" color="yellow" />
        </div>
        <div class="ingestion-description">
          <span>Failed</span>
          <q-icon name="clear" color="red" />
        </div>
        <q-input
          bottom-slots
          class="q-ml-md float-right"
          dark
          dense
          input-class="text-right"
          label-color="white"
          outlined
          v-model="searchByName"
          @keydown.enter.prevent="searchData"
        >
          <template v-slot:append>
            <q-icon v-if="searchByName" name="clear" class="cursor-pointer" @click="clearSearchData" />
            <q-btn round dense flat icon="search" @click="searchData" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="bg-dark q-pa-sm">
      <q-checkbox dark size="sm" v-model="noneEventCourses" label="Courses" />
      <q-checkbox v-if="!eventCourses && !AllCourses" v-model="nonIngestedCourses" dark size="sm" label="Non Ingested courses" />
      <q-checkbox dark size="sm" v-model="eventCourses" label="Event" />
      <q-checkbox dark size="sm" v-model="AllCourses" label="All" />
      <q-btn size="sm" class="q-ml-md" color="primary" @click="$emit('markdownView', { show: true })">Prerequisite</q-btn>
    </div>
    <div v-if="eventCourses">
      <div class="row">
        <div v-for="(data, index) in coursesEventList" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" :key="index">
          <BoxFlashCard
            :data="data"
            :itemType="data.isEvent ? 'Event' : 'Course'"
            @copyCourse="copyCourse(data.id)"
            @moveToCourseInfo="goToCoursePage(data.id, data.name)"
            @showDeleteCourse="showDeleteCourse(data.id)"
            @showFeedbackCourse="showFeedbackCourse(data.id, data.name)"
            @showSortCourse="showSortCourse(data.id)"
            @showUpdateCourse="showUpdateCourse(data.id)"
            @injectCourse="injectCourse(data.id, data.name)"
          />
        </div>
      </div>
      <div v-if="Object.keys(eventCoursesPaginationKeyForward).length > 0" class="text-center">
        <q-btn
          icon="chevron_right"
          label="Load More"
          style="border: 2px solid white; margin: 7px 0px"
          @click="loadMoreCourses(eventCoursesPaginationKeyForward)"
        />
      </div>
    </div>
    <div v-if="nonIngestedCourses">
      <div class="row">
        <div v-for="(data, index) in nonIngestedCoursesList" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" :key="index">
          <BoxFlashCard
            :data="data"
            :itemType="data.isEvent ? 'Event' : 'Course'"
            @copyCourse="copyCourse(data.id)"
            @moveToCourseInfo="goToCoursePage(data.id, data.name)"
            @showDeleteCourse="showDeleteCourse(data.id)"
            @showFeedbackCourse="showFeedbackCourse(data.id, data.name)"
            @showSortCourse="showSortCourse(data.id)"
            @showUpdateCourse="showUpdateCourse(data.id)"
            @injectCourse="injectCourse(data.id, data.name)"
          />
        </div>
      </div>
      <div v-if="Object.keys(nonIngestedCoursesPaginationKeyForward).length > 0" class="text-center">
        <q-btn
          icon="chevron_right"
          label="Load More"
          style="border: 2px solid white; margin: 7px 0px"
          @click="loadMoreIngestedCourses(nonIngestedCoursesPaginationKeyForward)"
        />
      </div>
    </div>
    <div v-if="AllCourses" class="row">
      <div v-for="(data, index) in coursesList" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" :key="index">
        <BoxFlashCard
          :data="data"
          :itemType="data.isEvent ? 'Event' : 'Course'"
          @copyCourse="copyCourse(data.id)"
          @moveToCourseInfo="goToCoursePage(data.id, data.name)"
          @showDeleteCourse="showDeleteCourse(data.id)"
          @showFeedbackCourse="showFeedbackCourse(data.id, data.name)"
          @showSortCourse="showSortCourse(data.id)"
          @showUpdateCourse="showUpdateCourse(data.id)"
          @injectCourse="injectCourse(data.id, data.name)"
        />
      </div>
      <div v-if="Object.keys(coursePaginationKeyForward).length > 0" class="col-12 text-center">
        <q-btn
          icon="chevron_right"
          label="Load More"
          style="border: 2px solid white; margin: 7px 0px"
          @click="loadMoreCourses(coursePaginationKeyForward)"
        />
      </div>
      <div
        v-if="
          searchByNameGetter &&
          searchFireActive &&
          (coursePaginationKeyForward === 'string' ? coursePaginationKeyForward.length > 0 : false)
        "
        class="col-12 text-center"
      >
        <q-btn
          icon="chevron_right"
          label="Load More"
          style="border: 2px solid white; margin: 7px 0px"
          @click="loadMoreCourses(coursePaginationKeyForward)"
        />
      </div>
    </div>
    <div v-if="noneEventCourses" class="row">
      <div v-for="(data, index) in coursesNoneEventList" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 q-pa-sm" :key="index">
        <BoxFlashCard
          :data="data"
          itemType="Course"
          @copyCourse="copyCourse(data.id)"
          @moveToCourseInfo="goToCoursePage(data.id, data.name)"
          @showDeleteCourse="showDeleteCourse(data.id)"
          @showFeedbackCourse="showFeedbackCourse(data.id, data.name)"
          @showSortCourse="showSortCourse(data.id)"
          @showUpdateCourse="showUpdateCourse(data.id)"
          @injectCourse="injectCourse(data.id, data.name)"
        />
      </div>
      <div v-if="Object.keys(noneEventCoursesPaginationKeyForward).length > 0" class="col-12 text-center">
        <q-btn
          icon="chevron_right"
          label="Load More"
          style="border: 2px solid white; margin: 7px 0px"
          @click="loadMoreCourses(noneEventCoursesPaginationKeyForward)"
        />
      </div>
    </div>
    <Confirm
      v-if="isDelete"
      :header="'copy'"
      :show="isDelete"
      @confirmDelete="confirmCopy($event)"
      @confirmDeleteCancel="confirmCopyCancel($event)"
    />
  </div>
</template>
<script setup>
import BoxFlashCard from 'components/dashboard/BoxFlashCard'
import Confirm from 'components/shared/ConfirmationWindow'
import { useCourseStore } from 'src/stores'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, defineEmits, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const courseStore = useCourseStore()
const emit = defineEmits([
  'markdownView',
  'showCourseCreate',
  'showUpdateCourse',
  'showDeleteCourse',
  'confirmCopyCourse',
  'showDataBasedToggle',
  'injectCourse'
])

const noneEventCourses = ref(true)
const nonIngestedCourses = ref(false)
const AllCourses = ref(false)
const eventCourses = ref(false)
const isDelete = ref(false)
const confirmId = ref(0)
const tempPagination = ref('')
const tempNonIngestPagination = ref('')
const showInjectingBadge = ref([])
const showInjectedBadge = ref([])
const injectingStatus = ref(1)
const injectedStatus = ref(2)

const coursesList = computed(() => (courseStore.listCourses.length > 0 ? [...new Set(courseStore.listCourses)] : []))
const coursesEventList = computed(() => (courseStore.listEventCourses.length > 0 ? [...new Set(courseStore.listEventCourses)] : []))
const nonIngestedCoursesList = computed(() =>
  courseStore.listNonIngestedCourses.length > 0 ? [...new Set(courseStore.listNonIngestedCourses)] : []
)
const coursePaginationKeyForward = computed(() => courseStore.paginationKey)
const noneEventCoursesPaginationKeyForward = computed(() => courseStore.paginationKeyNoneEventCourse)
const nonIngestedCoursesPaginationKeyForward = computed(() => courseStore.paginationKeyNonIngestedCourse)
const eventCoursesPaginationKeyForward = computed(() => courseStore.paginationKeyAllEventCourse)
const searchByNameGetter = computed(() => courseStore.searchByName)
const searchFireActive = computed(() => courseStore.searchFire)
const coursesNoneEventList = computed(() =>
  courseStore.listNonEventCourses.length > 0 ? [...new Set(courseStore.listNonEventCourses)] : []
)
const ingestedCourseName = computed(() => courseStore.injectedJobName)
const ingestingCourseName = computed(() => courseStore.injectingJobName)
const injectStatus = computed(() => courseStore.injectStatus)
const ingestingCourseId = computed(() => courseStore.injectingJobId)
const searchByName = computed({
  get: () => courseStore.searchByName,
  set: (value) => courseStore.SEARCH_BY_NAME(value)
})

watch(eventCourses, (value) => {
  if (value) {
    noneEventCourses.value = false
    nonIngestedCourses.value = false
    AllCourses.value = false
    eventCourses.value = value
    emit('showDataBasedToggle', { type: 'eventCourses' })
  }
})
watch(nonIngestedCourses, (value) => {
  if (value) {
    noneEventCourses.value = false
    AllCourses.value = false
    eventCourses.value = false
    nonIngestedCourses.value = value
    emit('showDataBasedToggle', { type: 'nonIngestedCourses' })
  }
})
watch(noneEventCourses, (value) => {
  if (value) {
    noneEventCourses.value = value
    AllCourses.value = false
    eventCourses.value = false
    nonIngestedCourses.value = false
    emit('showDataBasedToggle', { type: 'noneEventCourses' })
  }
})
watch(AllCourses, (value) => {
  if (value) {
    noneEventCourses.value = false
    AllCourses.value = value
    eventCourses.value = false
    nonIngestedCourses.value = false
    emit('showDataBasedToggle', { type: 'allCourses' })
  }
})

function showCourseCreate(event) {
  if (event.show) {
    emit('showCourseCreate', { show: true })
  }
}
function goToCoursePage(id, name) {
  router.push(`/portal/subject/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(name)}`)
}
function showUpdateCourse(id) {
  emit('showUpdateCourse', {
    show: true,
    id: id,
    type: AllCourses.value ? 'All' : eventCourses.value ? 'Event' : noneEventCourses.value ? 'None-event' : 'All'
  })
}
function showInjecting() {
  return (id) => {
    const temp = [...Object.values(ingestingCourseId.value)]
    return ingestingCourseId.value && temp.includes(id)
  }
}
async function injectCourse(id, name) {
  let data = {}
  data = {
    event_id: id,
    event_name: name
  }
  await courseStore.injectStart(data)
  checkIngestionStatusInterval(data)
}
function checkIngestionStatusInterval(data) {
  if (showInjecting(data.event_id)) {
    setTimeout(async () => {
      await checkIngestionStatus(data)
      await checkIngestionStatusInterval(data)
    }, 5000)
  } else {
    courseStore.SET_INGESTION_STARTED(false)
    if (injectStatus.value === 'Succeeded') {
      data = {
        pagination: { last_value: this.tempPagination },
        reset: false
      }
      courseStore.fetchNoneEventCoursesOptions(data)
      const filter_payload = {
        payload: {
          status_value: 'Failed',
          last_evaluated_key: this.tempNonIngestPagination
        },
        reset: false
      }
      courseStore.fetchIngestCoursesOptions(filter_payload)
    }
  }
}
async function checkIngestionStatus(data) {
  await courseStore.checkStatus(data)
}
function copyCourse(id) {
  confirmId.value = id
  isDelete.value = true
}
function confirmCopy() {
  emit('confirmCopyCourse', {
    id: confirmId.value,
    type: AllCourses.value ? 'All' : eventCourses.value ? 'Event' : noneEventCourses.value ? 'None-event' : 'All'
  })
  isDelete.value = false
}
function confirmCopyCancel() {
  isDelete.value = false
}
function showDeleteCourse(id) {
  emit('showDeleteCourse', {
    show: true,
    id: id,
    type: AllCourses.value ? 'All' : eventCourses.value ? 'Event' : noneEventCourses.value ? 'None-event' : 'All'
  })
}
function showSortCourse(id) {
  router.push(`/portal/subject-order/${urlSafeBase64Encode(id)}`)
}
function showFeedbackCourse(id, name) {
  router.push(`/portal/course/${urlSafeBase64Encode(id)}/${urlSafeBase64Encode(name)}`)
}
function loadMoreIngestedCourses(pagination) {
  tempNonIngestPagination.value = pagination
  let filter_payload = {}
  if (Object.keys(pagination).length === 0) {
    filter_payload = {
      payload: {
        status_value: 'Failed'
      },
      reset: false
    }
  } else {
    filter_payload = {
      payload: {
        status_value: 'Failed',
        last_evaluated_key: pagination
      },
      reset: false
    }
    if (!searchByNameGetter.value && !searchFireActive.value) {
      courseStore.fetchIngestCoursesOptions(filter_payload)
    } else {
      data = {
        pagination: { pagination: pagination },
        reset: false
      }
    }
  }
}
function loadMoreCourses(pagination) {
  tempPagination.value = pagination
  let data = {}
  if (Object.keys(pagination).length === 0) {
    data = {
      pagination: {},
      reset: false
    }
  } else {
    data = {
      pagination: { last_value: pagination },
      reset: false
    }
    if (!searchByNameGetter.value && !searchFireActive.value) {
      if (eventCourses.value) {
        courseStore.fetchEventCoursesOptions(data)
      } else if (noneEventCourses.value) {
        courseStore.fetchNoneEventCoursesOptions(data)
      } else if (AllCourses.value) {
        data = {
          pagination: { last_value: pagination },
          reset: false
        }
        courseStore.fetchCourses(data)
      }
    } else {
      data = {
        pagination: { pagination: pagination },
        reset: false
      }
      if (searchByNameGetter.value && searchFireActive.value) {
        data.pagination.pk = 'event'
        data.pagination.query = searchByNameGetter.value
        courseStore.searchCourses(data)
      }
    }
  }
}
async function searchData() {
  if (searchByNameGetter.value === ' ' || searchByNameGetter.value === undefined) {
    AllCourses.value = true
    const data = {
      pagination: {},
      reset: true
    }
    await courseStore.fetchCourses(data)
  } else {
    AllCourses.value = true
    const data = {
      pagination: { pk: 'event', query: searchByNameGetter.value },
      reset: true
    }
    await courseStore.searchCourses(data)
  }
}
function clearSearchData() {
  const reset = ''
  courseStore.searchByNameAction(reset)
  const data = {
    pagination: {},
    reset: true
  }
  courseStore.fetchCourses(data)
  searchByName.value = ''
}
function closeBadge(num, course) {
  num === injectingStatus.value ? (showInjectingBadge.value[course] = true) : (showInjectedBadge.value[course] = true)
}
</script>

<style lang="sass" scoped>
.sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
.course-create
  display: flex
  align-items: baseline
.injected-course
  font-size: 17px
  margin-bottom: 10px
.injected-course .coure-name
  color: red
  font-weight: 800
  vertical-align: middle
.ase-roboto
  position: relative
  color: white
  padding: 0px 20px 20px 20px
  font-size: 17px
  margin-bottom: 10px
.ase-roboto span
  padding-top: 20px
  flex-wrap: wrap !important
.close-icon
  position: absolute
  top: -8px
  right: -10px
  cursor: pointer
  font-size: 17px
  border-radius: 50%
  background: red
.inject-course
  justify-content: space-between
.inject-course .search
  display: flex
  align-items: baseline
.inject-course .search .ingestion-description span, .inject-course .search .ingestion-description i
  margin-right: 5px
</style>
