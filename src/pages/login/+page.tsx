import { toast } from 'anni'
import { api } from '@/lib/api'
import { handleAuthError } from '@/utils'
import { FluentProvider, Spinner } from '@fluentui/react-components'
import { ArrowCircleRightRegular } from '@fluentui/react-icons'
import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Link, useSearchParams } from 'react-router'
import { VITE_API_HOST, VITE_HOST } from '@/config/env'
import { PiEyeClosedDuotone } from 'react-icons/pi'
import { PiEye } from 'react-icons/pi'
import { businesses } from '@/const'
import { lightTheme } from '@/utils/themes'
import { Microsoft } from '@/icons'
import './styles.css'

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
        window.location.href = `${host}/create-password?redirectURL=${href}`
        return
      }
      window.location.href = href
      return
    }
    setLoadingCredential(false)
    toast.error(handleAuthError(res.error))
  }

  React.useEffect(() => {
    const error = searchParams.get('error')
    if (error) toast(handleAuthError(searchParams.get('error')))
  }, [searchParams])

  return (
    <FluentProvider theme={lightTheme}>
      <div className="min-h-svh login-page flex bg-white">
        <Helmet>
          <title>Ponti App | Iniciar Sesión</title>
        </Helmet>
        <h2 className="hidden" data-seo="true">
          PontiApp del grupo la Pontificia, Escuela Superior La Pontificia,
          Instituto La Pontificia, Educación Continua, Escuela Cybernet
        </h2>
        <div className="flex w-full text-black flex-grow">
          <div className="flex-grow relative lg:flex hidden">
            <div className="absolute z-[1] bg-gradient-to-b from-transparent to-black/30 inset-0 " />
            <div
              style={{
                backgroundImage: 'url(/background.webp)'
              }}
              className="absolute bg-no-repeat bg-fixed inset-0 bg-center bg-cover"
            />
          </div>
          <div
            style={{
              backgroundPosition: 'center',
              background:
                'linear-gradient(rgba(255,255,255,.95),rgba(255,255,255,.6)), url(/background-gradient.webp)'
            }}
            className=" relative text-black flex flex-col lg:px-5 lg:w-[550px] lg:min-w-[550px] lg:max-w-[550px] flex-grow h-full"
          >
            <nav className="p-10 relative flex justify-center basis-0">
              <Link to="/login" className="flex items-center gap-1">
                <img
                  src="_lp-only-logo.webp"
                  className=""
                  width={50}
                  alt="Logo Grupo La Pontificia"
                />
                <img
                  src="_lp_only-letters.webp"
                  className=""
                  width={100}
                  alt="Logo Grupo La Pontificia Letters"
                />
              </Link>
            </nav>
            <header className="lg:py-8 relative pb-5 lg:pb-8">
              <h1 className="font-bold pb-2 tracking-tight text-2xl text-center">
                PontiApp
              </h1>
              <p className="max-w-[35ch] opacity-70 text-center text-sm mx-auto">
                Aplicación Institucional PontiApp, sistema integrado de gestión
                de EDA
              </p>
            </header>
            <div className="flex-grow relative px-4 my-auto">
              <button
                disabled={loadingId}
                onClick={handleID}
                className="mx-auto relative lg:hover:scale-105 active:scale-95 transition-transform font-semibold text-black group w-full bg-gradient-to-r shadow-black/5 shadow-lg from-purple-300 via-blue-300 to-lime-300 h-14 px-10 rounded-xl flex items-center gap-2 justify-center"
              >
                {loadingId ? (
                  <Spinner />
                ) : (
                  <>
                    Continuar con microsoft
                    <Microsoft size={30} />
                  </>
                )}
              </button>
              <div className="py-5 font-medium text-xs max-w-[40ch] text-center mx-auto">
                También puedes iniciar sesión con tu correo o nombre de usuario.
              </div>
              <div className="w-full">
                <form
                  onSubmit={handleCredential}
                  className="rounded-xl border-black text-black divide-black/10 shadow-black/10 shadow-md bg-white group divide-y transition-transform overflow-hidden w-full"
                >
                  <input
                    disabled={!!loadingCredential}
                    autoFocus
                    name="username"
                    data-fillable
                    autoComplete="off"
                    placeholder="Correo o nombre de usuario"
                    className="p-4 px-5 bg-transparent outline-none w-full"
                  />
                  <div className="relative">
                    <input
                      name="password"
                      data-fillable
                      disabled={!!loadingCredential}
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete="off"
                      placeholder="Contraseña"
                      className="p-4 px-5 outline-none bg-transparent w-full"
                    />
                    <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="text-neutral-500 transition-opacity px-2"
                      >
                        {passwordVisible ? (
                          <PiEye size={23} />
                        ) : (
                          <PiEyeClosedDuotone size={23} />
                        )}
                      </button>
                      <button
                        disabled={!!loadingCredential}
                        className="aspect-square dark:text-cyan-500 text-cyan-500 hover:scale-110 rounded-full"
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
                <a
                  href="#"
                  className="hover:underline w-fit text-sm mt-3 block mx-auto text-slate-700"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            <footer className="p-10 relative">
              <div className="flex flex-wrap justify-center items-center gap-10">
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
                        className="w-[100%] h-[25px] "
                        src={logo}
                        loading="lazy"
                        alt={acronym + ' Logo' + name}
                      />
                    </Link>
                  )
                )}
              </div>
              <p className="mt-10 text-xs text-center">
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
        </div>
      </div>
    </FluentProvider>
  )
}
