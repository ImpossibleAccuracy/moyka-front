<template>
  <div class="bg-window relative w-screen h-screen flex center px-8 py-4">
    <Button v-slot="slotProps" as-child>
      <RouterLink class="absolute top-4 left-8 max-lg:hidden" to="/" :class="slotProps.class">
        На главную
      </RouterLink>
    </Button>

    <div class="h-full flex items-center">
      <div class="min-w-[25vw]">
        <slot />
      </div>
    </div>
  </div>
</template>
