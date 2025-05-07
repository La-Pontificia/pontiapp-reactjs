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
  Spinner,
  Tooltip
} from '@fluentui/react-components'

import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'

import {
  BreakoutRoomRegular,
  CalendarEditRegular,
  DeleteRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { concatDateWithTime, format, timeAgo } from '@/lib/dayjs'
import Form from './form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Classroom } from '@/types/academic/classroom'
import Calendar from '@/components/calendar'
import { SectionCourseSchedule } from '@/types/academic/section-course-schedule'
import { EventSourceInput } from '@fullcalendar/core'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Classroom
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openDialogCalendar, setOpenDialogCalendar] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/classrooms/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! El aula ha sido eliminado con éxito.')
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const { data: schedules, isLoading } = useQuery<SectionCourseSchedule[]>({
    queryKey: ['academic/sections/courses/schedules', item],
    enabled: !!(openDialogCalendar && item),
    queryFn: async () => {
      const res = await api.get<SectionCourseSchedule[]>(
        `academic/sections/courses/schedules?classroomId=${item?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const events = React.useMemo<EventSourceInput>(() => {
    const newEvents: EventSourceInput = []
    if (!schedules) return []
    for (const schedule of schedules) {
      if (!schedule?.dates) continue
      for (const date of schedule.dates) {
        newEvents.push({
          title: schedule.sectionCourse?.planCourse?.name,
          start: concatDateWithTime(date, schedule.startTime),
          end: concatDateWithTime(date, schedule.endTime),
          date: date,
          id: schedule.id,
          backgroundColor: '#0074ba',
          extendedProps: {
            Aula: schedule.classroom?.code,
            Docente: schedule.sectionCourse?.teacher?.displayName,
            Desde: format(schedule.startDate, 'DD [de] MMM YYYY'),
            Hasta: format(schedule.endDate, 'DD [de] MMM YYYY')
          }
        })
      }
    }

    return newEvents
  }, [schedules])

  return (
    <>
      <Dialog
        open={openDialogCalendar}
        onOpenChange={(_, { open }) => setOpenDialogCalendar(open)}
      >
        <DialogSurface className="max-xl:!max-w-[95vw] !bg-[#f5f5f4] dark:!bg-[#2f2e2b] !max-h-[95vh] xl:!min-w-[1100px] !p-0">
          <DialogBody
            style={{
              gap: 0,
              maxHeight: '99vh'
            }}
          >
            <DialogContent className="flex !p-1 !pb-0 !grow xl:!h-[700px] !max-h-[100%]">
              <Calendar
                nav={
                  <div>
                    {item.code} ({item.type}) - {item.pavilion?.name}
                  </div>
                }
                events={events}
                defaultView="timeGridWeek"
              />
              <div className="w-[400px] overflow-auto max-w-[400px] flex gap-1 flex-col p-2">
                {isLoading ? (
                  <div className="grow grid place-content-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grow overflow-y-auto flex gap-1 flex-col">
                    <p className="font-medium pb-1">Horarios</p>
                    {schedules?.map((s) => (
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
                    onClick={() => setOpenDialogCalendar(false)}
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
          <TableCellLayout media={<BreakoutRoomRegular fontSize={25} />}>
            {item.code}
          </TableCellLayout>
        </TableCell>
        <TableCell className="max-w-[70px]">
          <Badge>{item.floor ?? '-'}</Badge>
        </TableCell>
        <TableCell className="max-w-[100px]">{item.type ?? '-'}</TableCell>
        <TableCell className="max-w-[80px]">{item.capacity ?? '-'}</TableCell>
        <TableCell className="max-lg:!hidden max-w-[130px]">
          <p className="font-medium">
            {item.creator?.displayName}{' '}
            <span className="opacity-70 font-normal">
              {timeAgo(item.created_at)}
            </span>
          </p>
        </TableCell>
        <TableCell className="max-w-[100px]">
          <Button
            onClick={() => setOpenDialogCalendar(true)}
            icon={<CalendarEditRegular />}
            appearance="transparent"
          >
            Horarios
          </Button>
        </TableCell>
        <TableCell className="max-w-[100px]">
          <div>
            <Tooltip content="Editar" relationship="description">
              <Button
                icon={<PenRegular />}
                onClick={() => setOpenForm(true)}
                appearance="transparent"
              />
            </Tooltip>
            <Tooltip content="Eliminar" relationship="description">
              <Button
                icon={<DeleteRegular />}
                onClick={() => setOpenDelete(true)}
                appearance="transparent"
              />
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
      <Form
        open={openForm}
        onOpenChange={setOpenForm}
        defaultProp={item}
        refetch={refetch}
      />
      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿Estás seguro de eliminar: {item.code} - {item.type}?
            </DialogTitle>
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
