<template>
  <q-dialog v-model="dataShow" persistent>
    <q-card transition-show="flip-up" transition-hide="flip-down" dark style="width: 750px; max-width: 90vw">
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Company' : 'Create Company' }}
          <hr />
        </div>
      </q-card-section>
      <q-card-section>
        <q-form greedy ref="formRef" @submit.prevent="onSubmit">
          <q-stepper active-color="white" alternative-labels animated dark done-color="positive" header-nav ref="stepper" v-model="step">
            <q-step :name="1" title="Company Details" icon="settings" :done="step > 1" :header-nav="step > 1">
              <q-list class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput
                      autofocus
                      label="Company Name *"
                      :maxlength="150"
                      required
                      :rules="[...minLength(2), ...maxLength(150)]"
                      v-model="company.name"
                    />
                    <p v-if="fetchErrorMsgs.company_name" class="text-caption text-negative">{{ fetchErrorMsgs.company_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect label="Plan Type *" :options="fetchlistPlans" :rules="required" v-model="company.plans" />
                    <p v-if="fetchErrorMsgs?.plan" class="text-caption text-negative">{{ fetchErrorMsgs.plan_msg }}</p>
                    <p
                      v-if="id"
                      class="text-caption text-center text-warning"
                      v-show="![companyFromServer?.plan, companyFromServer?.plans?.[0]].includes(company.plans?.value)"
                    >
                      Note: if plans were changed, please manually update plans in chargebee
                    </p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput label="Nº Users *" required :rules="[...number, ...min(1)]" v-model="company.numUsers" />
                    <p v-if="fetchErrorMsgs.num_users" class="text-caption text-negative">{{ fetchErrorMsgs.num_users_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseSelect
                      label="Subscription Type *"
                      :options="subcriptionTypeOptions"
                      :rules="required"
                      v-model="company.subscription"
                    />
                    <p v-if="fetchErrorMsgs.subscription" class="text-caption text-negative">{{ fetchErrorMsgs.subscription_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      clearable
                      label="Start Date *"
                      :options="(date) => date >= todayDate() && (company.endDate ? date < company.endDate : true)"
                      required
                      :rules="date"
                      type="date"
                      v-model="company.startDate"
                    />
                    <p v-if="fetchErrorMsgs.start_date" class="text-caption text-negative">{{ fetchErrorMsgs.start_date_msg }}</p>
                    <label
                      v-if="id && company.startDate !== companyFromServer?.start_date?.replace(/-/g, '/')"
                      class="text-caption text-warning"
                    >
                      Changing this won't modify subscription start date
                    </label>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      clearable
                      label="End Date *"
                      :options="(date) => (company.startDate ? date > company.startDate : true)"
                      required
                      :rules="date"
                      type="date"
                      v-model="company.endDate"
                    />
                    <p v-if="fetchErrorMsgs.end_date" class="text-caption text-negative">{{ fetchErrorMsgs.end_date_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseInput
                      :label="
                        company.subscription === 'Enterprise-Trial' || company.subscription?.value === 'Enterprise-Trial'
                          ? 'Monthly mins *'
                          : 'Monthly mins'
                      "
                      :required="company.subscription?.value === 'Enterprise-Trial' || company.subscription === 'Enterprise-Trial'"
                      :rules="company.subscription?.value === 'Enterprise-Trial' ? [...number, ...min(1)] : []"
                      type="number"
                      v-model="company.monthly_minutes"
                    />
                    <p v-if="fetchErrorMsgs.monthly_minutes" class="text-caption text-negative">{{ fetchErrorMsgs.monthly_minutes_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-sm-6 col-xs-12">
                  <q-item-section>
                    <BaseSelect
                      :clearable="false"
                      label="Domains"
                      hide-hint
                      :hint="domainValidation.hint ? domainValidation.hintLabel : ''"
                      multiple
                      newValueMode="add-unique"
                      v-model="company.domains"
                    />
                    <p v-if="fetchErrorMsgs.domains" class="text-caption text-negative">{{ fetchErrorMsgs.domains_msg }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step
              :name="2"
              title="Super User"
              icon="verified_user"
              :done="step > 2"
              :header-nav="step > 2"
              :disable="
                !(
                  company.name &&
                  (id ? company.plans : true) &&
                  (!company.subscription ||
                    (company.subscription?.value !== 'Enterprise-Trial' && company.subscription !== 'Enterprise-Trial') ||
                    parseInt(company.monthly_minutes)) &&
                  company.startDate &&
                  company.endDate &&
                  company.endDate >= company.startDate
                )
              "
            >
              <q-list v-if="!id" class="row">
                <q-item class="col-6">
                  <q-item-section>
                    <BaseInput autofocus label="First Name *" required :rules="shortName" v-model="company.first_name" />
                    <p v-if="fetchErrorMsgs.first_name" class="text-caption text-negative">{{ fetchErrorMsgs.first_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-6">
                  <q-item-section>
                    <BaseInput label="Last Name *" required :rules="shortName" v-model="company.last_name" />
                    <p v-if="fetchErrorMsgs.last_name" class="text-caption text-negative">{{ fetchErrorMsgs.last_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Parent Email *" required :rules="email" v-model="company.parent" />
                    <p v-if="fetchErrorMsgs.parent" class="text-caption text-negative">{{ fetchErrorMsgs.parent_msg }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list v-else-if="id && companyFromServer?.parent && !showChangeParent" class="row">
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Parent Email *" readonly v-model="company.parent" />
                    <p v-if="fetchErrorMsgs.parent" class="text-caption text-negative">{{ fetchErrorMsgs.parent_msg }}</p>
                    <q-icon class="cursor-pointer" name="edit" @click="updateChange()">
                      <q-tooltip>Update</q-tooltip>
                    </q-icon>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list
                v-else-if="id && !companyFromServer?.parent && !companyFromServer?.first_name && !companyFromServer?.last_name"
                class="row"
              >
                <q-item class="col-6">
                  <q-item-section>
                    <BaseInput autofocus label="First Name *" required :rules="shortName" v-model="company.first_name" />
                    <p v-if="fetchErrorMsgs.first_name" class="text-caption text-negative">{{ fetchErrorMsgs.first_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-6">
                  <q-item-section>
                    <BaseInput label="Last Name *" required :rules="shortName" v-model="company.last_name" />
                    <p v-if="fetchErrorMsgs.last_name" class="text-caption text-negative">{{ fetchErrorMsgs.last_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Parent Email *" required :rules="email" v-model="company.parent" />
                    <p v-if="fetchErrorMsgs.parent" class="text-caption text-negative">{{ fetchErrorMsgs.parent_msg }}</p>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list v-else-if="id && showChangeParent" class="row">
                <q-item class="col-6">
                  <q-item-section>
                    <BaseInput autofocus label="First Name *" required :rules="shortName" v-model="company.first_name" />
                    <p v-if="fetchErrorMsgs.first_name" class="text-caption text-negative">{{ fetchErrorMsgs.first_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-6">
                  <q-item-section>
                    <BaseInput label="Last Name *" required :rules="shortName" v-model="company.last_name" />
                    <p v-if="fetchErrorMsgs.last_name" class="text-caption text-negative">{{ fetchErrorMsgs.last_name_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-item class="col-12">
                  <q-item-section>
                    <BaseInput label="Parent Email *" required :rules="email" v-model="company.parent" />
                    <p v-if="fetchErrorMsgs.parent" class="text-caption text-negative">{{ fetchErrorMsgs.parent_msg }}</p>
                  </q-item-section>
                </q-item>
                <q-icon name="undo" @click="undoChange()" class="cursor-pointer">
                  <q-tooltip>Undo</q-tooltip>
                </q-icon>
              </q-list>
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation class="row">
                <q-btn class="col-grow q-mr-sm" color="orange" outline @click="onCancel()">Cancel</q-btn>
                <q-btn v-if="step > 1" @click="$refs.stepper.previous()" class="col-grow q-mr-sm" color="orange" label="Back" />
                <q-btn
                  v-if="step === 1"
                  class="col-grow"
                  color="positive"
                  label="Next"
                  @click="$refs.formRef.validate().then((valid) => (valid ? $refs.stepper.next() : null))"
                />
                <q-btn v-if="step === 2" class="col-grow" color="positive" :disable="!company.parent" type="submit">Save</q-btn>
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { Notify } from 'quasar'
import { useCompanyStore } from 'src/stores'
import { todayDate } from 'src/utils/reuseFunctions'
import { date, email, maxLength, min, minLength, number, required, shortName } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['id', 'show'])
const emit = defineEmits(['openWarning', 'onCacel'])

const step = ref(1)
const showDialog = ref(false)
const company = ref({
  name: '',
  plans: undefined,
  email: '',
  parent: '',
  first_name: '',
  last_name: '',
  numUsers: 0,
  minutesPerUser: 0,
  monthly_minutes: undefined,
  startDate: '',
  endDate: '',
  domains: null,
  isPayment: false,
  isEvent: false,
  subscription: undefined
})
const companyFromServer = ref({})
const showChangeParent = ref(false)
const domainValidation = ref({ hint: 'true', hintLabel: 'Optional' })
const subcriptionTypeOptions = ref([
  { value: 'Enterprise', label: 'Enterprise' },
  { value: 'Enterprise-Trial', label: 'Enterprise-Trial' }
])
const dataShow = ref(props.show)

// const courseStore = useCourseStore()
const companyStore = useCompanyStore()

// const coursesOption = computed(() => (courseStore.courseOptions.length > 0 ? [...new Set(courseStore.courseOptions)] : []))
const companiesData = computed(() => (companyStore.listCompanies.length > 0 ? [...new Set(companyStore.listCompanies)] : []))
const errorMessageDialogGetter = computed(() => companyStore.errorMessageDialog)
const fetchErrorMsgs = computed(() => companyStore.error_msgs)
const fetchlistPlans = computed(() => companyStore.listPlans)
const fetchStatusOfApiCompany = computed(() => companyStore.statusOfApi)

onMounted(async () => {
  if (!fetchlistPlans.value?.length) {
    await companyStore.fetchPlanOptions({})
  }
  if (props.id) {
    const company_temp = companiesData.value.find((company) => company.id === props.id)
    companyFromServer.value = { ...company_temp }

    company.value.name = company_temp.company_name
    company.value.startDate = company_temp.start_date?.replace(/-/g, '/')
    company.value.endDate = company_temp.end_date?.replace(/-/g, '/')
    company.value.domains = company_temp.domains
    company.value.plans = fetchlistPlans.value.find((plan) => [company_temp.plan, company_temp.plans?.[0]].includes(plan.value))
    company.value.numUsers = company_temp.num_users
    company.value.isPayment = company_temp.payment_complete
    company.value.minutesPerUser = company_temp.minutes_per_user
    company.value.first_name = company_temp.first_name
    company.value.last_name = company_temp.last_name
    company.value.parent = company_temp.parent
    company.value.subscription = company_temp.subscription
    company.value.monthly_minutes = company_temp.monthly_minutes
  }
})

async function onSubmit() {
  if (company.value.endDate <= company.value.startDate) {
    Notify.create({ message: 'End date should be greater than start date', color: 'negative', position: 'top', timeout: 2000 })
    return
  }
  const data = {
    company_name: company.value.name,
    first_name: company.value.first_name,
    last_name: company.value.last_name,
    parent: company.value.parent,
    num_users: parseInt(company.value.numUsers),
    start_date: company.value.startDate.replace(/\//g, '-'),
    end_date: company.value.endDate.replace(/\//g, '-'),
    subscription: company.value.subscription?.value || company.value.subscription,
    plan: company.value.plans?.value || company.value.plans
  }
  if (company.value.domains) {
    data.domains = company.value.domains
  }
  if (company.value.monthly_minutes > 0) {
    data.monthly_minutes = parseInt(company.value.monthly_minutes)
  }
  if (props.id) {
    data.type = 'object'
    data.company_id = props.id
    const company = companiesData.value.find((company) => company.id === props.id)
    await companyStore.updateCompanyInfo(compareFunction('company', data, company))
  } else {
    await companyStore.createCompany(data)
  }
  if (fetchStatusOfApiCompany.value) {
    company.value = {
      name: '',
      parent: '',
      first_name: '',
      last_name: '',
      numUsers: 0,
      minutesPerUser: 0,
      monthly_minutes: undefined,
      startDate: '',
      endDate: '',
      domains: null,
      isPayment: false,
      isEvent: false,
      subscription: ''
    }
    showChangeParent.value = false
    if (errorMessageDialogGetter.value.status) {
      emit('openWarning', { show: true, dialog: true })
      showDialog.value = true
    }
    onCancel()
  }
}
function updateChange() {
  showChangeParent.value = true
  company.value.first_name = ''
  company.value.last_name = ''
  company.value.parent = ''
}
function undoChange() {
  showChangeParent.value = false
  company.value.first_name = companyFromServer.value.first_name
  company.value.last_name = companyFromServer.value.last_name
  company.value.parent = companyFromServer.value.parent
}
function onCancel() {
  emit('onCacel', { show: true })
  company.value = {}
}
</script>
