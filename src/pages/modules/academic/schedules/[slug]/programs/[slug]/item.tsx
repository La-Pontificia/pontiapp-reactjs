import {
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
  CalendarEditRegular,
  CheckmarkCircleFilled,
  Dismiss24Regular,
  DocumentRegular,
  PersonLightbulbRegular
} from '@fluentui/react-icons'
import React from 'react'
import Calendar from '~/components/calendar'
import { EventSourceInput } from '@fullcalendar/core'

import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '~/components/table'
import { SectionCourse } from '~/types/academic/section-course'
import ScheduleForm from './form'
import { SectionCourseSchedule } from '~/types/academic/section-course-schedule'
import { api } from '~/lib/api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { concatDateWithTime, format } from '~/lib/dayjs'
import { Schedule } from '~/types/schedule'
import { useSlugSchedules } from '../../+layout'
import UserDrawer from '~/components/user-drawer'
import { toast } from 'anni'
import { handleError } from '~/utils'

type Props = {
  item: SectionCourse
  refetchSections: () => void
}

type PreEvent = {
  id: string
  title: string
  from: Date
  to: Date
  dates: Date[]
  backgroundColor: string
  extendedProps?: Record<string, string | React.ReactNode>
}

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
    refetch: refetchTeacherSchedulesUnavailables
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
        backgroundColor: '#fcd53f',
        extendedProps: {
          Aula: s.classroom?.code,
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [teacherSchedules]
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
          backgroundColor: '#a878eb'
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
        <DialogSurface className="min-w-[99vw] w-[100vw] max-lg:min-w-[98vw] max-lg:w-[98vw] !p-2">
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              Horarios: {item.planCourse?.course?.code} -{' '}
              {item.planCourse?.name} | {item.section?.code}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Calendar
                events={events}
                nav={
                  <div className="flex gap-2 pt-1">
                    <div>🔵 {item.section?.code}</div>
                    {item.teacher && (
                      <>
                        <div>🟡 {item.teacher?.displayName}</div>
                        <div>
                          🟣 {item.section?.code} y {item.teacher?.displayName}
                        </div>
                        <div>🔴 Docente no disponible</div>
                      </>
                    )}
                  </div>
                }
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

                  setDefaultValues(schedule ?? {})
                  setTimeout(() => {
                    setOpenForm(true)
                  }, 50)
                }}
                defaultView="timeGridWeek"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} appearance="outline">
                Cerrar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout media={<DocumentRegular fontSize={25} />}>
            {item.planCourse?.course?.code}
          </TableCellLayout>
        </TableCell>
        <TableCell>{item.planCourse?.name}</TableCell>
        <TableCell className="font-semibold ">
          {item.planCourse?.plan?.name}
        </TableCell>
        <TableCell className="font-semibold">
          <UserDrawer
            onSubmit={(users) => {
              asignTeacher({
                teacherId: users[0]?.id,
                sectionId: item.section.id,
                planCourseId: item.planCourse.id
              })
            }}
            max={1}
            onSubmitTitle="Asignar"
            title="Asignar profesor"
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
                : 'Sin asignar',
              appearance: 'transparent',
              className: '!px-1'
            }}
          />
        </TableCell>
        <TableCell className="font-semibold">{item.section?.code}</TableCell>
        <TableCell>
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
