import {
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
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import {
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

export default function Item({
  item,
  refetch
}: {
  item: TeGroup
  refetch: () => void
}) {
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

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
        <TableSelectionCell type="radio" />
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

      {openDelete && (
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
      )}
      <Form
        defaultProp={item}
        onOpenChange={setOpenEdit}
        open={openEdit}
        refetch={refetch}
      />
    </>
  )
}
