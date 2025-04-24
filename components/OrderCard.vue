<script lang="ts" setup>
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

defineProps<{
  order: Order;
}>()
</script>

<template>
  <app-card>
    <slot name="start" />

    <div class="flex max-lg:flex-col items-center gap-4">
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

      <div class="w-full lg:max-w-[300px] flex flex-col lg:items-end gap-2">
        <div v-if="!!order.status" class="flex lg:flex-row-reverse gap-2 items-center">
          <i class="pi pi-flag" />
          <span class="whitespace-nowrap">{{ order.status }}</span>
        </div>

        <div v-if="!!order.rejectReason" class="flex flex-col lg:items-end">
          <span class="text-sm text-secondary">Причина:</span>
          <span class="text-sm font-medium lg:text-end">{{ order.rejectReason }}</span>
        </div>
      </div>
    </div>

    <slot name="end" />
  </app-card>
</template>
