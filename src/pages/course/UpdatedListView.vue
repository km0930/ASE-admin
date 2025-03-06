<template>
  <div>
    <CreateCoursePage
      v-if="isCreate"
      :createDataStatus="isCreate"
      :id="updateId"
      :selectedDeliveryInfo="selectedDeliveryInfo"
      :title="title"
      @onCancel="cancelCreateNewCourse($event)"
    />
    <CourseListView
      v-else-if="!isUsers"
      :allCourseActive="listViewToggle"
      @confirmCopyCourse="confirmCopyCourse($event)"
      @markdownView="showMarkDown($event)"
      @showCourseCreate="createNewCourse($event)"
      @showDataBasedToggle="showDataBasedToggle($event)"
      @showDeleteCourse="deleteNewCourse($event)"
      @showUpdateCourse="updateNewCourse($event)"
    />
    <Delete
      v-if="isDelete"
      :header="'Course'"
      :show="isDelete"
      @confirmDelete="courseConfirmDeletion($event)"
      @confirmDeleteCancel="courseConfirmDeleteCancel($event)"
    />
    <q-dialog v-model="showMD" persistent>
      <q-card style="min-width: 800px" transition-show="flip-up" transition-hide="flip-down" dark>
        <q-card-section>
          <div class="text-subtitle1 ase-roboto text-weight-normal">
            <q-icon name="pen" />
            Prerequisite
            <hr />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit()" class="q-gutter-md">
            <q-list class="row">
              <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-markdown>{{ base64Decode() }}</q-markdown>
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <div class="full-width">
                  <q-btn color="primary" size="sm" label="Cancel" @click="confirmCancelMD()" />
                </div>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import CourseListView from 'components/course/CourseListView'
import CreateCoursePage from 'components/course/CreateCoursePage'
import Delete from 'components/shared/Delete.vue'
import { useCourseStore, useDeliveryStore, useInstructorStore, useLearningPathStore } from 'src/stores'
import { filteredItemBasedOnKey, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'

const courseStore = useCourseStore()
const instructorStore = useInstructorStore()
const learningPathStore = useLearningPathStore()
const deliveryStore = useDeliveryStore()
const isCreate = ref(false)
const isDelete = ref(false)
const isUsers = ref(false)
const updateId = ref('')
const title = ref('Create Course')
const courseId = ref('')
const selectedDeliveryInfo = ref(null)
const listViewToggle = ref(false)
const actionView = ref('')
const showMD = ref(false)
const markdowntext = ref(
  'IyBDb3Vyc2UgY3JlYXRpb24gUHJlLVJlcXVpc2l0ZXMKCiogMTogQ291cnNlIGxvZ28gd2l0aCB0aGlzIGRpbWVuc2lvbgpgYGBiYXNoCjc0MHB4IFggMTAyMHB4CmBgYAoqIDI6IENvdXJzZSBkZXRhaWxlZCBgRGVzY3JpcHRpb25gIHJlcXVpcmVkCgoqIDM6IGBQcm9maWNpZW5jeWAgcmVxdWlyZWQKCiogNDogYFJvbGVzYCByZXF1aXJlZAoKKiA1OiBgSW5zdHJ1Y3RvcmAgcmVxdWlyZWQKCiogNjogYExlYXJuaW5nIHBhdGhgIHJlcXVpcmVkCgoKIyMgSWYgaXQncyBhIENvdXJzZS9QbGF5Z3JvdW5kIHRoZW4gb25seSBCYWRnZSBpcyByZXF1aXJlZAoqIDE6IENyZWF0ZSBiYWRnZSBpbiBgc2VydGlmaWVyYAoKCiMjIE5vdyBsZXQncyBjcmVhdGUgY291cnNlCgoqIDE6IEluIGFkbWluIHBvcnRhbCBgY3JlYXRlIGNvdXJzZWAKCgojIyBOb3cgYWRkIHJlbGF0ZWQgdmlkZW9zLCBsYWJzIGFuZCBtZWRpYSBldGMgIGluc2lkZSB0aGUgY291cnNlCg=='
)

const coursesNoneEventList = computed(() =>
  courseStore.listNonEventCourses.length > 0 ? [...new Set(courseStore.listNonEventCourses)] : []
)
const coursesList = computed(() => (courseStore.listCourses.length > 0 ? [...new Set(courseStore.listCourses)] : []))
const singleCourseInfo = computed(() => (Object.keys(courseStore.courseInfo).length > 0 ? courseStore.courseInfo : []))
const coursesEventList = computed(() => (courseStore.listEventCourses.length > 0 ? [...new Set(courseStore.listEventCourses)] : []))
const fetchStatusOfApi = computed(() => courseStore.statusOfApi)
const fetchDeliveryOptionsList = computed(() =>
  deliveryStore.listOptionsDelivery.length > 0 ? [...new Set(deliveryStore.listOptionsDelivery)] : []
)

onMounted(async () => {
  if (coursesNoneEventList.value.length === 0) {
    const data = {
      pagination: {},
      reset: false
    }
    courseStore.fetchNoneEventCoursesOptions(data)
  }
})

function showMarkDown(event) {
  showMD.value = Boolean(event.show)
}
function base64Decode() {
  return urlSafeBase64Decode(markdowntext.value)
}
function confirmCancelMD() {
  showMD.value = false
}
function createNewCourse(event) {
  courseStore.errorMsgReset({
    proficiency: false,
    proficiency_msg: '',
    description: false,
    description_msg: '',
    event_name: false,
    event_name_msg: '',
    logo: false,
    logo_msg: '',
    avg_minutes: false,
    avg_minutes_msg: '',
    documentation_path: false,
    documentation_path_msg: '',
    instructor_id: false,
    instructor_id_msg: '',
    learning_path_id: false,
    learning_path_id_msg: '',
    badge_id: false,
    badge_id_msg: '',
    is_event: false,
    is_event_msg: '',
    is_active: false,
    is_active_msg: '',
    is_free: false,
    is_free_msg: ''
  })
  if (event.show) {
    updateId.value = ''
    isCreate.value = true
    title.value = 'Create Course'
    instructorStore.fetchInstructorOptions()
    learningPathStore.fetchLearningPaths({ pagination: {}, reset: true })
  }
}
function cancelCreateNewCourse(event) {
  if (event.show) {
    isCreate.value = false
  }
}
async function updateNewCourse(event) {
  courseStore.errorMsgReset({
    proficiency: false,
    proficiency_msg: '',
    description: false,
    description_msg: '',
    event_name: false,
    event_name_msg: '',
    logo: false,
    logo_msg: '',
    avg_minutes: false,
    avg_minutes_msg: '',
    documentation_path: false,
    documentation_path_msg: '',
    instructor_id: false,
    instructor_id_msg: '',
    learning_path_id: false,
    learning_path_id_msg: '',
    badge_id: false,
    badge_id_msg: '',
    is_event: false,
    is_event_msg: '',
    is_active: false,
    is_active_msg: '',
    is_free: false,
    is_free_msg: ''
  })
  instructorStore.fetchInstructorOptions()
  isDelete.value = false
  isCreate.value = true
  updateId.value = ''
  updateId.value = event.id
  title.value = ''
  title.value = 'Update Course'
  if (singleCourseInfo.value.delivery_id) {
    if (fetchDeliveryOptionsList.value.length === 0) {
      await deliveryStore.fetchDeliveries({ pagination: { length: 80 } })
    }
    selectedDeliveryInfo.value = filteredItemBasedOnKey(singleCourseInfo.value.delivery_id, fetchDeliveryOptionsList.value)
  } else {
    selectedDeliveryInfo.value = null
  }
}
async function confirmCopyCourse(event) {
  courseStore.fetchCopyCourse({ event_id: event.id })
  actionView.value = event.type
  callDataBasedOnEvent(actionView.value)
}
function deleteNewCourse(event) {
  actionView.value = event.type
  isCreate.value = false
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      courseId.value = ''
      courseId.value = event.id
    }
  }
}
async function courseConfirmDeletion(event) {
  if (event.show) {
    const data = { event_id: this.courseId }
    await courseStore.deleteCourse(data)
    if (fetchStatusOfApi.value) {
      callDataBasedOnEvent(actionView.value)
    }
    courseId.value = ''
    isDelete.value = false
  }
}
function courseConfirmDeleteCancel(event) {
  if (event.show) {
    isDelete.value = !isDelete.value
  }
}
async function callDataBasedOnEvent(type) {
  const data = {
    pagination: {},
    reset: true
  }
  if (type === 'All') {
    await courseStore.fetchCourses(data)
  } else if (type === 'None-event') {
    await courseStore.fetchNoneEventCoursesOptions(data)
  } else if (type === 'Event') {
    await courseStore.fetchEventCoursesOptions(data)
  }
}
function showDataBasedToggle(event) {
  const data = {
    pagination: {},
    reset: false
  }
  if (event.type === 'allCourses') {
    if (coursesList.value.length === 0) {
      courseStore.fetchCourses(data)
    }
  } else if (event.type === 'noneEventCourses') {
    if (coursesNoneEventList.value.length === 0) {
      courseStore.fetchNoneEventCoursesOptions(data)
    }
  } else if (event.type === 'eventCourses') {
    if (coursesEventList.value.length === 0) {
      courseStore.fetchEventCoursesOptions(data)
    }
  }
}
</script>
