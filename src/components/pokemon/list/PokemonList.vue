<template>
  <div class="pokemon-list">
    <!-- Loading state -->
    <div v-if="listStore.loading" class="pokemon-list__loading">
      <div class="spinner"></div>
      <p>Loading Pokémon...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="listStore.error" class="pokemon-list__error">
      <p>❌ {{ listStore.error }}</p>
      <button @click="listStore.loadPokemonList()" class="pokemon-list__retry">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="listStore.displayedPokemon.length === 0" class="pokemon-list__empty">
      <p>No Pokémon found</p>
    </div>

    <!-- Main grid -->
    <div v-else class="pokemon-list__content">
      <div class="pokemon-list__grid">
        <PokemonListItem
          v-for="pokemon in listStore.displayedPokemon"
          :key="pokemon.id"
          :pokemon="pokemon"
          @select="selectPokemon"
        />
      </div>

      <!-- Modern Pagination -->
      <div v-if="listStore.totalResults > listStore.itemsPerPage" class="pokemon-list__pagination">
        <button
          @click="listStore.setPage(listStore.currentPage - 1)"
          :disabled="listStore.currentPage === 1"
          class="pagination-btn pagination-btn--prev"
        >
          ← Previous
        </button>

        <div class="pagination-pages">
          <!-- First page -->
          <button
            v-if="listStore.currentPage > 3"
            @click="listStore.setPage(1)"
            class="pagination-page"
          >
            1
          </button>

          <!-- Ellipsis -->
          <span v-if="listStore.currentPage > 4" class="pagination-ellipsis">...</span>

          <!-- Around current page -->
          <button
            v-for="page in paginationRange"
            :key="page"
            @click="listStore.setPage(page)"
            :class="[
              'pagination-page',
              { 'pagination-page--active': page === listStore.currentPage },
            ]"
          >
            {{ page }}
          </button>

          <!-- Ellipsis -->
          <span v-if="listStore.currentPage < listStore.totalPages - 3" class="pagination-ellipsis"
            >...</span
          >

          <!-- Last page -->
          <button
            v-if="listStore.currentPage < listStore.totalPages - 2"
            @click="listStore.setPage(listStore.totalPages)"
            class="pagination-page"
          >
            {{ listStore.totalPages }}
          </button>
        </div>

        <button
          @click="listStore.setPage(listStore.currentPage + 1)"
          :disabled="listStore.currentPage === listStore.totalPages"
          class="pagination-btn pagination-btn--next"
        >
          Next →
        </button>
      </div>

      <!-- Page info -->
      <div class="pagination-info">
        Page {{ listStore.currentPage }} of {{ listStore.totalPages }} • Showing
        {{ (listStore.currentPage - 1) * listStore.itemsPerPage + 1 }}-{{
          Math.min(listStore.currentPage * listStore.itemsPerPage, listStore.totalResults)
        }}
        of {{ listStore.totalResults }} Pokémon
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonListItem as PokemonListItemType } from '@/types/pokemon'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { PokemonListItem } from '@/components/pokemon/list'
import { useRouter } from 'vue-router'

const listStore = usePokemonListStore()
const router = useRouter()

// Pagination range (e.g., [3, 4, 5, 6, 7] when current = 5)
const paginationRange = computed(() => {
  const range: number[] = []
  const start = Math.max(1, listStore.currentPage - 2)
  const end = Math.min(listStore.totalPages, listStore.currentPage + 2)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

const selectPokemon = (pokemon: PokemonListItemType) => {
  router.push(`/pokemon/${pokemon.name}`)
}
</script>

<style scoped lang="scss">
.pokemon-list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 14px;
  }
}
.pokemon-list__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pokemon-list__loading,
.pokemon-list__error,
.pokemon-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: rgba(148, 163, 184, 0.8);
  font-size: 15px;

  @media (max-width: 768px) {
    padding: 40px 16px;
    font-size: 14px;
  }
}

.pokemon-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 4px 0 8px;
}

.pokemon-list__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 16px 0 8px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 8px 14px;
  font-size: 13px;
}

.pagination-page {
  width: 36px;
  height: 36px;
  font-size: 13px;
}

.pagination-info {
  text-align: center;
  font-size: 12px;
  color: rgba(148, 163, 184, 0.7);
  padding: 0 12px 8px;

  @media (max-width: 768px) {
    font-size: 11px;
  }
}
</style>
