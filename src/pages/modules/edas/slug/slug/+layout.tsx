/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { EdaYear } from '~/types/eda-year'
import { SlugCollaboratorContext } from '../+layout'
import { api } from '~/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  AvatarGroup,
  AvatarGroupItem,
  Button,
  Spinner
} from '@fluentui/react-components'
import { useAuth } from '~/store/auth'
// import { format } from '~/lib/dayjs'
import { Eda } from '~/types/eda'

import { toast } from 'anni'

type SlugEdaSlugState = {
  year: EdaYear
  edaIsTheCurrentUser: boolean
  hasCurrentUserSupervision: boolean
  refetchEda: () => void
  eda: Eda
}

export const SlugCollaboratorEdaSlugContext =
  React.createContext<SlugEdaSlugState>({} as SlugEdaSlugState)
export default function SlugCollaboratorsEdaSlugLayout() {
  const ctxc = React.useContext(SlugCollaboratorContext)
  const navigate = useNavigate()
  const { slugYear } = useParams<{
    slugYear: string
  }>()

  const year = ctxc.years.find((i) => i.id === slugYear)
  const { user: authUser } = useAuth()

  const edaIsTheCurrentUser = ctxc.collaborator.username === authUser.username
  const hasCurrentUserSupervision =
    ctxc.collaborator.manager?.username === authUser.username

  const {
    data: eda,
    isLoading: isLoadingEda,
    refetch: refetchEda
  } = useQuery<Eda | null>({
    queryKey: ['eda', slugYear, ctxc.collaborator.username],
    queryFn: async () => {
      const res = await api.get<Eda>(
        `edas/${ctxc.collaborator.username}/${slugYear}?relationship=sender,approver,closer`
      )
      if (!res.ok) return null
      return res.data ? new Eda(res.data) : null
    }
  })

  const { mutate: create, isPending: creating } = useMutation({
    mutationKey: ['edas', slugYear, ctxc.collaborator.username, 'create'],
    mutationFn: () =>
      api.post(`edas/${ctxc.collaborator.id}/${slugYear}/create`, {
        alreadyHandleError: false
      }),
    onError: (error) => {
      console.error(error)
      toast.error('Ocurrió un error al intentar registrar el Eda 😢')
    },
    onSuccess: () => {
      refetchEda()
      toast.success('Eda registrado exitosamente ✅')
    }
  })

  if (isLoadingEda)
    return (
      <div className="grid place-content-center font-semibold space-y-3 h-full w-full">
        <Spinner />
        <h2>Cargando el Eda de {year?.name}, por favor espere</h2>
      </div>
    )

  if (!year)
    return (
      <div className="p-5 text-center h-full grid place-content-center flex-col items-center font-semibold gap-3 w-full">
        Oops! Something went wrong
        <Button size="small" onClick={() => navigate('/m/edas')}>
          Go back
        </Button>
      </div>
    )

  const hasCreate =
    (authUser.hasModule('edas:create:my') && edaIsTheCurrentUser) ||
    (authUser.hasModule('edas:create:inHisSupervision') &&
      hasCurrentUserSupervision) ||
    authUser.hasModule('edas:create:all')
  return (
    <SlugCollaboratorEdaSlugContext.Provider
      value={{
        hasCurrentUserSupervision,
        eda: eda as Eda,
        refetchEda,
        edaIsTheCurrentUser,
        year: year
      }}
    >
      {eda ? (
        <div className="h-full flex flex-col w-full overflow-auto">
          <header className="lg:px-5">
            <nav className="flex lg:border border-stone-200 dark:border-stone-700 lg:rounded-2xl shadow-sm dark:shadow-black/50 p-2">
              <div className="flex-grow flex flex-col lg:flex-row gap-3">
                <div className="text-center grid lg:aspect-[10/5] place-content-center lg:w-[130px] dark:bg-black/40 bg-white p-2 rounded-lg">
                  <span className="opacity-50"> Eda</span>
                  <h2 className="text-xl font-extrabold">{year.name}</h2>
                </div>
                <div className="flex-grow flex items-center space-y-1">
                  <AvatarGroup layout="stack" size={32}>
                    {!edaIsTheCurrentUser && (
                      <AvatarGroupItem
                        image={{
                          src: authUser.photoURL
                        }}
                        color="colorful"
                        name={authUser.displayName}
                      />
                    )}
                    <AvatarGroupItem
                      image={{
                        src: ctxc.collaborator.photoURL
                      }}
                      color="colorful"
                      name={ctxc.collaborator.displayName}
                    />
                    <AvatarGroupItem
                      image={{
                        src: ctxc.collaborator.manager?.photoURL
                      }}
                      color="colorful"
                      name={ctxc.collaborator.manager?.displayName}
                    />
                  </AvatarGroup>
                </div>
                <div className="dark:text-stone-400 flex items-end gap-2 max-lg:flex max-lg:items-center max-lg:gap-3 font-medium max-lg:text-xs text-right lg:space-y-2 text-nowrap text-stone-600">
                  <Button size="small">Cerrar Eda</Button>
                  <Button size="small">Restablecer Eda</Button>
                </div>
              </div>
            </nav>
          </header>
          <Outlet />
        </div>
      ) : (
        <div className="grid place-content-center max-w-xs mx-auto text-center space-y-3 h-full w-full">
          <h1 className="font-semibold text-lg tracking-tight">
            Eda no disponible.
          </h1>
          <p className="opacity-60">
            {authUser.displayName}{' '}
            {edaIsTheCurrentUser ? (
              <>tu Eda del año {year.name} </>
            ) : (
              <>
                el eda de{' '}
                <span className="font-semibold">
                  {ctxc.collaborator.displayName}
                </span>{' '}
                del año {year.name}{' '}
              </>
            )}
            aún no ha sido registrada
          </p>
          {hasCreate ? (
            <Button
              appearance="primary"
              onClick={() => create()}
              disabled={creating}
              icon={creating ? <Spinner size="tiny" /> : <></>}
            >
              Registrar Eda
            </Button>
          ) : (
            <p className="text-xs dark:text-stone-400 text-red-600 border-t dark:border-stone-700 pt-3 mt-3">
              No tienes privilegios ⚠️ suficientes para registrar el Eda
            </p>
          )}
        </div>
      )}
    </SlugCollaboratorEdaSlugContext.Provider>
  )
}
