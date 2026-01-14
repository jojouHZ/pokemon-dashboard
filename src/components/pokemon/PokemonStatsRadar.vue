<template>
  <div class="radar-container">
    <Radar v-if="chartData.datasets?.[0]?.data?.length" :data="chartData" :options="chartOptions" />

    <!-- Tooltip при наведении 
    <div v-if="hoveredStat" class="radar-container__tooltip">
      <PokemonStatTooltip :description="hoveredStat.description" :value="hoveredStat.value" />
    </div>
    -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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
import { STAT_DESCRIPTIONS } from '@/data/pokemonStatsGuide'
// import PokemonStatTooltip from './PokemonStatTooltip.vue'

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{
  stats: PokemonStat[]
}>()

// const hoveredStat = ref(null)

const chartData = computed<ChartData<'radar'>>(() => ({
  labels: props.stats.map((s) => {
    const key = s.label.toLowerCase().replace(' ', '-')
    return STAT_DESCRIPTIONS[key]?.shortName || s.label
  }),
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
.radar-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.radar-container__tooltip {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 220px;
  z-index: 10;
}
</style>
