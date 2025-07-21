import { api } from '@/lib/api'
import { handleError } from '@/utils'
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Select,
  SpinButton,
  Spinner,
  Textarea
} from '@fluentui/react-components'
import {
  AddRegular,
  DeleteRegular,
  EditRegular,
  TextBulletListSquareEditRegular
} from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSettingContext } from '.'
import { TeQuestion } from '@/types/academic/te-question'
import { BiSolidRightArrow } from 'react-icons/bi'

// eslint-disable-next-line react-refresh/only-export-components
export const types = {
  text: 'Texto',
  select: 'Selección simple'
}

export default function Questions() {
  const { block, question, setQuestion } = useSettingContext()
  const {
    data: questions,
    isLoading,
    refetch
  } = useQuery<TeQuestion[] | null>({
    queryKey: ['academic/te/question', block?.id],
    queryFn: async () => {
      const res = await api.get<TeQuestion[]>(
        `academic/te/question?blockId=${block?.id}`
      )
      if (!res.ok) return null
      return res.data.map((e) => new TeQuestion(e))
    }
  })

  React.useEffect(() => {
    setQuestion(null)
  }, [setQuestion])

  const [openForm, setOpenForm] = React.useState(false)

  return (
    <div
      data-open={question ? '' : undefined}
      className="col-span-6 data-[open]:col-span-3 px-2 flex flex-col"
    >
      <p className="opacity-60">Preguntas</p>
      <div className="grow">
        {isLoading ? (
          <div className="py-20">
            <Spinner size="tiny" />
          </div>
        ) : questions && questions?.length > 0 ? (
          <ol className="grid pt-1">
            {questions?.map((prop) => (
              <Item key={prop.id} prop={prop} refetch={refetch} />
            ))}
          </ol>
        ) : (
          <div className="py-20 px-10 text-center">
            No hay nada que mostrar
            <br />
            <p className="text-xs pt-1 opacity-60">
              Selecciona una medición para ver las preguntas.
            </p>
          </div>
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

const Item = ({ prop, refetch }: { prop: TeQuestion; refetch: () => void }) => {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const { setQuestion, question } = useSettingContext()

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/te/question/${prop.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! La pregunta ha sido eliminada con éxito.')
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const isCurrent = question?.id === prop.id

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
            <DialogTitle>
              ¿Estás seguro de eliminar: {prop.question}?
            </DialogTitle>
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
            className="flex py-1 pr-2 relative group items-center rounded-lg data-[current]:dark:bg-yellow-400 data-[current]:dark:text-yellow-900 data-[current]:bg-yellow-800 data-[current]:text-yellow-100 transition-colors hover:bg-stone-500/10"
          >
            {isCurrent && (
              <div className="absolute inset-y-0 -right-[11px] flex items-center">
                <BiSolidRightArrow className="dark:text-yellow-400 text-yellow-800" />
              </div>
            )}
            <div className="w-9 flex justify-center opacity-60 items-center">
              {String(prop.order).padStart(2, '0')}
            </div>
            <div className="py-1 flex items-center w-full">
              <p className="grow px-1">
                {prop.question}
                {prop.type === 'select' && !isCurrent && (
                  <span className="px-1 ml-1 py-px dark:bg-yellow-500/10 dark:text-yellow-600 bg-yellow-500/20 rounded-md text-yellow-600">
                    {types[prop.type] ?? 'Desconocido'}
                  </span>
                )}
              </p>
              <div className="items-center relative gap-1 opacity-0 group-hover:opacity-100 flex transition-opacity">
                {prop.type === 'select' && (
                  <Button
                    icon={<TextBulletListSquareEditRegular fontSize={14} />}
                    size="small"
                    shape="rounded"
                    onClick={() => setQuestion(prop)}
                  />
                )}
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
  prop?: TeQuestion | null
  refetch: () => void
}) => {
  const { block } = useSettingContext()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      question: prop ? prop.question : '',
      order: prop ? prop.order : 0,
      type: prop ? prop.type : 'text'
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        prop ? `academic/te/question/${prop.id}` : 'academic/te/question',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success('Pregunta registrada correctamente')
      reset()
      refetch()
      setOpen(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      question: values.question,
      order: values.order,
      type: values.type,
      blockId: block?.id
    })
  })

  if (!open) return null
  return (
    <form onSubmit={onSubmit} className="rounded-xl grid p-2 gap-2">
      <p className="text-xs opacity-60 pt-1 px-1">
        {prop ? 'Editar pregunta' : 'Nueva pregunta'}
      </p>
      <Controller
        control={control}
        rules={{
          required: 'El nombre es requerido'
        }}
        name="question"
        render={({ field, fieldState }) => (
          <Field
            label="Pregunta"
            size="small"
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Textarea className="h-24" autoFocus {...field} />
          </Field>
        )}
      />
      <Controller
        control={control}
        rules={{
          required: 'El tipo es requerido'
        }}
        name="type"
        render={({ field, fieldState }) => (
          <Field
            label="Tipo de pregunta"
            size="small"
            validationState={fieldState.error ? 'error' : 'none'}
            validationMessage={fieldState.error?.message}
          >
            <Select {...field}>
              {Object.entries(types).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
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
