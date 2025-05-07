import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  Spinner,
  Tooltip
} from '@fluentui/react-components'
import {
  CalendarEditRegular,
  CheckmarkCircleFilled,
  DocumentRegular,
  PersonLightbulbRegular
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
import { handleError } from '@/utils'

type Props = {
  item: SectionCourse
  refetchSections: () => void
}

type PreEvent = {
  id: string
  title: string
  from: Date
  to: Date
  interactive?: boolean
  dates: Date[]
  backgroundColor: string
  extendedProps?: Record<string, string | React.ReactNode>
}

const Item = ({ item, refetchSections }: Props) => {
  const { period, program } = useSlugSchedules()
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

  const parseSectionSchedules = React.useMemo(
    (): PreEvent[] =>
      sectionSchedules?.map((s) => ({
        id: s.id,
        title: s.sectionCourse?.planCourse?.name,
        from: s.startTime,
        to: s.endTime,
        dates: s.dates,
        backgroundColor: '#0074ba',
        extendedProps: {
          Aula: s.classroom?.code,
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [sectionSchedules]
  )

  const parseTeacherSchedulesUnavailables = React.useMemo(
    (): PreEvent[] =>
      teacherSchedulesUnavailables?.map((s) => ({
        id: s.id,
        title: item.teacher.displayName,
        from: s.from,
        to: s.to,
        dates: s.dates ?? [],
        backgroundColor: '#ff1000',
        extendedProps: {
          Descripción: 'Docente no disponible',
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
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
        backgroundColor: '#c9a932',
        extendedProps: {
          ...(program?.id !== s.program.id
            ? {
                Programa: s.program.name
              }
            : {}),
          Aula: s.classroom?.code,
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [teacherSchedules, program]
  )

  const events = React.useMemo<EventSourceInput>(() => {
    const newEvents: EventSourceInput = []

    const combinedSchedules = [
      ...(parseSectionSchedules ?? []),
      ...(parseTeacherSchedules ?? []),
      ...(parseTeacherSchedulesUnavailables ?? [])
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scheduleMap = new Map<string, any>()

    for (let i = 0; i < combinedSchedules.length; i++) {
      const schedule = combinedSchedules[i]
      if (scheduleMap.has(schedule.id)) {
        scheduleMap.set(schedule.id, {
          ...schedule,
          backgroundColor: '#7956a9'
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
        <DialogSurface className="max-xl:!max-w-[95vw] !bg-[#f5f5f4] dark:!bg-[#2f2e2b] !max-h-[95vh] xl:!min-w-[1300px] !p-0">
          <DialogBody
            style={{
              maxHeight: '99vh',
              gap: 0
            }}
          >
            <DialogContent className="flex !p-1 !pb-0 !grow xl:!h-[700px] !max-h-[100%]">
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
              <div className="w-[400px] overflow-auto max-w-[400px] flex gap-1 flex-col p-2">
                {isLoading ? (
                  <div className="grow grid place-content-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grow overflow-y-auto flex gap-1 flex-col">
                    <p className="font-medium pb-1">
                      Horarios de {item.section?.code}
                    </p>
                    {sectionSchedules?.map((s) => (
                      <Tooltip
                        key={s.id}
                        content={
                          <div className="text-sm capitalize pb-2 font-semibold">
                            - {s.sectionCourse.planCourse.course.code}
                            <br />- {s.sectionCourse.planCourse.name}
                          </div>
                        }
                        relationship="inaccessible"
                        withArrow
                      >
                        <div className="p-2 text-left flex items-center bg-stone-200 text-stone-950 dark:text-stone-200 dark:bg-stone-900 rounded-lg text-sm">
                          <div className="grow">
                            <div className="capitalize font-semibold">
                              {format(s.startDate, 'DD MMM, YYYY')} -{' '}
                              {format(s.endDate, 'DD MMM, YYYY')}
                            </div>
                            <div className="opacity-70">
                              {format(s.startTime, 'hh:mm A')} -{' '}
                              {format(s.endTime, 'hh:mm A')}
                            </div>
                          </div>
                        </div>
                      </Tooltip>
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
              disabled: isAsigning,
              icon: isAsigning ? (
                <Spinner size="tiny" />
              ) : item.teacher ? (
                <CheckmarkCircleFilled className="dark:text-green-500 text-green-700" />
              ) : (
                <PersonLightbulbRegular />
              ),
              children: item.teacher
                ? item.teacher?.displayName
                : 'Sin docente',
              appearance: 'transparent',
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
            Horarios
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Item
