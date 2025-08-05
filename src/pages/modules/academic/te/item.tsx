import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Spinner
} from '@fluentui/react-components'
import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import {
  CopyAddRegular,
  DeleteRegular,
  FolderOpenRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { TeGroup } from '@/types/academic/te-group'
import Form from './form'
import { useNavigate } from 'react-router'
import { useAuth } from '@/store/auth'
import { useMutation } from '@tanstack/react-query'

export default function Item({
  item,
  refetch,
  selected,
  setSelected
}: {
  item: TeGroup
  refetch: () => void
  selected: TeGroup[]
  setSelected: React.Dispatch<React.SetStateAction<TeGroup[]>>
}) {
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [replicate, setReplicate] = React.useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const { mutate: replicateGroup, isPending: replicating } = useMutation({
    mutationFn: async (name: string) =>
      api.post(`academic/te/gro/${item.id}/replicate`, {
        data: JSON.stringify({ name }),
        alreadyHandleError: false
      }),
    onSuccess: () => {
      toast.success(`Grupo replicado correctamente`)
      refetch()
      setReplicate(false)
    },
    onError: (error) => {
      toast.error(handleError(error))
    }
  })

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`academic/te/gro/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast.error(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast.success(`Grupo eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <TableRow>
        <TableSelectionCell
          checked={selected.some((i) => i.id === item.id)}
          onClick={() => {
            setSelected((prev) =>
              prev.some((i) => i.id === item.id)
                ? prev.filter((i) => i.id !== item.id)
                : [...prev, item]
            )
          }}
          type="radio"
        />
        <TableCell>
          <TableCellLayout
            onClick={() => navigate(`/m/academic/te/${item.id}`)}
            className="hover:underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-400"
            media={<FolderOpenRegular fontSize={25} />}
          >
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <div>
            <p>{item.creator?.displayName}</p>
          </div>
        </TableCell>
        <TableCell>
          <Button
            disabled={
              !user.hasPrivilege('academic:teacherEvaluation:groups:write')
            }
            appearance="transparent"
            onClick={() => setReplicate(true)}
            icon={<CopyAddRegular />}
          >
            Replicar
          </Button>
          <Button
            disabled={
              !user.hasPrivilege('academic:teacherEvaluation:groups:write')
            }
            appearance="transparent"
            onClick={() => setOpenEdit(true)}
            icon={<PenRegular />}
          />
          <Button
            disabled={
              !user.hasPrivilege('academic:teacherEvaluation:groups:write')
            }
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
              ¿Estás seguro de eliminar el grupo {item.name}?
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

      <Dialog
        open={replicate}
        onOpenChange={(_, e) => setReplicate(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Duplicar: {item.name}</DialogTitle>
            <DialogContent>
              <p>Clona un grupo con todas las configuraciones.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = formData.get('name') as string
                  replicateGroup(name)
                }}
                id="formreplicate"
                className="pt-2 w-full"
              >
                <Field
                  label="Nombre"
                  validationState="none"
                  validationMessage="Ingrese el nombre del grupo a duplicar"
                >
                  <Input
                    required
                    defaultValue={item.name + ' Copia'}
                    className="w-full"
                    name="name"
                    placeholder="Nombre del grupo"
                  />
                </Field>
              </form>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                disabled={replicating}
                form="formreplicate"
                type="submit"
                icon={replicating ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                Replicar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Form
        defaultProp={item}
        onOpenChange={setOpenEdit}
        open={openEdit}
        refetch={refetch}
      />
    </>
  )
}
