import { Button, InfoLabel, Spinner } from '@fluentui/react-components'
import { ArrowLeftFilled } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { api } from '~/lib/api'
import { EdaEvaluation } from '~/types/eda-evaluation'
import EvaluationObjetiveItem from './objetive'
import { format } from '~/lib/dayjs'
import React from 'react'
import { EdaObjetiveEvaluation } from '~/types/eda-objetive-evaluation'
import { SlugCollaboratorEdaSlugContext } from '../../+layout'
import { useAuth } from '~/store/auth'
import { toast } from 'anni'

export default function SlugCollaboratorSlugEdaEvaluationSlugPage() {
  const edactx = React.useContext(SlugCollaboratorEdaSlugContext)
  const { user: authUser } = useAuth()
  const { slugEvaluation } = useParams<{
    slugEvaluation: string
  }>()

  const [objetives, setObjetives] = React.useState<EdaObjetiveEvaluation[]>([])

  const {
    data: evaluation,
    isLoading: isLoadingEvaluation,
    refetch: refetchEvaluation
  } = useQuery<EdaEvaluation | null>({
    queryKey: ['edas/evaluation', slugEvaluation],
    queryFn: async () => {
      const res = await api.get<EdaEvaluation>(
        `edas/evaluations/${slugEvaluation}?relationship=qualifier,selftQualifier,closer,objetives`
      )
      if (!res.ok) return null
      return new EdaEvaluation(res.data)
    }
  })

  React.useEffect(() => {
    if (evaluation) {
      setObjetives(evaluation.objetives)
    }
  }, [evaluation])

  const { mutate: selftQualify, isPending: selftQualifing } = useMutation({
    mutationFn: ({
      objetives,
      total
    }: {
      objetives: EdaObjetiveEvaluation[]
      total: number
    }) =>
      api.post(`edas/evaluations/${evaluation?.id}/selftQualify`, {
        alreadyHandleError: false,
        data: JSON.stringify({
          objetives: objetives.map((objetive) => ({
            id: objetive.id,
            selftQualification: objetive.selftQualification
          })),
          total
        })
      }),
    onError(error) {
      toast(error.message + ' ❌')
    },
    onSuccess() {
      edactx.refetchEda()
      refetchEvaluation()
      toast('Objetivos autocalificados correctamente ✅')
    }
  })

  const { mutate: qualify, isPending: qualifing } = useMutation({
    mutationFn: ({
      objetives,
      total
    }: {
      objetives: EdaObjetiveEvaluation[]
      total: number
    }) =>
      api.post(`edas/evaluations/${evaluation?.id}/qualify`, {
        alreadyHandleError: false,
        data: JSON.stringify({
          objetives: objetives.map((objetive) => ({
            id: objetive.id,
            qualification: objetive.qualification
          })),
          total
        })
      }),
    onError(error) {
      toast(error.message + ' ❌')
    },
    onSuccess() {
      edactx.refetchEda()
      refetchEvaluation()
      toast('Objetivos calificados correctamente ✅')
    }
  })

  const { mutate: close, isPending: closing } = useMutation({
    mutationFn: (evaluation: EdaEvaluation) =>
      api.post(`edas/evaluations/${evaluation?.id}/close`, {
        alreadyHandleError: false
      }),
    onError(error) {
      toast(error.message + ' ❌')
    },
    onSuccess() {
      edactx.refetchEda()
      refetchEvaluation()
      toast('Evaluación cerrada correctamente ✅')
    }
  })

  if (isLoadingEvaluation)
    return (
      <div className="grid place-content-center font-semibold space-y-3 h-full w-full">
        <Spinner />
        <h2>Cargando la evaluación</h2>
      </div>
    )

  if (!evaluation)
    return (
      <div className="p-5 text-center h-full grid place-content-center flex-col items-center font-semibold gap-3 w-full">
        Evaluation not found
        <Button size="small" onClick={() => refetchEvaluation()}>
          Retry
        </Button>
      </div>
    )

  const hasQualify =
    (edactx.hasCurrentUserSupervision &&
      authUser.hasPrivilege('edas:evaluations:qualify') &&
      !evaluation.closedAt &&
      !evaluation.qualificationAt &&
      !!evaluation.selftQualificationAt) ||
    authUser.isDeveloper

  const hasSelftQualify =
    (!evaluation.selftQualificationAt &&
      !evaluation.closedAt &&
      authUser.hasPrivilege('edas:evaluations:selftQualify') &&
      edactx.edaIsTheCurrentUser) ||
    authUser.isDeveloper

  const hasClose =
    (edactx.hasCurrentUserSupervision &&
      evaluation.selftQualificationAt &&
      evaluation.qualificationAt &&
      !evaluation.closedAt &&
      authUser.hasPrivilege('edas:evaluations:close')) ||
    authUser.isDeveloper

  const totalQualification = objetives
    .reduce((acc, objetive) => {
      const percentage = objetive.objetive.percentage
      const qualification = objetive.qualification
      return acc + (Number(qualification) * Number(percentage)) / 100
    }, 0)
    .toFixed(2)

  const allQualify = objetives.every((objetive) => objetive.qualification)
  const allSelftQualify = objetives.every(
    (objetive) => objetive.selftQualification
  )

  const totalSelftQualification = objetives
    .reduce((acc, objetive) => {
      const percentage = objetive.objetive.percentage
      const qualification = objetive.selftQualification
      return acc + (Number(qualification) * Number(percentage)) / 100
    }, 0)
    .toFixed(2)

  return (
    <div className="py-2 h-full px-5 max-lg:px-2 flex flex-col">
      <nav className="flex pb-5 pt-3 justify-between">
        <button
          className="flex items-center gap-1 tracking-tight text-base font-semibold"
          onClick={() => {
            window.history.back()
          }}
        >
          <ArrowLeftFilled />
          <p>Evaluacion N° {evaluation.number}</p>
        </button>
        <div className="flex gap-2">
          {hasSelftQualify && (
            <Button
              appearance="primary"
              disabled={selftQualifing}
              icon={selftQualifing ? <Spinner size="tiny" /> : undefined}
              onClick={() =>
                !allSelftQualify
                  ? toast.warning('No has autocalificado todos los objetivos')
                  : selftQualify({
                      objetives,
                      total: Number(totalSelftQualification)
                    })
              }
            >
              Autocalificar
            </Button>
          )}
          {hasQualify && (
            <Button
              appearance="primary"
              disabled={qualifing}
              icon={qualifing ? <Spinner size="tiny" /> : undefined}
              onClick={() =>
                !allQualify
                  ? toast.warning('No has calificado todos los objetivos')
                  : qualify({
                      objetives,
                      total: Number(totalQualification)
                    })
              }
            >
              Calificar
            </Button>
          )}
          {hasClose && (
            <Button
              appearance="primary"
              disabled={closing}
              icon={closing ? <Spinner size="tiny" /> : undefined}
              onClick={() => close(evaluation)}
            >
              Cerrar evaluación
            </Button>
          )}
        </div>
      </nav>
      <div className="w-full flex-grow border-stone-200 dark:bg-stone-500/10 bg-white lg:rounded-2xl p-1">
        {evaluation.objetives.length > 0 && (
          <table className="w-full">
            <thead>
              <tr className="[&>th]:p-2 [&>th]:py-3 [&>th]:text-left text-left [&>th]:font-semibold border-b dark:border-stone-700 border-stone-300">
                <th></th>
                <th className="w-[200px] max-md:w-full">Título</th>
                <th className="max-md:hidden">Descripción</th>
                <th className="max-xl:hidden">Indicadores</th>
                <th className="text-center">Porcentaje</th>
                <th className="!text-center">
                  <div className="flex">
                    AC
                    <InfoLabel info="Auto calificación es la calificación que el colaborador se asigna a si mismo, esta calificación no es definitiva y puede ser modificada por el supervisor."></InfoLabel>
                  </div>
                </th>
                <th className="!text-center">
                  <div className="flex">
                    C
                    <InfoLabel info="Calificación es la que el supervisor asigna al colaborador"></InfoLabel>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {objetives.map((objetive) => (
                <EvaluationObjetiveItem
                  hasQualify={hasQualify}
                  hasSelftQualify={hasSelftQualify}
                  setObjetives={setObjetives}
                  objetive={objetive}
                  key={objetive.id}
                />
              ))}
            </tbody>
            <tfoot className="border-t dark:border-stone-700">
              <tr className="[&>td]:p-2 [&>td]:px-2 font-semibold">
                <td colSpan={5}>Totales</td>
                <td className="text-center">{totalSelftQualification}</td>
                <td className="text-center">{totalQualification}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
      <footer className="text-xs pt-2 space-y-1">
        <h2 className="pb-1">Metadata</h2>
        {evaluation.selftQualificationAt && (
          <p className="opacity-60">
            Autocalificado por <b>{evaluation.selftQualifier?.displayName}</b>{' '}
            el{' '}
            {format(
              evaluation.selftQualificationAt,
              'dddd DD [de] MMMM [del] YYYY [a las] hh:mm A'
            )}
          </p>
        )}
        {evaluation.qualificationAt && (
          <p className="opacity-60">
            Calificado por <b>{evaluation.qualifier?.displayName}</b> el{' '}
            {format(
              evaluation.qualificationAt,
              'dddd DD [de] MMMM [del] YYYY [a las] hh:mm A'
            )}
          </p>
        )}
        {evaluation.closedAt && (
          <p className="opacity-60">
            Cerrada por <b>{evaluation.closer?.displayName}</b> el{' '}
            {format(
              evaluation.closedAt,
              'dddd DD [de] MMMM [del] YYYY [a las] hh:mm A'
            )}
          </p>
        )}
      </footer>
    </div>
  )
}
