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
        :search-query="searchQuery"
        :selected-type="selectedType"
        :total-results="totalResults"
        @search="setSearchQuery"
        @filter="setSelectedType"
        @clear="clearFilters"
      />

      <!-- Pokemon List -->
      <section class="pokemon-dashboard__content">
        <PokemonList
          :items="listStore.displayedPokemon"
          :loading="listStore.loading"
          :error="listStore.error"
          @retry="handleRetry"
          @select="handleSelectPokemon"
        />
      </section>
      <section>
        <!-- Pagination -->
        <PokemonPagination
          :current-page="listStore.currentPage"
          :total-pages="listStore.totalPages"
          :total-items="totalResults"
          :items-per-page="listStore.itemsPerPage"
          @page-change="listStore.setPage"
        ></PokemonPagination>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemonStore'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { PokemonControls, PokemonList, PokemonPagination } from '@/components/pokemon'
import { useResponsivePagination } from '@/composables/useResponsivePagination'
import { usePokemonFilters } from '@/composables/usePokemonFilters'
import type { PokemonListItem as PokemonListItemType } from '@/types/pokemon'

const router = useRouter()
const store = usePokemonStore()
const listStore = usePokemonListStore()
const { searchQuery, selectedType, totalResults, setSearchQuery, setSelectedType, clearFilters } =
  usePokemonFilters()

const handleRetry = () => {
  listStore.loadPokemonList()
}

const handleSelectPokemon = (pokemon: PokemonListItemType) => {
  router.push(`/pokemon/${pokemon.name}`)
}

const { itemsPerPage } = useResponsivePagination()

// Set initial value
listStore.setItemsPerPage(itemsPerPage.value)
// Watch for changes
watch(
  itemsPerPage,
  (newValue) => {
    listStore.setItemsPerPage(newValue)
  },
  { immediate: true },
)

const totalPokemonCount = computed(() => store.totalPokemonCount)
</script>

<style scoped lang="scss">
.pokemon-dashboard {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  flex-direction: column;
}

/* fix viewport for mobile/low-height toggle to scroll */
@media (min-width: 1024px) and (min-height: 750px) {
  .pokemon-dashboard {
    max-height: 100vh;
    overflow: hidden;
  }
}

.pokemon-dashboard__header {
  max-width: 1600px;
  margin: 0 auto 16px;
  padding: 24px 24px 12px;
}

.pokemon-dashboard__header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
}

.pokemon-dashboard__emoji {
  font-size: 2.5rem;
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 2.1rem;
  }
}

.pokemon-dashboard__header h1 {
  font-size: clamp(2.2rem, 3.5vw, 3rem);
  font-weight: 700;
  background: linear-gradient(135deg, #56bdf8 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.pokemon-dashboard__header p {
  color: rgba(148, 163, 184, 0.85);
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
}

.pokemon-dashboard__main {
  max-width: 1600px;
  width: 100%;
  align-self: center;
  padding: 0 16px 16px;
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Inner scroll for desktop */
.pokemon-dashboard__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) and (min-height: 750px) {
    overflow-y: auto;
    padding-right: 4px;
  }
}
</style>
