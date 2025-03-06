<script setup>
import Achievement from 'components/shared/Achievement.vue'
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { useCourseStore, useJourneysStore } from 'src/stores'

import { computed, onBeforeMount, ref } from 'vue'
const journeysStore = useJourneysStore()
const courseStore = useCourseStore()

import { generateChangedObject, getFileWithNameFromUrl } from 'src/utils/reuseFunctions'
import { maxLength, minLength, required } from 'src/utils/rules'

const proficiencies = [
  { label: 'Beginner', value: 'Basic' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
]

const roles = [
  { value: 'Developer', label: 'Developer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
  { value: 'Cloud Operations', label: 'Cloud Operations' },
  { value: 'Security Engineer', label: 'Security Engineer' },
  { value: 'Pentester', label: 'Pentester' },
  { value: 'Security Architect', label: 'Security Architect' },
  { value: 'Security Champion', label: 'Security Champion' },
  { value: 'Cloud Engineer', label: 'Cloud Engineer' }
]

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    deafault: () => false
  }
})

const model = defineModel({ type: Boolean, required: true })

const isLoadingEvents = ref(false)
const isSaving = ref(false)
const imageData = ref(null)
const logoObj = ref(null)
const backupLogoName = ref()
const formData = ref({
  name: '',
  description: '',
  events: [],
  duration: 0,
  logo: null,
  logo_name: '',
  proficiency: '',
  roles: [],
  delivery_id: null
})
const step = ref(1)
const stepper = ref(null)
const formRef = ref(null)
const achievementType = ref('badge')

const events = computed(() => {
  return (courseStore.listNonEventCourses.length > 0 ? [...new Set(courseStore.listNonEventCourses)] : []).map((event) => {
    return { label: event?.event_name, value: event?.sk }
  })
})
const disabledNext = computed(() => {
  return (
    !formData.value.name ||
    formData.value.description?.length < 30 ||
    !formData.value.duration ||
    !formData.value.roles ||
    !formData.value.events?.length ||
    !formData.value.logo_name ||
    !formData.value.proficiency
  )
})
const eventsPagination = computed(() => {
  return courseStore.paginationKeyNoneEventCourse
})

onBeforeMount(async () => {
  if (props.editMode) {
    if (props.data?.logo) {
      getFileWithNameFromUrl(props.data?.logo ?? '').then((res) => {
        if (res) {
          backupLogoName.value = res?.name
          imageData.value = props.data?.logo
          logoObj.value = res.data
          formData.value.logo_name = res.name
        }
      })
    }
    formData.value = {
      ...formData.value,
      name: props.data?.name,
      description: props.data?.description,
      duration: props.data?.duration,
      logo: props.data?.logo,
      proficiency: props.data?.proficiency,
      roles: roles?.filter((role) => props.data?.roles?.includes(role.value)) ?? [],
      delivery_id: props.data?.delivery_id
    }
  }

  isLoadingEvents.value = true
  await courseStore.fetchNoneEventCoursesOptions({ reset: true })
  isLoadingEvents.value = false

  if (props.editMode) {
    formData.value.events = events.value?.filter((event) => {
      return props.data?.events?.includes(event.value)
    })
  }
})

function onFileSelected(event) {
  formData.value.logo_name = event.name

  if (event) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageData.value = e.target.result
      const imageSplit = e.target.result.split(';')
      const getOnlyB64Val = imageSplit[1].split(',')
      formData.value.logo = getOnlyB64Val[1]
    }
    reader.readAsDataURL(event)
  }
}

async function onSubmit() {
  formData.value.proficiency = formData.value.proficiency?.value
  formData.value.events = formData.value.events?.map((event) => event?.value)
  formData.value.delivery_id = formData.value.delivery_id ?? undefined
  formData.value.roles = formData.value.roles?.map((role) => role.value)

  isSaving.value = true
  if (props.editMode) {
    const payload = generateChangedObject({ ...props.data, logo_name: backupLogoName.value }, formData.value)
    if (Object.keys(payload).length) {
      await journeysStore.updateJourney({ ...payload, sk: props.data?.sk })
    }
  } else {
    await journeysStore.updateJourney(formData.value)
  }
  isSaving.value = false
  handleCancel()
}

function handleNext() {
  formRef.value.validate().then((valid) => {
    if (valid) {
      step.value = 2
    }
  })
}

function handleCancel() {
  model.value = false
}

function handleChangeDeliveryID(delivery_id) {
  formData.value.delivery_id = delivery_id?.value ?? null
}

async function loadMoreEvents() {
  const payload = {
    pagination: { last_value: eventsPagination.value },
    reset: false
  }
  await courseStore.fetchNoneEventCoursesOptions(payload)
}
</script>

<template>
  <q-dialog v-model="model">
    <q-card style="width: 60rem; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal flex items-center q-gutter-sm">
          <q-icon name="create" />
          <p class="q-mb-none">{{ editMode ? 'Update' : 'Create' }} journey</p>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-sm q-pb-lg">
        <q-form greedy @submit="onSubmit" ref="formRef">
          <q-stepper
            active-color="white"
            alternative-labels
            animated
            dark
            done-color="positive"
            ref="stepper"
            v-model="step"
            flat
            class="q-pl-md"
          >
            <q-step :name="1" title="Journey Info" icon="article" :done="step > 1">
              <q-list class="row q-col-gutter-sm">
                <q-item class="col-8">
                  <q-item-section>
                    <BaseInput v-model="formData.name" autofocus label="Name *" :rules="[...minLength(2), ...maxLength(100)]" />
                  </q-item-section>
                </q-item>

                <q-item class="col-4">
                  <q-item-section>
                    <BaseSelect v-model="formData.proficiency" label="Proficiency *" :options="proficiencies" :rules="required" />
                  </q-item-section>
                </q-item>

                <q-item class="col-4">
                  <q-item-section>
                    <BaseInput v-model="formData.duration" type="number" label="Duration(Days) *" :rules="required" />
                  </q-item-section>
                </q-item>

                <q-item class="col-8">
                  <q-item-section>
                    <BaseSelect v-model="formData.roles" label="Roles *" multiple :options="roles" :rules="required" />
                  </q-item-section>
                </q-item>

                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect
                      v-model="formData.events"
                      label="Events *"
                      multiple
                      :options="events"
                      :loading="isLoadingEvents"
                      :showMore="Boolean(eventsPagination?.length)"
                      @loadMoreItems="loadMoreEvents"
                    />
                  </q-item-section>
                </q-item>

                <q-item class="col-12">
                  <q-item-section>
                    <BaseFile v-model="logoObj" accept="image/*" label="Logo *" :rules="required" @update:model-value="onFileSelected" />
                  </q-item-section>
                </q-item>

                <q-item v-if="imageData" class="col-12">
                  <q-item-section>
                    <div class="image-preview text-center">
                      <img class="preview" :src="imageData" placeholder="required *" style="height: 100px; width: auto" />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput v-model="formData.description" autofocus label="Description *" type="textarea" :rules="[...minLength(30)]" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>

            <q-step :name="2" title="Achievement" icon="article" :done="step > 1">
              <Achievement
                v-model:achievementType="achievementType"
                :title="formData.name"
                type="journey"
                :data="formData"
                @update:delivery_id="handleChangeDeliveryID"
              />
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow q-mr-sm" color="orange" outline @click="handleCancel()">Cancel</q-btn>
                <q-btn v-if="step !== 1" class="col-grow q-mr-sm" color="orange" @click="$refs.stepper.previous()">Back</q-btn>
                <q-btn v-if="step !== 2" :disabled="disabledNext" color="positive" class="col-grow" @click="handleNext">Next</q-btn>
                <q-btn v-if="step === 2" type="submit" class="col-grow" color="positive">Save</q-btn>
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
