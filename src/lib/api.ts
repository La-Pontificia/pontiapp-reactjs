/* eslint-disable @typescript-eslint/no-explicit-any */
export type ExtendedRequestInit = RequestInit & {
  data?: any
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  api?: boolean
}

const API_HOST = import.meta.env.VITE_API_HOST

async function fetchCore<T>(
  pathname: string,
  options?: ExtendedRequestInit
): Promise<T> {
  const { api = true, ...ops } = options ?? {}

  const URL = api ? `${API_HOST}/api/${pathname}` : `${API_HOST}/${pathname}`

  const getTokenFromCookies = () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
  }

  const csrfToken = getTokenFromCookies()

  const response = await fetch(URL, {
    ...ops,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(csrfToken) } : {}),
      ...options?.headers
    },

    body: options?.data ? JSON.stringify(options.data) : undefined,
    credentials: 'include',
    method: options?.method ?? 'GET',
    mode: 'cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
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
    return await fetchCore<T>(pathname, { ...options, method: 'GET' })
  },
  post: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, { ...options, method: 'POST' })
  },
  put: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, { ...options, method: 'PUT' })
  },
  delete: async <T>(pathname: string, options?: OmitedMetodInOptions) => {
    return await fetchCore<T>(pathname, { ...options, method: 'DELETE' })
  }
})
