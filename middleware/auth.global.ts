export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAppAuth()

  if (to.meta?.auth === true && !isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
})
