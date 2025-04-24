<template>
  <app-card :loading="!services || isLoading">
    <Button class="lg:absolute left-2" type="text" size="small" variant="text" @click="$router.go(-1)">
      Назад
    </Button>

    <div class="flex center">
      <h1 class="text-2xl font-black">
        Новый заказ
      </h1>
    </div>

    <app-loader v-if="!services" />

    <div v-else class="mt-6 flex flex-col gap-2">
      <input-validated
        v-model="address"
        :show-error="showErrors"
        :error="errors.address"
        :props="addressAttrs"
        placeholder="Адрес"
      />

      <input-validated
        v-model="contacts"
        :show-error="showErrors"
        :error="errors.contacts"
        :props="contactsAttrs"
        placeholder="Контакты"
      />

      <Select
        v-model="selectedService"
        :options="services"
        option-label="name"
        placeholder="Тип услуги"
        class="w-full"
      />

      <div class="contents lg:grid grid-cols-2 gap-2">
        <div class="flex flex-col">
          <DatePicker
            v-model="selectedDate"
            show-time
            hour-format="24"
            fluid
            placeholder="Время и дата доставки"
            :invalid="showErrors && (!selectedDate || selectedDate < new Date())"
            class="w-full"
          />

          <span v-if="showErrors && (!selectedDate || selectedDate < new Date())" class="text-red-500">Выбранное время
            невалидно</span>
        </div>

        <Select v-model="selectedPaymentType" :options="paymentTypes" placeholder="Тип оплаты" class="w-full" />
      </div>
    </div>

    <Button class="mt-4" :disabled="isLoading || (!isFormValid && showErrors)" @click="onSubmit">
      Создать заказ
    </Button>

    <Toast />
  </app-card>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  keepalive: false,
  auth: true
})

interface Service {
  id: number;
  name: string;
}

const { account } = useAppAuth()
const toast = useToast()
const router = useRouter()

const validationSchema = yup.object({
  address: yup.string().min(4).required(),
  contacts: yup.string().min(4).required().trim()
})

const { defineField, errors } = useForm({ validationSchema })

const showErrors = ref(false)
const [address, addressAttrs] = defineField('address')
const [contacts, contactsAttrs] = defineField('contacts')

const isLoading = ref(false)
const services = ref<Array<Service>>()
const paymentTypes = [
  'Наличные',
  'Банковская карта'
]

const selectedService = ref<Service>()
const selectedPaymentType = ref<string>()
const selectedDate = ref<Date>()

const isFormValid = computed(() => {
  return (
    !!address.value &&
    !!contacts.value &&
    !errors.value.address &&
    !errors.value.contacts &&
    !!selectedService.value &&
    !!selectedPaymentType.value &&
    (!!selectedDate.value && selectedDate.value > new Date())
  )
})

onMounted(async () => {
  services.value = await useApiCall<Array<Service>>('/order/services')

  if (!contacts.value) {
    contacts.value = account.value.email
  }
})

async function onSubmit () {
  // Show errors only after first submit
  showErrors.value = true

  if (!isFormValid.value) { return }

  isLoading.value = true

  try {
    await useApiCall('/order/create', {
      method: 'POST',
      body: {
        service_id: selectedService.value.id,
        address: address.value,
        contacts: contacts.value,
        delivery_date: selectedDate.value.getTime(),
        payment_type: selectedPaymentType.value
      }
    })

    await navigateTo('/profile', {
      replace: true
    })
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error!', detail: e.message, life: 3000 })
  }

  isLoading.value = false
}
</script>
