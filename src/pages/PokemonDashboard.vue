<template>
  <div class="pokemon-dashboard">
    <header class="pokemon-dashboard__header">
      <div class="pokemon-dashboard__header-title">
        <span class="pokemon-dashboard__emoji">🐾</span>
        <h1>Pokémon Dashboard</h1>
        <p>Explore all {{ totalPokemonCount }} Pokémon</p>
      </div>
    </header>

    <main class="pokemon-dashboard__main">
      <!-- Search & Filter Controls -->
      <PokemonControls
        :search-query="listStore.searchQuery"
        :selected-type="listStore.selectedType"
        :total-results="listStore.totalResults"
        @search="listStore.setSearchQuery"
        @filter="listStore.setSelectedType"
        @clear="listStore.clearFilters"
      />

      <!-- Pokemon List -->
      <PokemonList />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemonStore'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { PokemonControls, PokemonList } from '@/components/pokemon'

const store = usePokemonStore()
const listStore = usePokemonListStore()

const totalPokemonCount = computed(() => store.totalPokemonCount || 1292)
</script>

<style scoped lang="scss">
.pokemon-dashboard {
  width: 100%;
  padding: 32px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.pokemon-dashboard__header {
  max-width: 1600px;
  margin: 0 auto 40px;
}

.pokemon-dashboard__header h1 {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #56bdf8 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.pokemon-dashboard__header p {
  color: rgba(148, 163, 184, 0.85);
  font-size: 1.1rem;
  margin: 0;
}

.pokemon-dashboard__main {
  max-width: 1600px;
  margin: 0 auto;
}

.pokemon-dashboard__header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pokemon-dashboard__emoji {
  font-size: 2.5rem;
  display: inline-block;
}
</style>
