<script lang="ts" setup>
withDefaults(
  defineProps<{
    static?: boolean;
  }>(),
  {
    static: false
  }
)
</script>

<template>
  <div
    class="loader"
    :class="{
      static: static,
    }"
  >
    <progress-spinner class="!size-[50px]" stroke-width="8" animation-duration=".5s" />
  </div>
</template>

<style scoped lang="scss">
.loader {
  @apply flex items-center justify-center;
  @apply p-4;

  &:not(.static) {
    @apply absolute top-0 left-0 size-full;
    @apply bg-surface-700 bg-opacity-40;
    z-index: 1003; // z-index used to overlap multi-select component
  }
}
</style>
