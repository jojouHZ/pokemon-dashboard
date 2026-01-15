<template>
  <div class="pokemon-list">
    <!-- Loading state -->
    <div v-if="loading" class="pokemon-list__loading">
      <div class="spinner"></div>
      <p>Loading Pokémon...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="pokemon-list__error">
      <p>❌ {{ error }}</p>
      <button @click="fetchPokemonListInternal" class="pokemon-list__retry">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="displayedPokemon.length === 0" class="pokemon-list__empty">
      <p>No Pokémon found</p>
    </div>

    <!-- Main grid -->
    <div v-else>
      <div class="pokemon-list__grid">
        <PokemonListItemComponent
          v-for="pokemon in displayedPokemon"
          :key="pokemon.id"
          :pokemon="pokemon"
          @select="selectPokemon"
        />
      </div>

      <!-- Modern Pagination -->
      <div v-if="totalCount > limit" class="pokemon-list__pagination">
        <button
          @click="changePage(-1)"
          :disabled="currentPage === 1"
          class="pagination-btn pagination-btn--prev"
        >
          ← Previous
        </button>

        <div class="pagination-pages">
          <!-- First page -->
          <button v-if="currentPage > 3" @click="goToPage(1)" class="pagination-page">1</button>

          <!-- Ellipsis -->
          <span v-if="currentPage > 4" class="pagination-ellipsis">...</span>

          <!-- Around current page -->
          <button
            v-for="page in paginationRange"
            :key="page"
            @click="goToPage(page)"
            :class="['pagination-page', { 'pagination-page--active': page === currentPage }]"
          >
            {{ page }}
          </button>

          <!-- Ellipsis -->
          <span v-if="currentPage < totalPages - 3" class="pagination-ellipsis">...</span>

          <!-- Last page -->
          <button
            v-if="currentPage < totalPages - 2"
            @click="goToPage(totalPages)"
            class="pagination-page"
          >
            {{ totalPages }}
          </button>
        </div>

        <button
          @click="changePage(1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn pagination-btn--next"
        >
          Next →
        </button>
      </div>

      <!-- Page info -->
      <div class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }} • Showing {{ (currentPage - 1) * limit + 1 }}-{{
          Math.min(currentPage * limit, totalCount)
        }}
        of {{ totalCount }} Pokémon
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PokemonListItem } from '@/types/pokemon'
import { fetchPokemonList, fetchPokemonSummary } from '@/services/pokemonApiClient'
import { PokemonListItemComponent } from '@/components/pokemon'
import { useRouter } from 'vue-router'

const loading = ref(false)
const error = ref<string | null>(null)
const pokemonList = ref<PokemonListItem[]>([])
const totalCount = ref(0)

// 20 pokemon per page (5-6 cards per row on desktop)
const limit = 20
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(totalCount.value / limit))
const displayedPokemon = computed(() => pokemonList.value)

// Pagination range (e.g., [3, 4, 5, 6, 7] wenn current = 5)
const paginationRange = computed(() => {
  const range: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

const fetchPokemonListInternal = async () => {
  loading.value = true
  error.value = null

  try {
    const offset = (currentPage.value - 1) * limit
    const response = await fetchPokemonList(limit, offset)

    totalCount.value = response.count

    pokemonList.value = await Promise.all(
      response.results.map(async (item: { name: string; url: string }) => {
        const summary = await fetchPokemonSummary(item.url)
        return summary
      }),
    )
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load Pokémon'
    pokemonList.value = []
  } finally {
    loading.value = false
  }
}

const changePage = (delta: number) => {
  const newPage = currentPage.value + delta
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
    fetchPokemonListInternal()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page: number) => {
  if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchPokemonListInternal()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const router = useRouter()

const selectPokemon = (pokemon: PokemonListItem) => {
  router.push(`/pokemon/${pokemon.name}`)
}

onMounted(() => {
  fetchPokemonListInternal()
})
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

// Grid: 5-6 columns on desktop, responsive smaller
.pokemon-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 0;
}

// Modern Pagination
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
