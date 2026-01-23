<template>
  <div class="pokemon-detail-page">
    <div class="pokemon-detail-page__container">
      <!-- Loading state -->
      <div v-if="store.loading" class="pokemon-detail__loading">
        <div class="spinner"></div>
        <p>Loading Pokémon...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="store.error" class="pokemon-detail__error">
        <p>❌ {{ store.error }}</p>
      </div>

      <!-- Content -->
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

      <!-- Empty state -->
      <div v-else class="pokemon-detail__empty">
        <p>No Pokémon loaded</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
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
const route = useRoute()

// Compute stats map for archetype detection
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

// Compute archetype based on stats
const archetype = computed(() => {
  return store.current ? detectArchetype(statsMap.value) : null
})

// Load pokemon from route params
onMounted(() => {
  const pokemonName = route.params.name as string

  if (pokemonName) {
    store.loadPokemon(pokemonName)
  } else {
    console.warn('No pokemon name provided in route params')
  }
})
</script>

<style scoped lang="scss">
.pokemon-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.pokemon-detail-page__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.pokemon-detail__loading,
.pokemon-detail__error,
.pokemon-detail__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: rgba(148, 163, 184, 0.8);
  font-size: 16px;
  text-align: center;

  p {
    margin: 0;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(148, 163, 184, 0.2);
  border-top: 3px solid #56bdf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pokemon-detail__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pokemon-detail__stats-row {
  display: flex;
  gap: 20px;
  min-height: 250px;
}

.pokemon-detail__info-row {
  display: flex;
  gap: 20px;
  height: 140px;
}
</style>
