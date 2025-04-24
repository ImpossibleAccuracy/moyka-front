<template>
  <div class="col gap-1">
    <InputGroup>
      <component
        :is="password ? Password : InputText"
        v-model="value"
        v-bind="props"
        :class="{
          '!border-red-400': isError,
        }"
        :variant="variant"
        :invalid="isError"
        :feedback="feedback"
        :placeholder="placeholder"
      />
    </InputGroup>

    <span v-if="isError" class="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

const props = withDefaults(
  defineProps<{
    password?: boolean;
    feedback?: boolean;
    showError: boolean;
    error?: string;
    props: unknown;
    placeholder: string;
    variant?: 'filled' | 'outlined' | undefined;
  }>(),
  {
    password: false,
    feedback: false,
    error: undefined,
    variant: undefined
  }
)

const value = defineModel<string>()

const isError = computed(() => props.showError && !!props.error)
</script>

<style lang="scss" scoped>
.error {
  @apply text-xs font-medium text-red-500;

  &::first-letter {
    @apply capitalize;
  }
}
</style>
