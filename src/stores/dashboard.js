import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { ref } from 'vue'

const useDashboardStore = defineStore('dashboardStore', () => {
  const loading = ref(false)
  const loadedPage = ref(false)
  const dashboard_counts = ref({})
  const topFiveCourses = ref({
    data: [],
    downloadReport: [],
    labels: [],
    colors: [],
    static_data: [],
    title: 'Popular Courses',
    name: 'Popular Courses'
  })
  const topFiveLps = ref({
    data: [],
    downloadReport: [],
    labels: [],
    colors: [],
    static_data: [],
    title: 'Popular Learning Paths',
    name: 'Popular Learning Paths'
  })
  const weeklyMonthlyJsonIndividualUser = ref({
    status: false,
    data: {
      dateRange: '',
      freeTrailSignup: '' || '0',
      paidMonthlySignup: '' || '0',
      paidAnnualSignup: '' || '0',
      partnerSignup: '' || '0',
      totalCertificate: '' || '0',
      Labs: [],
      LabsValues: [],
      LabsValuesReport: [],
      eveValuesReport: [],
      lpValuesReport: [],
      eveColor: [],
      labColor: [],
      lpColor: [],
      Courses: [],
      CoursesLabels: [],
      learningPaths: [],
      learningPathsLabels: []
    }
  })
  function LOADING(data) {
    loading.value = data
    showLoader(data)
  }
  function DASHBOARD_COUNTS(data) {
    dashboard_counts.value = data
  }
  function LOADED_PAGE(data) {
    loadedPage.value = data
  }
  function TOP_FIVE_LPS(data) {
    topFiveLps.value = data
  }
  function TOP_FIVE_COURSES(data) {
    topFiveCourses.value = data
  }
  function WEEKLY_MONTHLY_REPORTS_JSON_INDIVIDUAL_USER(data) {
    weeklyMonthlyJsonIndividualUser.value = data
  }
  function loadingStatus(data) {
    LOADING(data)
  }
  async function loadedPageStatus(data) {
    LOADED_PAGE(data)
  }
  async function fetchDashboardCounts() {
    LOADING(true)
    try {
      const res = await api.get('dashboard/get-dashboard-count')
      if (res.data.success) {
        DASHBOARD_COUNTS(res.data.data.data)
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function fetchTopFiveLps() {
    LOADING(true)
    try {
      const res = await api.get('dashboard/get-learning-path-counts')
      if (res.data.success) {
        const topLps = {
          data: [],
          downloadReport: [],
          labels: [],
          colors: [],
          values: [],
          static_data: [],
          title: 'Popular Learning Paths',
          name: 'Popular Learning Paths'
        }
        const color = [
          '#246590',
          '#5AB049',
          '#F5B041',
          '#45B39D',
          '#f08a5d',
          '#FF5733',
          '#6f4a8e',
          '#3282b8',
          '#00c698',
          '#0097A7',
          '#CC6699',
          '#9CCC65',
          '#FFB300',
          '#DCE775',
          '#5C6BC0',
          '#99CCFF',
          '#00ACC1',
          '#9575CD',
          '#D9B277',
          '#CACAC3',
          '#2B3766',
          '#BA674B',
          '#C9352B',
          '#8639A7',
          '#ad8528',
          '#7593C9',
          '#9de3b6',
          '#1B1B53',
          '#8787e0',
          '#bf8673',
          '#c266c4',
          '#CC9E76',
          '#C7A876',
          '#EFC5AB',
          '#90348A',
          '#164E80'
        ]
        let index = 0

        if (res.data.data) {
          res.data.data.data.forEach((info) => {
            if (info.count) {
              topLps.data.push({
                name: info.learning_path_name,
                type: 'bar',
                value: info.count,
                itemStyle: { color: color[index] }
              })
              topLps.labels.push(info.learning_path_name)
              topLps.colors.push(color[index])
              topLps.values.push(info.count)
              index = index + 1
            }
          })
        }
        TOP_FIVE_LPS(topLps)
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function fetchTopFiveCourses() {
    LOADING(false)
    try {
      const res = await api.get('admin/get-top-courses')
      if (res.data.success) {
        const topCourses = {
          data: [],
          labels: [],
          colors: [],
          values: [],
          downloadReport: [],
          static_data: [],
          title: 'Popular Courses',
          name: 'Popular Courses'
        }
        const color = [
          '#246590',
          '#5AB049',
          '#F5B041',
          '#45B39D',
          '#f08a5d',
          '#FF5733',
          '#6f4a8e',
          '#3282b8',
          '#00c698',
          '#0097A7',
          '#CC6699',
          '#9CCC65',
          '#FFB300',
          '#DCE775',
          '#5C6BC0',
          '#99CCFF',
          '#00ACC1',
          '#9575CD',
          '#D9B277',
          '#CACAC3',
          '#2B3766',
          '#BA674B',
          '#C9352B',
          '#8639A7',
          '#ad8528',
          '#7593C9',
          '#9de3b6',
          '#1B1B53',
          '#8787e0',
          '#bf8673',
          '#c266c4',
          '#CC9E76',
          '#C7A876',
          '#EFC5AB',
          '#90348A',
          '#164E80'
        ]
        let index = 0

        if (res.data.data) {
          res.data.data.data.forEach((info) => {
            if (info.enroll_count) {
              topCourses.data.push({
                name: info.event_name,
                value: info.enroll_count,
                id: info.event_id,
                itemStyle: { color: color[index] }
              })
              topCourses.downloadReport.push({
                'Course Name': info.event_name,
                'Enrollments count': info.enroll_count + ''
              })
              topCourses.labels.push(info.event_name)
              topCourses.colors.push(color[index])
              topCourses.values.push(info.enroll_count)
              index = index + 1
            }
          })
        }
        TOP_FIVE_COURSES(topCourses)
      }
    } catch (error) {
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  async function monthlyWeeklyreportOverallStatsIndividualUser(payload) {
    LOADING(true)
    try {
      const res = await api.get('admin/get-user-activitydata', payload)
      if (res) {
        const color = [
          '#246590',
          '#5AB049',
          '#F5B041',
          '#45B39D',
          '#f08a5d',
          '#FF5733',
          '#6f4a8e',
          '#3282b8',
          '#00c698',
          '#0097A7',
          '#CC6699',
          '#9CCC65',
          '#FFB300',
          '#DCE775',
          '#5C6BC0',
          '#99CCFF',
          '#00ACC1',
          '#9575CD',
          '#D9B277',
          '#CACAC3',
          '#2B3766',
          '#BA674B',
          '#C9352B',
          '#8639A7',
          '#ad8528',
          '#7593C9',
          '#9de3b6',
          '#1B1B53',
          '#8787e0',
          '#bf8673',
          '#c266c4',
          '#CC9E76',
          '#C7A876',
          '#EFC5AB',
          '#90348A',
          '#164E80'
        ]

        let colorIndex = 0
        const labColor = []
        const labsLabels = []
        const labsValues = []
        const LabsValuesReport = []

        res.data.data.data.enrolment_labs.forEach((labs) => {
          labColor.push(color[colorIndex])
          labsLabels.push(labs.lab_name)
          labsValues.push({
            name: labs.lab_name,
            value: labs.count,
            itemStyle: { color: color[colorIndex] }
          })
          LabsValuesReport.push({
            'Lab Name': labs.lab_name,
            'Lab minutes': (labs.count || 0) + ''
          })

          colorIndex = colorIndex + 1
        })
        colorIndex = 0
        const eveColor = []
        const eveLabels = []
        const eveValues = []
        const eveValuesReport = []

        res.data.data.data.enrolment_courses.forEach((eve) => {
          eveColor.push(color[colorIndex])
          eveLabels.push(eve.event_name)
          eveValues.push({
            name: eve.event_name,
            value: eve.in_progress,
            itemStyle: { color: color[colorIndex] }
          })
          eveValuesReport.push({
            'Course name': eve.event_name,
            Percentage: eve.in_progress + ''
          })
          colorIndex = colorIndex + 1
        })
        colorIndex = 0
        const lpColor = []
        const lpLabels = []
        const lpValues = []
        const lpValuesReport = []

        res.data.data.data.learning_path.forEach((lp) => {
          lpColor.push(color[colorIndex])

          lpLabels.push(lp.learning_path_name)
          lpValues.push({
            name: lp.learning_path_name,
            value: lp.count,
            itemStyle: { color: color[colorIndex] }
          })
          lpValuesReport.push({
            'Learning path': lp.learning_path_name,
            Count: lp.count + ''
          })
          colorIndex = colorIndex + 1
        })
        WEEKLY_MONTHLY_REPORTS_JSON_INDIVIDUAL_USER({
          status: true,
          data: {
            dateRange: `${dateFormatReadable(res.data.data.data.from_date)} to ${dateFormatReadable(res.data.data.data.to_date)}`,
            totalCertificate: `${res.data.data.data.num_certificate_generated}` || '0',
            Labs: labsLabels,
            LabsValues: labsValues,
            LabsValuesReport: LabsValuesReport,
            labColor: labColor,
            Courses: eveValues,
            CoursesLabels: eveLabels,
            eveColor: eveColor,
            eveValuesReport: eveValuesReport,
            learningPaths: lpLabels,
            learningPathsLabels: lpValues,
            lpValuesReport: lpValuesReport,
            lpColor: lpColor
          }
        })
      }
    } catch (error) {
      WEEKLY_MONTHLY_REPORTS_JSON_INDIVIDUAL_USER({
        status: false,
        data: {
          dateRange: '',
          totalCertificate: '' || '0',
          Labs: [],
          LabsValues: [],
          eveColor: [],
          labColor: [],
          lpColor: [],
          Courses: [],
          CoursesLabels: [],
          learningPaths: [],
          LabsValuesReport: [],
          eveValuesReport: [],
          lpValuesReport: [],
          learningPathsLabels: []
        }
      })
      if (error.response.status === 400) {
        Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
      }
    } finally {
      LOADING(false)
    }
  }
  return {
    dashboard_counts,
    topFiveCourses,
    topFiveLps,
    loading,
    loadedPage,
    weeklyMonthlyJsonIndividualUser,
    loadingStatus,
    loadedPageStatus,
    fetchDashboardCounts,
    fetchTopFiveLps,
    fetchTopFiveCourses,
    monthlyWeeklyreportOverallStatsIndividualUser
  }
})
export { useDashboardStore }
