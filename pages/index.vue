<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-[3em] font-bold ">
      Добро пожаловать на <span class="text-primary">Мой Не Сам!</span>
    </h3>

    <p>
      Кампания «Мой Не Сам» — это профессиональный сервис уборки жилых и производственных помещений, который избавляет
      вас от хлопот, связанных с наведением порядка.
      <br>
      Мы берем на себя всю рутинную работу: от ежедневной поддержки чистоты до генеральной уборки и клининга после
      ремонта. Наша команда использует современное оборудование и экологичные средства, чтобы обеспечить безупречный
      результат без вашего участия.
      <br>

      С «Мой Не Сам» вам не придется тратить время и силы на уборку — просто наслаждайтесь чистотой и комфортом! 🧹✨
    </p>

    <app-card v-if="isLoggedIn" container-class="flex items-center">
      <h3>Добро пожаловать, <span class="text-primary">{{ account.username }}</span>!</h3>

      <div class="spacer" />

      <Button v-if="account.role == 'Admin'" v-slot="slotProps" as-child>
        <RouterLink :to="{ name: 'admin' }" :class="slotProps.class">
          Админка
        </RouterLink>
      </Button>
      <Button v-slot="slotProps" as-child variant="text">
        <RouterLink :to="{ name: 'profile' }" :class="slotProps.class">
          Личный кабинет
        </RouterLink>
      </Button>
    </app-card>

    <Button v-else v-slot="slotProps" as-child>
      <RouterLink class="mt-10" :to="{ name: 'auth-login' }" :class="slotProps.class">
        Стать нашим клиентом!
      </RouterLink>
    </Button>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ auth: false })
const { isLoggedIn, account } = useAppAuth()
</script>

<style scoped>
pre {
  @apply bg-gray-800 text-white p-3 my-3 rounded shadow overflow-x-auto;
}

pre span {
  @apply text-green-400;
}
</style>
