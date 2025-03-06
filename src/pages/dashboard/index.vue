<template>
  <div class="row q-pa-sm">
    <div class="q-pa-xs col-xs-12 col-sm-5 col-md-5 col-lg-5">
      <div class="row">
        <div class="col-6 q-pa-xs">
          <Statistics iconName="school" title="Courses" :count="getDashboardDetails.tota_non_event_courses || 0" />
        </div>
        <div class="col-6 q-pa-xs">
          <Statistics iconName="add_road" title="Learning paths" :count="getDashboardDetails.total_learningpaths || 0" />
        </div>
        <div class="col-6 q-pa-xs">
          <Statistics iconName="school" title="Event courses" :count="getDashboardDetails.total_event_courses || 0" />
        </div>
        <div class="col-6 q-pa-xs">
          <Statistics iconName="school" title="Unpublished courses" :count="getDashboardDetails.total_unpublished_courses || 0" />
        </div>
      </div>
    </div>
    <div class="q-pa-xs col-xs-12 col-sm-7 col-md-7 col-lg-7">
      <PieChart
        :pieChartData="getTopFiveCourses.data || []"
        :pieChartLabels="getTopFiveCourses.labels || []"
        :pieChartName="'' || ''"
        :title="isLoading ? 'Loading...' : getTopFiveCourses.data.length > 0 ? getTopFiveCourses.name : 'Popular Courses'"
        :loading="!isLoading"
      />
    </div>
    <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <BarChart
        :barChartData="getTopFiveLps.data"
        :barChartLabels="getTopFiveLps.labels"
        :barChartName="'Learning path'"
        :title="isLoading ? 'Loading...' : getTopFiveLps.data.length > 0 ? getTopFiveLps.name : 'Popular Learning Paths'"
        :idBarChart="'IDBARRRLPS'"
        :loading="!isLoading"
      />
    </div>
  </div>
</template>

<script setup>
import Statistics from 'components/dashboard/Statistics'
import BarChart from 'components/echarts-latest/bar'
import PieChart from 'components/echarts-latest/pie'
import { useDashboardStore } from 'src/stores'
import { computed, onMounted } from 'vue'

const dashboardStore = useDashboardStore()

const getDashboardDetails = computed(() => dashboardStore.dashboard_counts)
const getTopFiveCourses = computed(() => dashboardStore.topFiveCourses)
const getTopFiveLps = computed(() => dashboardStore.topFiveLps)
const isLoading = computed(() => dashboardStore.loading)
const loadedPageStatusGetter = computed(() => dashboardStore.loadedPage)

onMounted(async () => {
  if (!loadedPageStatusGetter.value) {
    await dashboardStore.fetchTopFiveCourses()
    await dashboardStore.fetchTopFiveLps()
    await dashboardStore.fetchDashboardCounts()
  }
})
</script>
