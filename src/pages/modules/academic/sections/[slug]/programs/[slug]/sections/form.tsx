import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Input,
  Select,
  Spinner
  // Textarea
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '~/lib/api'
import { Section } from '~/types/academic/section'
import { handleError } from '~/utils'
import { useSlugSection } from '../../../+layout'
// import { Cycle } from '~/types/academic/cycle'
import { Plan, PlanCourse } from '~/types/academic/plan'
import React from 'react'
import { useDebounce } from 'hothooks'
import SearchBox from '~/commons/search-box'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '~/components/table'
import { Cycle } from '~/types/academic/cycle'

type FormValues = {
  code: string
  plan: Plan | null
  cycle: Cycle | null
  courses: PlanCourse[]
}

export default function Form({
  onOpenChange,
  open,
  refetch = () => {},
  defaultProp,
  readOnly = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch: () => void
  defaultProp?: Section | null
  readOnly?: boolean
}) {
  const { period, program } = useSlugSection()

  const [q, setQ] = React.useState<string | null>(null)
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>(
    {
      values: defaultProp
        ? {
            code: defaultProp.code,
            cycle: defaultProp.cycle,
            courses: [],
            plan: defaultProp.plan
          }
        : { code: '', plan: null, cycle: null, courses: [] }
    }
  )

  const plan = watch('plan')
  const cycle = watch('cycle')

  const { data: cycles } = useQuery<Cycle[]>({
    queryKey: ['academic/cycles', program],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Cycle[]>(
        `academic/cycles?programId=${program?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { data: plans } = useQuery<Plan[]>({
    queryKey: ['academic/plans', program],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Plan[]>(
        `academic/plans?programId=${program?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp
          ? `academic/sections/${defaultProp.id}`
          : 'academic/sections',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success(
        'En hora buena! La sección ha sido guardado o actualizado con éxito.'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      code: values.code,
      planId: values.plan?.id,
      cycleId: values.cycle?.id,
      coursesIds: values.courses.map((course) => course.id),
      programId: program?.id,
      periodId: period?.id
    })
  })

  const { data: planCourses, isLoading: isLoadingPlanCourses } = useQuery<
    PlanCourse[]
  >({
    queryKey: ['academic/plans/courses', plan, q, cycle],
    enabled: open && !!plan,
    queryFn: async () => {
      const res = await api.get<PlanCourse[]>(
        `academic/plans/courses?planId=${plan?.id}${q ? `&q=${q}` : ''}${
          cycle ? `&cycleId=${cycle?.id}` : ''
        }`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { setValue: setValueQ } = useDebounce<string | null>({
    delay: 500,
    onFinish: (v) => setQ(v)
  })

  return (
    <>
      <Dialog open={open} onOpenChange={(_, { open }) => onOpenChange(open)}>
        <DialogSurface className="min-w-[550px] w-[550px]">
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              {defaultProp ? 'Editar sección' : 'Registrar nueva sección'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field orientation="horizontal" label="Programa:" required>
                <Input
                  disabled
                  readOnly={readOnly}
                  defaultValue={program?.name}
                />
              </Field>
              <Field orientation="horizontal" label="Periodo:" required>
                <Input
                  disabled
                  readOnly={readOnly}
                  defaultValue={period?.name}
                />
              </Field>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="code"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Código:"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="cycle"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Ciclo:"
                    required
                  >
                    <Select
                      onChange={(_, d) => {
                        const cycle = cycles?.find((c) => c.id === d.value)
                        setValue('courses', [])
                        setQ(null)
                        if (cycle) {
                          field.onChange(cycle)
                        } else {
                          field.onChange(null)
                        }
                      }}
                      value={field.value?.id}
                    >
                      <option value={''}>Seleccionar ciclo</option>
                      {cycles?.map((cycle) => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.code} - {cycle.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              />
              <Divider />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="plan"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Plan de estudio:"
                    required
                  >
                    <Select
                      onChange={(_, d) => {
                        const plan = plans?.find((c) => c.id === d.value)
                        setValue('courses', [])
                        setQ(null)
                        if (plan) {
                          field.onChange(plan)
                        } else {
                          field.onChange(null)
                        }
                      }}
                      value={field.value?.id}
                    >
                      <option value={''}>Seleccionar plan</option>
                      {plans?.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              />
              {plan && !defaultProp && (
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="courses"
                  render={({ field }) => (
                    <div className="dark:bg-neutral-900 overflow-y-auto p-2 rounded-xl min-h-[300px]">
                      <SearchBox onSearch={setValueQ} placeholder="Filtrar " />
                      {isLoadingPlanCourses ? (
                        <div className="pt-5">
                          <Spinner size="tiny" appearance="inverted" />
                        </div>
                      ) : (
                        <div className="pt-2">
                          <p className="text-neutral-400">
                            Selecciona un plan de estudio para ver los cursos.
                          </p>
                          {planCourses?.length === 0 ? (
                            <p className="text-neutral-500 pt-7 text-center">
                              No hay cursos en este plan de estudio.
                            </p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableSelectionCell
                                    checked={
                                      field.value?.length ===
                                      planCourses?.length
                                        ? true
                                        : field.value.length !== 0
                                        ? 'mixed'
                                        : false
                                    }
                                    onClick={() => {
                                      if (field.value?.length) {
                                        field.onChange([])
                                      } else {
                                        field.onChange(planCourses)
                                      }
                                    }}
                                  />
                                  <TableHeaderCell>Curso</TableHeaderCell>
                                  <TableHeaderCell>Ciclo</TableHeaderCell>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {planCourses?.map((course) => (
                                  <TableRow
                                    onClick={() => {
                                      const hasSelected = field.value?.some(
                                        (c) => c.id === course.id
                                      )
                                      if (hasSelected) {
                                        field.onChange(
                                          field.value?.filter(
                                            (c) => c.id !== course.id
                                          )
                                        )
                                      } else {
                                        field.onChange([
                                          ...(field.value ?? []),
                                          course
                                        ])
                                      }
                                    }}
                                    key={course.id}
                                  >
                                    <TableSelectionCell
                                      checked={field.value?.some(
                                        (c) => c.id === course.id
                                      )}
                                    />
                                    <TableCell>{course.name}</TableCell>
                                    <TableCell>{course.cycle.name}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                />
              )}
            </DialogContent>
            <DialogActions className="pt-5">
              <Button
                disabled={fetching}
                icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
                onClick={() => {
                  if (readOnly) {
                    onOpenChange(false)
                  } else {
                    onSubmit()
                  }
                }}
                appearance="primary"
              >
                {defaultProp ? 'Actualizar' : 'Registrar'}
              </Button>
              <Button onClick={() => onOpenChange(false)} appearance="outline">
                Cerrar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
