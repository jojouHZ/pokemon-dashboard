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
    <div v-else>
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
  gap: 32px;
}

.pokemon-list__loading,
.pokemon-list__error,
.pokemon-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: rgba(148, 163, 184, 0.8);
  font-size: 16px;
}

.pokemon-list__loading p,
.pokemon-list__error p,
.pokemon-list__empty p {
  margin: 0;
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

.pokemon-list__retry {
  margin-top: 16px;
  padding: 10px 20px;
  background: rgba(56, 189, 248, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.5);
  color: #56bdf8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.3);
  }
}

.pokemon-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 0;
}

.pokemon-list__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 10px 18px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: rgba(148, 163, 184, 0.95);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(56, 189, 248, 0.2);
    border-color: rgba(56, 189, 248, 0.6);
    color: #56bdf8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pagination-pages {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-page {
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: rgba(148, 163, 184, 0.9);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.2);
    border-color: rgba(56, 189, 248, 0.6);
    color: #56bdf8;
  }

  &--active {
    background: rgba(56, 189, 248, 0.4);
    border-color: rgba(56, 189, 248, 0.8);
    color: #56bdf8;
    font-weight: 600;
  }
}

.pagination-ellipsis {
  color: rgba(148, 163, 184, 0.6);
  font-size: 14px;
}

.pagination-info {
  text-align: center;
  font-size: 13px;
  color: rgba(148, 163, 184, 0.7);
  padding: 0 16px;
}
</style>
