import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { handleAuthError } from '~/utils'
import { Spinner } from '@fluentui/react-components'
import { ArrowCircleRightRegular } from '@fluentui/react-icons'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { useSearchParams } from 'react-router'
import { VITE_API_HOST, VITE_HOST } from '~/config/env'

const host = VITE_HOST
const apiHost = VITE_API_HOST

export default function LoginPage() {
  const [loadingId, setLoadingId] = React.useState(false)
  const [loadingCredential, setLoadingCredential] = React.useState(false)
  const [credentialLogin, setCredentialLogin] = React.useState(false)
  const [searchParams] = useSearchParams()

  const handleID = async () => {
    setLoadingId(true)
    const uri = new URL(`${apiHost}/api/auth/login/id`)
    uri.searchParams.set('redirectURL', `${host}`)
    uri.searchParams.set('redirectErrorURL', `${host}/login`)
    window.location.href = uri.href
  }

  const handleCredential = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingCredential(true)
    const form = new FormData(e.currentTarget)
    const res = await api.post('auth/login/credentials', {
      data: JSON.stringify({
        username: form.get('username'),
        password: form.get('password')
      })
    })
    console.log(res)
    if (res.ok) return (window.location.href = '/')
    setLoadingCredential(false)
    toast(handleAuthError(res.error))
    return
  }

  React.useEffect(() => {
    const error = searchParams.get('error')
    if (error) toast(handleAuthError(searchParams.get('error')))
  }, [searchParams])

  return (
    <div
      className="w-full flex-grow h-full flex-col flex bg-cover bg-center"
      style={{
        backgroundImage:
          'url(college_1090_29-15_00_o-HARVARD-UNIVERSITY-BUILDING-facebook.jpeg)'
      }}
    >
      <Helmet>
        <title>Ponti App | Login</title>
      </Helmet>
      <div className="w-full h-full text-white flex-col flex flex-grow bg-gradient-to-b from-neutral-950/95 via-neutral-950/90 to-neutral-950/80">
        <div className="flex-grow flex-col px-10 w-full max-w-xl mx-auto flex items-center justify-center">
          <h1 className="text-yellow-50 py-8 font-medium tracking-tight text-2xl text-center">
            Ponti App
          </h1>

          <button
            disabled={loadingId}
            onClick={handleID}
            className="mx-auto font-semibold text-yellow-50 group w-full bg-black h-16 px-10 rounded-2xl flex items-center gap-2 justify-center"
          >
            {loadingId ? (
              <Spinner />
            ) : (
              <>
                Continuar con
                <img
                  src="/_microsoft.png"
                  width={90}
                  alt="Microsoft Logo"
                  className="group-hover:scale-105 transition-transform"
                />
              </>
            )}
          </button>

          <div className="py-4 w-full flex items-center flex-col">
            {credentialLogin ? (
              <form
                onSubmit={handleCredential}
                className="rounded-2xl divide-y overflow-hidden divide-neutral-500/50 bg-black w-full"
              >
                <input
                  disabled={!!loadingCredential}
                  autoFocus
                  name="username"
                  placeholder="Correo o nombre de usuario"
                  className="p-5 placeholder:text-neutral-500 outline-none bg-transparent w-full"
                />
                <div className="relative">
                  <input
                    name="password"
                    disabled={!!loadingCredential}
                    type="password"
                    placeholder="Contraseña"
                    className="p-5 placeholder:text-neutral-500 outline-none bg-transparent w-full"
                  />
                  <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                    <button
                      disabled={!!loadingCredential}
                      className="aspect-square dark:text-blue-500 text-blue-500 hover:scale-110  rounded-full"
                    >
                      {loadingCredential ? (
                        <Spinner size="medium" />
                      ) : (
                        <ArrowCircleRightRegular fontSize={35} />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setCredentialLogin(true)}
                className="dark:text-blue-500 text-blue-500 hover:underline font-semibold"
              >
                Utilizar correo y contraseña
              </button>
            )}
          </div>
        </div>

        <footer className="pb-10">
          <p className="mt-6 text-xs text-gray-100 text-center">
            {new Date().getFullYear()} ©{' '}
            <a
              href="https://lp.com.pe"
              target="_blank"
              className="border-b border-gray-500 border-dotted"
            >
              La Pontificia.
            </a>{' '}
            All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
