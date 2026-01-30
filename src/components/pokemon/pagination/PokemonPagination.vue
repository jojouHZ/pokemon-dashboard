<template>
  <section v-if="totalPages > 1" class="pokemon-pagination">
    <!-- Previous Button -->
    <button
      @click="emit('page-change', currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn pagination-btn--prev"
    >
      ← Previous
    </button>

    <!-- Page Numbers -->
    <div class="pagination-pages">
      <!-- First page -->
      <button v-if="currentPage > 3" @click="emit('page-change', 1)" class="pagination-page">
        1
      </button>

      <!-- Ellipsis -->
      <span v-if="currentPage > 4" class="pagination-ellipsis">...</span>

      <!-- Around current page -->
      <button
        v-for="page in paginationRange"
        :key="page"
        @click="emit('page-change', page)"
        :class="['pagination-page', { 'pagination-page--active': page === currentPage }]"
      >
        {{ page }}
      </button>

      <!-- Ellipsis -->
      <span v-if="currentPage < totalPages - 3" class="pagination-ellipsis">...</span>

      <!-- Last page -->
      <button
        v-if="currentPage < totalPages - 2"
        @click="emit('page-change', totalPages)"
        class="pagination-page"
      >
        {{ totalPages }}
      </button>
    </div>

    <!-- Next Button -->
    <button
      @click="emit('page-change', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn pagination-btn--next"
    >
      Next →
    </button>
  </section>

  <!-- Page Info -->
  <div v-if="totalPages > 0" class="pagination-info">
    Page {{ currentPage }} of {{ totalPages }} • Showing {{ startIndex }}-{{ endIndex }} of
    {{ totalItems }} Pokémon
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface Emits {
  (event: 'page-change', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Pagination range (e.g., [3, 4, 5, 6, 7] when current = 5)
const paginationRange = computed(() => {
  const range: number[] = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)

  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
})

const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)

const endIndex = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>

<style scoped lang="scss">
.pokemon-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 16px 0 8px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 8px 14px;
  background: rgba(30, 64, 175, 0.2);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 8px;
  color: rgba(56, 189, 248, 0.9);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(30, 64, 175, 0.35);
    border-color: rgba(56, 189, 248, 0.5);
    color: rgba(56, 189, 248, 1);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pagination-pages {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-page {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(30, 64, 175, 0.15);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 6px;
  color: rgba(148, 163, 184, 0.9);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(30, 64, 175, 0.3);
    border-color: rgba(56, 189, 248, 0.4);
    color: rgba(56, 189, 248, 0.95);
  }

  &--active {
    background: rgba(56, 189, 248, 0.25);
    border-color: rgba(56, 189, 248, 0.5);
    color: rgba(56, 189, 248, 1);
    font-weight: 600;
  }
}

.pagination-ellipsis {
  color: rgba(148, 163, 184, 0.5);
  font-size: 14px;
  padding: 0 4px;
  user-select: none;
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
