<template>
  <div class="detail-card">
    <div class="detail-card__image-wrapper">
      <img :src="pokemon.image" :alt="pokemon.name" class="detail-card__image" />
    </div>

    <div class="detail-card__content">
      <div class="detail-card__header">
        <h1 class="detail-card__name">{{ pokemon.name }}</h1>
        <div class="detail-card__id">#{{ String(pokemon.id).padStart(4, '0') }}</div>
      </div>

      <div class="detail-card__types">
        <span v-for="type in pokemon.types" :key="type" class="detail-card__type-badge">
          {{ type }}
        </span>
      </div>

      <div class="detail-card__stats">
        <div class="detail-card__stat">
          <span class="detail-card__stat-label">Height</span>
          <span class="detail-card__stat-value">{{ (pokemon.height / 10).toFixed(1) }}m</span>
        </div>
        <div class="detail-card__stat">
          <span class="detail-card__stat-label">Weight</span>
          <span class="detail-card__stat-value">{{ (pokemon.weight / 10).toFixed(1) }}kg</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '@/types/pokemon'

defineProps<{
  pokemon: Pokemon
}>()
</script>

<style scoped lang="scss">
.detail-card {
  border-radius: 18px;
  padding: 16px 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  gap: 20px;
  align-items: stretch;

  &__image-wrapper {
    flex-shrink: 0;
    width: 140px;
    height: 140px;
    border-radius: 12px;
    background: rgba(30, 64, 175, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__name {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #e5e7eb;
    text-transform: capitalize;
  }

  &__id {
    font-size: 12px;
    color: rgba(148, 163, 184, 0.7);
    font-family: monospace;
  }

  &__types {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  &__type-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(56, 189, 248, 0.2);
    color: rgba(56, 189, 248, 1);
    font-size: 11px;
    font-weight: 500;
    text-transform: capitalize;
    border: 1px solid rgba(56, 189, 248, 0.4);
  }

  &__stats {
    display: flex;
    gap: 16px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__stat-label {
    font-size: 11px;
    color: rgba(148, 163, 184, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  &__stat-value {
    font-size: 14px;
    color: #e5e7eb;
    font-weight: 600;
  }
}
</style>
