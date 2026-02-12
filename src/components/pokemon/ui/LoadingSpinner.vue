<template>
  <div class="spinner" :class="`spinner--${size}`"></div>
</template>

<script setup lang="ts">
interface Props {
  /** Spinner size: small (24px), medium (40px), large (56px) */
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
})
</script>

<style scoped lang="scss">
.spinner {
  border: 4px solid rgba(148, 163, 184, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &--small {
    width: 24px;
    height: 24px;
    border-width: 3px;
  }

  &--medium {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }

  &--large {
    width: 56px;
    height: 56px;
    border-width: 5px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
