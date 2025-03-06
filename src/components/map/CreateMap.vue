<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 750px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Course Map' : 'Create Course Map' }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit.prevent="onSubmit">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-sm-9 col-xl-12">
              <q-item-section>
                <BaseSelect
                  autofocus
                  label="Family Plan *"
                  :options="familyPlans"
                  :rules="required"
                  v-model="map.family_plan"
                  @update:model-value="handleChangePlanType"
                />
                <!-- <p v-if="fetchErrorMsgs.plan_family" class="text-caption text-negative">{{ fetchErrorMsgs.plan_name_msg }}</p> -->
              </q-item-section>
            </q-item>
            <q-item class="col-sm-3 col-xs-12">
              <q-item-section>
                <BaseInput
                  label="Monthly minutes *"
                  :max="6000"
                  :min="1"
                  required
                  :rules="[...max(6000), ...min(1), ...number]"
                  type="number"
                  v-model="map.monthly_mins"
                />
                <p v-if="fetchErrorMsgs.monthly_mins" class="text-caption text-negative">{{ fetchErrorMsgs.monthly_mins_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect
                  autofocus
                  label="Plan *"
                  :options="filteredPlans"
                  :rules="required"
                  v-model="map.plan_name"
                  :disable="!map.family_plan"
                  :optionDisable="disablePlans"
                />
                <p v-if="fetchErrorMsgs.plan_name" class="text-caption text-negative">{{ fetchErrorMsgs.plan_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <SwapList :loading="isLoadingList" label="Courses *" :options="listOptions" v-model="map.events" />
                <p v-if="fetchErrorMsgs.events" class="text-caption text-negative">{{ fetchErrorMsgs.events_msg }}</p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import SwapList from 'components/shared/SwapList'
import { useMapStore } from 'src/stores'
import { max, min, number, required } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref, watch } from 'vue'

const mapStore = useMapStore()
const emit = defineEmits(['onCancel'])
const props = defineProps(['id', 'show', 'isUpdate'])

const singleMapInfo = computed(() => (Object.keys(mapStore.mapInfo).length > 0 ? mapStore.mapInfo : []))
const fetchlistEvents = computed(() => mapStore.listEvents)
const fetchStatusOfApi = computed(() => mapStore.statusOfApi)
const existingPlanIds = computed(() => mapStore.listMaps?.map((item) => item.plan_id))
const isLoadingList = computed(() => mapStore.listLoading)
const filteredPlans = computed(() => mapStore.listPlans?.filter((plan) => plan.family_id === map.value.family_plan))
const disablePlans = computed(() => existingPlanIds.value)
const fetchErrorMsgs = computed(() => mapStore.error_msgs)

const listOptions = ref([])
const familyPlans = ref(['Individual', 'Enterprise', 'Event'])
const map = ref({
  plan_name: null,
  monthly_mins: 0,
  events: [],
  family_plan: null
})
const dataShow = ref(props.show)

onMounted(async () => {
  if (props.id) {
    map.value.plan_name = { label: singleMapInfo.value.plan_name, value: singleMapInfo.value.plan_id }
    map.value.monthly_mins = singleMapInfo.value.monthly_mins
    map.value.family_plan = singleMapInfo.value.plan_family
    // map.value.id = singleMapInfo.value.id
    map.value.events = fetchlistEvents.value.filter((eve) => singleMapInfo.value.events?.includes(eve.value))
  }
  listOptions.value = fetchlistEvents.value.filter((eve) => !singleMapInfo.value.events?.includes(eve.value))
})

async function onSubmit() {
  const data = {
    plan_name: map.value.plan_name.label,
    plan_id: map.value.plan_name.value,
    // sk: map.value.id,
    monthly_mins: map.value.monthly_mins,
    events: map.value.events.map((eve) => eve.value),
    plan_family: map.value.family_plan
  }
  if (props.id) {
    const payload = compareFunction('map', data, singleMapInfo.value)
    await mapStore.updateMap(payload)
  } else {
    await mapStore.createMap(data)
  }
  if (fetchStatusOfApi.value) {
    map.value = {
      plan_name: null,
      monthly_mins: 0,
      events: [],
      family_plan: null
    }
    onCancel()
  }
}
function onCancel() {
  emit('onCancel', { show: true })
}
function handleChangePlanType() {
  map.value.plan_name = null
}

watch(
  () => fetchlistEvents.value,
  (newValue, oldValue) => {
    listOptions.value = newValue.filter((eve) => !singleMapInfo.value.events?.includes(eve.value))
    if (props.id) {
      map.value.events = newValue.filter((eve) => singleMapInfo.value.events?.includes(eve.value))
    }
  }
)
</script>
