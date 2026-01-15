<template>
  <div class="pokemon-list-item" @click="$emit('select', pokemon)">
    <div class="pokemon-list-item__image-wrapper">
      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="pokemon-list-item__image"
        loading="lazy"
      />
    </div>

    <div class="pokemon-list-item__content">
      <div class="pokemon-list-item__id">#{{ String(pokemon.id).padStart(3, '0') }}</div>
      <div class="pokemon-list-item__name">{{ formatName(pokemon.name) }}</div>

      <div class="pokemon-list-item__types">
        <span
          v-for="type in pokemon.types.slice(0, 2)"
          :key="type"
          class="pokemon-list-item__type"
          :style="getTypeStyle(type)"
        >
          {{ capitalize(type) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PokemonListItem } from '@/types/pokemon'

defineProps<{
  pokemon: PokemonListItem
}>()

defineEmits<{
  select: [pokemon: PokemonListItem]
}>()

const formatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getTypeStyle = (type: string) => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  }

  return {
    '--type-color': typeColors[type as keyof typeof typeColors] || '#999',
  }
}
</script>

<style scoped lang="scss">
.pokemon-list-item {
  cursor: pointer;
  border-radius: 14px;
  padding: 14px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.25);
  transition: all 0.25s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:hover {
    background: rgba(30, 64, 175, 0.25);
    border-color: rgba(56, 189, 248, 0.5);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.3);
  }

  &:active {
    transform: translateY(-1px);
  }
}

.pokemon-list-item__image-wrapper {
  width: 100%;
  height: 100px;
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokemon-list-item__image {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.pokemon-list-item__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pokemon-list-item__id {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.65);
  font-family: 'Courier New', monospace;
  align-self: flex-end;
  font-weight: 500;
}

.pokemon-list-item__name {
  font-size: 16px;
  font-weight: 600;
  color: #e5e7eb;
  text-align: center;
  line-height: 1.2;
}

.pokemon-list-item__types {
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
}

.pokemon-list-item__type {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--type-color);
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  text-transform: capitalize;
  white-space: nowrap;
}
</style>
