<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 700px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update User' : 'Create User' }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit="onSubmit()">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput autofocus label="First Name *" :maxlength="50" required :rules="shortName" v-model="user.first_name" />
                <p v-if="fetchErrorMsgsUser.first_name" class="text-caption text-negative">{{ fetchErrorMsgsUser.first_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput autofocus label="Last Name *" :maxlength="50" required :rules="shortName" v-model="user.last_name" />
                <p v-if="fetchErrorMsgsUser.last_name" class="text-caption text-negative">{{ fetchErrorMsgsUser.last_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Email *" required :rules="email" type="email" v-model="user.email" />
                <p v-if="fetchErrorMsgsUser.email" class="text-caption text-negative">{{ fetchErrorMsgsUser.email_msg }}</p>
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
import { useTrainingStore, useUsersStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { email, shortName } from 'src/utils/rules'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps(['id', 'show'])
const emit = defineEmits('onCacel')
const user = ref({
  first_name: '',
  last_name: '',
  email: ''
})
const dataShow = ref(props.show)
const route = useRoute()

const trainingStore = useTrainingStore()
const usersStore = useUsersStore()

const fetchStatusOfApi = computed(() => trainingStore.statusOfApi)
const fetchErrorMsgsUser = computed(() => trainingStore.error_msgs_user)

async function onSubmit() {
  const data = {
    first_name: user.value.first_name,
    last_name: user.value.last_name,
    email: user.value.email,
    training_id: urlSafeBase64Decode(route.params.eventId)
  }
  await trainingStore.createUser(data)
  if (fetchStatusOfApi.value) {
    await usersStore.fetchTrainingList({
      pagination: {
        training_id: urlSafeBase64Decode(route.params.eventId)
      },
      reset: true
    })
    onCancel()
  }
}
function onCancel() {
  emit('onCacel', { show: true })
}
</script>
