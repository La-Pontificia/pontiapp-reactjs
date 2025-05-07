import { User } from '@/types/user'
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  Divider,
  Spinner,
  Tooltip
} from '@fluentui/react-components'

import React from 'react'
import { Link } from 'react-router'
import UserHoverInfo from '@/components/user-hover-info'
import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { CalendarEditRegular, PenRegular } from '@fluentui/react-icons'
import Calendar from '@/components/calendar'
import { Schedule } from '@/types/schedule'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { concatDateWithTime, format } from '@/lib/dayjs'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import ScheduleForm from './form'
import { SectionCourseSchedule } from '@/types/academic/section-course-schedule'

type PreEvent = {
  id: string
  title: string
  from: Date
  to: Date
  dates: Date[]
  interactive?: boolean
  backgroundColor: string
  extendedProps?: Record<string, string | React.ReactNode>
}

type DataSchedule = {
  unavailable: Schedule[]
  classSchedules: SectionCourseSchedule[]
}

export default function Item({ user }: { user: User; refetch: () => void }) {
  const [openDialog, setOpenDialog] = React.useState(false)
  const [openForm, setOpenForm] = React.useState(false)
  const [defaultValues, setDefaultValues] = React.useState<Partial<Schedule>>(
    {}
  )

  const {
    data: schedules,
    refetch,
    isLoading
  } = useQuery<DataSchedule>({
    queryKey: ['schedules', user],
    enabled: !!(openDialog && user),
    queryFn: async () => {
      const res = await api.get<DataSchedule>(
        `academic/teachers/${user.id}/schedules`
      )
      if (!res.ok) {
        return {
          unavailable: [],
          classSchedules: []
        }
      }
      return res.data
    }
  })

  const parseTeacherSchedulesUnavailables = React.useMemo(
    (): PreEvent[] =>
      schedules?.unavailable.map((s) => ({
        id: s.id,
        title: 'No disponible',
        from: s.from,
        to: s.to,
        dates: s.dates ?? [],
        backgroundColor: '#ff1000',
        extendedProps: {
          Descripción: 'No disponible',
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [schedules]
  )
  const parseTeachersClassSchedules = React.useMemo(
    (): PreEvent[] =>
      schedules?.classSchedules?.map((s) => ({
        id: s.id,
        title: s.sectionCourse.planCourse.name,
        from: s.startTime,
        to: s.endTime,
        dates: s.dates ?? [],
        interactive: false,
        backgroundColor: '#7373737d',
        extendedProps: {
          $classNames: 'dark:!text-white !text-black',
          Descripción: 'Horario de clase',
          Desde: format(s.startDate, 'DD [de] MMM YYYY'),
          Hasta: format(s.endDate, 'DD [de] MMM YYYY')
        }
      })) ?? [],
    [schedules]
  )

  const events = React.useMemo<EventSourceInput>(() => {
    const newEvents: EventSourceInput = []

    const combinedSchedules = [
      ...(parseTeacherSchedulesUnavailables ?? []),
      ...(parseTeachersClassSchedules ?? [])
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scheduleMap = new Map<string, any>()

    for (let i = 0; i < combinedSchedules.length; i++) {
      const schedule = combinedSchedules[i]
      scheduleMap.set(schedule.id, schedule)
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
  }, [parseTeacherSchedulesUnavailables, parseTeachersClassSchedules])

  return (
    <>
      <ScheduleForm
        user={user}
        onOpenChange={setOpenForm}
        open={openForm}
        defaultProp={defaultValues}
        refetch={() => {
          refetch()
        }}
      />

      <Dialog
        open={openDialog}
        onOpenChange={(_, { open }) => setOpenDialog(open)}
      >
        <DialogSurface className="!bg-[#f5f5f4] dark:!bg-[#2f2e2b] max-xl:!max-w-[95vw] !max-h-[95vh] xl:!min-w-[1200px] !p-0">
          <DialogBody
            style={{
              gap: 0
            }}
          >
            <DialogContent className="flex !p-1 !pb-0 !grow xl:!h-[650px] !max-h-[100%]">
              <Calendar
                nav={
                  <div className="flex items-center gap-1">
                    <Avatar
                      size={20}
                      name={user.displayName}
                      color="colorful"
                      image={{
                        src: user.photoURL
                      }}
                    />
                    {user.displayName}
                  </div>
                }
                events={events}
                onDateSelect={(args) => {
                  setDefaultValues({
                    from: args.start,
                    to: args.end,
                    days: [args.start.getDay().toString()],
                    startDate: args.start
                  })

                  // open form with 2s delay
                  setTimeout(() => {
                    setOpenForm(true)
                  }, 50)
                }}
                onEventClick={(args) => {
                  const schedule = schedules?.unavailable.find(
                    (s) => s?.id === args.id
                  )

                  if (!schedule) return

                  setDefaultValues(schedule ?? {})
                  setTimeout(() => {
                    setOpenForm(true)
                  }, 50)
                }}
                defaultView="timeGridWeek"
              />
              <div className="w-[400px] overflow-auto max-w-[400px] flex gap-1 flex-col p-2">
                {isLoading ? (
                  <div className="grow grid place-content-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grow overflow-y-auto flex gap-1 flex-col">
                    <p className="font-medium pb-1">Horarios no disponibles</p>
                    {schedules?.unavailable.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setDefaultValues(s)

                          // open form with 2s delay
                          setTimeout(() => {
                            setOpenForm(true)
                          }, 50)
                        }}
                        className="p-2 flex bg-red-200 text-red-900 dark:text-red-200 dark:bg-stone-900 hover:opacity-80 items-center gap-2 text-left rounded-lg text-sm"
                      >
                        <div className="grow">
                          <div className="capitalize font-semibold">
                            {format(s.startDate, 'DD MMM, YYYY')} -{' '}
                            {format(s.endDate, 'DD MMM, YYYY')}
                          </div>
                          <div className="opacity-80">
                            {format(s.from, 'hh:mm A')} -{' '}
                            {format(s.to, 'hh:mm A')}
                          </div>
                        </div>
                        <div className="pr-1">
                          <PenRegular fontSize={20} />
                        </div>
                      </button>
                    ))}
                    <div className="pt-2">
                      <Divider />
                    </div>
                    <p className="font-medium pb-1">Horarios de clases</p>
                    {schedules?.classSchedules.map((s) => (
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
        <TableCell>
          <UserHoverInfo slug={user.username}>
            <div className="flex items-center gap-2">
              <TableCellLayout
                media={
                  <Avatar
                    name={user.displayName}
                    color="colorful"
                    image={{
                      src: user.photoURL
                    }}
                  />
                }
              >
                <Link
                  className="hover:underline font-semibold relative"
                  to={`/m/users/${user.username}`}
                >
                  {user.displayName}
                </Link>
              </TableCellLayout>
            </div>
          </UserHoverInfo>
        </TableCell>
        <TableCell className="max-lg:hidden">
          <p className="dark:text-white relative text-ellipsis overflow-hidden">
            <a href={`mailto:${user.email}`} className="hover:underline">
              {user.email}
            </a>
          </p>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <Badge shape="rounded" color="danger">
              {user.schedulesNotAvailable?.length}
            </Badge>
            <Button
              onClick={() => setOpenDialog(true)}
              icon={<CalendarEditRegular />}
              appearance="transparent"
            >
              Ver
            </Button>
          </div>
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    </>
  )
}
