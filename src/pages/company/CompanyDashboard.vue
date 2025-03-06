<template>
  <section class="q-pa-sm">
    <div class="row">
      <div class="q-pa-xs col-12">
        <div class="row text-h6">
          <div class="col-10" v-if="detailedCompanyUsersInfo.company_info">
            <q-icon name="edit" class="cursor-pointer" @click="actionItem('changeObject')"></q-icon>
            {{ detailedCompanyUsersInfo.company_info ? detailedCompanyUsersInfo.company_info.company_name : '' }}

            <q-badge
              outline
              :color="detailedCompanyUsersInfo.company_info.cbstatus === 'cancelled' ? 'red' : 'green'"
              size="xs"
              v-if="detailedCompanyUsersInfo.company_info ? detailedCompanyUsersInfo.company_info.cbstatus : ''"
            >
              {{ detailedCompanyUsersInfo.company_info ? detailedCompanyUsersInfo.company_info.cbstatus : '' }}
            </q-badge>
          </div>
          <div class="col-2" align="right" v-if="detailedCompanyUsersInfo.company_info">
            <q-btn
              outline
              bordered
              size="sm"
              v-if="
                detailedCompanyUsersInfo.company_info.cbstatus === 'active' ||
                detailedCompanyUsersInfo.company_info.cbstatus === 'non_renewing'
              "
              @click="actionItemFly(detailedCompanyUsersInfo.company_info.cbstatus)"
            >
              Cancel
            </q-btn>
            <q-btn
              outline
              size="sm"
              v-if="detailedCompanyUsersInfo.company_info.cbstatus === 'cancelled'"
              @click="actionItemFly(detailedCompanyUsersInfo.company_info.cbstatus)"
            >
              Re-activate
            </q-btn>
            <q-btn
              outline
              size="sm"
              v-if="detailedCompanyUsersInfo.company_info.cbstatus === 'in_trial'"
              @click="actionItemFly(detailedCompanyUsersInfo.company_info.cbstatus)"
            >
              Upgrade
            </q-btn>
          </div>
        </div>
      </div>
      <div class="q-pa-xs col-12">
        <div class="row"></div>
      </div>
      <q-dialog v-model="showDialogSubscriptions" persistent>
        <q-card transition-show="flip-up" transition-hide="flip-down" dark style="width: 750px; max-width: 90vw">
          <q-card-section>
            <div class="text-subtitle1 ase-roboto text-weight-normal">
              <q-icon name="create" />
              {{ showDialogTitle === 'changeUsers' ? 'Increase Users Count' : '' }}
              {{ showDialogTitle === 'changeDowngrade' ? 'Downgrade' : '' }}
              {{ showDialogTitle === 'changePlan' ? 'Change Plan' : '' }}
              {{ showDialogTitle === 'changeObject' ? 'Update Name' : '' }}
              {{ showDialogTitle === 'changeDate' ? 'Extend Date' : '' }}
              {{ showDialogTitle === 'changeCancel' ? 'Cancel' : '' }}
              {{ showDialogTitle === 'changeDomain' ? 'Domain Update' : '' }}
              {{ showDialogTitle === 'changeParent' ? 'Update Parent' : '' }}
              {{
                showDialogTitle === 'changeReactive'
                  ? `${detailedCompanyUsersInfo.company_info.cbstatus === 'in_trial' ? 'Upgrade' : 'Re activate'}`
                  : ''
              }}
              {{ showDialogTitle === 'changeMins' ? 'Monthly minutes' : '' }}
              {{ showDialogTitle === 'setIdp' ? 'Set Idp' : '' }}
              <hr />
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmitSubscriptions()">
              <div v-if="showDialogTitle === 'changeUsers'">
                <BaseInput label="Nº Users *" required :rules="[...number, ...min(1)]" v-model="company.numUsers" />
                <p v-if="fetchErrorMsgs.num_users" class="text-caption text-negative">{{ fetchErrorMsgs.num_users_msg }}</p>
              </div>
              <div v-if="showDialogTitle === 'changePlan'">
                <BaseSelect label="Plan Type *" :options="fetchlistPlans" v-model="company.plans" />

                <p v-if="fetchErrorMsgs.plans" class="text-caption text-negative">{{ fetchErrorMsgs.plans_msg }}</p>
                <BaseSelect label="Subscription Type *" :disable="true" :options="subcriptionTypeOptions" v-model="company.subType" />
                <p v-if="fetchErrorMsgs.subscription" class="text-caption text-negative">{{ fetchErrorMsgs.subscription_msg }}</p>
                <BaseInput label="Nº Users " required :rules="[...number, ...min(1)]" v-model="company.numUsers" />
                <p v-if="fetchErrorMsgs.num_users" class="text-caption text-negative">{{ fetchErrorMsgs.num_users_msg }}</p>

                <BaseToggle label="Pro-Rate" v-model="company.proRate" />
                <p v-if="fetchErrorMsgs.pro_rate" class="text-caption text-negative">{{ fetchErrorMsgs.pro_rate_msg }}</p>
              </div>
              <div v-if="showDialogTitle === 'changeParent'">
                <BaseInput label="Parent Email *" required :rules="email" v-model="company.parent" />
                <p v-if="fetchErrorMsgs.parent" class="text-caption text-negative">{{ fetchErrorMsgs.parent_msg }}</p>
              </div>

              <div v-if="showDialogTitle === 'changeDowngrade'">
                <div>Are you sure to cancel the subscription?</div>
              </div>
              <div v-if="showDialogTitle === 'changeCancel'">
                <div>Are you sure to cancel the subscription?</div>
              </div>
              <div v-if="showDialogTitle === 'changeMins'">
                <BaseInput
                  :label="
                    company.subType === 'Enterprise-Trial' || company.subType?.value === 'Enterprise-Trial'
                      ? 'Monthly mins *'
                      : 'Monthly mins'
                  "
                  :required="company.subType.value === 'Enterprise-Trial' || company.subType === 'Enterprise-Trial'"
                  :rules="
                    company.subType.value === 'Enterprise-Trial' || company.subType === 'Enterprise-Trial'
                      ? [...number, ...min(1)]
                      : []
                  "
                  type="number"
                  v-model="company.monthly_minutes"
                />
                <p v-if="fetchErrorMsgs.monthly_minutes" class="text-caption text-negative">{{ fetchErrorMsgs.monthly_minutes_msg }}</p>
              </div>

              <div v-if="showDialogTitle === 'setIdp'">
                <IdpModal :companyId="detailedCompanyUsersInfo.company_info.sk" @closemodal="onCancelSubscriptions()" />
              </div>

              <BaseInput
                autofocus
                v-if="showDialogTitle === 'changeObject'"
                label="Company Name *"
                :maxlength="150"
                required
                :rules="[...minLength(2), ...maxLength(150)]"
                v-model="company.name"
              />
              <p v-if="fetchErrorMsgs.company_name" class="text-caption text-negative">{{ fetchErrorMsgs.company_name_msg }}</p>

              <BaseSelect
                v-if="showDialogTitle === 'changeDomain'"
                :clearable="false"
                label="Domains"
                hide-hint
                :hint="domainValidation.hint ? domainValidation.hintLabel : ''"
                multiple
                newValueMode="add-unique"
                v-model="company.domains"
              />
              <p v-if="fetchErrorMsgs.domains" class="text-caption text-negative">{{ fetchErrorMsgs.domains_msg }}</p>

              <BaseInput
                clearable
                v-if="showDialogTitle === 'changeDate'"
                label="End Date *"
                :options="(date) => (company.startDate ? date > company.startDate : true)"
                required
                :rules="date"
                type="date"
                v-model="company.endDate"
              />
              <p v-if="fetchErrorMsgs.end_date" class="text-caption text-negative">{{ fetchErrorMsgs.end_date_msg }}</p>
              <div v-if="showDialogTitle === 'changeReactive'">
                <BaseInput
                  clearable
                  :label="`End Date ${company.subType.value === 'Enterprise' ? '' : '*'}`"
                  :options="(date) => (company.startDate ? date > company.startDate : true)"
                  required
                  :rules="date"
                  type="date"
                  v-model="company.endDate"
                />
                <p v-if="fetchErrorMsgs.end_date" class="text-caption text-negative">{{ fetchErrorMsgs.end_date_msg }}</p>
                <BaseSelect label="Plan Type *" :options="fetchlistPlans" v-model="company.plans" />
                <p v-if="fetchErrorMsgs.plans" class="text-caption text-negative">{{ fetchErrorMsgs.plans_msg }}</p>
                <BaseSelect label="Subscription Type *" :options="subcriptionTypeOptions" v-model="company.subType" />
                <p v-if="fetchErrorMsgs.subscription" class="text-caption text-negative">{{ fetchErrorMsgs.subscription_msg }}</p>
                <BaseInput label="Nº Users " required :rules="[...number, ...min(1)]" v-model="company.numUsers" />
                <p v-if="fetchErrorMsgs.num_users" class="text-caption text-negative">{{ fetchErrorMsgs.num_users_msg }}</p>
              </div>
              <q-card-actions v-if="showDialogTitle !== 'setIdp'" align="right">
                <q-btn class="text-capitalize bg-primary text-white" @click="onCancelSubscriptions()">Cancel</q-btn>
                <q-btn class="text-capitalize bg-primary text-white" type="submit">Save</q-btn>
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>

    <div class="row">
      <div class="q-pa-xs col-3">
        <Statistics
          iconName="people"
          title="Users"
          :editIcon="true"
          :editIconName="'edit'"
          @editUsers="actionItem('changeUsers')"
          :count="company.numUsers || 0"
        />
      </div>
      <div class="q-pa-xs col-3">
        <Statistics iconName="notifications_active" title="Active Users" :count="detailedCompanyUsersInfo.no_of_active_users || 0" />
      </div>
      <div class="q-pa-xs col-3">
        <Statistics
          iconName="people_outline"
          title="Monthly mins"
          :editIconName="'edit'"
          :editIcon="true"
          @editUsers="actionItem('changeMins')"
          :showToolTip="true"
          :count="detailedCompanyUsersInfo.company_info ? detailedCompanyUsersInfo.company_info.monthly_minutes || 'N/A' : '-'"
        />
      </div>

      <div class="q-pa-xs col-3">
        <Statistics
          iconName="event_available"
          title="End date"
          :editIconName="'edit'"
          :editIcon="true"
          @editUsers="actionItem('changeDate')"
          :count="detailedCompanyUsersInfo.company_info ? dateFormatReadable(detailedCompanyUsersInfo.company_info.end_date) : '' || 0"
        />
      </div>
      <div class="q-pa-xs col-3">
        <Statistics
          iconName="people_outline"
          title="Plan"
          :editIconName="'edit'"
          :editIcon="true"
          @editUsers="actionItem('changePlan')"
          :showToolTip="true"
          :count="detailedCompanyUsersInfo.company_info?.plan ? detailedCompanyUsersInfo.company_info?.plan.toString() : ''"
        />
      </div>
      <div class="q-pa-xs col-3">
        <Statistics
          iconName="people_outline"
          title="Domain"
          :editIconName="'edit'"
          :editIcon="true"
          @editUsers="actionItem('changeDomain')"
          :showToolTip="true"
          :updateDomainInfo="true"
          :count="company.domains"
        />
      </div>
      <div class="q-pa-xs col-3">
        <Statistics
          iconName="user"
          title="Parent"
          :editIconName="'edit'"
          :editIcon="true"
          @editUsers="actionItem('changeParent')"
          :showToolTip="true"
          :count="detailedCompanyUsersInfo.company_info ? detailedCompanyUsersInfo.company_info.parent || 'N/A' : '-'"
        />
      </div>
      <div class="q-pa-xs col-3">
        <Statistics
          :title="detailedCompanyUsersInfo?.company_info?.idp_name ? 'Delete IDP' : 'Set IDP'"
          :editIconName="detailedCompanyUsersInfo?.company_info?.idp_name ? 'delete' : 'edit'"
          :editIcon="true"
          @editUsers="detailedCompanyUsersInfo?.company_info?.idp_name ? deleteIdp() : actionItem('setIdp')"
        />
      </div>
    </div>
    <div class="row">
      <div class="q-pa-xs col-12">
        <br />
        <q-tabs active-color="white" align="justify" class="text-grey" dense indicator-color="white" v-model="tab" @click="filteredInfo">
          <q-tab name="users" label="Users" />
          <q-tab name="admins" label="Administrators" />
          <q-tab name="popularCourses" label="Popular Courses" @click="statsInformation" />
          <q-tab name="popularTeams" label="Popular Teams" @click="statsInformation" />
        </q-tabs>
        <q-separator dark />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel class="bg-primary text-white" dark name="users">
            <CompanyUsers :companyId="route.params.companyid" />
          </q-tab-panel>
          <q-tab-panel class="bg-primary text-white" name="admins">
            <CompanyAdmins :data="fetchCompanyAdminGetter ? fetchCompanyAdminGetter || [] : []" />
          </q-tab-panel>
          <q-tab-panel class="bg-primary text-white" name="popularCourses">
            <BarChart
              :barChartData="fetchTopCoursesGetter.data"
              :barChartLabels="fetchTopCoursesGetter.labels"
              :barChartName="fetchTopCoursesGetter.data.length > 0 ? fetchTopCoursesGetter.name : 'No data'"
              :title="isLoading ? 'Loading...' : fetchTopCoursesGetter.data.length > 0 ? fetchTopCoursesGetter.name : 'Popular Courses'"
              :idBarChart="'IDBARRRLPSCorpsortate'"
            />
          </q-tab-panel>
          <q-tab-panel class="bg-primary text-white" name="popularTeams">
            <TrendBar
              :title="isLoading ? 'Loading...' : fetchTopTeamsGetter.data.length > 0 ? fetchTopTeamsGetter.name : 'Popular Teams'"
              :bar_chart_categories="fetchTopTeamsGetter.categories ? fetchTopTeamsGetter.categories : [] || []"
              :bar_chart_data="fetchTopTeamsGetter.data ? fetchTopTeamsGetter.data : [] || []"
              :bar_chart_labels="fetchTopTeamsGetter.labels"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </section>
</template>
<script setup>
import { showLoader } from 'app/src/utils/loader'
import IdpModal from 'components/IdpModal/Index.vue'
import Statistics from 'components/company/Statistics'
import CompanyAdmins from 'components/company/tables/companyAdmins'
import CompanyUsers from 'components/company/tables/users'
import BarChart from 'components/echarts-latest/bar'
import TrendBar from 'components/echarts-latest/trendBarMultiple'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseToggle from 'components/shared/BaseToggle.vue'
import { Notify } from 'quasar'
import { useAnalyticsStatStore, useCompanyStore, useCourseStore } from 'src/stores'
import { dateFormatReadable, urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { date, email, maxLength, min, minLength, number } from 'src/utils/rules'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const tab = ref('users')
const domainValidation = ref({ hint: 'true', hintLabel: 'Optional' })
const showDialogSubscriptions = ref(false)
const showDialogTitle = ref('')
const qty = ref(3)
const company = reactive({
  name: '',
  plans: [],
  email: '',
  parent: '',
  first_name: '',
  last_name: '',
  courses: null,
  numUsers: 0,
  minutesPerUser: 0,
  monthly_minutes: undefined,
  startDate: '',
  endDate: '',
  domains: null,
  isPayment: false,
  isEvent: false,
  subType: '',
  proRate: false
})
const subcriptionTypeOptions = ref([
  { value: 'Enterprise', label: 'Enterprise' },
  { value: 'Enterprise-Trial', label: 'Enterprise-Trial' }
])

const companyStore = useCompanyStore()
const courseStore = useCourseStore()
const analyticsStatsStore = useAnalyticsStatStore()
const route = useRoute()

const isLoading = computed(() => companyStore.loading)
const detailedCompanyUsersInfo = computed(() => companyStore.companyUsersStats)
const fetchCompanyAdminGetter = computed(() => companyStore.companyAdmins)
const fetchStatusOfApiCompany = computed(() => companyStore.statusOfApi)
const fetchErrorMsgs = computed(() => companyStore.error_msgs)
const fetchlistPlans = computed(() => companyStore.listPlans)
const fetchTopCoursesGetter = computed(() => analyticsStatsStore.topCourses)
const fetchTopTeamsGetter = computed(() => analyticsStatsStore.topTeams)
const coursesOption = computed(() => (courseStore.courseOptions.length > 0 ? [...new Set(courseStore.courseOptions)] : []))
// const emit = defineEmits(['openWarning', 'onCacel'])
onMounted(async () => {
  tab.value = 'users'
  await companyStore.fetchCompanyUserStats({
    company_id: urlSafeBase64Decode(route.params.companyid)
  })
  qty.value = detailedCompanyUsersInfo.value.no_of_users
  await updateChanges()
})

async function actionItemFly(data) {
  if (data === 'cancelled') {
    actionItem('changeReactive')
  } else if (data === 'in_trial ') {
    actionUpgrade()
  } else if (data === 'active' || data === 'non_renewing') {
    actionItem('changeCancel')
  } else {
    actionItem('changeReactive')
  }
}
async function actionItem(data) {
  if (data) {
    showDialogTitle.value = data
    if (data === 'changePlan') {
      await companyStore.fetchPlanOptions({})
      await updateChanges()
    }
    if (data === 'changeObject') {
      if (detailedCompanyUsersInfo.value.company_info) {
        company.name = detailedCompanyUsersInfo.value.company_info.company_name
      }
    }
    if (data === 'changeParent') {
      if (detailedCompanyUsersInfo.value.company_info) {
        company.parent = detailedCompanyUsersInfo.value.company_info.parent
      }
    }
    if (data === 'changeReactive') {
      await companyStore.fetchPlanOptions({})
      await updateChanges()
    }

    showDialogSubscriptions.value = true
  }
}
function onCancelSubscriptions() {
  showDialogSubscriptions.value = false
}
function statsInformation() {
  analyticsStatsStore.fetchCompanyStatsAction({
    company_id: urlSafeBase64Decode(route.params.companyid)
  })
}
async function updateChanges() {
  if (detailedCompanyUsersInfo.value.company_info?.courses) {
    const coursesList = []
    coursesOption.value.forEach((course) => {
      detailedCompanyUsersInfo.value.company_info.courses.forEach((icheck) => {
        if (course.value === icheck) {
          coursesList.push({ label: course.label, value: course.value })
        }
      })
    })
    company.courses = coursesList
  }

  if (detailedCompanyUsersInfo.value.company_info) {
    company.name = detailedCompanyUsersInfo.value.company_info.company_name
    company.startDate = detailedCompanyUsersInfo.value.company_info.start_date.replace(/-/g, '/')
    company.endDate = detailedCompanyUsersInfo.value.company_info.end_date.replace(/-/g, '/')
    company.domains = detailedCompanyUsersInfo.value.company_info.domains
    fetchlistPlans.value.forEach((plan) => {
      if (plan.value === detailedCompanyUsersInfo.value.company_info.plan) {
        company.plans = { label: plan.label, value: plan.value }
      }
    })
    company.numUsers = detailedCompanyUsersInfo.value.company_info.num_users
    company.isPayment = detailedCompanyUsersInfo.value.company_info.payment_complete
    company.minutesPerUser = detailedCompanyUsersInfo.value.company_info.minutes_per_user
    company.first_name = detailedCompanyUsersInfo.value.company_info.first_name
    company.last_name = detailedCompanyUsersInfo.value.company_info.last_name
    company.parent = detailedCompanyUsersInfo.value.company_info.parent
    company.subType = {
      label: detailedCompanyUsersInfo.value.company_info.subscription,
      value: detailedCompanyUsersInfo.value.company_info.subscription
    }
    company.proRate = detailedCompanyUsersInfo.value.company_info.pro_rate

    company.monthly_minutes = detailedCompanyUsersInfo.value.company_info.monthly_minutes
  }
}
function filteredInfo() {
  if (tab.value === 'admins') {
    companyStore.fetchCompanyAdmins({
      pagination: { company_id: urlSafeBase64Decode(route.params.companyid) },
      reset: true
    })
  }
}
async function onSubmitSubscriptions() {
  if (showDialogTitle.value === 'changeUsers') {
    const end_date =
      detailedCompanyUsersInfo.value.company_info.subscription === 'Enterprise-Trial'
        ? detailedCompanyUsersInfo.value.company_info.end_date
        : undefined
    const payload = {
      type: 'change',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      subscription: detailedCompanyUsersInfo.value.company_info.subscription,
      num_users: parseInt(company.numUsers),
      end_date
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changePlan') {
    const payload = {
      type: 'change',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      subscription: detailedCompanyUsersInfo.value.company_info.subscription,
      plan: company.plans.value,
      prorate: company.proRate,
      num_users: parseInt(company.numUsers)
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changeCancel') {
    const payload = {
      type: 'cancel',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      subscription: detailedCompanyUsersInfo.value.company_info.subscription,
      plan: detailedCompanyUsersInfo.value.company_info.plan,
      prorate: company.proRate
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changeObject') {
    const payload = {
      type: 'object',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      company_name: company.name
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changeParent') {
    const payload = {
      type: 'parent',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      parent: company.parent
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changeDomain') {
    const payload = {
      type: 'object',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      company_name: company.name,
      domains: company.domains
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changeMins') {
    const payload = {
      type: 'object',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      monthly_minutes: parseInt(company.monthly_minutes)
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }

  if (showDialogTitle.value === 'changeDate') {
    const payload = {
      type: 'extend',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      end_date: company.endDate.replace(/\//g, '-')
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }

  if (showDialogTitle.value === 'changeDowngrade') {
    const payload = {
      type: 'cancel',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      credit_option: 'prorate'
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }
  if (showDialogTitle.value === 'changeReactive') {
    const payload = {
      type: 'change',
      company_id: detailedCompanyUsersInfo.value.company_info.sk,
      end_date: company.endDate.replace(/\//g, '-'),
      subscription: company.subType.value,
      plan: company.plans.value,
      num_users: parseInt(company.numUsers)
    }
    await companyStore.actionCompany(payload)
    if (fetchStatusOfApiCompany.value) {
      showDialogSubscriptions.value = false
    }
  }

  await updateChanges()
}
async function actionUpgrade() {
  const payload = {
    type: 'upgrade',
    company_id: detailedCompanyUsersInfo.value.company_info.sk,
    subscription: company.subType.value
  }
  await companyStore.actionCompany(payload)
  if (fetchStatusOfApiCompany.value) {
    showDialogSubscriptions.value = false
  }
}
async function deleteIdp() {
  showLoader(true)
  const success = await companyStore.deleteIdp({
    company_id: detailedCompanyUsersInfo.value.company_info.sk
  })
  Notify.create({
    type: success ? 'positive' : 'negative',
    position: 'top',
    progress: true,
    icon: success ? 'success' : 'error',
    timeout: 1100,
    message: success ? 'Successfully deleted IDP' : 'Failed to delete IDP'
  })
  success && onCancelSubscriptions()
  showLoader(false)
}
</script>
<style scoped>
.bordered_info {
  border: 1px solid #1c1c1c;
  padding: 14px;
  border-radius: 0px;
  box-shadow: inset 0px, 1px rgba(0, 0, 0, 0.05);
}
</style>
