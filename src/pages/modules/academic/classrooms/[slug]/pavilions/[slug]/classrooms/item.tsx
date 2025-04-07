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
} from '~/components/table'

import {
  BreakoutRoomRegular,
  CalendarEditRegular,
  DeleteRegular,
  Dismiss24Regular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { concatDateWithTime, format, timeAgo } from '~/lib/dayjs'
import Form from './form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { Classroom } from '~/types/academic/classroom'
import Calendar from '~/components/calendar'
import { SectionCourseSchedule } from '~/types/academic/section-course-schedule'
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

  const { data: schedules } = useQuery<SectionCourseSchedule[]>({
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
              Horarios: {item.pavilion?.name} - {item.code}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Calendar events={events} defaultView="timeGridWeek" />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDialogCalendar(false)}
                appearance="outline"
              >
                Cerrar
              </Button>
            </DialogActions>
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
        <TableCell>
          <Badge>{item.floor ?? '-'}</Badge>
        </TableCell>
        <TableCell>{item.type ?? '-'}</TableCell>
        <TableCell>{item.capacity ?? '-'}</TableCell>
        <TableCell className="max-lg:!hidden">
          <p className="font-medium">{item.creator?.displayName} </p>
          <span className="opacity-70">{timeAgo(item.created_at)}</span>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => setOpenDialogCalendar(true)}
            icon={<CalendarEditRegular />}
            appearance="transparent"
          >
            Horarios
          </Button>
        </TableCell>
        <TableCell>
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
