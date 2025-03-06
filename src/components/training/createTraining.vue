<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="min-width: 750px" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Events' : 'Create Events' }}
          <hr />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-form greedy ref="formRef" @submit="onSubmit()">
          <q-stepper active-color="white" alternative-labels animated dark done-color="positive" header-nav ref="stepper" v-model="step">
            <q-step :name="1" title="Training Info" icon="article" :done="step > 1" :header-nav="step > 1">
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput
                      autofocus
                      label="Name *"
                      :maxlength="150"
                      required
                      :rules="[maxLength(150), ...minLength(2)]"
                      v-model="training.training_name"
                    />
                    <p v-if="fetchErrorMsgs.training_name" class="text-caption text-negative">{{ fetchErrorMsgs.training_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect label="Plan Type *" :options="plansOptionsGetter" :rules="required" v-model="training.plan" />
                    <p v-if="fetchErrorMsgs.plan" class="text-caption text-negative">{{ fetchErrorMsgs.plan_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      :disable="Boolean(id)"
                      hint="Start date can't be changed after creation"
                      label="Start Date *"
                      :options="(date) => date >= todayDate() && (training.end_date ? date < training.end_date : true)"
                      required
                      :rules="required"
                      type="date"
                      v-model="training.start_date"
                    />
                    <p v-if="fetchErrorMsgs.start_date" class="text-caption text-negative">{{ fetchErrorMsgs.start_date_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      :disable="Boolean(id)"
                      label="End Date *"
                      :options="(date) => date > training.start_date"
                      required
                      :rules="required"
                      type="date"
                      v-model="training.end_date"
                    />
                    <p v-if="fetchErrorMsgs.end_date" class="text-caption text-negative">{{ fetchErrorMsgs.end_date_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput label="Nº Users *" required :rules="min(0)" type="number" v-model="training.num_users" />
                    <p v-if="fetchErrorMsgs.num_users" class="text-caption text-negative">{{ fetchErrorMsgs.num_users_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseSelect label="Domains" multiple new-value-mode="add-unique" v-model="training.domains" />
                    <p v-if="fetchErrorMsgs.domains" class="text-caption text-negative">{{ fetchErrorMsgs.domains_msg }}</p>
                  </q-item-section>
                </q-item>
                <p class="text-caption text-warning q-mb-none q-mx-md">
                  Note: You cannot change start date and end date once after the event is created. Please choose carefully.
                </p>
              </q-list>
            </q-step>
            <q-step
              :name="2"
              title="Achievement"
              icon="emoji_events"
              :done="step > 2"
              :header-nav="step > 2"
              :disable="!training.training_name || !training.plan || !training.start_date || !training.end_date || !training.num_users"
            >
              <Achievement
                :data="training"
                :title="training.training_name"
                type="training"
                v-model:achievementType="achievementType"
                @update:achievementSelected="addAchievementType"
                @update:delivery_id="addDeliveryID"
              />
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation class="row">
                <q-btn v-if="step === 1" class="col-grow q-mr-sm" color="orange" outline @click="onCancel">Cancel</q-btn>
                <q-btn v-if="step !== 1" class="col-grow q-mr-sm" color="orange" @click="$refs.stepper.previous()">Back</q-btn>
                <q-btn
                  v-if="step !== 2"
                  class="col-grow q-mr-sm"
                  color="positive"
                  @click="$refs.formRef.validate().then((valid) => (valid ? $refs.stepper.next() : null))"
                >
                  Next
                </q-btn>
                <q-btn
                  v-if="step === 2"
                  class="col-grow"
                  color="positive"
                  :disable="achievementType !== 'None' && achievementType && !training.delivery_id"
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
import Achievement from 'components/shared/Achievement.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { todayDate } from 'src/utils/reuseFunctions'
import { maxLength, min, minLength, required } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { useTrainingStore } from 'stores/training'
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps({
  id: String,
  show: Boolean
})
const emit = defineEmits(['onCancel'])

const trainingStore = useTrainingStore()

const achievementType = ref('None')
const training = reactive({
  training_name: '',
  plan: null,
  start_date: '',
  end_date: '',
  num_users: undefined,
  domains: null,
  delivery_id: undefined
})
const dataShow = ref(props.show)
const step = ref(1)

const singleTrainingInfo = computed(() => (Object.keys(trainingStore.trainingInfo).length > 0 ? trainingStore.trainingInfo : []))
const plansOptionsGetter = computed(() => (trainingStore.plansOptions.length > 0 ? [...new Set(trainingStore.plansOptions)] : []))
const fetchErrorMsgs = computed(() => trainingStore.error_msgs)

onMounted(async () => {
  if (props.id) {
    await trainingStore.fetchTraining({ training_id: props.id })
    training.training_name = singleTrainingInfo.value.training_name
    training.start_date = singleTrainingInfo.value.start_date.replace(/-/g, '/')
    training.end_date = singleTrainingInfo.value.end_date.replace(/-/g, '/')
    training.domains = singleTrainingInfo.value.domains
    training.num_users = singleTrainingInfo.value.num_users
    training.plan = plansOptionsGetter.value.find((plan) => plan.value === singleTrainingInfo.value.plan)
    if (singleTrainingInfo.value.delivery_id) {
      training.delivery_id = singleTrainingInfo.value.delivery_id
      achievementType.value = 'certificate'
    }
  }
})

function addAchievementType(achievement_type) {
  achievementType.value = achievement_type
}
function addDeliveryID(event) {
  training.delivery_id = event || undefined
}
async function onSubmit() {
  const data = {
    num_users: parseInt(training.num_users),
    training_name: training.training_name
  }
  if (training.domains && training.domains?.length > 0) {
    data.domains = training.domains
  }
  if (achievementType.value && training.delivery_id) {
    data.delivery_id = training.delivery_id?.value || training.delivery_id
  }
  if (props.id) {
    data.training_id = props.id
    await trainingStore.updateTraining(compareFunction('training', data, singleTrainingInfo.value))
  } else {
    data.plan = training.plan.value
    data.start_date = training.start_date.replace(/\//g, '-')
    data.end_date = training.end_date.replace(/\//g, '-')
    await trainingStore.createTraining(data)
  }
  if (trainingStore.statusOfApi) {
    training.value = {
      training_name: '',
      plan: null,
      start_date: '',
      end_date: '',
      num_users: 0,
      domains: null
    }
    onCancel()
  }
}
function onCancel() {
  emit('onCancel', { show: true })
}
</script>
