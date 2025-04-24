export default defineNuxtRouteMiddleware((to) => {
  const { data } = useAuth()

  const isLoggedIn = data.value != null

  if (to.meta?.auth === true && !isLoggedIn) {
    return navigateTo('/auth/login')
  }
})
