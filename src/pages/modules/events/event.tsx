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
import { DeleteFilled, PenFilled } from '@fluentui/react-icons'
import React from 'react'
import { format } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from 'anni'

import { useAuth } from '~/store/auth'
import { Event } from '~/types/event'
import { Link } from 'react-router'
import Form from './form'
import UserHoverInfo from '~/components/user-hover-info'

export default function Item({
  item,
  refetch
}: {
  item: Event
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`events/${item?.id}/delete`)
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
      <tr className="relative bg-white dark:bg-[#292827] [&>td]:text-nowrap group [&>td]:p-2 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar color="colorful" size={40} name={item.name} />
            <div>
              <p className="line-clamp-3 font-semibold">{item.name}</p>
              <p className="text-xs opacity-70">{item.description}</p>
            </div>
          </div>
        </td>
        <td>
          <p className="overflow-hidden font-medium text-nowrap capitalize text-ellipsis">
            {item.date ? format(item.date, 'MMMM D, YYYY') : 'Sin fecha'}
          </p>
        </td>
        <td>
          <Link
            to={`/events/records/${item.id}`}
            className="hover:underline text-nowrap  text-sm font-semibold text-blue-600"
          >
            {item.recordsCount} asistente{item.recordsCount === 1 ? '' : 's'}
          </Link>
        </td>
        <td>
          <UserHoverInfo slug={item.creator.username}>
            <a
              target="_blank"
              href={`/${item.creator.username}`}
              className="hover:underline text-nowrap font-medium"
            >
              {item.creator?.displayName}
            </a>
          </UserHoverInfo>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {authUser.hasPrivilege('events:edit') && (
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
            {authUser.hasPrivilege('events:delete') && (
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
                ¿Estás seguro de eliminar el departamento: {item.name}?
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
