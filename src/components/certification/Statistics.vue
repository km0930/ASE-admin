<template>
  <section>
    <div class="row">
      <div v-if="topUsersData" class="col-md-6 col-sm-12">
        <BarChart :data="topUsersData" labelY="Total Scored" title="Top Users" />
      </div>
      <div class="col-md-6 col-sm-12">
        <BarChart :data="topData" labelY="Certifications Passed" title="Top Certifications" />
      </div>
    </div>
    <h6 class="q-my-md">Certification Detailed Info</h6>
    <div v-for="(top, index) of top" class="bg-dark" :key="index">
      <p class="text-body1 text-bold">{{ top.certification.name }}</p>
      <p class="text-body2">{{ top.certification.description }}</p>
      <q-separator dark spaced />
    </div>
  </section>
</template>

<script setup>
import BarChart from 'components/echarts/Bar'
import { useCertificationStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const certificationStore = useCertificationStore()
const top = computed(() => certificationStore.top)
const topUsers = computed(() => certificationStore.topUsers)

const topData = ref([])
const topUsersData = ref([])

onMounted(async () => {
  if (!top.value.length) {
    await certificationStore.certificationTop()
  }

  if (!topUsers.value.length) {
    await certificationStore.certificationTopUsers()
  }

  topUsersData.value = topUsers.value.map(({ email, total_scored }) => ({ label: email, value: total_scored }))

  topData.value = top.value.map(({ certification, certification_pass_count }) => ({
    label: certification.name,
    value: certification_pass_count
  }))
})
</script>
