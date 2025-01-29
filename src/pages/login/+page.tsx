import { toast } from 'anni'
import { api } from '~/lib/api'
import { handleAuthError } from '~/utils'
import { Spinner } from '@fluentui/react-components'
import { ArrowCircleRightRegular } from '@fluentui/react-icons'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { useSearchParams } from 'react-router'
import { VITE_API_HOST, VITE_HOST } from '~/config/env'
import { PiEyeClosedDuotone } from 'react-icons/pi'
import { PiEye } from 'react-icons/pi'

const host = VITE_HOST
const apiHost = VITE_API_HOST

export default function LoginPage() {
  const [loadingId, setLoadingId] = React.useState(false)
  const [loadingCredential, setLoadingCredential] = React.useState(false)
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [searchParams] = useSearchParams()

  const currentRedirentURL = searchParams.get('redirectURL')

  const handleID = async () => {
    setLoadingId(true)
    const uri = new URL(`${apiHost}/api/auth/login/id`)
    uri.searchParams.set(
      'redirectURL',
      currentRedirentURL ? currentRedirentURL : host
    )
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
    if (res.ok) {
      return (window.location.href = currentRedirentURL
        ? currentRedirentURL
        : host)
    }
    setLoadingCredential(false)
    toast(handleAuthError(res.error))
  }

  React.useEffect(() => {
    const error = searchParams.get('error')
    if (error) toast(handleAuthError(searchParams.get('error')))
  }, [searchParams])

  return (
    <div
      className="w-full z-[0] text-white relative flex-grow h-full flex-col flex bg-cover bg-center"
      style={{
        backgroundImage: 'url(lp-build.webp)'
      }}
    >
      <Helmet>
        <title>Ponti App | Iniciar Sesión</title>
      </Helmet>
      <div className="w-full bg-[#000000cc] lg:bg-[#000000c9] h-full text-white flex-col flex flex-grow">
        <div className="flex-grow flex-col lg:px-10 px-2 w-full max-w-xl mx-auto flex items-center justify-center">
          <h1 className="text-yellow-50 py-8 font-medium tracking-tight text-2xl text-center">
            Ponti App
          </h1>

          <button
            disabled={loadingId}
            onClick={handleID}
            className="mx-auto relative shadow-xl lg:hover:scale-105 active:scale-95 transition-transform font-semibold text-yellow-50 group w-full bg-black h-16 px-10 rounded-2xl flex items-center gap-2 justify-center"
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
          <div className="py-5 font-medium text-xs max-w-[40ch] text-center mx-auto">
            También puedes iniciar sesión con tu correo o nombre de usuario.
          </div>
          <div className="w-full flex items-center flex-col">
            <form
              onSubmit={handleCredential}
              className="rounded-2xl shadow-2xl group divide-y lg:hover:scale-105 transition-transform overflow-hidden divide-neutral-500/30 bg-black w-full"
            >
              <input
                disabled={!!loadingCredential}
                autoFocus
                name="username"
                data-fillable
                autoComplete="off"
                placeholder="Correo o nombre de usuario"
                className="p-5 font-semibold placeholder:text-neutral-500 outline-none bg-transparent w-full"
              />
              <div className="relative">
                <input
                  name="password"
                  data-fillable
                  disabled={!!loadingCredential}
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="off"
                  placeholder="Contraseña"
                  className="p-5 font-semibold placeholder:text-neutral-500 outline-none bg-transparent w-full"
                />
                <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                  >
                    {passwordVisible ? (
                      <PiEye size={23} />
                    ) : (
                      <PiEyeClosedDuotone size={23} />
                    )}
                  </button>
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
            Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  )
}
