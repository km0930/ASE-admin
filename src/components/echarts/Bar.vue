<template>
  <q-card class="card-line bg-primary none-spacing padding_7">
    <div class="text-subtitle1">{{ title }}</div>
    <q-card-section align="right" class="bg-primary none-spacing">
      <div class="chart_size_latest" align="right">
        <p v-if="data.length === 0 && !isLoading" class="text-h5 text-center">NO DATA</p>
        <div :ref="title" :id="title" align="right" autoresize style="width: 100%; height: 350px"></div>
        <q-resize-observer @resize="onResize" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { dispose, init } from 'echarts'
import { onMounted, ref } from 'vue'

const props = defineProps({
  data: { type: Array, required: false },
  isLoading: { type: Boolean, required: false, default: () => false },
  labelY: { type: String, required: false, default: () => 'Count' },
  title: { type: String, required: false }
})

const barChart = ref({
  backgroundColor: '#111111',
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    axisLabel: { fontSize: 10 },
    axisTick: { alignWithLabel: true },
    data: props.data.map((item) => item.label)
  },
  yAxis: {
    splitLine: { show: false },
    axisLine: { show: true },
    axisLabel: { fontSize: 10 },
    minInterval: 1,
    name: props.labelY
  },
  series: [
    {
      data: props.data.map((item, index) => ({
        value: item.value,
        itemStyle: { color: ['#246590', '#5AB049', '#F5B041', '#45B39D', '#f08a5d', '#FF5733', '#6f4a8e'][index] }
      })),
      type: 'bar'
    }
  ]
})
const chart = ref(null)

onMounted(async () => {
  const courseBarInfo = document.getElementById(props.title)
  dispose(courseBarInfo)
  chart.value = init(courseBarInfo)
  chart.value.setOption(barChart.value)
})

function onResize() {
  if (chart.value) {
    chart.value.resize()
  }
}
</script>
<style>
.chart_size_latest {
  top: 0;
  width: 100%;
  height: 350px;
}
</style>
