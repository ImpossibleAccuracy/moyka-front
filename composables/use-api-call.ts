import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack/types'

export function useApiCall<T> (
  path: string,
  props?: NitroFetchOptions<NitroFetchRequest>
) {
  const config = useRuntimeConfig()

  const { token } = useAppAuth()

  return $fetch<T>(path, {
    baseURL: config.public.api.origin,
    headers: {
      Authorization: token.value ?? '',
      ...props?.headers
    },
    ...props
  })
}
