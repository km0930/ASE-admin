<template>
  <div class="row">
    <div class="col-12">
      <q-card dark style="margin-left: 1%; margin-right: 1%">
        <q-card-section class="bg-primary text-white">
          <div class="text-subtitle1 ase-roboto text-weight-normal">{{ username }}</div>
          <div class="text-subtitle2">{{ emailInfo }}</div>
        </q-card-section>
        <div class="row">
          <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div>
              <q-btn @click="reportWindowTopData">Report</q-btn>
            </div>
          </div>
          <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
            <div>
              <div class="row" v-if="!isLoading && fetchRecentActivities.length > 0" style="overflow-y: scroll; height: 80vh">
                <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <q-card dark style="border: 1px solid grey">
                    <q-timeline dark color="grey" v-if="fetchRecentActivities.length > 0" style="padding: 5%; overflow-y: scroll">
                      <template v-for="(i, index) in fetchRecentActivities">
                        <template v-if="i.action === 'completed' && i.type === 'event'">
                          <q-timeline-entry
                            v-bind:key="index + 'IN LOOP OF FETCH RECENT ACTIVITIES'"
                            icon="fas fa-user-graduate"
                            side="right"
                          >
                            <template v-slot:title></template>
                            <template v-slot:subtitle v-if="i.endDate">
                              <div class="portal_md">{{ i.endDate }}</div>
                            </template>
                            <div>
                              <span class="portal_md">Course: {{ i.name }}</span>
                            </div>
                            <div>
                              <span class="portal_md">Progress: {{ i.progress }}%</span>
                            </div>
                            <div>
                              <span class="portal_md">
                                Status:
                                <b>Completed</b>
                              </span>
                            </div>
                          </q-timeline-entry>
                        </template>
                        <template v-else-if="i.action === 'pending' && i.type === 'event'">
                          <q-timeline-entry v-bind:key="index + 'IN LOOP OF FETCH RECENT ACTIVITIES'" icon="fas fa-user-tag" side="left">
                            <template v-slot:subtitle v-if="i.startDate">
                              <div class="portal_md">{{ i.startDate }}</div>
                            </template>
                            <div>
                              <div>
                                <span class="portal_md">Course: {{ i.name }}</span>
                              </div>
                              <div>
                                <span class="portal_md">Progress: {{ i.progress }}%</span>
                              </div>
                              <div>
                                <span class="portal_md">
                                  Status:
                                  <b>Enrolled</b>
                                </span>
                              </div>
                            </div>
                          </q-timeline-entry>
                        </template>
                        <template v-else-if="i.action === 'pending' && i.type === 'lab'">
                          <q-timeline-entry v-bind:key="index + 'IN LOOP OF FETCH RECENT ACTIVITIES'" :icon="i.icon" side="left">
                            <template v-slot:subtitle>
                              <div class="portal_md portal_lg">{{ i.createdOn }}</div>
                            </template>
                            <div>
                              <span class="portal_md">{{ i.name }}</span>
                            </div>
                            <div>
                              <span class="portal_md">Time: {{ i.numMinutes }}mins</span>
                            </div>
                          </q-timeline-entry>
                        </template>
                      </template>
                    </q-timeline>
                  </q-card>
                </div>
              </div>
              <div v-if="!isLoading && fetchRecentActivities.length === 0" class="padding_12">
                <span class="center">
                  <div class="text-center portal_lg text-white padding_12">No recent activities</div>
                </span>
              </div>
            </div>
            <br />
          </div>
          <div class="q-pa-xs col-xs-8 col-sm-8 col-md-8 col-lg-8">
            <div class="row">
              <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <CountBox :name="'Total Course'" :countValue="fetchStatsData.totalCourseCount" :iconType="'school'"></CountBox>
              </div>
              <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <CountBox :name="'Inprogress Course'" :countValue="fetchStatsData.inProgressCount" :iconType="'school'"></CountBox>
              </div>
              <div class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <CountBox :name="'Completed Course'" :countValue="fetchStatsData.completedCount" :iconType="'school'"></CountBox>
              </div>
            </div>
            <div class="row">
              <div class="q-pa-xs col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <CountBox :name="'Lab count'" :countValue="fetchStatsData.labCount" :iconType="'science'"></CountBox>
              </div>
              <div class="q-pa-xs col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <CountBox :name="'Certificate Issued'" :countValue="fetchCertificateInfo.count" :iconType="'badge'"></CountBox>
              </div>
            </div>
            <div class="row" style="overflow-y: scroll; max-height: 110vh" v-if="fetchCertificateInfo.data.length > 0">
              <div
                class="q-pa-xs col-xs-4 col-sm-4 col-md-4 col-lg-4"
                v-for="(certificate, index) in fetchCertificateInfo.data"
                v-bind:key="certificate.pk + 'certificate' + index"
              >
                <q-card dark style="border: 1px solid grey; max-height: 450px; min-height: 450px; overflow: scroll">
                  <q-card-section>
                    <q-img :src="certificate.logo"></q-img>
                  </q-card-section>
                  <q-card-section>
                    <div class="portal_lg portal_bold text-center">{{ certificate.badge_name }}</div>
                  </q-card-section>
                  <q-card-section>
                    <p>Skills</p>
                    <div class="text-subtitle2" style="max-height: 80px; overflow: scroll">
                      <q-chip
                        color="teal"
                        text-color="white"
                        v-for="(skills, skindex) in certificate.skills"
                        :key="skills + 'sss' + skindex"
                      >
                        {{ skills }}
                      </q-chip>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <div v-if="!isLoading && fetchCertificateInfo.data.length === 0" style="padding: 10%">
              <span class="center">
                <div class="text-center portal_lg text-white">No Certificates issued</div>
              </span>
            </div>
          </div>
        </div>
        <q-dialog v-model="reportWindowStatusTopData" persistent>
          <q-card style="min-width: 500px" transition-show="flip-up" transition-hide="flip-down" dark>
            <q-card-section>
              <div class="text-subtitle1 ase-roboto text-weight-normal">
                Download
                <hr />
              </div>
            </q-card-section>
            <q-card-section>
              <q-toggle
                dark
                color="white"
                @input="toggleInfoTopCourses"
                v-model="weeklyMonthlyTopData"
                false-value="weekly"
                true-value="monthly"
                :label="weeklyMonthlyTopData"
              />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-form class="q-gutter-md">
                <div class="q-pa-md q-gutter-sm">
                  <div class="text-center">
                    <a id="downloadAnchorElem" type="hidden" />
                    <q-btn label="JSON report" dark @click="downloadableReportTopData('json')"></q-btn>
                  </div>
                </div>
              </q-form>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn class="text-capitalize bg-primary text-white" @click="onCancelWindowTopData()">Cancel</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card>
    </div>
  </div>
</template>
<style scoped>
.bordered_style {
  padding: 12px;
  border: 1px solid #c4c0c0;
  border-radius: 0px;
}
</style>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import CountBox from 'components/shared/CountBox'
import { useUsersStore, useDashboardStore } from 'src/stores'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const usersStore = useUsersStore()
const dashbaordStore = useDashboardStore()
const route = useRoute()

const emailInfo = ref(urlSafeBase64Decode(route.params.userEmail))
const username = ref(urlSafeBase64Decode(route.params.userName))
const weeklyMonthlyTopData = ref('monthly')
const showOverallWeeklyMonthly = ref(false)
const reportWindowStatusTopData = ref(false)

onMounted(() => {
  usersStore.recentActivities({ user_id: urlSafeBase64Decode(route.params.userEmail) })
  usersStore.certificateInfo({ user_id: urlSafeBase64Decode(route.params.userEmail) })
})

const isLoading = computed(() => usersStore.loading)
const fetchStatsData = computed(() => usersStore.statsCountInfo)
const fetchCertificateInfo = computed(() => usersStore.certificateInfo)
const fetchRecentActivities = computed(() => usersStore.recentActivitiesData)
const weeklyMonthlyJsonIndividualUserGetter = computed(() => dashbaordStore.weeklyMonthlyJsonIndividualUser)

async function toggleInfoTopCourses(val) {
  if (weeklyMonthlyTopData.value === 'weekly' || weeklyMonthlyTopData.value === 'monthly') {
    showOverallWeeklyMonthly.value = true
  } else {
    showOverallWeeklyMonthly.value = false
  }
}
function reportWindowTopData() {
  if (reportWindowStatusTopData.value) {
    reportWindowStatusTopData.value = false
  } else {
    reportWindowStatusTopData.value = true
  }
}
function onCancelWindowTopData() {
  reportWindowStatusTopData.value = false
}
async function downloadableReportTopData(type) {
  await dashbaordStore.monthlyWeeklyreportOverallStatsIndividualUser({
    user_id: urlSafeBase64Decode(route.params.userEmail),
    period: weeklyMonthlyTopData.value
  })
  const requiredFields = {
    Courses: weeklyMonthlyJsonIndividualUserGetter.value.data.eveValuesReport,
    Labs: weeklyMonthlyJsonIndividualUserGetter.value.data.LabsValuesReport,
    'Learning paths': weeklyMonthlyJsonIndividualUserGetter.value.data.lpValuesReport
  }
  if (type === 'json') {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(requiredFields))
    const dlAnchorElem = document.getElementById('downloadAnchorElem')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', `${capitalizeFirstLetter(weeklyMonthlyTopData.value)}-courses-labs-lp-report.json`)
    dlAnchorElem.click()
  }
  if (type === 'csv') {
    const headers = {}
    Object.entries(requiredFields).forEach(([key, value]) => {
      headers[key] = `${key}\t\t`.replace(/,/g, '\t')
    })

    const itemsFormatted = this.getTopFiveCourses.downloadReport

    const fileTitle = 'Top-five-courses-labs-report'

    exportCSVFile(headers, itemsFormatted, fileTitle)
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function convertToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''

  for (let i = 0; i < array.length; i++) {
    let line = ''
    for (const index in array[i]) {
      if (line !== '') line += ','

      line += array[i][index]
    }

    str += line + '\r\n'
  }

  return str
}
function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers)
  }

  const jsonObject = JSON.stringify(items)

  const csv = convertToCSV(jsonObject)

  const exportedFilenmae = fileTitle + '.csv' || 'export.csv'

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilenmae)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportedFilenmae)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
