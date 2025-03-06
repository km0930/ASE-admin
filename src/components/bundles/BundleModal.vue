<template>
  <q-dialog v-model="show">
    <q-card style="width: 760px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal flex items-center q-gutter-sm">
          <q-icon name="create" />
          <p class="q-mb-none">{{ editMode ? 'Update Bundle' : 'Create Bundle' }}</p>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm q-pb-lg">
        <q-form greedy @submit="onSubmit()">
          <q-card-section class="q-pt-none">
            <q-list class="row">
              <q-item-section>
                <BaseInput
                  autofocus
                  label="Name *"
                  v-model="formData.bundle_name"
                  :rules="[(val) => !!val || 'Please enter tag name', ...minLength(3)]"
                />
                <BaseSelect
                  multiple
                  label="Course Maps"
                  :options="planOptions"
                  v-model="formData.course_maps"
                  :rules="[(val) => !!formData.course_maps.length || 'Please choose at least one Plan']"
                />
              </q-item-section>
            </q-list>
          </q-card-section>
          <div class="full-width flex q-px-md justify-end">
            <q-btn class="q-mr-sm" color="orange" outline @click="onCancel">Cancel</q-btn>
            <q-btn color="positive" type="submit">{{ editMode ? 'Save' : 'Add' }}</q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'src/components/shared/BaseSelect'
import { useBundleStore, useMapStore } from 'src/stores'
import { minLength } from 'src/utils/rules'
import { computed, ref } from 'vue'

const bundleStore = useBundleStore()
const mapStore = useMapStore()

const show = defineModel('show', { type: Boolean, required: true })
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Object,
    default: null
  }
})

const formData = ref({
  bundle_name: props.selected?.bundle_name ?? '',
  course_maps: props.selected?.course_maps ?? []
})

const planOptions = computed(() => {
  return (
    mapStore.listMaps.map((plan) => ({
      value: plan.plan_id,
      label: plan.plan_name,
      plan: plan.plan_family
    })) ?? []
  )
})

async function onSubmit() {
  let callApi = true

  const payload = {
    ...formData.value,
    course_maps:
      formData.value.course_maps?.map((item) => {
        // item can be a string or it has the value property
        return typeof item === 'string' ? item : item?.value
      }) ?? []
  }
  if (props.editMode) {
    const nameChanged = props.selected?.bundle_name !== payload.bundle_name
    const courseMapsChanged = JSON.stringify(props.selected?.course_maps) !== JSON.stringify(payload.course_maps)
    callApi = nameChanged || courseMapsChanged
    if (callApi) {
      !nameChanged && delete payload.bundle_name
      !courseMapsChanged && delete payload.course_maps
      payload.bundle_id = props.selected?.sk
    }
  }
  if (callApi) {
    props.editMode ? bundleStore.updateBundle(payload) : bundleStore.createBundle(payload)
  }
  onCancel()
}

function onCancel() {
  show.value = false
}
</script>
<style></style>
