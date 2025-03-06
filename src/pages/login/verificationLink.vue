<template>
  <q-layout>
    <q-page-container class="bg-black">
      <q-page>
        <p class="absolute-center text-bold text-h5 text-white">Validating .....</p>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useLoginStore } from 'src/stores'
import { onMounted, ref } from 'vue'
const loginStore = useLoginStore()

const params = ref({
  email: '',
  code: ''
})
onMounted(() => {
  document.title = 'Validating'
  const urlSearchParams = new URLSearchParams(window.location.search)
  const queryParams = Object.fromEntries(urlSearchParams.entries())
  if (queryParams.email && queryParams.code) {
    params.value = queryParams
    onSubmit()
  }
})
async function onSubmit() {
  if (!params.value.code) {
    this.$q.notify({
      type: 'negative',
      position: 'top',
      progress: true,
      icon: 'warning',
      message: 'Invalid link'
    })
  } else if (!params.value.email) {
    this.$q.notify({
      type: 'negative',
      position: 'top',
      progress: true,
      icon: 'warning',
      message: 'Please enter a valid email'
    })
  } else {
    await loginStore.isVerifyStatus(false)
    await loginStore.loginUserVerify({
      username: params.value.email,
      answer: params.value.code
    })
  }
}
</script>
