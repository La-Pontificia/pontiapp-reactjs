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

import { DeleteRegular, PenRegular } from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '@/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Link } from 'react-router'
import { BusinessUnit } from '@/types/rm/business-unit'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: BusinessUnit
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`rm/business-units/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! El periodo ha sido eliminado con éxito.')
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const domainURL = React.useMemo(() => {
    if (!item.domain) return null

    let url = item.domain.trim()

    if (!url.startsWith('http')) {
      url = `https://${url}`
    } else if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://')
    }

    return url
  }, [item.domain])

  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <div className="w-[100px]">
            <img
              className="max-h-[25px] max-w-[100px]"
              src={item?.logoURL}
              alt=""
            />
          </div>
        </TableCell>
        <TableCell>
          <TableCellLayout>{item.name}</TableCellLayout>
        </TableCell>
        <TableCell>{item.acronym}</TableCell>
        <TableCell>
          <Link
            to={domainURL ?? '#'}
            target="_blank"
            className="hover:underline text-blue-400"
          >
            {domainURL?.split('://')[1]}
          </Link>
        </TableCell>
        <TableCell>
          <p className="font-medium">
            {item.creator?.displayName}{' '}
            <span className="opacity-70 font-normal">
              {timeAgo(item.created_at)}
            </span>
          </p>
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
            <DialogTitle>¿Estás seguro de eliminar: {item.name}?</DialogTitle>
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
