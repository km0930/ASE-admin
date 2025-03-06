import { Notify } from 'quasar'
import config from 'src/config'
import axios from 'src/utils/instance'
import { showLoader } from 'src/utils/loader'
import { dateFormatReadable } from 'src/utils/reuseFunctions'

const state = {
  loading: false,
  loadedPage: false,
  statusOfApi: true,
  dashboard_counts: {},
  calenderView: [],
  topFiveCourses: {
    data: [],
    downloadReport: [],
    labels: [],
    colors: [],
    static_data: [],
    title: 'Popular Courses',
    name: 'Popular Courses'
  },
  topFiveLabs: {
    data: [],
    downloadReport: [],
    labels: [],
    colors: [],
    static_data: [],
    title: 'Popular Labs',
    name: 'Popular Labs'
  },
  topFiveLps: {
    data: [],
    downloadReport: [],
    labels: [],
    colors: [],
    static_data: [],
    title: 'Popular Learning Paths',
    name: 'Popular Learning Paths'
  },
  downloadReportsJson: {
    status: false,
    data: {}
  },
  weeklyMonthlyJson: {
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
      eveColor: [],
      labColor: [],
      lpColor: [],
      Courses: [],
      CoursesLabels: [],
      learningPaths: [],
      learningPathsLabels: []
    }
  },
  weeklyMonthlyJsonIndividualUser: {
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
  }
}

const mutations = {
  LOADING(state, data) {
    state.loading = data
    showLoader(data)
  },
  DASHBOARD_COUNTS(state, data) {
    state.dashboard_counts = data
  },
  LOADED_PAGE(state, data) {
    state.loadedPage = data
  },
  TOP_FIVE_LPS(state, data) {
    state.topFiveLps = data
  },
  TOP_FIVE_COURSES(state, data) {
    state.topFiveCourses = data
  },
  WEEKLY_MONTHLY_REPORTS_JSON_INDIVIDUAL_USER(state, data) {
    state.weeklyMonthlyJsonIndividualUser = data
  }
}

const actions = {
  loadingStatus({ commit }, data) {
    commit('LOADING', data)
  },
  async loadedPageStatus({ commit }, data) {
    commit('LOADED_PAGE', data)
  },
  async fetchDashboardCounts({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'dashboard/get-dashboard-count')
      .then((res) => {
        if (res.data.success) {
          commit('DASHBOARD_COUNTS', res.data.data.data)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchTopFiveLps({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'dashboard/get-learning-path-counts')
      .then((res) => {
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
          commit('TOP_FIVE_LPS', topLps)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async fetchTopFiveCourses({ commit }) {
    commit('LOADING', true)
    await axios
      .get(config.baseURLApi + 'admin/get-top-courses')
      .then((res) => {
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
          commit('TOP_FIVE_COURSES', topCourses)
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          Notify.create({ message: error.response.data.message, color: 'red', position: 'top' })
        }
      })
      .finally(() => commit('LOADING', false))
  },
  async monthlyWeeklyreportOverallStatsIndividualUser({ state, commit }, payload) {
    commit('LOADING', true)
    await axios
      .post(config.baseURLApi + 'admin/get-user-activitydata', payload)
      .then((res) => {
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
        commit('WEEKLY_MONTHLY_REPORTS_JSON_INDIVIDUAL_USER', {
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
      })
      .catch((error) => {
        commit('WEEKLY_MONTHLY_REPORTS_JSON_INDIVIDUAL_USER', {
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
      })
      .finally(() => commit('LOADING', false))
  }
}

const getters = {
  getDashboardDetails: (state) => state.dashboard_counts || {},
  getTopFiveCourses: (state) => state.topFiveCourses,
  getTopFiveLps: (state) => state.topFiveLps,
  isLoading: (state) => state.loading,
  loadedPageStatusGetter: (state) => state.loadedPage,
  weeklyMonthlyJsonIndividualUserGetter: (state) => state.weeklyMonthlyJsonIndividualUser
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
