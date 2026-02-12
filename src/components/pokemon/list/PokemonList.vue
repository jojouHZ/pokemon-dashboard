<template>
  <div class="pokemon-list">
    <!-- Loading state -->
    <div v-if="props.loading" class="pokemon-list__loading">
      <RetryIndicator v-if="listStore.isRetrying" :current-attempt="listStore.currentAttempt" />
      <template v-else>
        <LoadingSpinner />
        <p>Loading Pokémon...</p>
      </template>
    </div>

    <!-- Error state -->
    <div v-else-if="props.error" class="pokemon-list__error">
      <p>❌ {{ listStore.error }}</p>
      <button @click="listStore.loadPokemonList()" class="pokemon-list__retry">Try Again</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!props.items.length" class="pokemon-list__empty">
      <p>No Pokémon found</p>
    </div>

    <!-- Main grid -->
    <div v-else class="pokemon-list__content">
      <div class="pokemon-list__grid">
        <PokemonListItem
          v-for="pokemon in props.items"
          :key="pokemon.id"
          :pokemon="pokemon"
          @select="emit('select', pokemon)"
        />
      </div>
    </div>
    <!-- Background loading progress (after initial load) -->
    <ProgressBar
      v-if="listStore.isBackgroundLoading && props.items.length > 0"
      :progress="listStore.backgroundLoadingProgress"
      :label="`Loading Pokémon... ${listStore.backgroundLoadingProgress}%`"
      :visible="progressBarVisible"
      @close="handleCloseProgress"
    />
    <InfiniteScrollLoader v-if="showInfiniteLoader" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBreakpoint } from '@/composables'
import type { PokemonListItem as PokemonListItemType } from '@/types/pokemon'
import { usePokemonListStore } from '@/stores/pokemonListStore'
import { PokemonListItem } from '@/components/pokemon/list'
import {
  LoadingSpinner,
  RetryIndicator,
  ProgressBar,
  InfiniteScrollLoader,
} from '@/components/pokemon/ui'

const listStore = usePokemonListStore()

interface Props {
  items: readonly PokemonListItemType[]
  loading: boolean
  error: string | null
}

interface Emits {
  (event: 'retry'): void
  (event: 'select', pokemon: PokemonListItemType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const progressBarVisible = ref(true)

const handleCloseProgress = () => {
  progressBarVisible.value = false
}

const { type: breakpoint } = useBreakpoint()

const showInfiniteLoader = computed(() => {
  const isMobileOrTablet = breakpoint.value !== 'desktop'
  const hasMore = listStore.loadedCount < listStore.filteredPokemon.length
  const hasItems = props.items.length > 0

  return isMobileOrTablet && hasMore && hasItems
})
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
</style>
