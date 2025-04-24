<template>
  <app-card class="md:min-w-[550px] max-sm:!contents" :loading="isLoading">
    <form class="form col gap-2" @submit.prevent="onSubmit">
      <h1 class="text-5xl font-black max-xl:text-center">
        Добро пожаловать
      </h1>

      <h3 class="text-lg text-secondary max-xl:text-center">
        Пожалуйста, введите свои данные
      </h3>

      <input-validated
        v-model="email"
        :show-error="showErrors"
        :error="errors.email"
        :props="emailAttrs"
        class="mt-6"
        placeholder="Логин"
      />

      <input-validated
        v-model="password"
        :show-error="showErrors"
        :error="errors.password"
        :props="passwordAttrs"
        password
        placeholder="Пароль"
      />

      <span
        v-if="showErrors && !isLoading && isInvalidCredentialsErrorVisible"
        class="text-lg text-red-500 text-center whitespace-pre-line"
      >Учетная запись не найдена.
      </span>

      <Button rounded class="mt-6" type="submit" :disabled="isLoading">
        Войти
      </Button>

      <span class="mt-4 text-sm text-secondary text-end">
        <span>Еще не зарегистрированы?</span>

        <nuxt-link class="ms-1 text-primary" to="/auth/registration">Зарегистрируйтесь сейчас</nuxt-link>
      </span>
    </form>
  </app-card>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useForm } from 'vee-validate'

definePageMeta({
  auth: false,
  title: 'Вход в "Мой Не Сам"',
  layout: 'auth'
})

const { signIn } = useAppAuth()

const validationSchema = yup.object({
  email: yup.string().min(4).required(),
  password: yup.string().min(8).required().trim()
})

const { defineField, values, errors } = useForm({
  validationSchema
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const showErrors = ref(false)
const isLoading = ref(false)
const isInvalidCredentialsErrorVisible = ref(false)

async function onSubmit () {
  // Show errors only after first submit
  showErrors.value = true

  if (
    !(
      !!email.value &&
      !!password.value &&
      !errors.value.email &&
      !errors.value.password
    )
  ) {
    return
  }

  isLoading.value = true

  try {
    await signIn(values.email, values.password)

    isInvalidCredentialsErrorVisible.value = false
  } catch (e) {
    console.error(e)
    isInvalidCredentialsErrorVisible.value = true
  }

  isLoading.value = false
}
</script>
