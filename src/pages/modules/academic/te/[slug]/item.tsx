import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Persona,
  Spinner
} from '@fluentui/react-components'
import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { DeleteRegular, EyeRegular, PenRegular } from '@fluentui/react-icons'
import React from 'react'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Tevaluation } from '@/types/academic/te-evaluation'
import UserHoverInfo from '@/components/user-hover-info'
import { format } from '@/lib/dayjs'
import { useMutation } from '@tanstack/react-query'
import ItemDetails from './details'

export default function Item({
  item,
  refetch
}: {
  item: Tevaluation
  refetch: () => void
}) {
  const [, setOpenEdit] = React.useState(false)
  const [show, setShow] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate: handleDelete, isPending: deleting } = useMutation({
    mutationFn: async () => api.post(`academic/te/${item?.id}/delete`),
    onError: (error) => {
      toast.error(handleError(error))
    },
    onSuccess: () => {
      setOpenDelete(false)
      toast.success(`Evaluación eliminada correctamente`)
      refetch()
    }
  })

  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout>
            <UserHoverInfo slug={item.teacher?.id}>
              <Persona
                avatar={{
                  image: {
                    src: item.teacher?.photoURL
                  },
                  color: 'colorful',
                  name: item.teacher?.displayName
                }}
                title={item.teacher?.fullName}
                name={item.teacher?.fullName}
                secondaryText={item.teacher?.username ?? 'Sin usuario'}
              />
            </UserHoverInfo>
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <p>
            <span className="opacity-60">
              {item.sectionCourse?.planCourse?.course?.code}{' '}
            </span>
            {item.sectionCourse?.planCourse?.course?.name}
          </p>
        </TableCell>
        <TableCell>
          <p>{item.evaluator?.displayName}</p>
        </TableCell>
        <TableCell className="!max-w-[150px]">
          <p>{format(item.trackingTime, 'DD [de] MMM, YYYY')}</p>
        </TableCell>
        <TableCell className="!max-w-[100px]">
          <p>{format(item.trackingTime, 'hh:mm A')}</p>
        </TableCell>
        <TableCell className="!max-w-[130px]">
          <Button
            appearance="transparent"
            onClick={() => setShow(true)}
            icon={<EyeRegular />}
          />
          <Button
            appearance="transparent"
            disabled
            onClick={() => setOpenEdit(true)}
            icon={<PenRegular />}
          />
          <Button
            onClick={() => setOpenDelete(true)}
            appearance="transparent"
            icon={<DeleteRegular />}
          />
        </TableCell>
      </TableRow>

      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿Estás seguro de eliminar la evaluación de{' '}
              {item.teacher?.fullName}?
            </DialogTitle>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => handleDelete()}
                disabled={deleting}
                icon={deleting ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                ELiminar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog
        open={show}
        onOpenChange={(_, e) => setShow(e.open)}
        modalType="modal"
      >
        <DialogSurface className="w-[600px] !p-0 !overflow-hidden !bg-violet-50 dark:!bg-[#110f15]">
          <DialogBody className="!p-0">
            <ItemDetails evaluation={item} />
            <div className="p-2 flex justify-end col-span-3 pt-0">
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cerrar</Button>
              </DialogTrigger>
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      {/* <Form
        defaultProp={item}
        onOpenChange={setOpenEdit}
        open={openEdit}
        refetch={refetch}
      /> */}
    </>
  )
}
