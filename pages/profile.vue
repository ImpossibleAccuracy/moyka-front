<template>
  <div class="flex flex-col gap-4">
    <app-card container-class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        Вы - <span class="text-primary">{{ account.username }}</span>
      </h1>

      <Button @click="logout">
        Выйти из аккаунта
      </Button>
    </app-card>

    <app-card>
      <div class="flex justify-between">
        <h3 class="text-[1.4em] font-black">
          Ваши заказы
        </h3>

        <Button v-slot="slotProps" type="text" as-child size="small" variant="text">
          <RouterLink to="/orders/new" :class="slotProps.class">
            Новый заказ
          </RouterLink>
        </Button>
      </div>

      <div class="orders mt-4 flex flex-col gap-2">
        <template v-if="orders.length > 0">
          <app-card v-for="order in orders" :key="order.id" container-class="flex items-center gap-4">
            <div class="w-full flex flex-col gap-2">
              <div class="flex gap-2 items-center">
                <i class="pi pi-building" />
                {{ order.address }}
              </div>

              <div class="flex gap-2 items-center">
                <i class="pi pi-clock" />
                <span>{{ order.deliveryDateFormatted }}</span>
              </div>

              <div class="flex gap-2 items-center">
                <i class="pi pi-wallet" />
                <span>{{ order.paymentType }}</span>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center">
                <span class="whitespace-nowrap">{{ order.status }}</span>
                <i class="pi pi-flag" />
              </div>

              <div v-if="!!order.rejectReason" class="flex flex-col items-end">
                <span class="text-sm text-secondary">Причина:</span>
                <span class="text-sm font-medium">{{ order.rejectReason }}</span>
              </div>
            </div>
          </app-card>
        </template>

        <div v-else class="my-8 flex justify-center">
          <span>У вас нет заказов</span>
        </div>
      </div>
    </app-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: true
})

const { account, logout } = useAppAuth()

interface Order {
  id: number;
  serviceId: number;
  address: string;
  contacts: string;
  deliveryDate: string;
  paymentType: string;
  status: string;
  rejectReason: string;
}

const ordersList = await useApiCall<Array<Order>>('/order/my')
const orders = computed(() => ordersList?.map((x) => {
  const date = new Date(x.deliveryDate)
  return {
    ...x,
    deliveryDate: date,
    deliveryDateFormatted: `${date.getFullYear()}.${date.getMonth().toString().padStart(2, '0')}.${date.getDay().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}.${date.getMinutes().toString().padStart(2, '0')}`
  }
}))

</script>
