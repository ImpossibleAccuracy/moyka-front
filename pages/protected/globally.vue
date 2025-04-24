<template>
  <div class="text-center flex flex-col">
    <h1 class="text-2xl font-bold">
      I'm a secret!
    </h1>
    <h3>
      My protection works via an <a
        href="https://sidebase.io/nuxt-auth/application-side/protecting-pages#global-middleware"
        target="_blank"
      >global
        middleware</a>.
    </h3>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: true
})
</script>
