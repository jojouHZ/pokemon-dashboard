<template>
  <div class="radar-container" @mouseleave="handleMouseLeave">
    <Radar v-if="chartData.datasets?.[0]?.data?.length" :data="chartData" :options="chartOptions" />

    <!-- Tooltip при наведении с динамической позицией -->
    <div v-if="hoveredStat" class="radar-container__tooltip" :style="tooltipStyle">
      <PokemonStatTooltip :description="hoveredStat.description" :value="hoveredStat.value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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
import type { CSSProperties } from 'vue'
import { Radar } from 'vue-chartjs'
import type { PokemonStat } from '@/types/pokemon'
import { STAT_DESCRIPTIONS } from '@/data/pokemonStatsGuide'
import type { StatDescription } from '@/data/pokemonStatsGuide'
import { PokemonStatTooltip } from '..'

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{
  stats: PokemonStat[]
}>()

const TOOLTIP_OFFSET = 4 // отступ от курсора
const TOOLTIP_WIDTH = 220 // примерная ширина тултипа
const TOOLTIP_HEIGHT = 160 // примерная высота тултипа

const hoveredStat = ref<{ description: StatDescription; value: number } | null>(null)
const tooltipPos = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const tooltipAlign = ref<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left')

let hideTooltipTimeout: ReturnType<typeof setTimeout> | null = null
let canvasElement: HTMLCanvasElement | null = null
let containerElement: HTMLElement | null = null

// Вычисляем оптимальную позицию тултипа
const calculateTooltipPosition = (mouseX: number, mouseY: number) => {
  if (!containerElement) return

  const containerRect = containerElement.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Позиция мыши относительно контейнера
  const relX = mouseX - containerRect.left
  const relY = mouseY - containerRect.top

  // Проверяем достаточно ли места справа
  const hasRightSpace = mouseX + TOOLTIP_WIDTH + TOOLTIP_OFFSET < viewportWidth
  // Проверяем достаточно ли места снизу
  const hasBottomSpace = mouseY + TOOLTIP_HEIGHT + TOOLTIP_OFFSET < viewportHeight

  let x = relX
  let y = relY
  let align: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

  // Определяем оптимальный угол привязки
  if (hasRightSpace && hasBottomSpace) {
    // Низ-справа (top-left привязка)
    align = 'top-left'
    x = relX + TOOLTIP_OFFSET
    y = relY + TOOLTIP_OFFSET
  } else if (!hasRightSpace && hasBottomSpace) {
    // Низ-слева (top-right привязка)
    align = 'top-right'
    x = relX - TOOLTIP_OFFSET - TOOLTIP_WIDTH
    y = relY + TOOLTIP_OFFSET
  } else if (hasRightSpace && !hasBottomSpace) {
    // Сверху-справа (bottom-left привязка)
    align = 'bottom-left'
    x = relX + TOOLTIP_OFFSET
    y = relY - TOOLTIP_OFFSET - TOOLTIP_HEIGHT
  } else {
    // Сверху-слева (bottom-right привязка)
    align = 'bottom-right'
    x = relX - TOOLTIP_OFFSET - TOOLTIP_WIDTH
    y = relY - TOOLTIP_OFFSET - TOOLTIP_HEIGHT
  }

  tooltipPos.value = { x, y }
  tooltipAlign.value = align
}

// Стили для тултипа в зависимости от позиции
const tooltipStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  left: `${tooltipPos.value.x}px`,
  top: `${tooltipPos.value.y}px`,
  zIndex: 10,
  animation: 'fadeIn 0.15s ease-in',
  pointerEvents: 'none' as const,
}))

// Очищаем тултип с задержкой
const scheduleHideTooltip = () => {
  if (hideTooltipTimeout) clearTimeout(hideTooltipTimeout)
  hideTooltipTimeout = setTimeout(() => {
    hoveredStat.value = null
  }, 100)
}

// При выходе мыши из контейнера
const handleMouseLeave = () => {
  scheduleHideTooltip()
}

// Обработчик движения мыши по канвасу
const handleCanvasMouseMove = (event: MouseEvent) => {
  if (!canvasElement || props.stats.length === 0) return

  // Очищаем таймер если он был
  if (hideTooltipTimeout) {
    clearTimeout(hideTooltipTimeout)
    hideTooltipTimeout = null
  }

  const rect = canvasElement.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const width = canvasElement.width
  const height = canvasElement.height

  // Центр и радиус графика
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(centerX, centerY) * 0.7

  // Расстояние от центра до текущей позиции мыши
  const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))

  // Если мышь близко к центру или внутри графика
  if (distance < radius * 1.2) {
    // Считаем угол от центра
    const angle = Math.atan2(y - centerY, x - centerX)
    let normalizedAngle = (angle * 180) / Math.PI + 90
    if (normalizedAngle < 0) normalizedAngle += 360

    // Определяем на какой сегмент попала мышь
    const segmentSize = 360 / props.stats.length
    const statIndex = Math.round(normalizedAngle / segmentSize) % props.stats.length

    const stat = props.stats[statIndex]
    if (stat) {
      const key = stat.label.toLowerCase().replace(' ', '-')
      const description = STAT_DESCRIPTIONS[key]

      if (description) {
        hoveredStat.value = {
          description,
          value: stat.value,
        }

        // Обновляем позицию тултипа под курсором
        calculateTooltipPosition(event.clientX, event.clientY)
      }
    }
  } else {
    scheduleHideTooltip()
  }
}

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
      pointHoverRadius: 6,
      borderWidth: 2,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
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

onMounted(() => {
  containerElement = document.querySelector('.radar-container') as HTMLElement
  if (containerElement) {
    canvasElement = containerElement.querySelector('canvas')
    if (canvasElement) {
      canvasElement.addEventListener('mousemove', handleCanvasMouseMove)
    }
  }
})

onBeforeUnmount(() => {
  if (canvasElement) {
    canvasElement.removeEventListener('mousemove', handleCanvasMouseMove)
  }
  if (hideTooltipTimeout) {
    clearTimeout(hideTooltipTimeout)
  }
})
</script>

<style scoped>
.radar-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.radar-container__tooltip {
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
