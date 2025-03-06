<template>
  <div>
    <div class="row">
      <div class="q-pa-xs col-12">
        <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab">
          <q-tab name="crud" label="Subject CRUD" />
          <q-tab name="feedback" label="Feedback" />
          <q-tab name="statistics" label="Statistics" />
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated @before-transition="changeTab">
          <q-tab-panel class="bg-primary text-white" dark name="crud">
            <template v-if="!isCreate">
              <SubjectTable
                :tableData="subjectsByEvent"
                :title="courseName"
                @createPage="showCreateSubject($event)"
                @deletePage="showSubjectDelete($event)"
                @publishCourseToPlan="publishCourseToPlan($event)"
                @subjectInfo="showSubjectInfo($event)"
                @updatePage="showUpdateSubject($event)"
                @viewSortContents="showSortContent($event)"
              />
            </template>
            <template v-if="isCreate">
              <CreateSubject :id="param" :subjectId="updateId" :title="'Create Subject'" @onCacel="cancelCreateSubject($event)" />
            </template>
            <Delete
              v-if="isDelete"
              header="a Subject"
              :show="isDelete"
              @confirmDelete="subjectConfirmDeletion($event)"
              @confirmDeleteCancel="subjectConfirmDeleteCancel($event)"
            />
          </q-tab-panel>
          <q-tab-panel class="bg-primary text-white" name="feedback">
            <FeedbackTable :coursename="courseName" />
          </q-tab-panel>
          <q-tab-panel class="bg-dark" dark name="statistics">
            <q-card dark>
              <div class="row">
                <div class="q-pa-xs col-4 padding_7">
                  <Statistics iconName="fas fa-users" title="Enrollments" :count="getCourseStatsInfo.no_of_enrollments || 0" />
                </div>
                <div class="q-pa-xs col-4">
                  <Statistics iconName="fas fa-video" title="Videos" :count="getCourseStatsInfo.no_of_videos || 0" />
                </div>
                <div class="q-pa-xs col-4">
                  <Statistics iconName="fas fa-flask" title="Labs" :count="getCourseStatsInfo.no_of_labs || 0" />
                </div>
                <div class="q-pa-xs col-4 padding_7">
                  <Statistics iconName="fas fa-question" title="Quiz" :count="getCourseStatsInfo.no_of_quiz || 0" />
                </div>
                <div class="q-pa-xs col-4">
                  <Statistics iconName="fas fa-photo-video" title="Media" :count="getCourseStatsInfo.no_of_medias || 0" />
                </div>
                <div class="q-pa-xs col-4">
                  <Statistics iconName="fas fa-download" title="Downloads" :count="getCourseStatsInfo.no_of_download || 0" />
                </div>
                <div class="q-pa-xs col-12">
                  <p class="text-subtitle1 text-weight-regular ase-roboto padding_7" style="line-height: 0px; padding-top: 2%">
                    Attached Plans
                  </p>
                  <CoursePlans v-if="getAttachedPlansToCourse?.length > 0" :data="getAttachedPlansToCourse" />
                </div>
                <div class="q-pa-xs col-12" v-if="getAttachedPlansToCourse?.length === 0">
                  <div class="text-center" style="padding-top: 2%; padding-bottom: 2%">
                    <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12">No data</p>
                  </div>
                </div>
              </div>
            </q-card>
            <q-separator dark />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <q-dialog v-model="createSubjectStatus" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white" style="width: 500px; max-width: 80vw">
        <q-bar>
          <q-icon name="create" />
          <div>{{ titleName }} Subject</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>
        <q-form greedy @submit="onSubmitSubject()">
          <q-card-section>
            <q-list bordered class="row">
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput autofocus :maxLength="150" required :rules="maxLength(150)" v-model="subject.subject_name" />
                  <p v-if="fetchErrorMsgs.subject_name" class="text-caption text-negative">{{ fetchErrorMsgs.subject_name_msg }}</p>
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput label="Description" required :rules="minLength(2)" type="textarea" v-model="subject.description" />
                  <p v-if="fetchErrorMsgs.description" class="text-caption text-negative">{{ fetchErrorMsgs.description_msg }}</p>
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseToggle label="Is Active" v-model="subject.is_active" />
                  <p v-if="fetchErrorMsgs.is_active" class="text-caption text-negative">{{ fetchErrorMsgs.is_active_msg }}</p>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
            <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <Confirm
      v-if="isConfirm"
      header="add plans "
      :show="isConfirm"
      @confirmDelete="sendPlansConfirm($event)"
      @confirmDeleteCancel="confirmSendCancel($event)"
    />
    <q-dialog v-model="showDialogInformation" persistent>
      <q-card style="min-width: 500px" transition-show="flip-up" transition-hide="flip-down" dark>
        <q-card-section>
          <div class="text-subtitle1 ase-roboto text-weight-normal">
            <q-icon name="create" />
            Add to Plans
            <hr />
          </div>
        </q-card-section>
        <q-separator />

        <q-form greedy @submit="sendPlansConfirm">
          <q-card-section>
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <BaseSelect
                    label="Plan Type *"
                    multiple
                    :option-disable="getAttachedPlansToCourse.map((plan) => plan.plan_id) || []"
                    :options="fetchlistPlansMaps"
                    v-model="plan_ids"
                  />
                  <div v-if="fetchErrorMsgsPlans.plan_ids">
                    <p class="text-caption text-weight-normal error_msg ase-roboto none-spacing">{{ fetchErrorMsgsPlans.plan_ids_msg }}</p>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn class="col-grow" color="orange" outline label="Cancel" @click="confirmCancel()" />
            <q-btn class="col-grow" color="positive" :disable="!plan_ids?.length" label="Send" @click="sendPlans()" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import BaseInput from 'app/src/components/shared/BaseInput.vue'
import BaseSelect from 'app/src/components/shared/BaseSelect.vue'
import BaseToggle from 'app/src/components/shared/BaseToggle.vue'
import { useCourseStore, useMapStore, useSubjectStore } from 'app/src/stores'
import Statistics from 'components/company/Statistics'
import CoursePlans from 'components/course/CoursePlans'
import FeedbackTable from 'components/feedback/FeedbackTable'
import Confirm from 'components/shared/ConfirmationWindow'
import Delete from 'components/shared/Delete.vue'
import CreateSubject from 'components/subject/CreateSubject'
import SubjectTable from 'components/subject/SubjectTable'
import { Notify } from 'quasar'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { maxLength, minLength } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const courseStore = useCourseStore()
const mapStore = useMapStore()
const subjectStore = useSubjectStore()
const router = useRouter()
const route = useRoute()

const tab = ref('crud')
const isCreate = ref(false)
const updateId = ref('')
const isDelete = ref(false)
const subjectId = ref('')
const subject = ref({
  subject_name: '',
  description: '',
  is_active: false,
  event_id: urlSafeBase64Decode(route.params.courseId)
})
const courseName = ref('')
const createSubjectStatus = ref(false)
const titleName = ref('Create')
const title = ref('')
const isConfirm = ref(false)
const plan_ids = ref(null)
const showDialogInformation = ref(false)

const singleSubjectInfo = computed(() => (Object.keys(subjectStore.subject).length > 0 ? subjectStore.subject : []))
const subjectsByEvent = computed(() => (subjectStore.subjectsList.length > 0 ? [...new Set(subjectStore.subjectsList)] : []))
const fetchErrorMsgs = computed(() => subjectStore.error_msgs)
const fetchlistPlansMaps = computed(() => mapStore.listMaps.map((plan) => ({
  value: plan.plan_id,
  label: plan.plan_name,
  plan: plan.plan_family
})))
const fetchErrorMsgsPlans = computed(() => courseStore.error_msgs_plans)
const getCourseStatsInfo = computed(() => courseStore.courseStatsInfo)
const getAttachedPlansToCourse = computed(() => courseStore.attachedPlansToCourse)

onMounted(() => {
  courseName.value = urlSafeBase64Decode(route.params.courseName)
  subjectStore.uiSearchAction(false)
  const data = {
    pagination: {
      event_id: urlSafeBase64Decode(route.params.courseId)
    },
    reset: true
  }
  subjectStore.fetchSubjectsByEvent(data)
})

function showCreateSubject(event) {
  subjectId.value = ''
  updateId.value = ''
  subjectStore.errorMsgReset({
    status: true,
    description: false,
    description_msg: '',
    subject_name: false,
    subject_name_msg: '',
    is_active: false,
    is_active_msg: ''
  })
  if (event.show) {
    subject.value = {
      subject_name: '',
      description: '',
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    titleName.value = 'Create'
    createSubjectStatus.value = true
  }
}
async function publishCourseToPlan() {
  await courseStore.attachedPlansToCourses({ event_id: urlSafeBase64Decode(route.params.courseId) })
  await mapStore.fetchMaps({ pagination: {}, reset: true })

  plan_ids.value = null
  showDialogInformation.value = true
}
function cancelCreateSubject(event) {
  if (event.show) {
    isCreate.value = !isCreate.value
  }
}
async function showUpdateSubject(event) {
  subjectStore.errorMsgReset({
    status: true,
    description: false,
    description_msg: '',
    subject_name: false,
    subject_name_msg: '',
    is_active: false,
    is_active_msg: ''
  })
  if (event.show) {
    titleName.value = 'Update'

    updateId.value = ''
    updateId.value = event.id
    title.value = ''
    title.value = 'Update Subject'
    await subjectStore.fetchSubject({ subject_id: event.id })
    subjectId.value = event.id
    subject.value = {
      subject_name: singleSubjectInfo.value.name,
      description: singleSubjectInfo.value.description,
      event_id: urlSafeBase64Decode(route.params.courseId),
      is_active: singleSubjectInfo.value.is_active,
      subject_id: event.id
    }
    createSubjectStatus.value = true
  }
}
function changeTab(newTab, _oldTab) {
  if (newTab === 'statistics') {
    courseStore.courseStatsData({ event_id: urlSafeBase64Decode(route.params.courseId) })
    courseStore.attachedPlansToCourses({ event_id: urlSafeBase64Decode(route.params.courseId) })
  }
}
function showSubjectDelete(event) {
  if (event.show) {
    if (isDelete.value) {
      isDelete.value = false
    } else {
      isDelete.value = true
      subjectId.value = ''
      subjectId.value = event.id
    }
  }
}
function subjectConfirmDeletion(event) {
  if (event.show) {
    const data = {
      subject_id: subjectId.value,
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    subjectStore.deleteSubject(data)
    subjectId.value = ''
    isDelete.value = false
  }
}
function subjectConfirmDeleteCancel(event) {
  if (event.show) {
    if (isDelete.value) {
      subjectId.value = ''
      isDelete.value = false
    } else {
      isDelete.value = true
    }
  }
}
function showSubjectInfo(event) {
  if (event.show) {
    router.push(
      `/portal/subject-detailed-information/${event.id}/${route.params.courseId}/${event.courseName}/${event.name}`
    )
  }
}
function showSortContent(event) {
  if (event.show) {
    router.push(`/portal/sort/${urlSafeBase64Encode(event.id)}/${route.params.courseId}`)
  }
}
async function onSubmitSubject() {
  const dataSubjectUpdate = {
    subject_name: subject.value.subject_name,
    description: subject.value.description,
    is_active: subject.value.is_active
  }
  if (subjectId.value) {
    if (
      singleSubjectInfo.value.name === dataSubjectUpdate.subject_name &&
      singleSubjectInfo.value.description === dataSubjectUpdate.description &&
      singleSubjectInfo.value.is_active === dataSubjectUpdate.is_active
    ) {
      Notify.create({ type: 'positive', position: 'top', progress: true, message: 'You have updated successfully' })
    } else {
      subject.value.subject_id = subjectId.value
      await subjectStore.updateSubject(compareFunction('subject', subject.value, singleSubjectInfo.value))
      if (fetchErrorMsgs.value.status) {
        subject.value = {
          subject_name: '',
          description: '',
          event_id: urlSafeBase64Decode(route.params.courseId)
        }
        subjectId.value = ''
        createSubjectStatus.value = false
      } else {
        subject.value = {
          subject_name: dataSubjectUpdate.subject_name,
          description: dataSubjectUpdate.description,
          is_active: dataSubjectUpdate.is_active,
          event_id: urlSafeBase64Decode(route.params.courseId)
        }
        createSubjectStatus.value = true
      }
    }
  } else {
    await subjectStore.createSubject(subject.value)
  }
  if (fetchErrorMsgs.value.status) {
    subject.value = {
      subject_name: '',
      description: '',
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    subjectId.value = ''
    createSubjectStatus.value = false
  } else {
    createSubjectStatus.value = true
  }
}
function sendPlans() {
  showDialogInformation.value = false
  isConfirm.value = true
}
async function sendPlansConfirm() {
  const data = {
    plans: [],
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  for (const plan of plan_ids.value) {
    data.plans.push(plan.value)
  }
  await courseStore.addPlansToUnpublishedCourses(data)
  if (fetchErrorMsgsPlans.value.status) {
    plan_ids.value = null
    showDialogInformation.value = false
    isConfirm.value = false
  }
}
function confirmSendCancel() {
  isConfirm.value = false
  showDialogInformation.value = true
}
function confirmCancel() {
  showDialogInformation.value = false
}
</script>
