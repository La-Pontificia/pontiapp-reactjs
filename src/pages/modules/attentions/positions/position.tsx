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

import { AttentionPosition } from '~/types/attention-position'
import {
  DeleteFilled,
  PenFilled,
  PersonDesktopRegular
} from '@fluentui/react-icons'
import Form from './form'
import { useAuth } from '~/store/auth'

export default function Item({
  item,
  refetch
}: {
  item: AttentionPosition
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`attentions/positions/${item?.id}/delete`)
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
      <tr
        key={item.id}
        className="relative bg-white dark:bg-[#272523] [&>td]:text-nowrap group [&>td]:p-1 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
      >
        <td style={{ backgroundColor: item.background }}>
          <div className="font-semibold opacity-70 dark:text-black">
            {item.shortName}
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2 py-3">
            {/* <Avatar size={32} icon={<PersonDesktopRegular />} /> */}
            <PersonDesktopRegular fontSize={20} />
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
            <p className="text-sm line-clamp-1 opacity-50">Ninguno</p>
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
            {authUser.hasPrivilege('events:positions:edit') && (
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
                      color="important"
                    >
                      Editar
                    </Badge>
                  )
                }}
              />
            )}
            {authUser.hasPrivilege('events:positions:delete') && (
              <button onClick={() => setOpenDelete(true)}>
                <Badge
                  icon={<DeleteFilled fontSize={15} />}
                  appearance="tint"
                  color="informative"
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
                ¿Estás seguro de eliminar el puesto atención: {item.name}?
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
