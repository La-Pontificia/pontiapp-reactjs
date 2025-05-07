import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
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
  CheckmarkCircleFilled,
  // CalendarEditRegular,
  DeleteRegular,
  DocumentRegular,
  PenRegular,
  PersonLightbulbRegular
} from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '@/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { SectionCourse } from '@/types/academic/section-course'
import UserDrawer from '@/components/user-drawer'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: SectionCourse
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/sections/courses/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success(
        <p>
          En hora buena! El curso <b>{item.planCourse?.name}</b> ha sido
          removido de la sección con éxito.
        </p>
      )
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const { mutate: asignTeacher, isPending: isAsigning } = useMutation({
    mutationFn: (data: object) =>
      api.post(`academic/sections/courses/${item.id}`, {
        data: JSON.stringify(data),
        alreadyHandleError: false
      }),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success(
        <p>
          En hora buena! El docente del curso <b>{item.planCourse?.name}</b> ha
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
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout media={<DocumentRegular fontSize={25} />}>
            {item.planCourse?.course.code} - {item.planCourse?.name}
          </TableCellLayout>
        </TableCell>
        <TableCell className="font-semibold max-w-[200px]">
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
              className: '!px-1 !text-left !text-nowrap'
            }}
          />
        </TableCell>
        <TableCell className="max-lg:!hidden max-w-[200px]">
          <p className="font-medium">
            {item.creator?.displayName}{' '}
            <span className="opacity-70 font-normal">
              {timeAgo(item.created_at)}
            </span>
          </p>
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
              ¿Estás seguro de remover: {item.planCourse?.name}?
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
