<template>
  <q-card class="card-line bg-primary none-spacing padding_7">
    <div class="text-subtitle1">
      {{ title }}
    </div>
    <q-card-section align="right" class="bg-primary none-spacing">
      <div class="chart_size_latest" align="right">
        <template>
          <div ref="trendTopMonths" autoresize id="trendTopMonths" align="right" style="width: 100%; height: 350px">
            <div class="text-center" style="padding-top: 20%; padding-bottom: 20%" v-if="bar_chart_data.length === 0">
              <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No Data</p>
            </div>
          </div>
        </template>
        <q-resize-observer @resize="onResize" />
      </div>
    </q-card-section>
  </q-card>
</template>
<style>
.chart_size_latest {
  top: 0;
  width: 100%;
  height: 350px;
}
</style>
<script>
import * as echarts from 'echarts'
export default {
  name: 'E-trendTopMonths',
  props: {
    bar_chart_categories: {
      type: Array,
      required: false
    },
    bar_chart_data: {
      type: Array,
      required: true
    },
    bar_chart_labels: {
      type: Array,
      required: true
    },
    bar_chart_name: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    x_axis_name: {
      type: String,
      required: false
    },
    y_axis_name: {
      type: String,
      required: false
    },
    loadingIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      model: false,
      BarChartTrendChart: {
        color: [
          '#F5B041',
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
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '5%',
          containLabel: true
        },
        backgroundColor: '',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          left: 'center',
          type: 'scroll',
          z: 2,
          orient: 'horizontal',
          right: 10,
          bottom: 5,
          data: this.bar_chart_categories ? this.bar_chart_categories : [],
          textStyle: {
            color: '#ffffff',
            fontSize: 12
          }
        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'category',
          data: this.bar_chart_labels ? this.bar_chart_labels : [],
          axisLabel: {
            show: true,
            inside: false,
            fontSize: 10,
            color: '#ffffff'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              shadowBlur: 0.5
            }
          }
        },
        yAxis: {
          type: 'value',
          inactiveColor: '#CDCDCF',
          axisLabel: {
            show: true,
            inside: false,
            fontSize: 10,
            color: '#ffffff'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              shadowBlur: 0.5
            }
          }
        },
        series: this.bar_chart_data ? this.bar_chart_data : []
      },
      bar_chart: null
    }
  },
  mounted() {},
  watch: {
    bar_chart_categories: {
      handler() {
        if (this.bar_chart_categories.length > 0) {
          this.BarChartTrendChart = {
            color: [
              '#F5B041',
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
            grid: {
              left: '5%',
              right: '5%',
              bottom: '10%',
              top: '5%',
              containLabel: true
            },
            backgroundColor: '',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              left: 'center',
              type: 'scroll',
              z: 2,
              orient: 'horizontal',
              right: 10,
              bottom: 5,
              data: this.bar_chart_categories ? this.bar_chart_categories : [],
              textStyle: {
                color: '#ffffff',
                fontSize: 12
              }
            },
            toolbox: {
              show: false,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            xAxis: {
              type: 'category',
              data: this.bar_chart_labels ? this.bar_chart_labels : [],
              axisLabel: {
                show: true,
                inside: false,
                fontSize: 10,
                color: '#ffffff'
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  shadowBlur: 0.5
                }
              }
            },
            yAxis: {
              type: 'value',
              inactiveColor: '#CDCDCF',
              axisLabel: {
                show: true,
                inside: false,
                fontSize: 10,
                color: '#ffffff'
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  shadowBlur: 0.5
                }
              }
            },
            series: this.bar_chart_data ? this.bar_chart_data : []
          }
        }
        this.init()
      }
    }
  },
  methods: {
    SaveImage() {
      const linkSource = this.bar_chart.getDataURL()
      const downloadLink = document.createElement('a')
      document.body.appendChild(downloadLink)
      downloadLink.href = linkSource
      downloadLink.target = '_self'
      downloadLink.download = 'BarChartTrendChart.png'
      downloadLink.click()
    },
    init() {
      if (this.bar_chart_categories.length > 0) {
        const trendTopMonths = document.getElementById('trendTopMonths')
        echarts.dispose(trendTopMonths)
        const theme = this.model ? 'dark' : 'light'
        this.bar_chart = echarts.init(trendTopMonths, theme)
        this.bar_chart.setOption(this.BarChartTrendChart)
      }
    },
    toggleTheme() {
      if (this.model) {
        this.model = false
        this.init()
      } else {
        this.model = true
        this.init()
      }
    },
    onResize() {
      if (this.bar_chart) {
        this.bar_chart.resize()
      }
    }
  }
}
</script>
<style scoped>
.centerAlignmentNodata {
  display: table-cell;
  height: 50vh;
  width: 100vw;
  vertical-align: middle;
  text-align: center;
}
</style>
