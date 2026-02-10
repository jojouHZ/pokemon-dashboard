<template>
  <div class="pokemon-list-item" @click="emit('select', pokemon)">
    <div class="pokemon-list-item__image-wrapper">
      <!-- Skeleton loader -->
      <div v-if="!imageLoaded && !imageError" class="pokemon-list-item__skeleton"></div>

      <!-- Image -->
      <img
        :src="pokemon.image"
        :alt="pokemon.name"
        class="pokemon-list-item__image"
        :class="{ 'pokemon-list-item__image--loaded': imageLoaded }"
        loading="lazy"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- Error fallback -->
      <div v-if="imageError" class="pokemon-list-item__error">?</div>
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
import { ref } from 'vue'
import type { PokemonListItem as PokemonListItemType } from '@/types/pokemon'

interface Props {
  pokemon: PokemonListItemType
}

interface Emits {
  (event: 'select', pokemon: PokemonListItemType): void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const imageLoaded = ref(false)
const imageError = ref(false)

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}

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
  padding: 12px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.25);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  will-change: transform;
  transform: translateZ(0); // Force GPU layer
  backface-visibility: hidden;
  isolation: isolate;

  &:hover {
    background: rgba(30, 64, 175, 0.25);
    border-color: rgba(56, 189, 248, 0.5);
    transform: translateY(-4px) translateZ(0);
    box-shadow: 0 12px 32px rgba(30, 64, 175, 0.3);
  }

  &:active {
    transform: translateY(-1px) translateZ(0);
  }

  @media (max-width: 768px) {
    padding: 10px;
    gap: 6px;
  }
}

.pokemon-list-item__image-wrapper {
  width: 100%;
  height: 90px;
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 80px;
  }
}

.pokemon-list-item__image {
  width: 64px;
  height: 64px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
  }
}

.pokemon-list-item__name {
  font-size: 15px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.pokemon-list-item__skeleton {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(148, 163, 184, 0.1) 25%,
    rgba(148, 163, 184, 0.2) 50%,
    rgba(148, 163, 184, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.pokemon-list-item__image {
  opacity: 0;
  transition: opacity 0.3s ease-in;

  &--loaded {
    opacity: 1;
  }
}

.pokemon-list-item__error {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: rgba(148, 163, 184, 0.4);
  font-weight: bold;

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    font-size: 28px;
  }
}
</style>
