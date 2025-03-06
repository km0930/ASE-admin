<template>
  <q-card class="card-line bg-primary none-spacing padding_7">
    <div class="text-subtitle1">
      {{ title }}
    </div>
    <q-card-section align="right" class="bg-primary none-spacing">
      <div class="chart_size_bar" align="right">
        <div ref="pieChart" align="right" autoresize id="pieChart" style="width: 100%; height: 220px">
          <div style="padding-top: 10%; padding-bottom: 10%" v-if="pieChartData.length === 0 && loading">
            <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No Data</p>
          </div>
        </div>
        <q-resize-observer @resize="onResize" />
      </div>
    </q-card-section>
  </q-card>
</template>

<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.chart_size_bar {
  top: 0;
  width: 100%;
  height: 220px;
}
</style>

<script>
import * as echarts from 'echarts'
export default {
  name: 'E-PieChart',
  props: {
    pieChartData: {
      type: Array,
      required: true
    },
    pieChartLabels: {
      type: Array,
      required: false
    },
    pie_chart_colors: {
      type: Array,
      required: false
    },
    pieChartName: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data() {
    return {
      model: false,
      pie_chart: null,
      PieChart: {
        backgroundColor: '#111111',
        grid: {
          show: false
        },
        color: [
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
        ],

        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `Name: ${
              params.data.name.length < 35 ? params.data.name : params.data.name.substring(0, 35) + ' ... '
            } <br/> <div align="left">Enrollments: ${params.value}</div>`
          },
          showDelay: 40,
          transitionDuration: 1.2,
          textStyle: {
            fontSize: 12,
            lineHeight: 18
          }
        },
        legend: {
          top: 'bottom',
          textStyle: {
            textBorderWidth: 14,
            textBorderType: 'dashed',
            overflow: 'truncate',
            color: '#fff',
            fontSize: 10
          },
          formatter: (params) => {
            if (params.length <= 50) {
              return params.substring(0, 50)
            } else {
              return params.substring(0, 50) + ' ... '
            }
          }
        },
        series: [
          {
            name: this.pieChartName,
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['30%', '40%'],
            data: this.pieChartData,
            avoidLabelOverlap: true,
            left: '20%',
            width: '100%',
            label: {
              show: false,
              fontSize: 10,
              formatter: '{b}',
              bleedMargin: 20,
              distanceToLabelLine: 5
            }
          }
        ]
      }
    }
  },
  mounted() {
    if (this.pieChartData.length > 0) {
      this.init()
    }
  },
  watch: {
    pieChartData: {
      handler() {
        if (this.pieChartData.length > 0) {
          this.PieChart = {
            backgroundColor: '#111111',
            grid: {
              show: false
            },
            color: [
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
            ],

            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                return `Name: ${
                  params.data.name.length < 35 ? params.data.name : params.data.name.substring(0, 35) + ' ... '
                } <br/> <div align="left">Enrollments: ${params.value}</div>`
              },
              showDelay: 40,
              transitionDuration: 1.2,
              textStyle: {
                fontSize: 12,
                lineHeight: 18
              }
            },
            legend: {
              top: 'bottom',
              textStyle: {
                textBorderWidth: 14,
                textBorderType: 'dashed',
                overflow: 'truncate',
                fontSize: 10,
                color: '#fff'
              },
              formatter: (params) => {
                if (params.length <= 50) {
                  return params.substring(0, 50)
                } else {
                  return params.substring(0, 50) + ' ... '
                }
              }
            },
            series: [
              {
                name: this.pieChartName,
                type: 'pie',
                radius: ['30%', '60%'],
                center: ['30%', '40%'],
                data: this.pieChartData,
                avoidLabelOverlap: true,
                left: '20%',
                width: '100%',
                label: {
                  show: false,
                  fontSize: 10,
                  formatter: '{b}',
                  bleedMargin: 20,
                  distanceToLabelLine: 5
                }
              }
            ]
          }
        }
        this.init()
      }
    }
  },
  methods: {
    init() {
      if (this.pieChartData.length > 0) {
        const pieChart = document.getElementById('pieChart')
        echarts.dispose(pieChart)
        const theme = this.model ? 'dark' : 'light'
        this.pie_chart = echarts.init(pieChart, theme)
        this.pie_chart.setOption(this.PieChart)
      }
    },
    onResize() {
      if (this.pie_chart) {
        this.pie_chart.resize()
      }
    }
  }
}
</script>
