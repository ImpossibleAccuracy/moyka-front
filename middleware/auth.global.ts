export default defineNuxtRouteMiddleware((to) => {
  const { account, isLoggedIn } = useAppAuth()

  if (to.meta?.auth === true && !isLoggedIn.value) {
    return navigateTo('/auth/login')
  } else if (!!to.meta?.role && to.meta.role !== account.value?.role) {
    return navigateTo('/')
  }
})
