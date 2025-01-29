import {
  ArrowLeftFilled,
  CheckmarkCircleFilled,
  SaveRegular,
  TableAddFilled
} from '@fluentui/react-icons'
import React from 'react'
import { SlugCollaboratorEdaSlugContext } from '../+layout'
import { EdaObjetive } from '~/types/eda-objetive'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { Button, Spinner } from '@fluentui/react-components'
import EdaObjetiveItem from './objetive'
import ObjetiveForm from './form'
import { toast } from 'anni'
import { useAuth } from '~/store/auth'
import { Eda } from '~/types/eda'
import { format } from '~/lib/dayjs'

export default function SlugCollaboratorEdaSlugObjetivesPage() {
  const edactx = React.useContext(SlugCollaboratorEdaSlugContext)
  const { user: authUser } = useAuth()

  const [openForm, setOpenForm] = React.useState(false)

  const [objetives, setObjetives] = React.useState<EdaObjetive[]>([])
  const [deletedObjetives, setDeletedObjetives] = React.useState<EdaObjetive[]>(
    []
  )

  const hasEdit =
    (!edactx.eda.approvedAt &&
      (edactx.hasCurrentUserSupervision || edactx.edaIsTheCurrentUser) &&
      authUser.hasPrivilege('edas:objetives:edit')) ||
    authUser.isDeveloper

  const hasDelete =
    (!edactx.eda.approvedAt &&
      (edactx.hasCurrentUserSupervision || edactx.edaIsTheCurrentUser) &&
      authUser.hasPrivilege('edas:objetives:delete')) ||
    authUser.isDeveloper

  const hasApprove =
    (!edactx.eda.approvedAt &&
      edactx.eda.sentAt &&
      edactx.hasCurrentUserSupervision &&
      authUser.hasPrivilege('edas:objetives:approve')) ||
    authUser.isDeveloper

  const {
    data,
    isLoading: isLoadingObjetives,
    refetch: refetchObjetives
  } = useQuery<EdaObjetive[] | null>({
    queryKey: ['edas/objetives', edactx.eda.id],
    queryFn: async () => {
      const res = await api.get<EdaObjetive[]>(
        `edas/${edactx.eda.id}/objetives?relationship=creator,updater`
      )
      if (!res.ok) return null
      return res.data.map((i) => new EdaObjetive(i))
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      objs,
      deleted
    }: {
      objs: EdaObjetive[]
      deleted: EdaObjetive[]
    }) =>
      api.post(`edas/${edactx.eda.id}/objetives/store`, {
        data: JSON.stringify({
          objetives: objs.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            indicators: i.indicators,
            percentage: i.percentage,
            order: i.order
          })),
          deleted: deleted.map((i) => i.id)
        }),
        alreadyHandleError: false
      }),
    onError(error) {
      toast(error.message + ' ❌')
    },
    onSuccess() {
      refetchObjetives()
      edactx.refetchEda()
      toast('Objetivos guardados correctamente ✅')
    }
  })

  const { mutate: approve, isPending: approving } = useMutation({
    mutationFn: (eda: Eda) =>
      api.post(`edas/${eda.id}/approve`, {
        alreadyHandleError: false
      }),
    onError(error) {
      toast(error.message + ' ❌')
    },
    onSuccess() {
      edactx.refetchEda()
      toast('Objetivos aprobados correctamente ✅')
    }
  })

  React.useEffect(() => {
    if (data) setObjetives(data)
  }, [data])

  const totalPercentage = objetives
    .reduce(
      (acc, i) =>
        parseFloat(acc.toString()) + parseFloat(i.percentage?.toString()),
      0
    )
    .toFixed(2)

  if (isLoadingObjetives)
    return (
      <div className="grid place-content-center font-semibold space-y-3 h-full w-full">
        <Spinner />
        <h2>Cargando los objetivos del año {edactx?.year.name}</h2>
      </div>
    )

  if (!objetives)
    return (
      <div className="p-5 text-center h-full grid place-content-center flex-col items-center font-semibold gap-3 w-full">
        Objectives not found
        <Button size="small" onClick={() => refetchObjetives()}>
          Retry
        </Button>
      </div>
    )

  return (
    <div className="py-2 h-full px-5 max-lg:px-2 flex flex-col">
      <ObjetiveForm
        open={openForm}
        setOpen={setOpenForm}
        onCreate={(objetive) => {
          setObjetives([...objetives, objetive])
        }}
        objetives={objetives}
      />
      <nav className="flex pb-5 pt-3 justify-between">
        <button
          className="flex items-center gap-1 tracking-tight text-base font-semibold"
          onClick={() => {
            window.history.back()
          }}
        >
          <ArrowLeftFilled />
          <p>Objetivos</p>
        </button>
      </nav>
      <div className="w-full flex-grow border-stone-200 dark:bg-stone-500/10 bg-white lg:rounded-2xl p-2">
        {objetives.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="[&>th]:p-2 [&>th]:pb-4 [&>th]:text-left text-left [&>th]:font-semibold opacity-70 border-b dark:border-stone-700 border-stone-300">
                <th></th>
                <th className="w-[200px] max-md:w-full">Título</th>
                <th className="max-md:hidden">Descripción</th>
                <th className="max-2xl:hidden">Indicadores</th>
                <th className="text-center">Porcentaje</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {objetives.map((objetive) => (
                <EdaObjetiveItem
                  hasEdit={hasEdit}
                  hasDelete={hasDelete}
                  setObjetives={setObjetives}
                  setDeletedObjetives={setDeletedObjetives}
                  objetive={objetive}
                  key={objetive.id}
                />
              ))}
              <tr>
                <td></td>
                <td className="p-2 opacity-70">Total porcentaje:</td>
                <td className="max-md:hidden"></td>
                <td className="max-xl:hidden"></td>
                <td className="p-2 text-center font-semibold dark:text-lime-400 text-blue-600 text-base">
                  {totalPercentage}%
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="p-5 flex justify-center gap-4">
          {(!edactx.eda.approvedAt || authUser.isDeveloper) && (
            <Button
              onClick={() => {
                setOpenForm(true)
              }}
              disabled={parseFloat(totalPercentage) >= 100}
              icon={<TableAddFilled />}
            >
              Agregar
            </Button>
          )}
          {(!edactx.eda.approvedAt || authUser.isDeveloper) && (
            <Button
              appearance={edactx.eda.sentAt ? 'secondary' : 'primary'}
              onClick={() => {
                mutate({
                  deleted: deletedObjetives,
                  objs: objetives
                })
              }}
              disabled={
                parseFloat(totalPercentage) !== 100 || isPending || !hasEdit
              }
              icon={isPending ? <Spinner size="tiny" /> : <SaveRegular />}
            >
              {edactx.eda.sentAt ? 'Actualizar objetivos' : 'Enviar objetivos'}
            </Button>
          )}
          {hasApprove && (
            <Button
              appearance={'primary'}
              onClick={() => {
                approve(edactx.eda)
              }}
              disabled={parseFloat(totalPercentage) !== 100 || approving}
              icon={
                approving ? <Spinner size="tiny" /> : <CheckmarkCircleFilled />
              }
            >
              Aprobar objetivos
            </Button>
          )}
        </div>
      </div>
      <footer className="text-xs pt-2">
        <h2 className="pb-1">Metadata</h2>
        {edactx.eda.sentAt && (
          <p className="opacity-60">
            Enviado por <b>{edactx.eda.sender?.displayName}</b> el{' '}
            {format(
              edactx.eda.sentAt,
              'dddd DD [de] MMMM [del] YYYY [a las] hh:mm A'
            )}
          </p>
        )}
        {edactx.eda.approvedAt && (
          <p className="opacity-60">
            Aprovado por <b>{edactx.eda.approver?.displayName}</b> el{' '}
            {format(
              edactx.eda.approvedAt,
              'dddd DD [de] MMMM [del] YYYY [a las] hh:mm A'
            )}
          </p>
        )}
      </footer>
    </div>
  )
}
