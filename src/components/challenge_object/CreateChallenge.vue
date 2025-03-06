<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 800px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Challenge' : 'Create Challenge' }}
          <hr />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form greedy ref="formRef" @submit="onSubmit()">
          <q-stepper active-color="white" alternative-labels animated dark done-color="positive" header-nav ref="stepper" v-model="step">
            <q-step :name="1" title="Challenge Info" icon="article" :done="step > 1" :header-nav="step > 1">
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput
                      label="Challenge Name *"
                      required
                      :maxlength="100"
                      :rules="[...minLength(2), ...maxLength(100)]"
                      v-model="challenge.name"
                    />
                    <p v-if="fetchErrorMsgs.name" class="text-caption text-negative">{{ fetchErrorMsgs.name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Description *" required :rules="minLength(2)" type="textarea" v-model="challenge.description" />
                    <p v-if="fetchErrorMsgs.description" class="text-caption text-negative">{{ fetchErrorMsgs.description_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseInput label="Score *" required :rules="[...min(1), ...max(100)]" type="number" v-model="challenge.score" />
                    <p v-if="fetchErrorMsgs.score" class="text-caption text-negative">{{ fetchErrorMsgs.score_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseSelect label="Proficiency" :options="proficiency_options" v-model="challenge.proficiency" />
                    <p v-if="fetchErrorMsgs.proficiency" class="text-caption text-negative">{{ fetchErrorMsgs.proficiency_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseSelect label="Career" multiple :options="career_options" v-model="challenge.career" />
                    <p v-if="fetchErrorMsgs.nature" class="text-caption text-negative">{{ fetchErrorMsgs.nature_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseSelect label="Nature *" :options="nature_options" :rules="required" v-model="challenge.nature" />
                    <p v-if="fetchErrorMsgs.nature" class="text-caption text-negative">{{ fetchErrorMsgs.nature_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect label="Learning Path *" :rules="required" :options="learningPathOptions" v-model="challenge.learningPath" />
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseSelect
                      label="Validation Type *"
                      :options="validation_options"
                      :rules="required"
                      v-model="challenge.validation_type"
                    />
                    <p v-if="fetchErrorMsgs.validation_type" class="text-caption text-negative">{{ fetchErrorMsgs.validation_type_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-md-6 col-sm-12">
                  <q-item-section>
                    <BaseSelect
                      :label="'List Labs *'"
                      :options="fetchListLabsOptions"
                      :rules="required"
                      :showMore="Object.keys(labsPaginationKeyForward).length > 0"
                      v-model="challenge.lab_id"
                      @loadMoreItems="loadMoreChallengeLabs"
                    />
                    <p v-if="fetchErrorMsgs.lab_id" class="text-caption text-negative">{{ fetchErrorMsgs.lab_id_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect label="Tags *" multiple newValueMode="add-unique" :rules="required" v-model="challenge.tags" />
                    <p v-if="fetchErrorMsgs.tags" class="text-caption text-negative">{{ fetchErrorMsgs.tags_msg }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step
              :name="2"
              title="Metadata"
              icon="code"
              :done="step > 2"
              :header-nav="step > 2"
              :disable="
                !id ||
                !challenge.name ||
                !challenge.description ||
                !challenge.lab_id ||
                !challenge.nature ||
                !challenge.validation_type ||
                !challenge.score ||
                !challenge.tags?.length
              "
            >
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <Metadata v-model="challenge.metadata" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step
              :name="3"
              title="Hints List"
              icon="format_list_bulleted"
              :done="step > 3"
              :header-nav="step > 3"
              :disable="
                !challenge.name ||
                !challenge.description ||
                !challenge.lab_id ||
                !challenge.nature ||
                !challenge.validation_type ||
                !challenge.score ||
                !challenge.tags?.length
              "
            >
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <Carousel v-model="challenge.hints" />
                    <p v-if="fetchErrorMsgs.hints" class="text-caption text-negative">{{ fetchErrorMsgs.hints_msg }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step
              :name="4"
              title="Achievement"
              icon="emoji_events"
              :done="step > 4"
              :header-nav="step > 4"
              :disable="
                !challenge.name ||
                !challenge.description ||
                !challenge.lab_id ||
                !challenge.nature ||
                !challenge.validation_type ||
                !challenge.score ||
                !challenge.tags?.length ||
                !challenge.hints?.length
              "
            >
              <Achievement
                v-model:achievementType="achievementType"
                :data="challenge"
                :title="challenge.name"
                type="challenge"
                @update:achievementSelected="addAchievementType"
                @update:delivery_id="addDeliveryID"
              />
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow q-mr-sm" color="orange" outline @click="onCancel()">Cancel</q-btn>
                <q-btn v-if="step !== 1" class="col-grow q-mr-sm" color="orange" @click="$refs.stepper.previous()">Back</q-btn>
                <q-btn
                  v-if="step !== 4"
                  class="col-grow q-mr-sm"
                  color="positive"
                  :disabled="step === 3 && !challenge.hints.length"
                  @click="$refs.formRef.validate().then((valid) => (valid ? $refs.stepper.next() : null))"
                >
                  Next
                </q-btn>
                <q-btn
                  v-if="step === 4"
                  class="col-grow"
                  color="positive"
                  :disable="achievementType !== 'None' && achievementType && !challenge.delivery_id"
                  @click="onSubmit()"
                >
                  Done
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
import Achievement from 'components/shared/Achievement'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import Carousel from 'components/shared/Carousel.vue'
import Metadata from 'components/shared/Metadata.vue'
import { useChallengeStore, useLabsStore, useLearningPathStore } from 'src/stores'
import { max, maxLength, min, minLength, required } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['id', 'show'])
const emit = defineEmits('onCancel')

const achievementType = ref(undefined)
const challenge = ref({
  delivery_id: '',
  description: '',
  event: '',
  hints: [],
  lab_id: undefined,
  learningPath: undefined,
  metadata: undefined,
  name: '',
  nature: '',
  proficiency: '',
  career: [],
  score: 0,
  tags: undefined,
  validation_type: ''
})
// const labs_data_select = ref([])
const nature_options = ref([
  { label: 'Offensive', value: 'Offensive' },
  { label: 'Defensive', value: 'Defensive' },
  { label: 'Callback', value: 'Callback' }
])
const proficiency_options = ref([
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
])
const career_options = ref([
  { label: 'Cloud Engineer', value: 'Cloud Engineer' },
  { label: 'Cloud Operations', value: 'Cloud Operations' },
  { label: 'DevOps Engineer', value: 'DevOps Engineer' },
  { label: 'Pentester', value: 'Pentester' },
  { label: 'Security Architect', value: 'Security Architect' },
  { label: 'Security Champion', value: 'Security Champion' },
  { label: 'Security Engineer', value: 'Security Engineer' }
])
// const searchLabData = ref('')
// const showDocs = ref(false)
const step = ref(1)
const validation_options = ref([
  { label: 'Any', value: 'Any' },
  { label: 'All', value: 'All' }
])
const dataShow = ref(true)

const challengeStore = useChallengeStore()
const labsStore = useLabsStore()
const learningPathStore = useLearningPathStore()

const learningPathOptions = computed(() => learningPathStore.learningPathOptions)
const fetchErrorMsgs = computed(() => challengeStore.error_msgs)
const fetchStatusOfApi = computed(() => challengeStore.statusOfApi)
const fetchListChallenges = computed(() => (challengeStore.listChallenges.length > 0 ? [...new Set(challengeStore.listChallenges)] : []))
const fetchListLabsOptions = computed(() => (challengeStore.listLabsOptions.length > 0 ? [...new Set(challengeStore.listLabsOptions)] : []))
const labsPaginationKeyForward = computed(() => challengeStore.labsPaginationKey || {})
const fetchLoadMoreTypeLabGetter = computed(() => labsStore.loadMoreTypeLab)

onMounted(async() => {
  resetValidation()

  if (!fetchListLabsOptions.value.length) {
    await challengeStore.fetchLabs({ pagination: {}, reset: true })
  }

  if (!learningPathOptions.value?.length) {
    await learningPathStore.fetchLearningPathOptions()
  }

  if (props.id) {
    const fetchedChallenge = fetchListChallenges.value.find((challenge) => challenge.sk === props.id)

    achievementType.value = fetchedChallenge.achievement_type
    challenge.value.career = fetchedChallenge.career?.map((c) => ({ label: c, value: c }))
    challenge.value.delivery_id = fetchedChallenge.delivery_id
    challenge.value.description = fetchedChallenge.description
    challenge.value.hints = fetchedChallenge.hints
    challenge.value.lab_id =
      fetchListLabsOptions.value.find((lab) => [fetchedChallenge.lab_id.value, fetchedChallenge.lab_id].includes(lab.value)) || fetchedChallenge.lab_id
    challenge.value.learningPath = learningPathOptions.value.find((lp) => lp.value === fetchedChallenge.learning_path_id)
    challenge.value.metadata = fetchedChallenge.metadata
    challenge.value.name = fetchedChallenge.name
    challenge.value.nature = fetchedChallenge.nature
    challenge.value.proficiency = fetchedChallenge.proficiency || fetchedChallenge.difficulty
    challenge.value.score = fetchedChallenge.score
    challenge.value.tags = fetchedChallenge.tags
    challenge.value.validation_type = fetchedChallenge.validation_type
  }
})

function addDeliveryID(event) {
  challenge.value.delivery_id = event || undefined
}
async function loadMoreChallengeLabs() {
  if (fetchLoadMoreTypeLabGetter.value === 'lab') {
    const data = {
      pagination: { last_value: labsPaginationKeyForward.value },
      reset: false
    }
    await challengeStore.fetchLabs(data)
  } else if (fetchLoadMoreTypeLabGetter.value === 'search') {
    const dataLab = {
      pagination: {
        pk: 'lab',
        pagination: labsPaginationKeyForward.value,
        query: searchLabData.value
      },
      reset: false
    }
    await labsStore.fetchSearchLabs(dataLab)
  }
}
function resetValidation() {
  const errorMsgs = {
    status: true,
    name: false,
    name_msg: '',
    description: false,
    description_msg: '',
    lab_id: false,
    lab_id_msg: '',
    nature: false,
    nature_msg: '',
    validation_type: false,
    validation_type_msg: '',
    hints: false,
    hints_msg: '',
    tags: false,
    tags_msg: '',
    score: false,
    score_msg: ''
  }
  challengeStore.errorMsgReset(errorMsgs)
}
function addAchievementType(achievement_type) {
  achievementType.value = achievement_type
}
async function onSubmit() {
  const data = {
    description: challenge.value.description,
    hints: challenge.value.hints,
    lab_id: challenge.value.lab_id?.value || challenge.value.lab_id,
    learning_path_id: challenge.value.learningPath.value,
    name: challenge.value.name,
    nature: challenge.value.nature?.value || challenge.value.nature,
    proficiency: challenge.value.proficiency?.value || challenge.value.proficiency,
    career: challenge.value?.career?.map((c) => c.value) ?? [],
    score: parseInt(challenge.value.score),
    tags: challenge.value.tags,
    validation_type: challenge.value.validation_type?.value || challenge.value.validation_type
  }
  if (achievementType.value) {
    data.achievement_type = achievementType.value
    data.delivery_id = challenge.value.delivery_id?.value || challenge.value.delivery_id
  }
  if (challenge.value.metadata) {
    data.metadata = challenge.value.metadata
  }
  if (props.id) {
    data.challenge_id = props.id
    const challenge = fetchListChallenges.value.find((challenge) => challenge.sk === props.id)
    await challengeStore.updateChallenge(compareFunction('challenge', data, challenge))
  } else {
    await challengeStore.createChallenge(data)
  }
  if (fetchStatusOfApi.value) {
    challenge.value = {
      status: true,
      name: false,
      name_msg: '',
      description: false,
      description_msg: '',
      lab_id: false,
      lab_id_msg: '',
      nature: false,
      nature_msg: '',
      validation_type: false,
      validation_type_msg: '',
      hints: false,
      hints_msg: '',
      tags: false,
      tags_msg: '',
      score: false,
      score_msg: '',
      event: '',
      delivery_id: ''
    }
    onCancel()
  }
}
function onCancel() {
  emit('onCancel', { show: true })
  challenge.value = {}
}
</script>
