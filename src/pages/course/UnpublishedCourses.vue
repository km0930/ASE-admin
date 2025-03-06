<template>
  <UnPublishedCourseTable
    v-if="!isUsers"
    :modelValue="isEventCourse"
    @update:modelValue="(val) => (isEventCourse = val)"
    @markdownView="showMarkDown($event)"
    @showDataBasedToggle="showDataBasedToggle($event)"
    @attachPlans="publishCourseToPlan"
  />
  <Confirm
    v-if="isConfirm"
    :show="isConfirm"
    :header="'Add Plans'"
    @confirmDelete="sendPlansConfirm($event)"
    @confirmDeleteCancel="confirmSendCancel($event)"
  />
  <q-dialog v-model="showDialogInformation" persistent>
    <q-card style="min-width: 750px" transition-show="flip-up" transition-hide="flip-down" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          Add to Plans
          {{ step }}
          <hr />
        </div>
      </q-card-section>
      <q-separator />
      <q-form greedy ref="formRef" @submit.prevent="sendPlans">
        <q-stepper active-color="white" alternative-labels animated dark done-color="positive" v-model="step" ref="stepper">
          <q-step v-if="!isEventCourse" :name="1" title="Select Bundles" icon="map" :done="step > 1">
            <q-card-section class="q-pt-none">
              <q-list class="row">
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <SwapList label="Bundles Name *" :options="fetchBundlesName" v-model="bundles">
                      <template #left_tool="props">
                        <q-icon class="q-ma-xs" name="info" size="sm" @click.stop>
                          <q-menu class="q-py-sm">
                            <p v-for="item in props.data?.course_maps ?? []" :key="item" class="q-mx-lg q-mb-sm">{{ item }}</p>
                          </q-menu>
                          <q-tooltip>Course maps</q-tooltip>
                        </q-icon>
                      </template>
                    </SwapList>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions>
              <q-btn class="col-grow" color="orange" outline label="Cancel" @click="confirmCancel()" />
              <q-btn
                class="col-grow"
                color="positive"
                label="Next"
                @click="$refs.formRef.validate().then((valid) => (valid ? $refs.stepper.next() : null))"
              />
            </q-card-actions>
          </q-step>
          <q-step :name="2" title="Select Plan Type" icon="map" :done="step > 2">
            <q-card-section class="q-pt-none">
              <q-list class="row">
                <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <q-item-section>
                    <BaseSelect
                      autofocus
                      label="Family Plan *"
                      :options="fetchPlanTypes"
                      v-model="plan_family"
                      :clearable="false"
                      required
                    />
                    <SwapList v-if="plan_family" label="Plan Type *" :options="fetchPlan" v-model="plans" />
                    <div v-if="fetchErrorMsgsPlans.plan_ids">
                      <p class="text-caption text-weight-normal error_msg ase-roboto none-spacing">
                        {{ fetchErrorMsgsPlans.plan_ids_msg }}
                      </p>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions class="q-px-lg q-mb-md">
              <q-btn class="col-grow" outline color="orange" label="Cancel" @click="confirmCancel()" />
              <q-btn v-if="step > 1 && !isEventCourse" class="col-grow" color="orange" label="Back" @click="step--" />
              <q-btn class="col-grow" color="positive" :disable="!plans.length" label="Send" type="submit" />
            </q-card-actions>
          </q-step>
        </q-stepper>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showMD">
    <q-card style="min-width: 850px" transition-show="flip-up" transition-hide="flip-down" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="pen" />
          How to publish course
          <hr />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-none">
        <q-list class="row">
          <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-item-section>
              <q-markdown>
                {{ base64DecodeData(markdowntext) }}
              </q-markdown>
            </q-item-section>
          </q-item>
          <q-item class="col-12">
            <q-btn class="col-grow" color="orange" label="Close" outline @click="confirmCancelMD()" />
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import UnPublishedCourseTable from 'components/course/UnPublishedCourseTable'
import BaseSelect from 'components/shared/BaseSelect.vue'
import Confirm from 'components/shared/ConfirmationWindow'
import SwapList from 'components/shared/SwapList'
import { useBundleStore, useCourseStore, useMapStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref, watch } from 'vue'

const courseStore = useCourseStore()
const mapStore = useMapStore()
const bundleStore = useBundleStore()

const isUsers = ref(false)
const eventId = ref('')
const showMD = ref(false)
const showDialogInformation = ref(false)
const isConfirm = ref(false)
const plans = ref([])
const bundles = ref([])
const toggledType = ref('noneEventCourses')
const markdowntext = ref(
  'IyBIb3cgdG8gcHVibGlzaCBjb3Vyc2UKCiMjIENyZWF0ZSBQbGFuIGluIGNoYXJnZWJlZQoqIDE6IENyZWF0ZSBwbGFuIGluIGBjaGFyZ2ViZWVgIHNpdGUuCgojIyBDb3Vyc2UgbWFwCiogMTogR28gdG8gYWRtaW4gcG9ydGFsIGFuZCBjbGljayBgQ291cnNlIE1hcGAKCiogMjogQ3JlYXRlIGBjb3Vyc2UgbWFwYAogICAgKiBTZWxlY3QgY3JlYXRlZCBgUGxhbmAgYXMgYFBsYW4gVHlwZWAKICAgICogRW50ZXIgYG1vbnRobHkgbWludXRlc2AKICAgID4gQmFzZWQgb24gdGhpcyB3ZSBhcmUgcmVzdHJpY3RpbmcgdXNlcnMgbGFiIG1pbnV0ZXMKICAgICogQ2xpY2sgYFNhdmVgIGJ1dHRvbgoKPiBDb3Vyc2VtYXAgaXMgbm90aGluZyBidXQgYSBjaGFyZ2ViZWUgc3Vic2NyaXB0aW9uLCBFeGFtcGxlOiBJZiBhIHVzZXIgc2lnbmVkIHVwIGFuIGFubnVhbCBwbGFuIGluIGNoYXJnZWJlZSwgdGhlbiAgYmFzZWQgb24gYW5udWFsIGNvdXJzZW1hcCBjb3Vyc2VzIG9ubHkgd2lsbCBhcHBlYXIgZm9yIHRoZSB1c2VyLgoKIyMgTGV0J3MgcHVibGlzaCB0aGUgY291cnNlCiogMTogR28gdG8gdWJwdWJsaXNoZWQgY291cnNlcwoqIDI6IFNlbGVjdCBhbnkgY291cnNlIHRvIHB1Ymxpc2ggLCBlYWNoIGNvdXJzZSBjYXJkIHdpbGwgaGF2ZSBgcHVibGlzaGAgYnV0dG9uCiogMzogQ2xpY2sgYHB1Ymxpc2hgIGJ1dHRvbiAKKiA0OiBTZWxlY3QgYFdoaWNoIGNvdXJzZSBtYXBgIAo+IEJhc2VkIG9uIHRoaXMgY291cnNlIHdpbGwgYXBwZWFyIHNlbGVjdGVkIGNvdXJzZW1hcC8gc3Vic2NyaXB0aW9uCiogNTogQ2xpY2sgYFNhdmVgIGJ1dHRvbg=='
)
const plan_family = ref('')
const isEventCourse = ref(false)
const step = ref(1)

const searchByNameGetter = computed(() => courseStore.searchByName)
const coursesUnPublishedList = computed(() => courseStore.listUnPublishedCourses)
const fetchErrorMsgsPlans = computed(() => courseStore.error_msgs_plans)
const fetchlistMaps = computed(() => mapStore.listMaps)
const fetchPlanTypes = computed(() => mapStore.planTypes)
const fetchlistPlansMaps = computed(() =>
  mapStore.listMaps.map((plan) => ({
    value: plan.plan_id,
    label: plan.plan_name,
    plan: plan.plan_family
  }))
)
const fetchBundlesName = computed(() =>
  bundleStore.bundles.map((data) => ({ value: data.sk, label: data.bundle_name, course_maps: data.course_maps }))
)

function fetchPlan() {
  return fetchlistPlansMaps.value.filter((data) => {
    return data.plan === plan_family.value
  })
}

watch(isEventCourse, (value) => {
  if (value) {
    step.value = 2
  } else {
    step.value = 1
  }
})

onMounted(async () => {
  bundleStore.searchAllBundle()
  if (coursesUnPublishedList.value.length === 0) {
    await courseStore.fetchUnPublishedCoursesOptions({ pagination: {}, reset: false })
  }
})
function confirmCancel() {
  showDialogInformation.value = false
  plan_family.value = ''
  plans.value = []
  step.value = isEventCourse.value ? 2 : 1
  bundles.value = []
}
function confirmCancelMD() {
  showMD.value = false
}
function base64DecodeData(data) {
  return urlSafeBase64Decode(data)
}
function sendPlans() {
  if (step.value > 1) {
    showDialogInformation.value = false
    isConfirm.value = true
  } else {
    showDialogInformation.value = true
    isConfirm.value = false
  }
}
async function publishCourseToPlan(event) {
  eventId.value = event.data.id
  if (fetchlistMaps.value.length === 0 && searchByNameGetter.value.length === 0) {
    await mapStore.fetchMaps({ pagination: {}, reset: false })
  }
  plans.value = []
  showDialogInformation.value = true
}
async function sendPlansConfirm() {
  const data = {
    plans: [],
    event_id: eventId.value,
    bundles: isEventCourse.value ? undefined : []
  }
  for (const plan of plans.value) {
    data.plans.push(plan.value)
  }

  if (!isEventCourse.value) {
    for (const bundle of bundles.value) {
      data.bundles.push(bundle.value)
    }
  }

  await courseStore.addPlansToUnpublishedCourses(data)
  if (fetchErrorMsgsPlans.value.status) {
    plan_family.value = ''
    plans.value = []
    bundles.value = []
    showDialogInformation.value = false
    isConfirm.value = false
    showDataBasedToggle({ type: toggledType.value })
  }
  step.value = isEventCourse.value ? 2 : 1
}
function showMarkDown(event) {
  showMD.value = Boolean(event.show)
}
function confirmSendCancel() {
  isConfirm.value = false
  showDialogInformation.value = true
}
async function showDataBasedToggle(event) {
  toggledType.value = event.type
  const data = {
    pagination: {},
    reset: true
  }
  if (event.type === 'noneEventCourses') {
    await courseStore.fetchUnPublishedCoursesOptions(data)
  } else if (event.type === 'eventCourses') {
    await courseStore.fetchUnPublishedEventCoursesOptions(data)
  }
}
</script>
