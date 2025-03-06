<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 760px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ title }}
          <hr />
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form greedy ref="formRef" @submit="onSubmit">
          <q-stepper active-color="white" alternative-labels animated dark done-color="positive" header-nav ref="stepper" v-model="step">
            <q-step :name="1" title="Certification Info" icon="article" :done="step > 1" :header-nav="step > 1">
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput autofocus label="Name *" :rules="[...minLength(2), ...maxLength(50)]" v-model="certification.name" />
                    <p v-if="fetchErrorMsgs.name" class="text-caption text-negative">{{ fetchErrorMsgs.name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput
                      label="Description *"
                      required
                      :rules="[...minLength(20)]"
                      type="textarea"
                      v-model="certification.description"
                    />
                    <p v-if="fetchErrorMsgs.description" class="text-caption text-negative">
                      {{ fetchErrorMsgs.description_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      hint="In minutes"
                      label="Duration *"
                      :max="60"
                      :min="30"
                      required
                      :rules="[...max(4500), ...min(30)]"
                      type="number"
                      v-model="certification.duration"
                    />
                    <p v-if="fetchErrorMsgs.duration" class="text-caption text-negative">{{ fetchErrorMsgs.duration_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput label="Pass percentage *" required :rules="min(1)" type="number" v-model="certification.pass_percentage" />
                    <p v-if="fetchErrorMsgs.pass_percentage" class="text-caption text-negative">
                      {{ fetchErrorMsgs.pass_percentage_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      label="Number of Challenges *"
                      :max="20"
                      :min="1"
                      required
                      :rules="[...min(1), ...max(20)]"
                      type="number"
                      v-model="certification.challenges"
                    />
                    <p v-if="fetchErrorMsgs.challenges" class="text-caption text-negative">
                      {{ fetchErrorMsgs.challenges_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      label="Questions Count *"
                      :max="20"
                      :min="1"
                      required
                      :rules="[...min(1), ...max(20)]"
                      type="number"
                      v-model="certification.questions_count"
                    />
                    <p v-if="fetchErrorMsgs.questions_count" class="text-caption text-negative">
                      {{ fetchErrorMsgs.questions_count_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseSelect label="Charges *" multiple :options="chargesOptions" :rules="required" v-model="certification.charges" />
                    <p v-if="fetchErrorMsgs.charges" class="text-caption text-negative">{{ fetchErrorMsgs.charges_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseSelect label="Skills" multiple :options="skillsOptionsGetter" v-model="certification.skills" />
                    <p v-if="fetchErrorMsgs.skills" class="text-caption text-negative">{{ fetchErrorMsgs.skills_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect
                      label="Learning Paths *"
                      multiple
                      :options="learningPathOption"
                      :rules="required"
                      style="width: 100%"
                      v-model="certification.learningPaths"
                    />
                    <p v-if="fetchErrorMsgs.learning_path_id" class="text-caption text-negative">
                      {{ fetchErrorMsgs.learning_path_id_msg }}
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect label="Persona *" multiple :options="careerOptions" :rules="required" v-model="certification.persona" />
                    <p v-if="fetchErrorMsgs.career" class="text-caption text-negative">{{ fetchErrorMsgs.persona_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseToggle :disable="!id" label="Is Active" v-model="certification.active" />
                    <p v-if="fetchErrorMsgs.active" class="text-caption text-negative">{{ fetchErrorMsgs.active_msg }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step :name="2" title="Achievement" icon="emoji_events" :done="step > 2" :header-nav="step > 2">
              <Achievement
                v-model="achievementType"
                :data="certification"
                :title="certification.name"
                type="certification"
                @update:achievementSelected="addAchievementType"
                @update:dates="updateDates"
                @update:delivery_id="addDeliveryID"
              />
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow q-mr-sm" color="orange" outline @click="onCancel()">Cancel</q-btn>
                <q-btn v-if="step !== 1" class="col-grow q-mr-sm" color="orange" @click="$refs.stepper.previous()">Back</q-btn>
                <q-btn
                  v-if="step !== 2"
                  class="col-grow"
                  :disabled="
                    !certification.name ||
                    !certification.description ||
                    !certification.duration ||
                    !certification.pass_percentage ||
                    !certification.challenges ||
                    !certification.persona?.length
                  "
                  color="positive"
                  @click="$refs.formRef.validate().then((valid) => (valid ? $refs.stepper.next() : null))"
                >
                  Next
                </q-btn>
                <q-btn v-if="step === 2" class="col-grow" color="positive" :disable="!certification.delivery_id" @click="onSubmit()">
                  Save
                </q-btn>
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import Achievement from 'components/shared/Achievement.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseToggle from 'components/shared/BaseToggle.vue'
import { useCertificationStore, useLearningPathStore } from 'src/stores'
import { max, maxLength, min, minLength, required } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const certificationStore = useCertificationStore()
const learningPathStore = useLearningPathStore()
const emit = defineEmits(['onCancel'])
const props = defineProps(['id', 'show', 'title'])

const fetchErrorMsgs = computed(() => certificationStore.error_msgs)
const fetchStatusOfApi = computed(() => certificationStore.statusOfApi)
const listCertification = computed(() => certificationStore.listCertification)
const chargesOptions = computed(() => certificationStore.chargesOptions)
const skillsOptionsGetter = computed(() => certificationStore.skillsOptions)
const learningPathOption = computed(() =>
  learningPathStore.learningPathOptions.length > 0 ? [...new Set(learningPathStore.learningPathOptions)] : []
)

const achievementType = ref('')
const dataShow = ref(props.show)
const step = ref(1)
const careerOptions = ref([
  { label: 'Developer', value: 'Developer' },
  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
  { label: 'Cloud Operations', value: 'Cloud Operations' },
  { label: 'Security Engineer', value: 'Security Engineer' },
  { label: 'Pentester', value: 'Pentester' },
  { label: 'Security Architect', value: 'Security Architect' },
  { label: 'Security Champion', value: 'Security Champion' },
  { label: 'Cloud Engineer', value: 'Cloud Engineer' }
])
const certification = ref({
  active: false,
  challenges: null,
  charges: null,
  delivery_id: null,
  description: null,
  duration: null,
  expiry_date: '',
  issue_date: '',
  learningPaths: [],
  name: null,
  pass_percentage: null,
  persona: null,
  skills: null,
  questions_count: null
})

onMounted(async () => {
  achievementType.value = 'badge'
  if (!learningPathOption.value.length) {
    await learningPathStore.fetchLearningPathOptions()
  }
  if (!chargesOptions.value.length) {
    await certificationStore.fetchCharges()
  }
  if (!skillsOptionsGetter.value.length) {
    certificationStore.fetchSkills({})
  }
  if (props.id) {
    const cert = listCertification.value.find((data) => data.sk === props.id)
    certification.value = {
      active: cert.active,
      challenges: cert.challenges,
      charges: cert.charges?.map((charge) => chargesOptions.value.find((data) => data.value === charge)) || [],
      delivery_id: cert.delivery_id,
      description: cert.description,
      questions_count: cert.questions_count,
      duration: cert.duration,
      expiry_date: cert.expiry_date,
      issue_date: cert.issue_date,
      learningPaths: learningPathOption.value?.filter((data) => cert.learning_path_ids?.includes(data.value)),
      name: cert.name,
      pass_percentage: cert.pass_percentage,
      persona: cert.persona.map((data) => ({ label: data, value: data })),
      skills: cert.skills.map((data) => ({ label: data, value: data }))
    }
  }
})
function addAchievementType(achType) {
  achievementType.value = achType
}
function addDeliveryID(event) {
  certification.value.delivery_id = event || undefined
}
function updateDates(event) {
  if (event.dateIssued) {
    certification.value.issue_date = event.dateIssued
  }
  if (event.dateExpired) {
    certification.value.expiry_date = event.dateExpired
  }
}
async function onSubmit() {
  const data = {
    active: certification.value.active,
    challenges: certification.value.challenges,
    charges: certification.value.charges.map((data) => data.value),
    delivery_id: certification.value.delivery_id?.value,
    description: certification.value.description,
    questions_count: certification.value.questions_count,
    duration: certification.value.duration,
    learning_path_ids: certification.value.learningPaths.map((i) => i.value),
    name: certification.value.name,
    pass_percentage: certification.value.pass_percentage,
    persona: certification.value.persona.map((data) => data.value)
  }
  if (certification.value.skills ?? false) {
    data.skills = certification.value.skills.map((data) => data.value)
  }
  if (certification.value.expiry_date?.trim()) {
    data.expiry_date = certification.value.expiry_date.replaceAll('/', '-')
  }
  if (certification.value.issue_date?.trim()) {
    data.issue_date = certification.value.issue_date.replaceAll('/', '-')
  }
  if (props.id) {
    data.certification = props.id
    await certificationStore.updateCertification(compareFunction('certification', data, certification.value))
  } else {
    await certificationStore.createCertification(data)
  }
  if (fetchStatusOfApi.value) {
    certification.value = {
      active: true,
      challenges: '',
      description: '',
      questions_count: '',
      duration: '',
      name: '',
      pass_percentage: '',
      persona: '',
      skills: ''
    }
    onCancel()
  }
}
function onCancel() {
  emit('onCancel', { show: true })
}
</script>
