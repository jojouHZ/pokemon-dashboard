<template>
  <div class="stat-tooltip">
    <div class="stat-tooltip__header">
      <h4 class="stat-tooltip__name">{{ description.name }}</h4>
      <span class="stat-tooltip__value">{{ value }}</span>
    </div>

    <p class="stat-tooltip__description">
      {{ description.description }}
    </p>

    <div class="stat-tooltip__impact">
      <span class="stat-tooltip__impact-label">Влияние:</span>
      <span class="stat-tooltip__impact-text">{{ description.impact }}</span>
    </div>

    <div class="stat-tooltip__bar">
      <div class="stat-tooltip__bar-fill" :style="{ width: barPercentage + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatDescription } from '@/data/pokemonStatsGuide'

const props = defineProps<{
  description: StatDescription
  value: number
}>()

const barPercentage = computed(() => {
  // Макс база 150, поэтому расчет от этого
  return Math.min((props.value / 150) * 100, 100)
})
</script>

<style scoped lang="scss">
.stat-tooltip {
  padding: 12px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  &__name {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: rgba(56, 189, 248, 1);
  }

  &__value {
    font-weight: 600;
    color: #e5e7eb;
    font-family: monospace;
    font-size: 14px;
  }

  &__description {
    margin: 0 0 8px;
    color: rgba(148, 163, 184, 0.9);
    font-size: 11px;
  }

  &__impact {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 11px;
  }

  &__impact-label {
    font-weight: 600;
    color: rgba(148, 163, 184, 0.7);
  }

  &__impact-text {
    color: rgba(148, 163, 184, 0.9);
  }

  &__bar {
    width: 100%;
    height: 4px;
    background: rgba(30, 64, 175, 0.3);
    border-radius: 2px;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(56, 189, 248, 0.8), rgba(59, 130, 246, 1));
    transition: width 0.3s ease;
  }
}
</style>
