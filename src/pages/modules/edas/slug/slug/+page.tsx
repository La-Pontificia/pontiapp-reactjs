import React from 'react'
import { Link } from 'react-router'
import { SlugCollaboratorEdaSlugContext } from './+layout'
import { SlugCollaboratorContext } from '../+layout'
import {
  CheckmarkCircleFilled,
  CheckmarkCircleRegular,
  NotepadEditRegular,
  PersonRegular,
  PersonWrenchRegular,
  TaskListSquareSettingsRegular
} from '@fluentui/react-icons'

export default function SlugCollaboratorEdaSlugPage() {
  const edactx = React.useContext(SlugCollaboratorEdaSlugContext)
  const ctx = React.useContext(SlugCollaboratorContext)

  const evaluations = {
    first: {
      title: '1da Evaluación',
      description:
        'Evaluación de la primera etapa del año. (Es habilitado una vez enviado y aprobado los objetivos).',
      evaluation: edactx.eda.evaluations[1],
      available: edactx.eda.approvedAt,
      completed: !!edactx.eda.evaluations[1].closedAt
    },
    second: {
      title: '2da Evaluación',
      description:
        'Evaluación de la segunda etapa del año. (Es habilitado una vez finalizado la primera evaluación).',
      evaluation: edactx.eda.evaluations[2],
      available: !!edactx.eda.evaluations[1].closedAt,
      completed: !!edactx.eda.evaluations[2].closedAt
    }
  }

  return (
    <div className="h-svh w-full lg:px-6 px-3 py-4">
      <h2 className="text-base opacity-70">Objetivos</h2>
      <div className="flex flex-col pt-2">
        <Link
          className="flex hover:shadow-lg transition-all gap-3 shadow-sm dark:bg-[#2c2b28] dark:shadow-black/20 bg-white p-2 rounded-xl"
          to={`/m/edas/${ctx.collaborator.username}/${edactx.year.id}/objetives`}
        >
          <div className="bg-[#5335ff] text-white dark:bg-[#5335ff] rounded-lg w-[100px] grid place-content-center">
            <NotepadEditRegular fontSize={30} />
          </div>
          <div className="space-y-0.5 w-full">
            <p className="text-base font-semibold">Objetivos</p>
            <p className="text-xs opacity-70">
              Por favor, registre sus objetivos y luego envia para su revisión.
            </p>
            <p className="text-xs opacity-70">
              {edactx.eda.countObjetives ?? '0'} objetivos registrados
            </p>
          </div>
          <div className="flex items-end text-xs gap-3 justify-end dark:text-stone-400 font-medium">
            <p className="flex text-nowrap items-center">
              {edactx.eda.sentAt ? 'Enviado' : 'Sin enviar'}
              {edactx.eda.sentAt ? (
                <CheckmarkCircleFilled
                  fontSize={20}
                  className="dark:text-lime-600 text-lime-600 ml-1"
                />
              ) : (
                <CheckmarkCircleRegular
                  fontSize={20}
                  className="opacity-50 ml-1"
                />
              )}
            </p>
            <p className="flex text-nowrap items-center">
              {edactx.eda.approvedAt ? 'Aprobado' : 'Sin aprobar'}
              {edactx.eda.approvedAt ? (
                <CheckmarkCircleFilled
                  fontSize={20}
                  className="dark:text-lime-600 text-lime-600 ml-1"
                />
              ) : (
                <CheckmarkCircleRegular fontSize={20} className="ml-1" />
              )}
            </p>
          </div>
        </Link>
      </div>
      <h2 className="text-base opacity-70 pt-3">Evaluaciones</h2>
      <div className="flex flex-col pt-2 space-y-3">
        {Object.entries(evaluations).map(([key, value]) => {
          return (
            <Link
              data-disabled={!value.available ? '' : undefined}
              key={key}
              className="flex data-[disabled]:grayscale data-[disabled]:pointer-events-none data-[disabled]:opacity-60 hover:shadow-lg transition-all gap-3 shadow-sm dark:bg-[#2c2b28] dark:shadow-black/20 bg-white p-2 rounded-xl"
              to={
                value.available
                  ? `/m/edas/${ctx.collaborator.username}/${edactx.year.id}/evaluations/${value.evaluation.id}`
                  : '#'
              }
            >
              <div className="bg-[#0e68df] text-white dark:bg-[#0057c8] rounded-lg w-[100px] grid place-content-center">
                <TaskListSquareSettingsRegular fontSize={30} />
              </div>
              <div className="space-y-0.5 w-full">
                <p className="text-base font-semibold">{value.title}</p>
                <p className="text-xs opacity-70">{value.description}</p>
                <p className="text-xs opacity-70 flex gap-2 pt-1">
                  <span className="flex items-center gap-1">
                    <PersonRegular fontSize={18} />
                    {value.evaluation.selftQualification}
                  </span>
                  <span className="flex items-center gap-1">
                    <PersonWrenchRegular fontSize={18} />
                    {value.evaluation.qualification}
                  </span>
                </p>
              </div>
              <div className="flex items-end text-xs gap-3 justify-end dark:text-stone-400 font-medium">
                <p className="flex text-nowrap">
                  {value.completed ? 'Completado' : 'Sin evaluar'}
                  {value.completed ? (
                    <CheckmarkCircleFilled
                      fontSize={20}
                      className="dark:text-lime-600 text-lime-600 ml-1"
                    />
                  ) : (
                    <CheckmarkCircleRegular fontSize={20} className="ml-1" />
                  )}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
