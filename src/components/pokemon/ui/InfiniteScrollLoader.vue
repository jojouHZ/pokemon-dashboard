<template>
  <div class="infinite-scroll-loader">
    <LoadingSpinner size="small" />
    <p class="infinite-scroll-loader__text">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  /** Loading text */
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: 'Loading more Pokémon...',
})
</script>

<style scoped lang="scss">
.infinite-scroll-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px;
  }
}

.infinite-scroll-loader__text {
  color: rgba(148, 163, 184, 0.8);
  font-size: 14px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }
}
</style>
