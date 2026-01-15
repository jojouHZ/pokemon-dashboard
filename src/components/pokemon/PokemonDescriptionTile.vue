<template>
  <div v-if="species" class="pokemon-tile">
    <div class="pokemon-tile__header">
      <h4 class="pokemon-tile__title">Pokemon Entry</h4>
    </div>

    <p class="pokemon-tile__description">"{{ species.description }}"</p>

    <div class="pokemon-tile__genus">
      <span class="pokemon-tile__label">Genus:</span>
      <span class="pokemon-tile__value">{{ species.genus }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonSpecies } from '@/services/pokemonApiClient'

defineProps<{
  species: PokemonSpecies | null
}>()
</script>

<style scoped lang="scss">
.pokemon-tile {
  border-radius: 12px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.4);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__header {
    margin-bottom: 8px;
  }

  &__title {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__description {
    margin: 0;
    font-size: 13px;
    font-style: italic;
    color: rgba(229, 231, 235, 0.95);
    line-height: 1.4;
    flex: 1;
  }

  &__genus {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 11px;
  }

  &__label {
    font-weight: 600;
    color: rgba(148, 163, 184, 0.8);
  }

  &__value {
    color: rgba(148, 163, 184, 0.95);
    font-style: italic;
  }
}
</style>
