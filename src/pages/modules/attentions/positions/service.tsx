import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from 'anni'

import { DeleteFilled, PenFilled } from '@fluentui/react-icons'
import Form from './form-service'
import { useAuth } from '~/store/auth'
import { AttentionService } from '~/types/attention-service'

export default function ServiceItem({
  item,
  refetch
}: {
  item: AttentionService
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`attentions/services/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`${item.name} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <tr className="relative bg-white dark:bg-[#292827] [&>td]:text-nowrap group [&>td]:px-2 [&>td]:py-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar name={item.name} color="colorful" size={40} />
            <p className="font-medium">{item.name}</p>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {authUser.hasPrivilege('attentions:services:edit') && (
              <Form
                defaultValues={item}
                defaultPosition={item.position}
                refetch={refetch}
                triggerProps={{
                  size: 'small',
                  appearance: 'transparent',
                  children: (
                    <Badge
                      icon={<PenFilled fontSize={15} />}
                      appearance="tint"
                      color="success"
                    >
                      Editar
                    </Badge>
                  )
                }}
              />
            )}
            {authUser.hasPrivilege('attentions:services:delete') && (
              <button onClick={() => setOpenDelete(true)}>
                <Badge
                  icon={<DeleteFilled fontSize={15} />}
                  appearance="tint"
                  color="danger"
                >
                  Eliminar
                </Badge>
              </button>
            )}
          </div>
        </td>
      </tr>
      {openDelete && (
        <Dialog
          open={openDelete}
          onOpenChange={(_, e) => setOpenDelete(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                ¿Estás seguro de eliminar la opción: {item.name}?
              </DialogTitle>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
                <Button
                  onClick={handleDelete}
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
      )}
    </>
  )
}
