<template>
  <div class="pokemon-detail">
    <div v-if="store.loading" class="pokemon-detail__loading">Loading...</div>

    <div v-else-if="store.error" class="pokemon-detail__error">
      {{ store.error }}
    </div>

    <div v-else-if="store.current" class="pokemon-detail__content">
      <PokemonDetailCard :pokemon="store.current" />

      <div class="pokemon-detail__stats-row">
        <PokemonStatsPanel :stats="store.current.stats" />
        <PokemonArchetypeTile :archetype="archetype" />
      </div>

      <div class="pokemon-detail__info-row">
        <PokemonDescriptionTile :species="store.species" />
      </div>
    </div>

    <div v-else class="pokemon-detail__empty">No Pokemon loaded</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { detectArchetype } from '@/data/pokemonStatsGuide'
import type { PokemonStat } from '@/types/pokemon'
import {
  PokemonDetailCard,
  PokemonStatsPanel,
  PokemonArchetypeTile,
  PokemonDescriptionTile,
} from '@/components/pokemon'

const store = usePokemonStore()

const statsMap = computed(() => {
  const map: Record<string, number> = {}
  const current = store.current

  if (!current) return map

  store.current?.stats?.forEach((s: PokemonStat) => {
    const key = s.label.toLowerCase().replace(' ', '-')
    map[key] = s.value
  })

  return map
})

const archetype = computed(() => {
  const result = store.current ? detectArchetype(statsMap.value) : null

  return result
})

onMounted(() => {
  store.loadPokemon('pikachu')
})
</script>

<style scoped lang="scss">
.pokemon-detail {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__stats-row {
    display: flex;
    gap: 16px;
    min-height: 200px; // фиксированная высота для рядов
  }
}
.pokemon-detail__info-row {
  display: flex;
  gap: 16px;
  height: 120px;
}
</style>
