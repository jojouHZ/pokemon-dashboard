<template>
  <div v-if="archetype" class="archetype-tile">
    <div class="archetype-tile__header">
      <h4 class="archetype-tile__title">{{ archetype.name }}</h4>
    </div>

    <p class="archetype-tile__description">
      {{ archetype.description }}
    </p>

    <div class="archetype-tile__indicators">
      <span v-for="(indicator, idx) in archetype.indicators" :key="idx" class="archetype-tile__tag">
        {{ indicator }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonArchetype } from '@/data/pokemonStatsGuide'

defineProps<{
  archetype: PokemonArchetype | null
}>()
</script>

<style scoped lang="scss">
.archetype-tile {
  border-radius: 12px;
  padding: 14px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__header {
    margin-bottom: 4px;
  }

  &__title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: rgba(56, 189, 248, 1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__description {
    margin: 0;
    font-size: 11px;
    color: rgba(148, 163, 184, 0.9);
    line-height: 1.4;
  }

  &__indicators {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__tag {
    background: rgba(56, 189, 248, 0.15);
    color: rgba(56, 189, 248, 0.9);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    border: 1px solid rgba(56, 189, 248, 0.3);
  }
}
</style>
