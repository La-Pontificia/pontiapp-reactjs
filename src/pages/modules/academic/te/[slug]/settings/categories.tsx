import { api } from '@/lib/api'
import { TeCategory } from '@/types/academic/te-category'
import { handleError } from '@/utils'
import { BiSolidRightArrow } from 'react-icons/bi'
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  SpinButton,
  Spinner
} from '@fluentui/react-components'
import { AddRegular, DeleteRegular, EditRegular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSettingContext } from '.'

export default function Categories() {
  const { group, setCategory, category } = useSettingContext()
  const {
    data: categories,
    isLoading,
    refetch
  } = useQuery<TeCategory[] | null>({
    queryKey: ['academic/te/cate', group.id],
    queryFn: async () => {
      const res = await api.get<TeCategory[]>(
        `academic/te/cate?groupId=${group.id}`
      )
      if (!res.ok) return null
      return res.data.map((e) => new TeCategory(e))
    }
  })

  React.useEffect(() => {
    if (!category && categories && categories.length > 0) {
      setCategory(categories[0])
    }
  }, [category, categories, setCategory])

  const [openForm, setOpenForm] = React.useState(false)

  return (
    <div className="col-span-3 pr-2 flex flex-col">
      <p className="opacity-60">Competencias</p>
      <div className="grow">
        {isLoading ? (
          <div className="py-20">
            <Spinner size="tiny" />
          </div>
        ) : (
          <ol className="grid pt-1">
            {categories?.map((prop) => (
              <Item key={prop.id} prop={prop} refetch={refetch} />
            ))}
          </ol>
        )}
      </div>
      <div className="py-1">
        {openForm ? (
          <Form refetch={refetch} open={openForm} setOpen={setOpenForm} />
        ) : (
          <Button onClick={() => setOpenForm(true)} className="!w-full">
            <AddRegular fontSize={20} />
          </Button>
        )}
      </div>
    </div>
  )
}

const Item = ({ prop, refetch }: { prop: TeCategory; refetch: () => void }) => {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const { setCategory, category, setBlock, setQuestion } = useSettingContext()

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/te/cate/${prop.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! La categoria ha sido eliminada con éxito.')
      if (category?.id === prop.id) {
        setCategory(null)
        setBlock(null)
      }
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const isCurrent = category?.id === prop.id

  return (
    <>
      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
        inertTrapFocus
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>¿Estás seguro de eliminar: {prop.name}?</DialogTitle>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => mutate()}
                disabled={isPending}
                icon={isPending ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                ELiminar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <li>
        {openForm ? (
          <Form
            prop={prop}
            refetch={refetch}
            setOpen={setOpenForm}
            open={openForm}
          />
        ) : (
          <div
            data-current={isCurrent ? '' : undefined}
            className="flex py-1 pr-2 relative group items-center rounded-lg data-[current]:dark:bg-blue-400 data-[current]:dark:text-blue-900 data-[current]:bg-blue-800 data-[current]:text-blue-100 transition-colors hover:bg-stone-500/10"
          >
            {isCurrent && (
              <div className="absolute inset-y-0 -right-[11px] flex items-center">
                <BiSolidRightArrow className="dark:text-blue-400 text-blue-800" />
              </div>
            )}
            <button
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                setCategory(prop)
                setBlock(null)
                setQuestion(null)
              }}
            />
            <div className="w-9 flex justify-center opacity-60 items-center">
              {String(prop.order).padStart(2, '0')}
            </div>
            <div className="py-1 flex items-center w-full">
              <p className="grow px-1">{prop.name}</p>
              <div className="items-center relative gap-1 opacity-0 group-hover:opacity-100 flex transition-opacity">
                <Button
                  icon={<EditRegular fontSize={14} />}
                  size="small"
                  shape="rounded"
                  onClick={() => setOpenForm(true)}
                />
                <Button
                  icon={<DeleteRegular fontSize={14} />}
                  size="small"
                  shape="rounded"
                  onClick={() => setOpenDelete(true)}
                />
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  )
}

const Form = ({
  open,
  setOpen,
  prop,
  refetch
}: {
  open: boolean
  setOpen: (open: boolean) => void
  prop?: TeCategory | null
  refetch: () => void
}) => {
  const { group } = useSettingContext()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: prop ? prop.name : '',
      order: prop ? prop.order : 0
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(prop ? `academic/te/cate/${prop.id}` : 'academic/te/cate', {
        alreadyHandleError: false,
        data: JSON.stringify(values)
      }),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success('Categoria registrada correctamente')
      reset()
      refetch()
      setOpen(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name,
      order: values.order,
      groupId: group.id
    })
  })

  if (!open) return null
  return (
    <form onSubmit={onSubmit} className="rounded-xl grid p-2 gap-2">
      <p className="text-xs opacity-60 pt-1 px-1">
        {prop ? 'Editar categoria' : 'Nueva categoria'}
      </p>
      <Controller
        control={control}
        rules={{
          required: 'El nombre es requerido'
        }}
        name="name"
        render={({ field, fieldState }) => (
          <Field
            label="Nombre"
            size="small"
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Input autoFocus {...field} />
          </Field>
        )}
      />
      <Controller
        control={control}
        rules={{
          required: 'El orden es requerido',
          min: {
            value: 0,
            message: 'Mayor o igual a 0'
          }
        }}
        name="order"
        render={({ field, fieldState }) => (
          <Field
            label="Orden"
            size="small"
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <SpinButton size="small" placeholder="Orden" {...field} />
          </Field>
        )}
      />
      <div className="flex items-center gap-2">
        <Button size="small" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button
          disabled={fetching}
          type="submit"
          size="small"
          className="w-full"
          appearance="primary"
          icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
        >
          {prop ? 'Guardar' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
