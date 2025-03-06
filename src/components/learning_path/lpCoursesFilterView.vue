<template>
  <q-card dark flat>
    <q-card-section class="q-pa-sm row">
      <div class="col-grow">
        <p class="q-mb-none text-subtitle1">Proficiency</p>
        <q-option-group
          class="portal_sm"
          color="green"
          inline
          keep-color
          :options="proficiencyOptions"
          size="xs"
          type="checkbox"
          v-model="proficiency"
          @update:model-value="learningPathFilterApply()"
        />
      </div>
      <div class="col-grow">
        <p class="q-mb-none text-subtitle1">Type</p>
        <q-option-group
          class="portal_sm"
          color="green"
          inline
          keep-color
          :options="typeOptions"
          size="xs"
          type="checkbox"
          v-model="type"
          @update:model-value="learningPathFilterApply()"
        />
      </div>
      <div class="col-grow">
        <p class="q-mb-none text-subtitle1">Subscription</p>
        <q-option-group
          class="portal_sm"
          color="green"
          inline
          keep-color
          :options="subscriptionOptions"
          size="xs"
          type="checkbox"
          v-model="subscription"
          @update:model-value="learningPathFilterApply()"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['FilteredData'])
const proficiency = ref([])
const type = ref([])
const subscription = ref([])
const proficiencyOptions = ref([
  { value: 'Basic', label: 'Basic' },
  { value: 'Intermediate', label: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
])
const typeOptions = ref([
  { value: 'course', label: 'Course' },
  { value: 'event', label: 'Event' }
])
const subscriptionOptions = ref([
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' }
])

async function learningPathFilterApply() {
  emit('FilteredData', { type: type.value, proficiency: proficiency.value, subs: subscription.value })
}
</script>
