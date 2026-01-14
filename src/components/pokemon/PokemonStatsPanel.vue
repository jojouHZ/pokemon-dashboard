<template>
  <article class="stats-panel">
    <header class="stats-panel__header">
      <h3 class="stats-panel__title">Base stats</h3>
      <div class="stats-panel__tabs">
        <button
          v-for="view in views"
          :key="view.id"
          type="button"
          class="stats-panel__tab"
          :class="{ 'stats-panel__tab--active': currentView === view.id }"
          @click="currentView = view.id"
        >
          {{ view.label }}
        </button>
      </div>
    </header>

    <section class="stats-panel__body">
      <div v-if="currentView === 'radar'" class="stats-panel__chart">
        <PokemonStatsRadar :stats="stats" />
      </div>

      <div v-else-if="currentView === 'bars'" class="stats-panel__placeholder">
        <p>Bars chart placeholder</p>
      </div>

      <div v-else class="stats-panel__placeholder">
        <p>Summary placeholder</p>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PokemonStat } from '@/types/pokemon'
import PokemonStatsRadar from '@/components/pokemon/PokemonStatsRadar.vue'

type ViewId = 'radar' | 'bars' | 'summary'

const props = defineProps<{
  stats: PokemonStat[]
}>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const statsLength = props.stats.length

const views: { id: ViewId; label: string }[] = [
  { id: 'radar', label: 'Radar' },
  { id: 'bars', label: 'Bars' },
  { id: 'summary', label: 'Summary' },
]

const currentView = ref<ViewId>('radar')
</script>

<style scoped lang="scss">
.stats-panel {
  border-radius: 18px;
  padding: 12px 12px 14px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.3);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 13px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(148, 163, 184, 0.9);
  }

  &__tabs {
    display: inline-flex;
    padding: 2px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.35);
  }

  &__tab {
    border: none;
    background: transparent;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
    color: rgba(148, 163, 184, 0.9);
    cursor: pointer;
    transition:
      0.15s background-color ease,
      0.15s color ease;

    &--active {
      background: radial-gradient(circle at top, rgba(56, 189, 248, 0.4), rgba(15, 23, 42, 1));
      color: #e5e7eb;
    }
  }

  &__body {
    margin-top: 6px;
    min-height: 180px;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }

  &__chart {
    width: 100%;
    height: 180px;
  }

  &__placeholder {
    font-size: 12px;
    color: rgba(148, 163, 184, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
</style>
