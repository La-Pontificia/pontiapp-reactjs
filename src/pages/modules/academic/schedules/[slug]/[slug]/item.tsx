/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
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
  PenRegular
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
import { toast } from 'anni'
import { getDaysShort, handleError } from '@/utils'
import TeacherUpdate from './teacher-update'
import { useAuth } from '@/store/auth'

type Props = {
  item: SectionCourse
  refetchSections: () => void
}

type CalendarSchedules = {
  sectionSchedules: SectionCourseSchedule[]
  teacherSchedules: SectionCourseSchedule[]
  teacherUnavailables: Schedule[]
}

const classNameViolet = [
  'interactive',
  '!bg-[#6e72c3]',
  '[&>div]:!text-violet-100'
]

type PreEvent = Record<string, any>

const Item = ({ item, refetchSections }: Props) => {
  const { period } = useSlugSchedules()
  const [openDialog, setOpenDialog] = React.useState(false)
  const { user } = useAuth()
  const [openForm, setOpenForm] = React.useState(false)
  const [defaultValues, setDefaultValues] = React.useState<
    Partial<SectionCourseSchedule>
  >({})

  const {
    data: schedules,
    refetch: refetchSchedules,
    isLoading
  } = useQuery<CalendarSchedules>({
    queryKey: ['academic/sections/courses/schedules', item.id],
    enabled: openDialog,
    queryFn: async () => {
      const res = await api.get<CalendarSchedules>(
        `academic/sections/courses/calendar/${item.id}?sectionId=${item.section?.id}&teacherId=${item.teacher?.id}`
      )
      if (!res.ok)
        return {
          sectionSchedules: [],
          teacherSchedules: [],
          teacherUnavailables: []
        }
      return {
        sectionSchedules: res.data.sectionSchedules.map(
          (s) => new SectionCourseSchedule(s)
        ),
        teacherSchedules: res.data.teacherSchedules.map(
          (s) => new SectionCourseSchedule(s)
        ),
        teacherUnavailables: res.data.teacherUnavailables.map(
          (s) => new Schedule(s)
        )
      }
    }
  })

  const parseTeacherSchedulesUnavailables = React.useMemo(
    (): PreEvent[] =>
      schedules?.teacherUnavailables?.map((s) => ({
        id: s.id,
        title: item.teacher.displayName,
        from: s.from,
        to: s.to,
        dates: s.dates ?? [],
        classNames: [
          'dark:!bg-red-600',
          '[&>div]:dark:!text-red-100',

          '!bg-red-700',
          '[&>div]:!text-white'
        ],
        extendedProps: {
          Descripción: 'Docente no disponible',
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY'),
          $icon: '🙅‍♂️'
        }
      })) ?? [],
    [schedules?.teacherUnavailables, item.teacher]
  )

  const parseTeacherSchedules = React.useMemo(
    (): PreEvent[] =>
      schedules?.teacherSchedules?.map((s) => {
        const isTheSection = s.sectionCourse.section.id === item.section.id
        return {
          id: s.id,
          title: s.sectionCourse?.planCourse?.name,
          from: s.startTime,
          to: s.endTime,
          dates: s.dates,
          classNames: isTheSection
            ? classNameViolet
            : [
                'dark:!bg-[#e7ba51]',
                '[&>div]:dark:!text-black',

                '!bg-[#e7ba51]',
                '[&>div]:!text-amber-950'
              ],
          extendedProps: {
            Programa: s.program.name,
            $img: s.program.businessUnit?.logoURLSquare,
            Aula: s.classroom?.code,
            Desde: format(s.startDate, 'DD [de] MMM YYYY'),
            Hasta: format(s.endDate, 'DD [de] MMM YYYY')
          }
        }
      }) ?? [],
    [schedules?.teacherSchedules]
  )

  const parseSectionSchedules = React.useMemo(
    (): PreEvent[] =>
      schedules?.sectionSchedules?.map((s) => {
        const withTeacher = s.sectionCourse.teacher?.id === item.teacher?.id
        return {
          id: s.id,
          title: s.sectionCourse?.planCourse?.name,
          from: s.startTime,
          to: s.endTime,
          dates: s.dates,
          classNames: withTeacher ? classNameViolet : ['interactive'],
          extendedProps: {
            Programa: s.program.name,
            $img: s.program.businessUnit?.logoURLSquare,
            Aula: s.classroom?.code,
            Desde: format(s.startDate, 'DD [de] MMM YYYY'),
            Hasta: format(s.endDate, 'DD [de] MMM YYYY')
          }
        }
      }) ?? [],
    [schedules?.sectionSchedules]
  )

  const events = React.useMemo<EventSourceInput>(() => {
    const schedules = [
      ...(parseTeacherSchedules ?? []),
      ...(parseTeacherSchedulesUnavailables ?? []),
      ...(parseSectionSchedules ?? [])
    ]

    const uniqueSchedules = Array.from(
      new Map(schedules.map((s) => [s.id, s])).values()
    )

    return uniqueSchedules.flatMap((schedule) =>
      (schedule?.dates ?? []).map((date: any) => ({
        classNames: schedule.classNames,
        title: schedule.title,
        start: concatDateWithTime(date, schedule.from),
        end: concatDateWithTime(date, schedule.to),
        date,
        id: schedule.id,
        backgroundColor: schedule.backgroundColor,
        extendedProps: schedule.extendedProps
      }))
    )
  }, [
    parseTeacherSchedulesUnavailables,
    parseTeacherSchedules,
    parseSectionSchedules
  ])

  const refetch = () => {
    refetchSchedules()
    refetchSections()
  }

  const allSchedules = React.useMemo(
    () => [
      ...(schedules?.sectionSchedules ?? []),
      ...(schedules?.teacherSchedules ?? [])
    ],
    [schedules?.sectionSchedules, schedules?.teacherSchedules]
  )

  const CalendarComp = React.useMemo(
    () => (
      <Calendar
        events={events}
        onDateSelect={(args) => {
          if (!user.hasPrivilege('academic:schedules:create')) return
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
          if (!user.hasPrivilege('academic:schedules:edit')) return

          const schedule = allSchedules?.find((s) => s?.id === args.id)
          if (!schedule) return
          if (schedule?.sectionCourse.section.id !== item.section.id) return
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
                <div className="text-nowrap">🔴 Docente no disponible</div>
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
    ),
    [
      events,
      item.section?.code,
      item.section.id,
      item.teacher,
      item.planCourse?.course?.code,
      item.planCourse?.name,
      period.startDate,
      period.endDate,
      allSchedules
    ]
  )

  return (
    <>
      {/* SCHEDULE FORM */}
      <ScheduleForm
        sectionCourse={item}
        onOpenChange={setOpenForm}
        open={openForm}
        defaultProp={defaultValues}
        refetch={refetch}
      />

      {/* SCHEDULE DIALOG */}
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
            <DialogContent className="flex !p-1 !pb-0 xl:!h-[800px] !max-h-[100%]">
              {CalendarComp}
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
                    {schedules?.sectionSchedules?.map((s) => (
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
                            {user.hasPrivilege('academic:schedules:edit') && (
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
                            )}
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
          <TeacherUpdate item={item} refetch={refetch} />
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
  const { user } = useAuth()
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

  if (!user.hasPrivilege('academic:schedules:delete')) return null

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
