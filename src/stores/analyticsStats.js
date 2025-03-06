import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'
import { showLoader } from 'src/utils/loader'
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

export const useAnalyticsStatStore = defineStore('analyticsStatStore', () => {
  const isLoading = ref(false)
  const monthlyStats = ref({
    data: [],
    labels: [],
    colors: [],
    title: 'Monthly report',
    name: '',
    values_list: [],
    single_line: [],
    scatter_line: []
  })
  const weeklyStats = ref({
    data: [],
    labels: [],
    colors: [],
    title: 'Monthly report',
    name: '',
    values_list: [],
    single_line: [],
    scatter_line: []
  })
  const topCourses = ref({
    data: [],
    labels: [],
    colors: [],
    static_data: [],
    title: 'Popular Courses',
    name: 'Popular Courses'
  })
  const topTeams = ref({
    data: [],
    labels: [],
    categories: [],
    colors: [],
    title: 'Team Activity',
    name: 'Team Activity'
  })

  function IS_LOADING(data) {
    isLoading.value = data
    showLoader(data)
  }
  function SET_MONTHLY_STATS(data) {
    monthlyStats.value = data
  }
  function SET_WEEKLY_STATS(data) {
    weeklyStats.value = data
  }
  function SET_TOP_COURSES(data) {
    topCourses.value = data
  }
  function SET_TOP_TEAMS(data) {
    topTeams.value = data
  }

  async function fetchCompanyStatsAction(payload) {
    IS_LOADING(true)
    await api
      .post('company/stats', payload)
      .then((res) => {
        if (res.data.success) {
          const dateKeysMonthly = []
          if (res.data.data.monthly) {
            res.data.data.monthly.dates.forEach((dateConvMonth) => {
              dateKeysMonthly.push(dateFormatReadable(dateConvMonth))
            })
            const monthlyStats = {
              labels: dateKeysMonthly,
              colors: ['#2B2D7D', '#2D3EBA', '#21BA45'],
              title: 'Monthly report',
              name: 'Monthly report',
              data: [
                {
                  name: 'Course mins',
                  type: 'line',
                  stack: 'line',
                  data: res.data.data.monthly.course_minutes
                },
                {
                  name: 'Lab mins',
                  type: 'line',
                  data: res.data.data.monthly.lab_minutes
                },
                {
                  name: 'Enrollments',
                  type: 'line',
                  data: res.data.data.monthly.enrolled_courses
                }
              ]
            }
            SET_MONTHLY_STATS(monthlyStats)
          } else {
            const monthlyEmpty = {
              labels: [],
              colors: ['#2B2D7D', '#2D3EBA', '#21BA45'],
              title: 'Monthly report',
              name: 'Monthly report',
              data: []
            }
            SET_MONTHLY_STATS(monthlyEmpty)
          }

          const dateKeys = []
          if (res.data.data.weekly) {
            res.data.data.weekly.dates.map((dateConv) => dateKeys.push(dateFormatReadable(dateConv)))
            const weeklyStats = {
              labels: dateKeys,
              colors: ['#2B2D7D', '#2D3EBA', '#21BA45'],
              title: 'Weekly report',
              name: 'Weekly report',
              data: [
                {
                  name: 'Course mins',
                  type: 'line',
                  stack: 'line',
                  data: res.data.data.weekly.course_minutes
                },
                {
                  name: 'Lab mins',
                  type: 'line',
                  data: res.data.data.weekly.lab_minutes
                },
                {
                  name: 'Enrollments',
                  type: 'line',
                  data: res.data.data.weekly.enrolled_courses
                }
              ]
            }
            SET_WEEKLY_STATS(weeklyStats)
          } else {
            const weeklyEmpty = {
              labels: [],
              colors: ['#2B2D7D', '#2D3EBA', '#21BA45'],
              title: 'Weekly report',
              name: 'Weekly report',
              data: []
            }
            SET_WEEKLY_STATS(weeklyEmpty)
          }

          const topCourses = {
            data: [],
            labels: [],
            colors: [],
            values: [],
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
          if (res.data.data.top_courses) {
            res.data.data.top_courses.forEach((info) => {
              topCourses.data.push({
                name: info.course_name,
                value: info.enrollment_count,
                itemStyle: { color: color[index] }
              })
              topCourses.static_data.push({
                name: info.course_name,
                value: info.enrollment_count + 5 * (10 * (5 - index)),
                itemStyle: { color: color[index] }
              })
              topCourses.labels.push(info.course_name)
              topCourses.values.push(info.enrollment_count)
              index = index + 1
            })
            SET_TOP_COURSES(topCourses)
          } else {
            const emptyCouses = {
              data: [],
              labels: [],
              colors: [],
              values: [],
              static_data: [],
              title: 'Popular Courses',
              name: 'Popular Courses'
            }
            SET_TOP_COURSES(emptyCouses)
          }

          const topTeams = {
            data: [],
            labels: [],
            categories: [],
            colors: [],
            title: 'Team Activity',
            name: 'Team Activity'
          }
          const courseMinutes = []
          const labMinutes = []
          const enrolledCourses = []
          const teamNames = []
          if (res.data.data.top_teams) {
            res.data.data.top_teams.forEach((info) => {
              courseMinutes.push(info.course_minutes || 0)
              labMinutes.push(info.lab_minutes || 0)
              enrolledCourses.push(info.enrolled_courses || 0)
              teamNames.push(info.name)
            })
            topTeams.data.push(
              {
                name: 'Course Mins',
                type: 'bar',
                barGap: 0,
                emphasis: {
                  focus: 'series'
                },
                data: courseMinutes
              },
              {
                name: 'Lab Mins',
                type: 'bar',
                barGap: 0,
                emphasis: {
                  focus: 'series'
                },
                data: labMinutes
              },
              {
                name: 'Enrollments',
                type: 'bar',
                barGap: 0,
                data: enrolledCourses
              }
            )
            topTeams.labels = teamNames
            topTeams.categories = ['Course Mins', 'Lab Mins', 'Enrollments']
          }
          SET_TOP_TEAMS(topTeams)
        }
      })
      .finally(() => IS_LOADING(false))
  }
  return {
    topCourses,
    topTeams,
    fetchCompanyStatsAction
  }
})
