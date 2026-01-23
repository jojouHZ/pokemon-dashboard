<template>
  <span class="pokemon-type-tag" :style="getTypeStyle(type)">
    {{ capitalize(type) }}
  </span>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PokemonTypeName } from '@/types/pokemon'

defineProps<{
  type: string
}>()

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
    '--type-color': typeColors[type.toLowerCase() as keyof typeof typeColors] || '#999',
  }
}
</script>

<style scoped lang="scss">
.pokemon-type-tag {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: var(--type-color);
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  text-transform: capitalize;
  white-space: nowrap;
  display: inline-block;
}
</style>
