<template>
  <div class="retry-indicator">
    <LoadingSpinner size="medium" />
    <p class="retry-indicator__text">Retrying... ({{ currentAttempt }}/{{ maxAttempts }})</p>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  /** Current retry attempt number */
  currentAttempt: number
  /** Maximum number of attempts */
  maxAttempts?: number
}

withDefaults(defineProps<Props>(), {
  maxAttempts: 3,
})
</script>

<style scoped lang="scss">
.retry-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 24px;

  @media (max-width: 768px) {
    padding: 40px 16px;
    gap: 12px;
  }
}

.retry-indicator__text {
  color: rgba(251, 191, 36, 0.9);
  font-weight: 500;
  font-size: 15px;
  margin: 0;
  animation: pulse 1.5s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
