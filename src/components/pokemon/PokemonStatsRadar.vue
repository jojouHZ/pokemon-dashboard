<template>
  <Radar v-if="chartData.datasets[0].data.length" :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import type { PokemonStat } from '@/types/pokemon'

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{
  stats: PokemonStat[]
}>()

const chartData = computed<ChartData<'radar'>>(() => ({
  labels: props.stats.map((s) => s.label),
  datasets: [
    {
      label: 'Base stat',
      data: props.stats.map((s) => s.value),
      borderColor: 'rgba(56, 189, 248, 1)',
      backgroundColor: 'rgba(56, 189, 248, 0.25)',
      pointBackgroundColor: 'rgba(248, 250, 252, 1)',
      pointBorderColor: 'rgba(15, 23, 42, 1)',
      pointRadius: 3,
      borderWidth: 2,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      angleLines: {
        color: 'rgba(148, 163, 184, 0.25)',
      },
      grid: {
        color: 'rgba(30, 64, 175, 0.4)',
      },
      pointLabels: {
        color: 'rgba(148, 163, 184, 0.9)',
        font: {
          size: 10,
        },
      },
      ticks: {
        display: false,
      },
    },
  },
}))
</script>

<style scoped>
:host,
div {
  width: 100%;
  height: 100%;
}
</style>
