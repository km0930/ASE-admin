<template>
  <q-form greedy ref="formRef" @submit="onSubmit()">
    <q-stepper active-color="white" alternative-labels animated dark done-color="positive" ref="stepper" v-model="step">
      <q-step :name="1" :title="title" icon="settings" :done="step > 1">
        <q-list class="row">
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseInput
                autofocus
                label="Name *"
                :maxlength="100"
                required
                :rules="[...minLength(2), ...maxLength(100)]"
                v-model="course.name"
              />
              <p v-if="fetchErrorMsgs.name" class="text-caption text-negative">{{ fetchErrorMsgs.name_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseSelect label="Proficiency *" :options="proficiencyOption" :rules="required" v-model="course.proficiency" />
              <p v-if="fetchErrorMsgs.proficiency" class="text-caption text-negative">{{ fetchErrorMsgs.proficiency_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseSelect label="Roles *" multiple :options="careerOptions" :rules="required" v-model="course.career" />
              <p v-if="fetchErrorMsgs.career" class="text-caption text-negative">{{ fetchErrorMsgs.career_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseSelect label="Event status *" :options="event_status_options" :rules="required" v-model="course.event_status" />
              <p v-if="fetchErrorMsgs.event_status" class="text-caption text-negative">{{ fetchErrorMsgs.event_status_msg }}</p>
            </q-item-section>
          </q-item>
          <transition appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
            <q-item v-if="course.event_status?.value === 'live_course'" class="col-md-6 col-xs-12">
              <q-item-section>
                <BaseInput
                  label="Live Date *"
                  :options="(date) => date > todayDate()"
                  required
                  :rules="required"
                  type="date"
                  v-model="course.date"
                />
                <p v-if="fetchErrorMsgs.date" class="text-caption text-negative">{{ fetchErrorMsgs.date_msg }}</p>
              </q-item-section>
              <q-item-section>
                <BaseInput label="Live Time *" required :rules="required" type="time" v-model="course.time" />
                <p v-if="fetchErrorMsgs.time" class="text-caption text-negative">{{ fetchErrorMsgs.time_msg }}</p>
              </q-item-section>
            </q-item>
          </transition>
          <transition appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
            <q-item v-if="!course.isEvent && course.event_status?.value === 'live_course'" class="col-md-6 col-xs-12">
              <q-item-section>
                <BaseSelect
                  hide-hint
                  hint="Timezone will be converted to UTC"
                  label="Timezone *"
                  :options="utcOptions"
                  :rules="required"
                  style="width: 100%"
                  v-model="course.utc"
                />
                <p v-if="fetchErrorMsgs.utc" class="text-caption text-negative">{{ fetchErrorMsgs.utc_msg }}</p>
              </q-item-section>
              <q-item-section>
                <BaseInput hint="In minutes" label="Duration *" required :rules="required" type="number" v-model="course.live_duration" />
                <p v-if="fetchErrorMsgs.live_duration" class="text-caption text-negative">{{ fetchErrorMsgs.duration_msg }}</p>
              </q-item-section>
            </q-item>
          </transition>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseSelect
                avatar
                label="Instructors *"
                multiple
                :options="instructorOption"
                :rules="required"
                v-model="course.instructors"
              />
              <p v-if="fetchErrorMsgs.instructor_id" class="text-caption text-negative">{{ fetchErrorMsgs.instructor_id_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseSelect
                label="Learning Paths *"
                multiple
                :options="learningPathList"
                :rules="required"
                v-model="course.learning_paths"
                @remove="removeLearningPath($event)"
              />
              <p v-if="fetchErrorMsgs.learning_paths" class="text-caption text-negative">{{ fetchErrorMsgs.learning_paths_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseFile accept="image/*" label="Logo *" :rules="required" v-model="course.logo" @update:model-value="onFileSelected" />
              <p v-if="fetchErrorMsgs.logo && !imageData" class="text-caption text-negative">{{ fetchErrorMsgs.logo_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <div class="image-preview text-center" v-if="imageData">
                <img class="preview" :src="imageData" placeholder="required *" style="height: 100px; width: auto" />
              </div>
            </q-item-section>
          </q-item>
          <q-item class="col-md-6 col-xs-12">
            <q-item-section>
              <BaseSelect label="Tags" v-model="course.tags" multiple :options="tagOptions" />
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <BaseInput
                hint="Kindly provide an accurate description; skills will be generated accordingly."
                label="Description *"
                required
                :rules="minLength(1)"
                type="textarea"
                v-model="course.description"
              />
              <p v-if="fetchErrorMsgs.description" class="text-caption text-negative">{{ fetchErrorMsgs.description_msg }}</p>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-item-section>
              <div class="row q-gutter-x-md">
                <BaseToggle label="Is Part of Event" v-model="course.isEvent" />
                <BaseToggle label="Free tier" v-model="course.is_free" />
              </div>
              <p v-if="fetchErrorMsgs.is_event" class="text-caption text-negative">{{ fetchErrorMsgs.is_event_msg }}</p>
              <p v-if="fetchErrorMsgs.is_free" class="text-caption text-negative">{{ fetchErrorMsgs.is_free_msg }}</p>
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>
      <q-step
        :name="2"
        title="Metadata"
        icon="code"
        :done="step > 2"
        :disable="
          !course.name ||
          !course.proficiency ||
          !course.career ||
          !course.event_status ||
          !course.instructors?.length ||
          !course.description ||
          !imageData
        "
      >
        <q-item class="col-12">
          <q-item-section>
            <Metadata v-model="course.metadata" />
          </q-item-section>
        </q-item>
      </q-step>
      <q-step
        :name="3"
        title="Achievement"
        icon="emoji_events"
        :done="step > 3"
        :disable="
          !course.name ||
          !course.proficiency ||
          !course.career ||
          !course.event_status ||
          !course.instructors?.length ||
          !course.description ||
          !imageData
        "
      >
        <Achievement
          v-model:achievementType="achievementType"
          :data="course"
          :title="course.name"
          type="course"
          @update:achievementSelected="addAchievementType"
          @update:delivery_id="addDeliveryID"
          @update:dates="updateDates"
        />
      </q-step>
      <q-step
        :name="4"
        title="Skills"
        caption="(Generated by AI)"
        icon="all_inclusive"
        :done="step > 3"
        :disable="achievementType && !course.delivery_id"
      >
        <q-list class="row">
          <q-item class="col-12">
            <q-item-section>
              <BaseSelect
                :disable="isGeneratingSkills"
                :hint="isGeneratingSkills ? 'Takes less than 1 minute' : 'Type and press enter ↵ to add a new skill'"
                :label="isGeneratingSkills ? 'Generating Skills' : 'Skills *'"
                :loading="isGeneratingSkills"
                multiple
                new-value-mode="add-unique"
                :rules="required"
                v-model="course.skills"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="row">
          <q-btn class="col-grow q-mr-sm" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn v-if="step > 1" @click="stepper.previous()" class="col-grow q-mr-sm" color="orange" label="Back" />
          <q-btn
            v-if="step < 4"
            class="col-grow q-mr-sm"
            color="positive"
            :disable="step === 3 && achievementType && !course.delivery_id"
            label="Next"
            @click="onNextStep"
          />
          <q-btn v-if="step === 4" class="col-grow" color="positive" :disable="step === 4 && !course.skills?.length" @click="onSubmit()">
            Save
          </q-btn>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>

<script setup>
import Achievement from 'components/shared/Achievement'
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseToggle from 'components/shared/BaseToggle.vue'
import Metadata from 'components/shared/Metadata.vue'
import { useCourseStore, useInstructorStore, useLearningPathStore, useTagsStore } from 'src/stores'
import { todayDate } from 'src/utils/reuseFunctions'
import { maxLength, minLength, required } from 'src/utils/rules'
import timezones from 'src/utils/timezones'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['id', 'createDataStatus', 'createUpdateStatus', 'title', 'selectedDeliveryInfo'])
const emit = defineEmits(['onCancel'])
const courseStore = useCourseStore()
const instructorStore = useInstructorStore()
const learningPathStore = useLearningPathStore()
const tagsStore = useTagsStore()

const achievementType = ref(undefined)
const logoName = ref('')
const imageData = ref('')
const b64logo = ref('')
const step = ref(1)
const course = ref({
  avgMinutes: 0,
  career: undefined,
  date: '',
  time: '',
  utc: { value: 'GMT+00:00', label: 'Etc/GMT (GMT+00:00) GMT (no daylight saving)' },
  delivery_id: undefined,
  description: '',
  event_status: undefined,
  expiry_date: '',
  is_free: false,
  instructors: undefined,
  isActive: false,
  isEvent: false,
  issue_date: '',
  learning_paths: undefined,
  live_duration: undefined,
  logo: [],
  metadata: undefined,
  name: '',
  proficiency: undefined,
  tags: []
})
const formRef = ref(null)
const stepper = ref(null)
const courseFromDB = ref({})
const proficiencyOption = ref([
  { label: 'Beginner', value: 'Basic' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
])
const event_status_options = ref([
  { value: 'challenge', label: 'Challenge' },
  { value: 'course', label: 'Course' },
  { value: 'live_course', label: 'Live Course' },
  { value: 'playground', label: 'Playground' }
])
const careerOptions = ref([
  { value: 'Developer', label: 'Developer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Cloud Operations', label: 'Cloud Operations' },
  { value: 'Security Engineer', label: 'Security Engineer' },
  { value: 'Pentester', label: 'Pentester' },
  { value: 'Security Architect', label: 'Security Architect' },
  { value: 'Security Champion', label: 'Security Champion' },
  { value: 'Cloud Engineer', label: 'Cloud Engineer' }
])
const utcOptions = ref(timezones)

const coursesEventList = computed(() => (courseStore.listEventCourses.length > 0 ? [...new Set(courseStore.listEventCourses)] : []))
const coursesList = computed(() => (courseStore.listCourses.length > 0 ? [...new Set(courseStore.listCourses)] : []))
const fetchStatusOfApi = computed(() => courseStore.statusOfApi)
const fetchErrorMsgs = computed(() => courseStore.error_msgs)
const coursesNoneEventList = computed(() =>
  courseStore.listNonEventCourses.length > 0 ? [...new Set(courseStore.listNonEventCourses)] : []
)
const isGeneratingSkills = computed(() => courseStore.isGeneratingSkills)
const instructorOption = computed(() =>
  instructorStore.instructorOptions.length > 0 ? [...new Set(instructorStore.instructorOptions)] : []
)
const learningPathList = computed(() =>
  learningPathStore.listLearningPath.length > 0 ? [...new Set(learningPathStore.listLearningPath)] : []
)

const tagOptions = computed(() => tagsStore.tags.map((item) => item.tag_name))

onMounted(async () => {
  if (props.id) {
    courseFromDB.value =
      coursesNoneEventList.value.find((course) => course.sk === props.id) ||
      coursesList.value.find((course) => course.sk === props.id) ||
      coursesEventList.value.find((course) => course.sk === props.id)

    achievementType.value = courseFromDB.value.achievement_type
    course.value.avgMinutes = courseFromDB.value.avgMinutes
    course.value.career = Array.isArray(courseFromDB.value.career)
      ? courseFromDB.value.career?.map((i) => ({ value: i, label: i }))
      : [{ value: courseFromDB.value.career, label: courseFromDB.value.career }]
    course.value.created_on = courseFromDB.value.created_on
    course.value.delivery_id =
      courseFromDB.value.delivery_id || courseFromDB.value.delivery_id?.value || selectedDeliveryInfo.value || undefined
    course.value.description = courseFromDB.value.description
    course.value.event_status = event_status_options.value.find((i) => i.value === courseFromDB.value.event_status)
    course.value.expiry_date = courseFromDB.value.expiry_date
    course.value.is_free = courseFromDB.value.is_free || courseFromDB.value.freetier || false
    course.value.instructors = courseFromDB.value.instructor_id?.map((i) => ({
      value: i.split('#')[0],
      label: i.split('#')[1],
      img: i.split('#')[2]
    }))
    course.value.isActive = courseFromDB.value.is_active
    course.value.isEvent = courseFromDB.value.is_event
    course.value.issue_date = courseFromDB.value.issue_date
    await learningPathStore.fetchLearningPaths({ pagination: {}, reset: true })
    course.value.learning_paths = courseFromDB.value.learning_paths || []
    if (!course.value.learning_paths.length) {
      learningPathList.value.find((i) => {
        if (typeof courseFromDB.value.learning_path_id === 'string' && i.value === courseFromDB.value.learning_path_id) {
          course.value.learning_paths.push(i)
        } else if (Array.isArray(courseFromDB.value.learning_path_id) && courseFromDB.value.learning_path_id.includes(i.value)) {
          course.value.learning_paths.push(i)
        }
        return false
      })
    }
    course.value.live_duration = courseFromDB.value.live_duration / 60
    course.value.logo = [courseFromDB.value.logo] || []
    logoName.value = courseFromDB.value.logoName
    imageData.value = courseFromDB.value.logo
    course.value.metadata = courseFromDB.value.metadata
    course.value.name = courseFromDB.value.name
    course.value.proficiency = { value: courseFromDB.value.proficiency, label: courseFromDB.value.proficiency }
    course.value.rating = courseFromDB.value.rating
    course.value.rcount = courseFromDB.value.rcount
    course.value.search_name = courseFromDB.value.search_name
    course.value.skills = courseFromDB.value.skills
    if (courseFromDB.value.live_at) {
      course.value.date = courseFromDB.value.live_at.replace(/[ T].*/, '').replace(/-/g, '/')
      course.value.time = courseFromDB.value.live_at.replace(/.*[ T](\d{2}:\d{2}).*/, '$1')
    }
    course.value.tags = courseFromDB.value.tags
  }
})
function onNextStep() {
  formRef.value.validate().then((valid) => {
    if (!valid) {
      return
    }
    if (step.value === 1 && !course.value.skills?.length) {
      onGenerateSkills()
    }
    return stepper.value.next()
  })
}
async function onSubmit() {
  const data = {
    achievement_type: achievementType.value || 'None',
    avg_minutes: parseInt(course.value.avgMinutes),
    career: course.value.career.map((i) => i.value),
    delivery_id: course.value.delivery_id?.value || course.value.delivery_id || '',
    description: course.value.description,
    event_name: course.value.name,
    event_status: course.value.event_status?.value || 'course',
    instructor_id: course.value.instructors.map((i) => i.value),
    is_active: course.value.isActive,
    is_event: course.value.isEvent,
    is_free: course.value.is_free,
    learning_path_id: course.value.learning_paths.map((i) => i.value),
    proficiency: course.value.proficiency?.value || course.value.proficiency,
    skills: course.value.skills?.map((i) => i.toLowerCase()),
    tags: course.value.tags
  }
  if (data.event_status === 'live_course') {
    data.live_at = new Date(`${course.value.date} ${course.value.time} ${course.value.utc.value}`).toISOString()
    data.live_duration = course.value.live_duration * 60
  }
  if (data.achievement_type === 'certificate') {
    if (course.value.expiry_date.trim()) {
      data.expiry_date = course.value.expiry_date.replaceAll('/', '-')
    }
    if (course.value.issue_date.trim()) {
      data.issue_date = course.value.issue_date.replaceAll('/', '-')
    }
  }
  if (logoName.value && b64logo.value) {
    data.logo_name = logoName.value
    data.logo = b64logo.value
  }
  if (course.value.metadata) {
    data.metadata = course.value.metadata
  }
  if (data.achievement_type === 'None') {
    delete data.delivery_id
  }
  if (props.id) {
    data.event_id = props.id
    await courseStore.updateCourse(compareFunction('course', data, courseFromDB.value))
  } else {
    await courseStore.createCourse(data)
  }
  if (fetchStatusOfApi.value) {
    course.value = {}
    course.value = {
      avgMinutes: 0,
      is_free: false,
      expiry_date: '',
      issue_date: '',
      isActive: false,
      isEvent: false
    }
    logoName.value = null
    imageData.value = null
    b64logo.value = null
    onCancel()
  }
}
function onCancel() {
  step.value = 1
  emit('onCancel', { show: true })
}
function onFileSelected(event) {
  logoName.value = event.name
  if (event) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageData.value = e.target.result
      const imageSplit = e.target.result.split(';')
      const getOnlyB64Val = imageSplit[1].split(',')
      b64logo.value = getOnlyB64Val[1]
    }
    reader.readAsDataURL(event)
  }
}
async function removeLearningPath(data) {
  if (data.details && props.id && data.details.value && courseFromDB.value.learning_paths.includes(data.details.value)) {
    await courseStore.detachLpFromCourse({ event_id: courseFromDB.value.sk, lp_id: data.details.value })
  }
}
function addAchievementType(type) {
  achievementType.value = type
}
function addDeliveryID(event) {
  course.value.delivery_id = event || undefined
}
function updateDates(event) {
  if (event.dateIssued) {
    course.value.issue_date = event.dateIssued
  }
  if (event.dateExpired) {
    course.value.expiry_date = event.dateExpired
  }
}
async function onGenerateSkills() {
  const payload = JSON.stringify({
    course_name: course.value.name,
    learning_path_id: course.value.learning_paths.map((i) => i.value),
    description: course.value.description
  })
  await courseStore
    .generateSkills(payload)
    .then((res) => (course.value.skills = res))
    .catch(() => (course.value.skills = []))
}
</script>
