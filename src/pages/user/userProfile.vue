<template>
  <q-form greedy @submit="onSubmit()">
    <q-list class="row">
      <q-item class="col-12">
        <q-item-section>
          <q-img class="q-mx-auto rounded-borders" spinner-color="white" src="https://cdn.quasar.dev/img/boy-avatar.png" width="300px" />
        </q-item-section>
      </q-item>
      <q-item class="col-12">
        <q-item-section>
          <BaseInput autofocus label="First Name *" :maxlength="50" required :rules="shortName" v-model="user.first_name" />
          <p v-if="fetchErrorMsgs.first_name" class="text-caption text-negative">{{ fetchErrorMsgs.first_name_msg }}</p>
        </q-item-section>
        <q-item-section>
          <BaseInput autofocus label="Last Name *" :maxlength="50" required :rules="shortName" v-model="user.last_name" />
          <p v-if="fetchErrorMsgs.last_name" class="text-caption text-negative">{{ fetchErrorMsgs.last_name_msg }}</p>
        </q-item-section>
      </q-item>
      <q-item class="col-12">
        <q-item-section>
          <BaseInput label="Email *" readonly v-model="user.email" />
          <div v-if="fetchErrorMsgs.email">
            <p class="text-caption text-weight-normal error_msg ase-roboto none-spacing">{{ fetchErrorMsgs.email_msg }}</p>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card-actions>
      <q-btn class="col-grow" color="positive" type="submit">Update</q-btn>
    </q-card-actions>
  </q-form>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import { shortName } from 'src/utils/rules.js'
import { useUserDetailsStore } from 'src/stores'
import { ref, computed, onMounted } from 'vue'

const user = ref({
  first_name: '',
  last_name: '',
  email: '',
  typeUser: ''
})
const token = ref(null)

const userDetailsStore = useUserDetailsStore()

const fetchErrorMsgs = computed(() => userDetailsStore.error_msgs)

onMounted(() => {
  token.value = localStorage.getItem('token')
  const base64Url = token.value.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  const userData = JSON.parse(jsonPayload)
  user.value.email = userData.email
  user.value.first_name = userData.family_name
  user.value.last_name = userData.given_name
})
function onSubmit() {
  const data = {
    last_name: user.value.last_name,
    first_name: user.value.first_name
  }
  userDetailsStore.changeUserDetails(data)
}
</script>
