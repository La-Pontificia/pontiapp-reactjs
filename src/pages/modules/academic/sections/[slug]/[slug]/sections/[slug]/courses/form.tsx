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
  Select,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular, PersonLightbulbRegular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { PlanCourse } from '@/types/academic/plan'
import { SectionCourse } from '@/types/academic/section-course'
import { User } from '@/types/user'
import { handleError } from '@/utils'
import { useSlugSection } from '../../../../+layout'
import UserDrawer from '@/components/user-drawer'

type FormValues = {
  teacher?: User | null
  planCourse?: PlanCourse | null
}

export default function Form({
  onOpenChange,
  open,
  refetch = () => { },
  defaultProp,
  readOnly = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch: () => void
  defaultProp?: SectionCourse | null
  readOnly?: boolean
}) {
  const { section } = useSlugSection()
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    values: defaultProp
      ? {
        teacher: defaultProp.teacher,
        planCourse: defaultProp.planCourse
      }
      : {
        teacher: null,
        planCourse: null
      }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp
          ? `academic/sections/courses/${defaultProp.id}`
          : 'academic/sections/courses/',
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
        'En hora buena!, El curso ha sido agregado o actualizado a la sección con éxito'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      sectionId: section?.id,
      teacherId: values.teacher?.id,
      planCourseId: values.planCourse?.id
    })
  })

  const { data: planCourses } = useQuery<PlanCourse[]>({
    queryKey: ['academic/plans/courses', section],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<PlanCourse[]>(
        `academic/plans/courses?planId=${section?.plan.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { planCourse } = watch()

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
              {defaultProp ? 'Editar curso' : 'Agregar nuevo curso'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="planCourse"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Curso:"
                    required
                  >
                    <Select
                      onChange={(_, d) => {
                        const course = planCourses?.find(
                          (c) => c.id === d.value
                        )
                        if (course) {
                          field.onChange(course)
                        } else {
                          field.onChange(null)
                        }
                      }}
                      value={field.value?.id}
                    >
                      <option value={''}>Seleccionar curso</option>
                      {planCourses?.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              />
              {/* <pre>{JSON.stringify(planCourse, null, 2)}</pre> */}
              <Field orientation="horizontal" label="Codigo curso:" required>
                <Input
                  disabled
                  readOnly
                  value={planCourse?.course?.code ?? ''}
                />
              </Field>
              <Controller
                control={control}
                name="teacher"
                render={({ field }) => (
                  <Field orientation="horizontal" label="Docente:">
                    <UserDrawer
                      onSubmitTitle="Aceptar"
                      title="Seleccionar docente"
                      triggerProps={{
                        icon: <PersonLightbulbRegular />,
                        appearance: 'outline',
                        children: field.value
                          ? field.value.displayName
                          : 'Seleccionar docente'
                      }}
                      onSubmit={(users) => field.onChange(users[0])}
                      users={field.value ? [field.value] : []}
                    />
                  </Field>
                )}
              />
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
