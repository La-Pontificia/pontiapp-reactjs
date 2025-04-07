import { Area } from '~/types/area'
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
  PenFilled
} from '@fluentui/react-icons'
import React from 'react'
import AreaForm from './form'
import { format, timeAgo } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from 'anni'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '~/commons/hover-card'

export default function AreaItem({
  area,
  refetch
}: {
  area: Area
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`partials/areas/${area?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast.error(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast('Área eliminada correctamente')
    refetch()
  }

  return (
    <>
      <tr className="relative bg-white dark:bg-[#292827] [&>td]:text-nowrap group [&>td]:p-2 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar
              icon={<BuildingPeopleRegular />}
              color="colorful"
              size={40}
              name={area.name}
              aria-label={area.name}
            />
            <p>{area.name}</p>
          </div>
        </td>
        <td>
          <Badge color="severe" appearance="tint">
            {area.codePrefix}
          </Badge>
        </td>
        <td>
          <HoverCard>
            <HoverCardTrigger className="hover:underline dark:text-blue-500 cursor-pointer">
              {area.departments.length}{' '}
              {area.departments.length === 1 ? 'departamento' : 'departamentos'}
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-xs opacity-70 pb-2">
                Departamentos de {area.name}
              </p>
              <div className="space-y-3">
                {area.departments?.map((department) => (
                  <div key={department.id} className="flex items-center gap-2">
                    <Avatar
                      icon={<BuildingPeopleRegular />}
                      color="colorful"
                      size={32}
                      name={department.name}
                      aria-label={department.name}
                    />
                    <p>{department.name}</p>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </td>
        <td>
          <p>Desde el {format(area.created_at, 'DD/MM/YYYY')}</p>
          <p className="text-xs opacity-60">{timeAgo(area.created_at)}</p>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <AreaForm
              defaultValues={area}
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
                ¿Estás seguro de eliminar el area {area.name}?
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
