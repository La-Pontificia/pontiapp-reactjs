/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import {
  BuildingMultipleRegular,
  CalendarEditRegular,
  CalendarLtrRegular,
  ClockRegular,
  DeleteRegular,
  DocumentRegular,
  PenRegular,
  PersonAddRegular
} from '@fluentui/react-icons'
import React from 'react'
import Calendar from '@/components/calendar'
import { EventSourceInput } from '@fullcalendar/core'

import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { SectionCourse } from '@/types/academic/section-course'
import ScheduleForm from './form'
import { SectionCourseSchedule } from '@/types/academic/section-course-schedule'
import { api } from '@/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { concatDateWithTime, format } from '@/lib/dayjs'
import { Schedule } from '@/types/schedule'
import { useSlugSchedules } from '../+layout'
import UserDrawer from '@/components/user-drawer'
import { toast } from 'anni'
import { getDaysShort, handleError } from '@/utils'

type Props = {
  item: SectionCourse
  refetchSections: () => void
}

type PreEvent = Record<string, any>

const Item = ({ item, refetchSections }: Props) => {
  const { period } = useSlugSchedules()
  const [openDialog, setOpenDialog] = React.useState(false)
  const [openForm, setOpenForm] = React.useState(false)
  const [defaultValues, setDefaultValues] = React.useState<
    Partial<SectionCourseSchedule>
  >({})

  const { data: teacherSchedules, refetch: refetchTeacherSchedules } = useQuery<
    SectionCourseSchedule[]
  >({
    queryKey: ['academic/sections/courses/schedules', item.teacher],
    enabled: !!(openDialog && item),
    queryFn: async () => {
      const res = await api.get<SectionCourseSchedule[]>(
        `academic/sections/courses/schedules?teacherId=${item.teacher?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { data: sectionSchedules, refetch: refetchSectionSchedules } = useQuery<
    SectionCourseSchedule[]
  >({
    queryKey: ['academic/sections/courses/schedules', item],
    enabled: openDialog,
    queryFn: async () => {
      const res = await api.get<SectionCourseSchedule[]>(
        `academic/sections/courses/schedules?sectionId=${item.section?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const {
    data: teacherSchedulesUnavailables,
    refetch: refetchTeacherSchedulesUnavailables,
    isLoading: isLoading
  } = useQuery<Schedule[]>({
    queryKey: ['schedules', item.teacher],
    enabled: !!(openDialog && item.teacher),
    queryFn: async () => {
      const res = await api.get<Schedule[]>(
        `users/schedules/${item.teacher.id}?archived=false&type=unavailable`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const parseTeacherSchedulesUnavailables = React.useMemo(
    (): PreEvent[] =>
      teacherSchedulesUnavailables?.map((s) => ({
        id: s.id,
        title: item.teacher.displayName,
        from: s.from,
        to: s.to,
        dates: s.dates ?? [],
        classNames: [
          'dark:!bg-red-600',
          '[&>div]:dark:!text-red-100',

          'bg-red-700',
          '[&>div]:!text-white'
        ],
        extendedProps: {
          Descripción: 'Docente no disponible',
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY'),
          $icon: '🙅‍♂️'
        }
      })) ?? [],
    [teacherSchedulesUnavailables, item.teacher]
  )

  const parseTeacherSchedules = React.useMemo(
    (): PreEvent[] =>
      teacherSchedules?.map((s) => ({
        id: s.id,
        title: s.sectionCourse?.planCourse?.name,
        from: s.startTime,
        to: s.endTime,
        dates: s.dates,
        classNames: [
          'dark:!bg-yellow-500',
          '[&>div]:dark:!text-black',

          '!bg-yellow-400',
          '[&>div]:!text-yellow-950'
        ],
        extendedProps: {
          Programa: s.program.name,
          $img: s.program.businessUnit?.logoURL,
          Aula: s.classroom?.code,
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [teacherSchedules]
  )

  const parseSectionSchedules = React.useMemo(
    (): PreEvent[] =>
      sectionSchedules?.map((s) => ({
        id: s.id,
        title: s.sectionCourse?.planCourse?.name,
        from: s.startTime,
        to: s.endTime,
        dates: s.dates,
        classNames: [
          'interactive',
          'dark:!bg-blue-500',
          '[&>div]:dark:!text-black',

          '!bg-blue-800',
          '[&>div]:!text-blue-100'
        ],
        extendedProps: {
          Programa: s.program.name,
          $img: s.program.businessUnit?.logoURL,
          Aula: s.classroom?.code,
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [sectionSchedules]
  )

  const events = React.useMemo<EventSourceInput>(() => {
    const newEvents: EventSourceInput = []

    const combinedSchedules = [
      ...(parseTeacherSchedules ?? []),
      ...(parseTeacherSchedulesUnavailables ?? []),
      ...(parseSectionSchedules ?? [])
    ]

    const scheduleMap = new Map<string, any>()

    for (let i = 0; i < combinedSchedules.length; i++) {
      const schedule = combinedSchedules[i]
      if (scheduleMap.has(schedule.id)) {
        scheduleMap.set(schedule.id, {
          ...schedule,
          classNames: [
            'interactive',
            'dark:!bg-violet-500',
            '[&>div]:dark:!text-black',

            '!bg-violet-800',
            '[&>div]:!text-violet-100'
          ]
        })
      } else {
        scheduleMap.set(schedule.id, schedule)
      }
    }

    const uniqueSchedules = Array.from(scheduleMap.values())

    if (!uniqueSchedules) return newEvents

    for (const schedule of uniqueSchedules) {
      if (!schedule?.dates) continue
      for (const date of schedule.dates) {
        newEvents.push({
          classNames: schedule.classNames,
          title: schedule.title,
          start: concatDateWithTime(date, schedule.from),
          end: concatDateWithTime(date, schedule.to),
          date: date,
          id: schedule.id,
          backgroundColor: schedule.backgroundColor,
          extendedProps: schedule.extendedProps
        })
      }
    }

    return newEvents
  }, [
    parseTeacherSchedulesUnavailables,
    parseTeacherSchedules,
    parseSectionSchedules
  ])

  const refetch = () => {
    refetchTeacherSchedules()
    refetchSectionSchedules()
    refetchTeacherSchedulesUnavailables()
  }

  const { mutate: asignTeacher, isPending: isAsigning } = useMutation({
    mutationFn: (data: object) =>
      api.post(`academic/sections/courses/${item.id}`, {
        data: JSON.stringify(data),
        alreadyHandleError: false
      }),
    onSuccess: () => {
      refetchSections()
      toast.success(
        <p>
          En hora buena! El profesor del curso <b>{item.planCourse?.name}</b> ha
          sido actualizado con éxito.
        </p>
      )
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  return (
    <>
      <ScheduleForm
        sectionCourse={item}
        onOpenChange={setOpenForm}
        open={openForm}
        defaultProp={defaultValues}
        refetch={refetch}
      />
      <Dialog
        open={openDialog}
        onOpenChange={(_, { open }) => setOpenDialog(open)}
      >
        <DialogSurface className="max-xl:!max-w-[95vw] !overflow-hidden !bg-[#f5f5f4] dark:!bg-[#2f2e2b] !max-h-[95vh] xl:!min-w-[1300px] !p-0">
          <DialogBody
            style={{
              maxHeight: '99vh',
              gap: 0
            }}
          >
            <DialogContent className="flex !p-1 !pb-0 xl:!h-[750px] !max-h-[100%]">
              <Calendar
                events={events}
                onDateSelect={(args) => {
                  setDefaultValues({
                    startTime: args.start,
                    endTime: args.end,
                    daysOfWeek: [args.start.getDay().toString()],
                    startDate: period.startDate,
                    endDate: period.endDate
                  })

                  // open form with 2s delay
                  setTimeout(() => {
                    setOpenForm(true)
                  }, 50)
                }}
                onEventClick={(args) => {
                  const schedule =
                    sectionSchedules?.find((s) => s?.id === args.id) ||
                    teacherSchedules?.find((s) => s?.id === args.id)

                  if (!schedule) return

                  if (schedule?.sectionCourse.section.id !== item.section.id)
                    return

                  setDefaultValues(schedule)
                  setTimeout(() => {
                    setOpenForm(true)
                  }, 50)
                }}
                defaultView="timeGridWeek"
                footerFLoat={
                  <div className="flex text-xs max-lg:flex-wrap gap-2">
                    <div className="text-nowrap">🔵 {item.section?.code}</div>
                    {item.teacher && (
                      <>
                        <div className="text-nowrap">🟡 Docente</div>
                        <div className="text-nowrap">
                          🟣 {item.section?.code} y Docente
                        </div>
                        <div className="text-nowrap">
                          🔴 Docente no disponible
                        </div>
                      </>
                    )}
                  </div>
                }
                nav={
                  <div className="text-center">
                    {item.planCourse?.course?.code} - {item.planCourse?.name} -{' '}
                    {item.section?.code}
                  </div>
                }
              />
              <div className="w-[350px] max-md:hidden overflow-auto max-w-[350px] flex gap-1 flex-col p-2">
                {isLoading ? (
                  <div className="grow grid place-content-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grow overflow-y-auto flex gap-1.5 flex-col">
                    <p className="font-medium pb-1">
                      Horarios de {item.section?.code}
                    </p>
                    {sectionSchedules?.map((s) => (
                      <div
                        key={s.id}
                        className="p-2 flex bg-white dark:bg-stone-900 items-center gap-2 text-left rounded-lg"
                      >
                        <div className="grow">
                          <p className="overflow-ellipsis font-medium line-clamp-1 pb-1">
                            {s.sectionCourse?.planCourse?.name}
                          </p>
                          <div className="text-xs flex items-center gap-1">
                            <BuildingMultipleRegular
                              fontSize={19}
                              className="opacity-50"
                            />
                            {s.classroom.code} - {s.classroom.pavilion.name}
                          </div>
                          <div className="text-xs flex items-center gap-1">
                            <CalendarLtrRegular
                              fontSize={19}
                              className="opacity-50"
                            />
                            {format(s.startDate, 'DD MMM, YYYY')} -{' '}
                            {format(s.endDate, 'DD MMM, YYYY')}
                          </div>
                          <div className="text-xs flex items-center gap-1">
                            <ClockRegular
                              fontSize={19}
                              className="opacity-50"
                            />
                            {format(s.startTime, 'hh:mm A')} -{' '}
                            {format(s.endTime, 'hh:mm A')}
                          </div>
                          <div className="py-1 pl-5">
                            <Badge color="warning">
                              {getDaysShort(s.daysOfWeek)}
                            </Badge>
                          </div>
                          <div className="pt-1 gap-1 flex">
                            <Button
                              onClick={() => {
                                setDefaultValues(s)
                                // open form with 2s delay
                                setTimeout(() => {
                                  setOpenForm(true)
                                }, 50)
                              }}
                              shape="circular"
                              size="small"
                              icon={<PenRegular />}
                            >
                              Editar
                            </Button>
                            <ScheduleDelete refetch={refetch} schedule={s} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <DialogActions className="flex justify-end">
                  <Button
                    onClick={() => setOpenDialog(false)}
                    appearance="outline"
                  >
                    Cerrar
                  </Button>
                </DialogActions>
              </div>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell className="max-w-[150px]">
          <TableCellLayout media={<DocumentRegular fontSize={25} />}>
            {item.planCourse?.course?.code}
          </TableCellLayout>
        </TableCell>
        <TableCell>{item.planCourse?.name}</TableCell>
        <TableCell className="font-semibold max-w-[150px]">
          {item.planCourse?.plan?.name}
        </TableCell>
        <TableCell className="font-semibold max-w-[200px]">
          <UserDrawer
            onSubmit={(users) => {
              asignTeacher({
                teacherId: users[0]?.id,
                sectionId: item.section.id,
                planCourseId: item.planCourse.id
              })
            }}
            onlyTeachers
            max={1}
            onSubmitTitle="Asignar"
            title="Asignar docente"
            users={item.teacher ? [item.teacher] : []}
            triggerProps={{
              disabled: isAsigning || item.schedulesCount !== 0,
              icon: isAsigning ? (
                <Spinner size="tiny" />
              ) : item.teacher ? (
                <Avatar
                  image={{
                    src: item.teacher.photoURL
                  }}
                  size={20}
                  color="colorful"
                  name={item.teacher.displayName}
                />
              ) : (
                <PersonAddRegular fontSize={16} />
              ),
              children: item.teacher
                ? item.teacher?.displayName
                : 'Sin docente',
              size: 'small',
              appearance: 'secondary',
              className: '!px-1 !text-left !text-nowrap'
            }}
          />
        </TableCell>
        <TableCell className="font-semibold max-w-[130px]">
          {item.section?.code}
        </TableCell>
        <TableCell className="max-w-[130px]">
          <Button
            onClick={() => setOpenDialog(true)}
            icon={<CalendarEditRegular />}
            appearance="transparent"
          >
            <Badge
              size="small"
              className="mr-1"
              color="warning"
              appearance="filled"
            >
              {item.schedulesCount}
            </Badge>
            Ver
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Item

export const ScheduleDelete = ({
  schedule,
  refetch
}: {
  schedule: SectionCourseSchedule
  refetch: () => void
}) => {
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api.post(`academic/sections/courses/schedules/${schedule?.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! El horario ha sido eliminado con éxito.')
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  return (
    <>
      <Button
        onClick={() => setOpenDelete(true)}
        shape="circular"
        size="small"
        icon={<DeleteRegular />}
      >
        Eliminar
      </Button>
      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>¿Estás seguro de eliminar el horario?</DialogTitle>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => mutate()}
                disabled={isPending}
                icon={isPending ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                ELiminar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
