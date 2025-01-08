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
import { toast } from '~/commons/toast'

import { AttentionPosition } from '~/types/attention-position'
import {
  DeleteFilled,
  PenFilled,
  PersonDesktopRegular
} from '@fluentui/react-icons'
import Form from './form'
import { useAuth } from '~/store/auth'
// import { DraggableData, Rnd } from 'react-rnd'
// import { useAttentionsUi } from '~/store/attentions'
// import { DraggableEvent } from 'react-draggable'

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
      return toast(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`${item.name} eliminado correctamente`)
    refetch()
  }

  // const setIsMoveable = useAttentionsUi((store) => store.setIsMoveable)
  // const isEditing = useAttentionsUi((state) => state.isEditing)
  // const [internalDisabled, setInternalDisabled] = React.useState(false)

  // const updatePosition = (x: number, y: number) => {
  //   void api.post(`attentions/positions/${item.id}/ui`, {
  //     data: JSON.stringify({
  //       x,
  //       y
  //     })
  //   })
  //   refetch()
  // }

  // const onStop = (_: DraggableEvent, data: DraggableData) => {
  //   updatePosition(data.x, data.y)
  //   setIsMoveable(true)
  // }

  // const onDrag = () => {
  //   setIsMoveable(false)
  // }

  // const onStart = () => {
  //   setIsMoveable(false)
  // }

  return (
    <>
      <tr
        key={item.id}
        className="bg-neutral-100 relative dark:bg-neutral-900 [&>td]:px-4 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
      >
        <td>
          <div
            className="absolute left-0 inset-y-0 w-[6px] rounded-l-xl"
            style={{ backgroundColor: item.background }}
          />
          <div className="font-semibold opacity-70">{item.shortName}</div>
        </td>
        <td>
          <div className="flex items-center gap-2 py-2">
            <Avatar size={32} icon={<PersonDesktopRegular />} />
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
                      color="success"
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
      {/* <Rnd
        enableResizing={false}
        onDragStop={onStop}
        onDragStart={onStart}
        dragGrid={[15, 15]}
        onDrag={onDrag}
        disableDragging={!isEditing || internalDisabled}
        default={{
          x: item.ui?.x ?? 0,
          y: item.ui?.y ?? 0,
          width: 90,
          height: 90
        }}
        size={{
          height: 90,
          width: 90
        }}
        className="cursor-pointer rounded-2xl bg-neutral-800 overflow-hidden"
      >
        <div className="w-full h-full relative p-2 flex flex-col">
          <div
            style={{
              backgroundColor: item.background
            }}
            className="absolute pointer-events-none right-0 inset-y-0 w-[5px]"
          />
          <div className="flex-grow">
            <h1 className="font-semibold dark:text-blue-500">
              {item.shortName}
            </h1>
            <p className="text-xs opacity-50">{item.name}</p>
          </div>
          {isEditing && (
            <div
              onMouseEnter={() => setInternalDisabled(true)}
              onMouseLeave={() => setInternalDisabled(false)}
              className="flex justify-between"
            >
              {authUser.hasPrivilege('events:positions:edit') && (
                <Form
                  defaultValues={item}
                  refetch={refetch}
                  triggerProps={{
                    size: 'small',
                    icon: <PenFilled fontSize={15} />,
                    appearance: 'subtle'
                  }}
                />
              )}
              {authUser.hasPrivilege('events:positions:delete') && (
                <Button
                  size="small"
                  onClick={() => setOpenDelete(true)}
                  icon={<DeleteFilled fontSize={15} />}
                  appearance="subtle"
                />
              )}
            </div>
          )}
        </div>
      </Rnd> */}
    </>
  )
}
