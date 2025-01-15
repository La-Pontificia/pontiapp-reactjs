import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  SearchBox,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from 'anni'

import { AttentionPosition } from '~/types/attention-position'
import {
  AddFilled,
  DeleteFilled,
  PenFilled,
  PersonDesktopRegular,
  Search20Regular
} from '@fluentui/react-icons'
import Form from './form'
import { useAuth } from '~/store/auth'
import { useQuery } from '@tanstack/react-query'
import { AttentionService } from '~/types/attention-service'
import { useDebounced } from '~/hooks/use-debounced'
import FormService from './form-service'
import ServiceItem from './service'

export default function Item({
  item,
  refetch
}: {
  item: AttentionPosition
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const [openServices, setOpenServices] = React.useState(false)

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

  return (
    <>
      <tr
        key={item.id}
        className="relative bg-white dark:bg-[#292827] [&>td]:text-nowrap group [&>td]:p-1 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
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
          <Button size="small" onClick={() => setOpenServices(true)}>
            Servicios
          </Button>
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

      {openServices && (
        <Services
          position={item}
          openServices={openServices}
          setOpenServices={setOpenServices}
        />
      )}
    </>
  )
}

export const Services = ({
  openServices,
  setOpenServices,
  position
}: {
  openServices: boolean
  setOpenServices: (open: boolean) => void
  position: AttentionPosition
}) => {
  const [q, setQ] = React.useState<string>()
  const { user: authUser } = useAuth()

  const query = `attentions/services/all?positionId=${position.id}${
    q ? `&q=${q}` : ''
  }`

  const {
    data: services,
    isLoading,
    refetch
  } = useQuery<AttentionService[]>({
    queryKey: ['attentions/services/all/relationship', q, position.id],
    queryFn: async () => {
      const res = await api.get<AttentionService[]>(query)
      if (!res.ok) return []
      return res.data
    }
  })

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <Dialog
      open={openServices}
      onOpenChange={(_, e) => setOpenServices(e.open)}
      modalType="modal"
    >
      <DialogSurface
        style={{
          maxWidth: 800
        }}
      >
        <DialogBody>
          <DialogContent>
            <DialogTitle>Servicios</DialogTitle>
            <p className="text-xs opacity-70">
              Servicios del puesto de atención: {position.name}{' '}
            </p>
            <div className="py-5">
              <nav className="flex gap-4 justify-between items-center">
                <FormService
                  defaultPosition={position}
                  refetch={refetch}
                  triggerProps={{
                    disabled:
                      isLoading ||
                      !authUser.hasPrivilege('attentions:services:create'),
                    appearance: 'primary',
                    icon: <AddFilled />,
                    children: <span>Nuevo</span>
                  }}
                />
                <SearchBox
                  disabled={isLoading}
                  value={searchValue}
                  style={{
                    borderRadius: '1rem'
                  }}
                  dismiss={{
                    onClick: () => setQ('')
                  }}
                  onChange={(_, e) => {
                    if (e.value === '') setQ(undefined)
                    handleChange(e.value)
                  }}
                  contentBefore={<Search20Regular className="text-blue-500" />}
                  placeholder="Filtrar"
                />
              </nav>
              <div className="overflow-auto pt-3 flex-grow rounded-xl h-full">
                {isLoading ? (
                  <div className="h-full p-10 grid place-content-center">
                    <Spinner size="small" />
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="dark:text-neutral-400 border-b border-neutral-500/30 font-semibold [&>td]:py-2 [&>td]:px-2">
                          <td className="text-nowrap w-full">Nombre</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
                        {services?.map((service) => (
                          <ServiceItem
                            key={service.id}
                            item={service}
                            refetch={refetch}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Aceptar</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
