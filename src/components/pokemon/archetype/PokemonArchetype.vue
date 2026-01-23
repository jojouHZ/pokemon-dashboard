<template>
  <div v-if="archetype" class="archetype">
    <div class="archetype__header">
      <h4 class="archetype__title">{{ archetype.name }}</h4>
    </div>

    <p class="archetype__description">
      {{ archetype.description }}
    </p>

    <div class="archetype__section">
      <h5 class="archetype__subtitle">Характеристики:</h5>
      <ul class="archetype__list">
        <li v-for="(indicator, idx) in archetype.indicators" :key="idx">
          {{ indicator }}
        </li>
      </ul>
    </div>

    <div class="archetype__section">
      <h5 class="archetype__subtitle">Сильные стороны:</h5>
      <ul class="archetype__list archetype__list--positive">
        <li v-for="(strength, idx) in archetype.strengths" :key="idx">✓ {{ strength }}</li>
      </ul>
    </div>

    <div class="archetype__section">
      <h5 class="archetype__subtitle">Слабости:</h5>
      <ul class="archetype__list archetype__list--negative">
        <li v-for="(weakness, idx) in archetype.weaknesses" :key="idx">✗ {{ weakness }}</li>
      </ul>
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
.archetype {
  padding: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  font-size: 12px;

  &__header {
    margin-bottom: 8px;
  }

  &__title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: rgba(56, 189, 248, 1);
  }

  &__description {
    margin: 0 0 12px;
    color: rgba(148, 163, 184, 0.9);
    font-size: 11px;
  }

  &__section {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__subtitle {
    margin: 0 0 6px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(148, 163, 184, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__list {
    margin: 0;
    padding-left: 16px;
    list-style: none;

    li {
      margin-bottom: 4px;
      color: rgba(148, 163, 184, 0.85);
      font-size: 11px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &--positive li {
      color: rgba(74, 222, 128, 0.9);
    }

    &--negative li {
      color: rgba(255, 107, 107, 0.9);
    }
  }
}
</style>
