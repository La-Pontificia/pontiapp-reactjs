import { toast } from '@/commons/toast'
import { api } from '@/lib/api'
import { handleAuthError } from '@/utils'
import { Spinner } from '@fluentui/react-components'
import * as React from 'react'
import { useSearchParams } from 'react-router'

const host = import.meta.env.VITE_HOST
const apiHost = import.meta.env.VITE_API_HOST

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false)
  const [searchParams] = useSearchParams()

  const handleID = async () => {
    setLoading(true)
    const uri = new URL(`${apiHost}/api/auth/login/id`)
    uri.searchParams.set('redirectURL', `${host}`)
    uri.searchParams.set('redirectErrorURL', `${host}/login`)
    await api('auth/sanctum/csrf-cookie')
    window.location.href = uri.href
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
      <div className="w-full h-full flex-col flex flex-grow bg-gradient-to-b from-stone-950/95 via-stone-950/90 to-stone-950/80">
        <div className="flex-grow flex-col px-10 w-full max-w-2xl mx-auto flex items-center justify-center">
          <h1 className="text-yellow-50 py-8 font-serif font-medium tracking-tight text-5xl text-center">
            Ponti App
          </h1>
          <button
            disabled={loading}
            onClick={handleID}
            className="mx-auto font-semibold text-yellow-50 group w-full bg-black h-16 px-10 rounded-2xl flex items-center gap-2 justify-center"
          >
            {loading ? (
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
          <div className="py-4">
            <button className="dark:text-blue-500 hover:underline font-semibold">
              Utilizar correo institucional{' '}
            </button>
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
