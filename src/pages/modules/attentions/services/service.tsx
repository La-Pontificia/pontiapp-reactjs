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
import Form from './form'
import { useAuth } from '~/store/auth'
import { AttentionService } from '~/types/attention-service'

export default function Item({
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
      return toast.error(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`${item.name} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <tr className="relative bg-neutral-50/40 dark:bg-neutral-900 odd:bg-neutral-500/10 dark:even:bg-neutral-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar name={item.name} color="colorful" size={32} />
            <p>{item.name}</p>
          </div>
        </td>
        <td>
          <p>
            <span className="opacity-60 inline-block pr-1">
              {item.position?.shortName}
            </span>
            {item.position?.name}
          </p>
        </td>
        <td>
          <p>{item.position?.business.name}</p>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {authUser.hasPrivilege('attentions:services:edit') && (
              <Form
                defaultValues={item}
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
        {/* <td>
          <div className="flex items-center gap-2 py-3">
            <Avatar size={40} icon={<PersonDesktopRegular />} />
            <p className="text-sm line-clamp-1 opacity-90">{item.name}</p>
          </div>
        </td>
        <td>
          {item.current ? (
            <div className="flex items-center gap-2 py-3">
              <Avatar
                size={24}
                color="colorful"
                image={{
                  src: item.current.displayName
                }}
                name={item.current.displayName}
              />
              <p className="text-sm line-clamp-1 opacity-90">
                {item.current.displayName}
              </p>
            </div>
          ) : (
            <p className="text-sm line-clamp-1 opacity-90">-</p>
          )}
        </td>
        <td>
          {item.available ? (
            <Badge color="success" appearance="tint">
              Disponible
            </Badge>
          ) : (
            <Badge color="subtle" appearance="tint">
              Inactivo
            </Badge>
          )}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {authUser.hasPrivilege('attentions:services:edit') && (
              <Form
                defaultValues={item}
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
        </td> */}
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
