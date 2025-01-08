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
import {
  BuildingPeopleRegular,
  DeleteFilled,
  LaptopPersonRegular,
  PenFilled
} from '@fluentui/react-icons'
import React from 'react'
import Form from './form'
import { format, timeAgo } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from '~/commons/toast'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '~/commons/hover-card'
import { Department } from '~/types/department'

export default function Item({
  item,
  refetch
}: {
  item: Department
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`partials/departments/${item?.id}/delete`)
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
      <tr className="relative bg-neutral-50/40 dark:bg-neutral-900 odd:bg-neutral-500/10 dark:even:bg-neutral-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar
              icon={<BuildingPeopleRegular />}
              color="colorful"
              size={40}
              name={item.name}
              aria-label={item.name}
            />
            <p>{item.name}</p>
          </div>
        </td>
        <td>
          <p>{item.area.name}</p>
        </td>
        <td>
          <Badge color="severe" appearance="tint">
            {item.codePrefix}
          </Badge>
        </td>
        <td>
          <HoverCard>
            <HoverCardTrigger className="hover:underline dark:text-blue-500 cursor-pointer">
              {item.roles.length} {item.roles.length === 1 ? 'cargo' : 'cargos'}
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-xs opacity-70 pb-2">
                Cargos en el departamento {item.name}
              </p>
              <div className="space-y-3">
                {item.roles?.map((it) => (
                  <div key={it.id} className="flex items-center gap-2">
                    <Avatar
                      icon={<LaptopPersonRegular />}
                      color="colorful"
                      size={32}
                      name={it.name}
                      aria-label={it.name}
                    />
                    <p>{it.name}</p>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </td>
        <td>
          <p>Registrado el {format(item.created_at, 'DD/MM/YYYY')}</p>
          <p className="text-xs opacity-60">{timeAgo(item.created_at)}</p>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Form
              defaultValues={item}
              refetch={refetch}
              triggerProps={{
                size: 'small',
                appearance: 'transparent',
                children: (
                  <Badge icon={<PenFilled />} appearance="tint" color="success">
                    Editar
                  </Badge>
                )
              }}
            />
            <button onClick={() => setOpenDelete(true)}>
              <Badge icon={<DeleteFilled />} appearance="tint" color="danger">
                Eliminar
              </Badge>
            </button>
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
