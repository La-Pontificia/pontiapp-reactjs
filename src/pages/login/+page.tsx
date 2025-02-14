import { toast } from 'anni'
import { api } from '~/lib/api'
import { handleAuthError } from '~/utils'
import {
  Button,
  Divider,
  FluentProvider,
  Input,
  Spinner
} from '@fluentui/react-components'
import { EyeFilled, EyeRegular, LockOpenRegular } from '@fluentui/react-icons'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Link, useSearchParams } from 'react-router'
import { VITE_API_HOST, VITE_HOST } from '~/config/env'
import { businesses } from '~/const'
import { lightTheme } from '~/utils/themes'
import { Microsoft } from '~/icons'

const host = VITE_HOST
const apiHost = VITE_API_HOST

export default function LoginPage() {
  const [loadingId, setLoadingId] = React.useState(false)
  const [loadingCredential, setLoadingCredential] = React.useState(false)
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const [searchParams] = useSearchParams()

  const redirectURL = searchParams.get('redirectURL')
    ? encodeURIComponent(searchParams.get('redirectURL')!)
    : undefined

  const currentRedirentURL = redirectURL
    ? decodeURIComponent(redirectURL)
    : undefined

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
    const res = await api.post<{
      id: string
      requiredChangePassword: boolean
    }>('auth/login/credentials', {
      data: JSON.stringify({
        username: form.get('username'),
        password: form.get('password')
      })
    })
    if (res.ok) {
      const href = currentRedirentURL ?? host

      if (res.data.requiredChangePassword) {
        window.location.href = `${host}/create-password?redirectURL=${decodeURIComponent(
          href
        )}`
        return
      }
      window.location.href = href
      return
    }
    setLoadingCredential(false)
    toast(handleAuthError(res.error))
  }

  React.useEffect(() => {
    const error = searchParams.get('error')
    if (error) toast(handleAuthError(searchParams.get('error')))
  }, [searchParams])

  return (
    <FluentProvider theme={lightTheme}>
      <div className="min-h-svh flex flex-col">
        <Helmet>
          <title>Ponti App | Iniciar Sesión</title>
        </Helmet>
        <h2 className="hidden" data-seo="true">
          PontiApp del grupo la Pontificia, Escuela Superior La Pontificia,
          Instituto La Pontificia, Educación Continua, Escuela Cybernet
        </h2>
        <div className="w-full flex flex-col md:bg-[url(/night.webp)] bg-cover bg-center bg-no-repeat flex-grow">
          <div className="md:grid md:py-10 md:place-content-center flex-grow w-full">
            <h1 className="py-5 hidden md:block text-white drop-shadow-md text-2xl text-center">
              La pontificia
            </h1>
            <div className="flex md:shadow-xl shadow-blue-900/30 flex-col max-sm:px-5 px-10 py-10 bg-white text-black md:w-[450px] md:min-w-[450px] md:max-w-[450px] flex-grow h-full">
              <nav className="flex justify-start">
                <Link to="/login" className="flex items-center gap-1">
                  <img
                    src="_lp-only-logo.webp"
                    className=""
                    width={25}
                    alt="Logo Grupo La Pontificia"
                  />
                  <img
                    src="_lp_only-letters.webp"
                    className=""
                    width={80}
                    alt="Logo Grupo La Pontificia Letters"
                  />
                </Link>
              </nav>
              <header className="text-left py-3">
                <h1 className="font-bold tracking-tight text-2xl">
                  Inicia sesión
                </h1>
                <p className="max-w-[35ch] opacity-70 text-sm">
                  para continuar
                </p>
              </header>
              <div className="flex-grow my-auto">
                <Button
                  disabled={loadingId}
                  onClick={handleID}
                  className="w-full !py-2.5 !rounded-none"
                  icon={
                    loadingId ? <Spinner size="extra-tiny" /> : <Microsoft />
                  }
                >
                  Microsoft
                </Button>
                <Divider className="py-5">o tambien</Divider>
                <div className="w-full">
                  <form onSubmit={handleCredential} className="grid gap-3">
                    <Input
                      disabled={!!loadingCredential}
                      name="username"
                      input={{
                        className: '!px-px !py-2'
                      }}
                      required
                      appearance="underline"
                      autoComplete="off"
                      placeholder="Correo, usuario, o documento de identidad"
                    />
                    <Input
                      name="password"
                      input={{
                        className: '!px-px !py-2'
                      }}
                      required
                      disabled={!!loadingCredential}
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete="off"
                      appearance="underline"
                      placeholder="Contraseña"
                      contentAfter={
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {!passwordVisible ? (
                            <EyeRegular fontSize={23} />
                          ) : (
                            <EyeFilled
                              fontSize={23}
                              className="text-blue-500 "
                            />
                          )}
                        </button>
                      }
                    />
                    <div className="flex md:justify-end">
                      <Button
                        icon={
                          loadingCredential ? (
                            <Spinner size="extra-tiny" />
                          ) : undefined
                        }
                        type="submit"
                        disabled={loadingCredential}
                        appearance="primary"
                        className="!rounded-none !p-1.5 !px-4 max-md:w-full"
                      >
                        Iniciar Sesión
                      </Button>
                    </div>
                  </form>
                  <a
                    href="#"
                    className="hover:underline w-fit text-sm mt-3 block text-blue-600"
                  >
                    ¿No puedes acceder a tu cuenta?
                  </a>
                </div>
              </div>
              <div className="pt-2">
                <Divider className="py-3" />
                <p className="text-xs">
                  <LockOpenRegular fontSize={15} className="inline-flex" />
                  Sistema centralizado de autenticación y autorización de La
                  Pontificia.
                </p>
                <Divider className="py-3" />
                <p className="text-xs">
                  Desarrollado por{' '}
                  <a
                    href="https://daustinn.com"
                    target="_blank"
                    className="border-b inline-block hover:underline border-dashed text-blue-600"
                  >
                    Daustinn
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex lg:flex-row flex-col justify-between p-4 py-2 flex-wrap gap-3 max-md:justify-center items-center bg-black text-white">
          <div className="flex flex-wrap justify-center items-center lg:gap-5 gap-3">
            {Object.entries(businesses).map(
              ([url, { acronym, logo, name }]) => (
                <Link
                  title={'Ir a la página de ' + name}
                  key={url}
                  to={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <img
                    className="w-[100%] brightness-125 invert grayscale h-[25px] lg:h-[20px] "
                    src={logo}
                    loading="lazy"
                    alt={acronym + ' Logo' + name}
                  />
                </Link>
              )
            )}
          </div>
          <p className="text-xs text-center">
            {new Date().getFullYear()} ©{' '}
            <a
              href="https://lp.com.pe"
              target="_blank"
              className="border-b border-dotted"
            >
              La Pontificia.
            </a>{' '}
            Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </FluentProvider>
  )
}
