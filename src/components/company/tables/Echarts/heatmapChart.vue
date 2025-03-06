<template>
  <div>
    <v-chart :options="heatmap" autoresize style="height: 410px; width: 1200px" />
  </div>
</template>

<script>
import VueECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/visualMap'

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let data = [
  [0, 0, 1],
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 5],
  [0, 5, 6],
  [0, 6, 7],
  [0, 7, 8],
  [0, 8, 9],
  [0, 9, 1],
  [0, 10, 2],
  [0, 11, 2],
  [0, 12, 4],
  [0, 13, 1],
  [0, 14, 1],
  [0, 15, 3],
  [0, 16, 4],
  [0, 17, 6],
  [0, 18, 4],
  [0, 19, 4],
  [0, 20, 3],
  [0, 21, 3],
  [0, 22, 2],
  [0, 30, 5],
  [1, 0, 7],
  [1, 1, 4],
  [1, 2, 4],
  [1, 3, 4],
  [11, 4, 4],
  [1, 5, 4],
  [11, 6, 3],
  [10, 7, 3],
  [1, 8, 3],
  [11, 9, 3],
  [5, 10, 5],
  [6, 11, 2],
  [1, 12, 2],
  [4, 13, 6],
  [1, 14, 9],
  [1, 15, 10],
  [11, 16, 6],
  [11, 17, 7],
  [9, 18, 8],
  [1, 19, 10],
  [1, 20, 5],
  [9, 21, 5],
  [1, 22, 7],
  [1, 23, 2],
  [2, 0, 1],
  [2, 1, 1],
  [2, 2, 7],
  [2, 3, 7],
  [2, 4, 7],
  [2, 5, 7],
  [2, 6, 3],
  [2, 7, 3],
  [2, 8, 3],
  [2, 9, 3],
  [11, 10, 3],
  [11, 11, 2],
  [11, 12, 1],
  [2, 13, 9],
  [2, 14, 8],
  [2, 15, 10],
  [2, 16, 6],
  [2, 17, 5],
  [2, 18, 5],
  [2, 19, 5],
  [2, 20, 7],
  [2, 21, 4],
  [2, 22, 2],
  [2, 23, 4],
  [3, 0, 7],
  [3, 1, 3],
  [3, 2, 8],
  [3, 3, 8],
  [3, 4, 0],
  [3, 5, 0],
  [3, 6, 8],
  [3, 7, 8],
  [12, 8, 1],
  [3, 9, 8],
  [7, 10, 5],
  [7, 11, 4],
  [7, 12, 7],
  [8, 13, 14],
  [8, 14, 13],
  [9, 15, 12],
  [9, 16, 9],
  [9, 17, 5],
  [2, 18, 5],
  [3, 19, 10],
  [3, 20, 6],
  [3, 21, 4],
  [3, 22, 4],
  [3, 23, 1],
  [4, 0, 1],
  [4, 1, 3],
  [4, 2, 5],
  [4, 3, 5],
  [4, 4, 5],
  [4, 5, 1],
  [4, 6, 0],
  [4, 7, 0],
  [4, 8, 0],
  [4, 9, 2],
  [4, 10, 4],
  [4, 11, 4],
  [4, 12, 2],
  [4, 13, 4],
  [4, 14, 4],
  [4, 15, 14],
  [4, 16, 12],
  [4, 17, 1],
  [4, 18, 8],
  [4, 19, 5],
  [4, 21, 7],
  [4, 22, 3],
  [5, 0, 2],
  [5, 1, 1],
  [5, 2, 1],
  [6, 3, 3],
  [7, 6, 1],
  [8, 7, 1],
  [5, 8, 2],
  [10, 9, 0],
  [5, 10, 4],
  [5, 11, 1],
  [5, 13, 10],
  [5, 14, 5],
  [5, 15, 7],
  [5, 16, 11],
  [5, 17, 6],
  [5, 18, 0],
  [5, 19, 5],
  [11, 20, 3],
  [11, 21, 4],
  [11, 22, 2],
  [11, 23, 0],
  [11, 0, 1],
  [11, 1, 1],
  [11, 14, 5],
  [11, 15, 7],
  [8, 16, 11],
  [10, 17, 6]
]

export default {
  components: {
    'v-chart': VueECharts
  },
  data() {
    data = data.map(function (item) {
      return [item[1], item[0], item[2] || '-']
    })

    return {
      heatmap: {
        tooltip: {
          position: 'top'
        },
        animation: true,
        grid: {
          height: '50%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: days,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: months,
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        title: {
          text: 'Quarterly Sales Results',
          x: 'center',
          textStyle: {
            fontSize: 24
          }
        },
        color: ['#127ac2'],
        series: [
          {
            type: 'heatmap',
            colors: ['#008FFB'],
            data: data,
            label: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(3, 1, 2, 10)'
              }
            }
          }
        ]
      }
    }
  }
}
</script>
