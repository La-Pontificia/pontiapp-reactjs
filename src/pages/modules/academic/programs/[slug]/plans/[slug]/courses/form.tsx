import {
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Option,
  Select,
  Spinner,
  Switch
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { Course } from '@/types/academic/course'
import { Cycle } from '@/types/academic/cycle'
import { PlanCourse } from '@/types/academic/plan'
import { handleError } from '@/utils'
import { useSlugProgram } from '../../../+layout'
import React from 'react'
import { PLAN_COURSE_FORMULAS } from '@/const'

type FormValues = {
  cycle: Cycle | null
  course: Course | null
  name: string
  teoricHours: string
  practiceHours: string
  formula: string | null
  credits: string
  status: boolean
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
  defaultProp?: PlanCourse | null
  readOnly?: boolean
}) {
  const { plan, program } = useSlugProgram()

  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>(
    {
      values: defaultProp
        ? {
            course: defaultProp.course,
            cycle: defaultProp.cycle,
            name: defaultProp.name,
            teoricHours: defaultProp.teoricHours.toString(),
            credits: defaultProp.credits.toString(),
            practiceHours: defaultProp.practiceHours.toString(),
            formula: defaultProp.formula ?? '',
            status: defaultProp.status
          }
        : {
            cycle: null,
            course: null,
            name: '',
            teoricHours: '0',
            formula: null,
            practiceHours: '0',
            credits: '0',
            status: true
          }
    }
  )

  const { data: courses } = useQuery<Course[]>({
    queryKey: ['academic/courses', program],
    enabled: open,
    queryFn: async () => {
      const query = `academic/courses?programId=${program.id}&status=true`
      const res = await api.get<Course[]>(query)
      if (!res.ok) return []
      return res.data
    }
  })

  // courses ordered by name
  const coursesOrdered = courses?.sort((a, b) => a.name.localeCompare(b.name))

  const { data: cycles } = useQuery<Cycle[]>({
    queryKey: ['academic/cycles', program],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Cycle[]>(
        `academic/cycles?programId=${program.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp
          ? `academic/plans/courses/${defaultProp.id}`
          : 'academic/plans/courses',
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
        'En hora buena!, El curso ha sido agregago o actualizado al plan con éxito'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const { course } = watch()

  const onSubmit = handleSubmit((values) => {
    fetch({
      planId: plan?.id,
      courseId: values.course?.id,
      cycleId: values.cycle?.id,
      name: values.name,
      credits: values.credits ? Number(values.credits) : undefined,
      teoricHours: values.teoricHours ? Number(values.teoricHours) : undefined,
      practiceHours: values.practiceHours
        ? Number(values.practiceHours)
        : undefined,
      status: values.status,
      formula: values.formula
    })
  })

  // course query states
  const [query, setQuery] = React.useState<string>(
    defaultProp ? defaultProp?.course?.name : ''
  )

  const options = React.useMemo(() => {
    if (!coursesOrdered)
      return <Option disabled>No hay cursos disponibles</Option>

    if (!query) {
      return (
        <div className="p-5 text-center">Por favor, realice una busqueda</div>
      )
    }
    const filteredCourses = coursesOrdered.filter(
      (course) =>
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.code.toLowerCase().includes(query.toLowerCase())
    )

    if (filteredCourses.length === 0) {
      return <Option disabled>No hay cursos disponibles</Option>
    }

    return filteredCourses.slice(0, 10).map((course) => (
      <Option key={course.id} value={course.id} text={course.name}>
        <p>
          <span className="opacity-70">{course.code}</span> - {course.name}
        </p>
      </Option>
    ))
  }, [coursesOrdered, query])

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
              {defaultProp
                ? 'Editar curso del plan de estudio'
                : 'Agregar nuevo curso al plan de estudio'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field
                orientation="horizontal"
                label="Programa de estudio:"
                required
              >
                <Input
                  disabled
                  defaultValue={program.name}
                  readOnly={readOnly}
                />
              </Field>
              <Field orientation="horizontal" label="Plan de estudio:" required>
                <Input disabled defaultValue={plan?.name} readOnly={readOnly} />
              </Field>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="course"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Curso:"
                    required
                  >
                    <Combobox
                      onOptionSelect={(_, d) => {
                        const course = courses?.find(
                          (c) => c.id === d.optionValue
                        )
                        setQuery(course ? course.name : '')
                        setValue('name', course?.name ?? '')
                        field.onChange(course ? course : null)
                      }}
                      defaultSelectedOptions={
                        field.value ? [field.value?.id] : []
                      }
                      placeholder="Sleccionar un curso"
                      onChange={(ev) => setQuery(ev.target.value)}
                      value={query}
                    >
                      {options}
                    </Combobox>
                  </Field>
                )}
              />
              {course && (
                <>
                  <Field
                    required
                    orientation="horizontal"
                    label="Codigo de curso:"
                  >
                    <Input
                      disabled
                      value={course?.code ?? ''}
                      readOnly={readOnly}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Requerido' }}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        required
                        orientation="horizontal"
                        label="Nombre del curso:"
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
                  <Controller
                    control={control}
                    name="teoricHours"
                    render={({ field }) => (
                      <Field orientation="horizontal" label="Horas teóricas:">
                        <Input {...field} type="number" readOnly={readOnly} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="practiceHours"
                    render={({ field }) => (
                      <Field orientation="horizontal" label="Horas prácticas:">
                        <Input {...field} type="number" readOnly={readOnly} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="credits"
                    render={({ field }) => (
                      <Field
                        orientation="horizontal"
                        label="Número de créditos:"
                      >
                        <Input {...field} type="number" readOnly={readOnly} />
                      </Field>
                    )}
                  />
                  <Field required label="Fórmula:" orientation="horizontal">
                    <Controller
                      control={control}
                      rules={{ required: 'Requerido' }}
                      name="formula"
                      render={({ field, fieldState: { error } }) => (
                        <Field
                          validationMessage={error?.message}
                          validationState={error ? 'error' : 'none'}
                        >
                          <Select
                            onChange={(_, d) => {
                              field.onChange(d.value)
                            }}
                            value={field.value ?? ''}
                          >
                            <option value={''}>Seleccionar una fórmula</option>
                            {Object.entries(PLAN_COURSE_FORMULAS)?.map(
                              ([key, name]) => (
                                <option key={key} value={key}>
                                  {name}
                                </option>
                              )
                            )}
                          </Select>
                        </Field>
                      )}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        orientation="horizontal"
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Estado:"
                      >
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={readOnly}
                        />
                      </Field>
                    )}
                  />
                </>
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
