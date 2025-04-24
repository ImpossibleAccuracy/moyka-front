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
          Общий список заказов
        </h3>
      </div>

      <div class="orders mt-4 flex flex-col gap-2">
        <app-loader v-if="!orders || isLoading" />

        <template v-if="!!orders && orders.length > 0">
          <order-card
            v-for="item in orders"
            :key="item.id"
            :order="item.order"
            @contextmenu="onRightClick($event, item)"
          >
            <template #start>
              <div class="flex">
                <div class="w-full flex flex-wrap gap-2">
                  <Chip :label="item.creator.fullName" icon="pi pi-user" />
                  <Chip :label="item.service.name" icon="pi pi-box" />
                </div>

                <Button
                  variant="text"
                  icon="pi pi-ellipsis-v"
                  aria-label="Menu"
                  @click="onMenuClick($event, item)"
                />
              </div>
            </template>

            <template #end>
              <div class="mt-2">
                <span class="text-sm font-bold">Контакты:</span>
                <ul class="list-disc ps-6">
                  <li v-for="contact in item.order.contacts" :key="contact">
                    {{ contact }}
                  </li>
                </ul>
              </div>
            </template>
          </order-card>

          <Menu ref="popupMenu" :model="contextMenuItems" :popup="true" />
          <ContextMenu ref="contextMenu" :model="contextMenuItems" />

          <Dialog
            v-model:visible="isCancelDialogVisible"
            modal
            header="Укажите причину отмены"
            :style="{ width: '25rem' }"
          >
            <InputText v-model="cancelReason" class="w-full flex-auto" autocomplete="off" />

            <div class="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                label="Отмена"
                severity="secondary"
                @click="isCancelDialogVisible = false"
              />
              <Button
                type="button"
                label="Отменить заказ"
                @click="onCancelOrder()"
              />
            </div>
          </Dialog>
        </template>

        <div v-else-if="!!orders" class="my-8 flex justify-center">
          <span>Заказы - это миф 🤡👍😀</span>
        </div>
      </div>
    </app-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: true
})

interface OrderFull {
    order: {
        id: number;
        accountId: number;
        serviceId: number;
        address: string;
        contacts: string;
        deliveryDate: string;
        paymentType: string;
        status: string;
        rejectReason: string;
    },
    creator: {
        id: number,
        username: string,
        firstName: string,
        middleName: string,
        lastName: string,
        email: string,
        phone: string,
        role: string
    },
    service: {
        id: number;
        name: string;
    }
}

const { account, logout } = useAppAuth()

const isCancelDialogVisible = ref(false)
const cancelReason = ref('')

const popupMenu = ref()
const contextMenu = ref()
const selectedOrder = ref<OrderFull>()
const contextMenuItems = ref([
  {
    label: 'Изменить статус',
    items: [
      {
        label: 'В работе',
        command: async () => {
          await updateOrderStatus(selectedOrder.value.order.id, 'В работе', null)
          await loadOrders()
        }
      },
      {
        label: 'Выполнено',
        command: async () => {
          await updateOrderStatus(selectedOrder.value.order.id, 'Выполнено', null)
          await loadOrders()
        }
      },
      {
        label: 'Отменено',
        command: () => {
          isCancelDialogVisible.value = true
        }
      }
    ]
  }
])

const onMenuClick = (event, item) => {
  selectedOrder.value = item
  popupMenu.value.toggle(event)
}

const onRightClick = (event, item) => {
  selectedOrder.value = item
  contextMenu.value.show(event)
}

const isLoading = ref(true)
const ordersList = ref<Array<OrderFull>>()
const orders = computed(() => ordersList.value?.map((x) => {
  const date = new Date(x.order.deliveryDate)
  return {
    ...x,
    creator: {
      ...x.creator,
      fullName: `${x.creator.firstName} ${x.creator.middleName} ${x.creator.lastName}`
    },
    order: {
      ...x.order,
      contacts: x.order.contacts
        .split(',')
        .map(s => s.trim())
        .filter(s => !!s),
      deliveryDate: date,
      deliveryDateFormatted: `${date.getFullYear()}.${date.getMonth().toString().padStart(2, '0')}.${date.getDay().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}.${date.getMinutes().toString().padStart(2, '0')}`
    }
  }
}))

onMounted(() => {
  loadOrders()
})

async function loadOrders () {
  isLoading.value = true
  ordersList.value = await useApiCall<Array<OrderFull>>('/order/all')
  isLoading.value = false
}

async function onCancelOrder () {
  isCancelDialogVisible.value = false

  await updateOrderStatus(selectedOrder.value.order.id, 'Отменено', cancelReason.value)
  await loadOrders()

  cancelReason.value = ''
}

async function updateOrderStatus (orderId: Number, status: string, rejectReason: string | null) {
  isLoading.value = true
  await useApiCall('/order/update-status', {
    method: 'PUT',
    body: {
      order_id: orderId,
      status,
      reject_reason: rejectReason
    }
  })
  isLoading.value = false
}
</script>
