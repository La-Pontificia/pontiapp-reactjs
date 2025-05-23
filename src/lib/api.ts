import { VITE_API_HOST } from '@/config/env'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ExtendedRequestInit = RequestInit & {
  data?: any
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  api?: boolean
  alreadyHandleError?: boolean
  redirectWithoutSession?: boolean
}

type ErrorResponse = {
  ok: false
  error: string
}

type SuccessResponse<T> = {
  ok: true
  data: T
}
type ApiReturnType<T> = SuccessResponse<T> | ErrorResponse

const handleSuccess = <T>(data: T): SuccessResponse<T> => ({
  ok: true,
  data
})

const handleError = (err: Error | any): ErrorResponse => {
  return {
    ok: false,
    error: err.message ?? err
  }
}

async function fetchCore<T>(
  pathname: string,
  options?: ExtendedRequestInit
): Promise<ApiReturnType<T>> {
  const {
    api = true,
    alreadyHandleError = true,
    redirectWithoutSession = true,
    ...ops
  } = options ?? {}

  const URL = api
    ? `${VITE_API_HOST}/api/${pathname}`
    : `${VITE_API_HOST}/${pathname}`

  const getTokenFromCookies = () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
  }

  const csrfToken = getTokenFromCookies()

  const res = await fetch(URL, {
    ...ops,
    headers: {
      ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
      ...ops.headers
    },

    body: options?.data ? options.data : undefined,
    credentials: 'include',
    method: options?.method ?? 'GET',
    mode: 'cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  })

  if (!res.ok) {
    if (res.status === 401 && redirectWithoutSession) {
      window.location.href = `/login?redirectURL=${encodeURIComponent(
        window.location.href
      )}`
    }
    if (alreadyHandleError) {
      return handleError(await res.json())
    } else {
      const errorData = await res.json()
      throw new Error(
        typeof errorData === 'string'
          ? errorData
          : JSON.stringify(errorData) || 'An error occurred'
      )
    }
  }

  return handleSuccess<T>(await res.json())
}

const apiFunction = async <T>(
  pathname: string,
  options?: ExtendedRequestInit
): ReturnType<typeof fetchCore> => {
  return await fetchCore<T>(pathname, options)
}

const basicApi = apiFunction

type OmitedMetodInOptions = Omit<ExtendedRequestInit, 'method'>

export const api = Object.assign(basicApi, {
  get: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers
      }
    })
  },
  post: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers
      }
    })
  },
  put: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers
      }
    })
  },
  delete: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options?.headers
      }
    })
  },
  image: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, { ...options, method: 'POST' })
  }
})
