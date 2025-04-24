<template>
  <component
    :is="as"
    class="app-card"
    :class="{
      filled: variant == 'filled',
      outlined: variant == 'outlined',
      'gap-0': noGap,
      'gap-2': !noGap,
    }"
  >
    <div v-if="!!title || !!subtitle" class="flex flex-wrap gap-2 items-start">
      <div class="flex-1 col gap-2">
        <component :is="titleTag" v-if="!!title" :class="!!titleClass ? titleClass : 'text-2xl font-black'">
          {{ title }}
        </component>

        <component :is="subtitleTag" v-if="!!subtitle" class="text-sm">
          {{ subtitle }}
        </component>
      </div>
    </div>

    <div v-if="!!$slots['default']" class="flex-1 flex gap-[inherit]" :class="containerClass">
      <slot />
    </div>

    <slot v-if="loading" name="loader">
      <app-loader />
    </slot>
  </component>
</template>

<script setup lang="ts">
type CardType = 'filled' | 'outlined';

withDefaults(
  defineProps<{
    title?: string | null;
    subtitle?: string | null;
    titleClass?: string;
    variant?: CardType;
    loading?: boolean;
    containerClass?: string;
    noGap?: boolean;
    titleTag?: string;
    subtitleTag?: string;
    as?: string;
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    titleClass: undefined,
    variant: 'filled',
    loading: false,
    containerClass: 'flex-col',
    noGap: false,
    titleTag: 'span',
    subtitleTag: 'span',
    as: 'div'
  }
)

defineEmits<{
  'click:action': [];
}>()
</script>

<style lang="scss">
.app-card {
  @apply relative;
  @apply flex flex-col justify-between;
  @apply p-5 rounded-xl overflow-hidden;

  &.filled {
    @apply bg-surface-100 dark:bg-surface-900;

    & .app-card.filled {
      @apply bg-surface-300 dark:bg-surface-800;
      @apply bg-opacity-40 !important;
      @apply px-3 py-2;
    }
  }

  &.outlined {
    @apply border-[1px] border-surface-700;
  }
}
</style>
