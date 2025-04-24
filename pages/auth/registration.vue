<template>
  <app-card class="md:min-w-[550px] max-sm:!contents" :loading="isLoading">
    <form class="form col gap-2" @submit.prevent="onSubmit">
      <h1 class="text-5xl font-black max-xl:text-center">
        Регистрация
      </h1>

      <input-validated
        v-model="email"
        :show-error="showErrors"
        :error="errors.email"
        :props="emailAttrs"
        class="mt-6"
        placeholder="Почта"
      />

      <input-validated
        v-model="username"
        :show-error="showErrors"
        :error="errors.username"
        :props="usernameAttrs"
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

      <input-validated
        v-model="phone"
        :show-error="showErrors"
        :error="errors.phone"
        :props="phoneAttrs"
        placeholder="Номер телефона"
      />

      <div class="flex gap-2 flex-wrap">
        <input-validated
          v-model="firstName"
          :show-error="showErrors"
          :error="errors.firstName"
          :props="firstNameAttrs"
          placeholder="Имя"
        />

        <input-validated
          v-model="lastName"
          :show-error="showErrors"
          :error="errors.lastName"
          :props="lastNameAttrs"
          placeholder="Фамилия"
        />

        <input-validated
          v-model="middleName"
          :show-error="showErrors"
          :error="errors.middleName"
          :props="middleNameAttrs"
          placeholder="Отчество"
        />
      </div>

      <span
        v-if="showErrors && !isLoading && isInvalidCredentialsErrorVisible"
        class="text-lg text-red-500 text-center whitespace-pre-line"
      >Учетная запись с такими данными уже существует.
      </span>

      {{ isLoading }}
      {{ isFormValid }}
      {{ showErrors }}
      {{ (!isFormValid && showErrors) }}
      {{ isLoading || (!isFormValid && showErrors) }}

      <Button rounded class="mt-6" type="submit" :disabled="isLoading || (!isFormValid && showErrors)">
        Зарегистрироваться
      </Button>

      <span class="mt-4 text-sm text-secondary text-end">
        <span>Уже зарегистрированы? </span>

        <nuxt-link class="ms-1 text-primary" to="/auth/login">Зарегистрироваться</nuxt-link>
      </span>
    </form>
  </app-card>
</template>

<script setup lang="ts">
import * as yup from 'yup'
import { useForm } from 'vee-validate'

definePageMeta({
  auth: false,
  title: 'Регистрация в "Мой Сам"',
  layout: 'auth'
})

const { signUp } = useAppAuth()

const validationSchema = yup.object({
  email: yup.string().email().min(4).required(),
  username: yup.string().min(4).required().trim(),
  password: yup.string().min(8).required().trim(),
  phone: yup.string().required().trim(),
  firstName: yup.string().required().trim(),
  middleName: yup.string().trim(),
  lastName: yup.string().required().trim()
})

const { defineField, values, errors } = useForm({
  validationSchema
})

const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [phone, phoneAttrs] = defineField('phone')
const [firstName, firstNameAttrs] = defineField('firstName')
const [middleName, middleNameAttrs] = defineField('middleName')
const [lastName, lastNameAttrs] = defineField('lastName')

const showErrors = ref(false)
const isLoading = ref(false)
const isInvalidCredentialsErrorVisible = ref(false)

const isFormValid = computed(() => {
  return (
    !!email.value &&
    !!username.value &&
    !!password.value &&
    !!phone.value &&
    !!firstName.value &&
    !!lastName.value &&
    !errors.value.email &&
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.phone &&
    !errors.value.firstName &&
    !errors.value.lastName
  )
})

async function onSubmit () {
  // Show errors only after first submit
  showErrors.value = true

  if (!isFormValid.value) { return }

  const e = Object.keys(errors.value)
  if (e.length > 0) { return }

  isLoading.value = true

  try {
    await signUp(
      values.email,
      values.username,
      values.password,
      values.phone,
      values.firstName,
      values.middleName,
      values.lastName
    )

    isInvalidCredentialsErrorVisible.value = false
  } catch (e) {
    console.error(e)
    isInvalidCredentialsErrorVisible.value = true
  }

  isLoading.value = false
}
</script>
