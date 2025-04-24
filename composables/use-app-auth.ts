export const useAppAuth = () => {
  const {
    signIn: signInRequest,
    signOut,
    signUp,
    data,
    status,
    token
  } = useAuth()

  const isLoggedIn = computed(() => !!data.value)
  const isLoading = computed(() => status.value === 'loading')

  return {
    token,
    account: data,
    status,
    isLoggedIn,
    isLoading,
    logout: () => {
      signOut({
        redirect: false
      }).then(() => {
        localStorage.clear()

        navigateTo('/')
      })
    },
    signIn: async (username: string, password: string) => {
      const route = useRoute()

      const callbackUrl = route.query.callbackUrl?.toString() ?? '/'

      await signInRequest(
        {
          username,
          password
        },
        {
          callbackUrl
        }
      )
    },
    signUp: (
      email: string,
      username: string,
      password: string,
      phone: string,
      firstName: string,
      middleName: string,
      lastName: string
    ) => {
      const route = useRoute()

      const callbackUrl = route.query.callbackUrl?.toString() ?? '/'

      return signUp(
        {
          email,
          username,
          password,
          phone,
          firstName,
          middleName,
          lastName
        },
        {
          callbackUrl
        }
      )
    }
  }
}
