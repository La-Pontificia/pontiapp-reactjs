/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Avatar,
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
  Spinner,
  Textarea
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { Dismiss24Regular } from '@fluentui/react-icons'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { localizedStrings } from '~/const'
import { api } from '~/lib/api'
import { format, parse, getDays } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { User } from '~/types/user'
import { parseTime } from '~/utils'
import { useER } from './state'
import FirstRubric from './first-rubric'
import SecondRubric from './second-rubric'
import { toast } from 'anni'
import { Program } from '~/types/academic/program'
import { Period } from '~/types/academic/period'
import { Section } from '~/types/academic/section'
import { SectionCourse } from '~/types/academic/section-course'
import { Classroom } from '~/types/academic/classroom'
import { Pavilion } from '~/types/academic/pavilion'
import { Branch } from '~/types/rm/branch'
import { SectionCourseSchedule } from '~/types/academic/section-course-schedule'
import { TeacherTraking } from '~/types/academic/teacher-traking'

type Props = {
  title?: string
  defaultValues?: TeacherTraking
  defaultFirstProp?: object
  defaultSecondProp?: object
  onSubmitTitle?: string
  open: boolean
  setOpen: (open: boolean) => void
  readOnly?: boolean
  refetch?: () => void
}

export type FormValues = {
  period: Period | null
  program: Program | null
  section: Section | null
  sectionCourse: SectionCourse | null
  schedule: SectionCourseSchedule | null
  pavilion: Pavilion | null
  classroom: Classroom | null
  branch: Branch | null

  id: string
  teacherDocumentId: string
  teacherFullName: string
  cycle: string
  businessUnit: string
  area: string
  aditional1: string
  aditional2: string
  aditional3: string

  course: string
  date: string
  evaluator: User
  evaluationNumber: string

  startOfClass: Date | null
  endOfClass: Date | null
  trackingTime: Date | null
}

export default function TeacherTrackingForm(props?: Props) {
  const {
    refetch = () => {},
    open = false,
    readOnly = false,
    defaultFirstProp,
    defaultSecondProp,
    defaultValues,
    setOpen = () => {},
    title = 'Registrar nueva evaluación',
    onSubmitTitle = 'Guardar'
  } = props || {}

  if (!open) return null

  const { user: authUser, businessUnit } = useAuth()

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      // defaultValues
    }
  })

  const { startOfClass } = watch()

  const {
    firstER,
    secondER,
    secondGrade,
    secondQualification,
    secondTotal,
    setFirstER,
    setSecondER,
    resetState
  } = useER({
    firstProp: defaultFirstProp as any,
    secondProp: defaultSecondProp as any
  })

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: ({ values, id }: { values: any; id?: string }) =>
      api.post(id ? `academic/tt/${id}/update` : 'academic/tt/store', {
        data: JSON.stringify(values),
        alreadyHandleError: false
      }),
    onError: (_, variables) => {
      toast.error(
        variables.id
          ? 'Ocurrió un error al actualizar la evaluación'
          : 'Ocurrió un error al registrar la evaluación'
      )
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.id
          ? 'Evaluación actualizado correctamente'
          : 'Evaluación registrado correctamente'
      )
      refetch()
      reset()
      resetState()
      setOpen(false)
    }
  })

  const period = watch('period')
  const program = watch('program')
  const section = watch('section')
  const sectionCourse = watch('sectionCourse')
  const schedule = watch('schedule')

  const { data: programs } = useQuery<Program[]>({
    queryKey: ['academic/programs', businessUnit],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Program[]>(
        `academic/programs?businessUnitId=${businessUnit?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new Program(data))
    }
  })

  const { data: periods } = useQuery<Period[]>({
    queryKey: ['academic/periods', businessUnit],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Period[]>(
        `academic/periods?businessUnitId=${businessUnit?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new Period(data))
    }
  })

  const { data: sections } = useQuery<Section[]>({
    queryKey: ['academic/sections', period, program],
    enabled: !!(open && period && program),
    queryFn: async () => {
      const res = await api.get<Section[]>(
        `academic/sections?periodId=${period?.id}&programId=${program?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new Section(data))
    }
  })

  const { data: sectionCourses } = useQuery<SectionCourse[]>({
    queryKey: ['academic/sections/courses', section],
    enabled: !!(open && section),
    queryFn: async () => {
      const res = await api.get<SectionCourse[]>(
        `academic/sections/courses?sectionId=${section?.id}`
      )
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new SectionCourse(data))
    }
  })

  const { data: schedules } = useQuery<SectionCourseSchedule[]>({
    queryKey: ['academic/sections/courses/schedules', sectionCourse],
    enabled: open && !!sectionCourse,
    queryFn: async () => {
      const res = await api.get<SectionCourseSchedule[]>(
        `academic/sections/courses/schedules?sectionCourseId=${sectionCourse?.id}`
      )
      if (!res.ok) return []
      return res.data.map((data) => new SectionCourseSchedule(data))
    }
  })

  const { data: branches } = useQuery<Branch[]>({
    queryKey: ['rm/branches'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Branch[]>(`rm/branches`)
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new Branch(data))
    }
  })

  const onSubmit = handleSubmit((values) => {
    create({
      values: {
        sectionCourseId: values.sectionCourse?.id,
        scheduleId: values.schedule?.id,
        branchId: values.branch?.id,
        date: format(values.date, 'YYYY-MM-DD'),
        trackingTime: format(values.trackingTime, 'YYYY-MM-DD HH:mm:ss'),
        evaluationNumber: Number(values.evaluationNumber),

        er1Json: firstER,
        er1a: firstER?.a.obtained,
        er1b: firstER?.b.obtained,
        er1Obtained: ((firstER.a.obtained + firstER.b.obtained) / 100) * 20,
        er1Qualification:
          firstER.a.obtained + firstER.b.obtained >= 50
            ? 'Aprobado'
            : 'Desaprobado',

        er2Json: secondER,
        er2a1: Number(secondER.a.indicators.a.obtained),
        er2a2: Number(secondER.a.indicators.b.obtained),
        er2aObtained:
          Number(secondER.a.indicators.a.obtained) +
          Number(secondER.a.indicators.b.obtained),

        er2b1: Number(secondER.b.indicators.b.obtained),
        er2b2: Number(secondER.b.indicators.c.obtained),
        er2bObtained:
          Number(secondER.b.indicators.b.obtained) +
          Number(secondER.b.indicators.c.obtained),
        er2Total: secondTotal,
        er2FinalGrade: secondGrade,
        er2Qualification: secondQualification,
        aditional1: values.aditional1,
        aditional2: values.aditional2,
        aditional3: values.aditional3
      },
      id: defaultValues?.id
    })
  })

  return (
    <>
      <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DialogSurface className="min-w-[600px]">
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
              {title}
            </DialogTitle>
            <DialogContent className="space-y-2">
              <Divider className="py-2">
                {/* Unidad de negocio, área, programa y curso */}
              </Divider>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="program"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Programa Académico"
                    required
                    orientation="horizontal"
                  >
                    <Select
                      onChange={(e) => {
                        const program = programs?.find(
                          (p) => p.id === e.target.value
                        )
                        field.onChange(program)
                      }}
                      value={field.value?.id}
                    >
                      <option disabled={readOnly} value="">
                        Seleccionar programa
                      </option>
                      {programs?.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="period"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Periodo Académico"
                    required
                    orientation="horizontal"
                  >
                    <Select
                      onChange={(e) => {
                        const period = periods?.find(
                          (p) => p.id === e.target.value
                        )
                        field.onChange(period)
                      }}
                      value={field.value?.id}
                    >
                      <option disabled={readOnly} value="">
                        Seleccionar periodo académico
                      </option>
                      {periods?.map((period) => (
                        <option key={period.id} value={period.id}>
                          {period.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              />
              {period && program && (
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="section"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Sección"
                      required
                      orientation="horizontal"
                    >
                      <Select
                        onChange={(e) => {
                          const section = sections?.find(
                            (p) => p.id === e.target.value
                          )
                          field.onChange(section)
                        }}
                        value={field.value?.id}
                      >
                        <option disabled={readOnly} value="">
                          Seleccionar sección
                        </option>
                        {sections?.map((section) => (
                          <option key={section.id} value={section.id}>
                            {section.code}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                />
              )}
              {section && (
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="sectionCourse"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Unidad didáctica"
                      required
                      orientation="horizontal"
                    >
                      <Select
                        onChange={(e) => {
                          const course = sectionCourses?.find(
                            (p) => p.id === e.target.value
                          )
                          field.onChange(course)
                        }}
                        value={field.value?.id}
                      >
                        <option disabled={readOnly} value="">
                          Seleccionar curso
                        </option>
                        {sectionCourses?.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.planCourse?.course?.code} -{' '}
                            {course.planCourse?.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                />
              )}
              {sectionCourse?.teacher && (
                <Field orientation="horizontal" label="Docente" required>
                  <Input
                    disabled
                    value={
                      sectionCourse?.teacher?.documentId +
                      ' - ' +
                      sectionCourse?.teacher?.fullName
                    }
                    readOnly={readOnly}
                  />
                </Field>
              )}
              {sectionCourse && (
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="schedule"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Horario de clase"
                      required
                      orientation="horizontal"
                    >
                      <Select
                        onChange={(e) => {
                          const schedule = schedules?.find(
                            (p) => p.id === e.target.value
                          )
                          field.onChange(schedule)
                        }}
                        value={field.value?.id}
                      >
                        <option disabled={readOnly} value="">
                          Seleccione un horario de clase
                        </option>
                        {schedules?.map((schedule) => (
                          <option key={schedule.id} value={schedule.id}>
                            {getDays(schedule.daysOfWeek)} -{' '}
                            {format(schedule.startTime, 'HH:mm A')} -{' '}
                            {format(schedule.endTime, 'HH:mm A')}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                />
              )}
              {schedule && (
                <Field orientation="horizontal" label="Pabellon/Aula" required>
                  <Input
                    disabled
                    value={`${schedule.classroom?.pavilion?.name} - ${schedule.classroom?.code}`}
                    readOnly={readOnly}
                  />
                </Field>
              )}
              {schedule && (
                <>
                  <Divider className="py-2">Sede, fecha y evaluador</Divider>
                  <Controller
                    control={control}
                    rules={{ required: 'Requerido' }}
                    name="branch"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Sede:"
                        required
                        orientation="horizontal"
                      >
                        <Select
                          onChange={(e) => {
                            field.onChange(
                              branches?.find((p) => p.id === e.target.value)
                            )
                          }}
                          value={field.value?.id}
                        >
                          <option disabled={readOnly} value="">
                            Seleccionar sede
                          </option>
                          {branches?.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{ required: 'Requerido' }}
                    name="date"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Fecha de evaluación"
                        orientation="horizontal"
                        required
                      >
                        <DatePicker
                          open={readOnly ? false : undefined}
                          onBlur={field.onBlur}
                          value={field.value ? new Date(field.value) : null}
                          onSelectDate={(date) => {
                            field.onChange(date)
                          }}
                          formatDate={(date) =>
                            format(date, 'dddd, DD [de] MMMM [de] YYYY')
                          }
                          strings={localizedStrings}
                          placeholder="Seleccionar fecha"
                        />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{ required: 'Requerido' }}
                    name="trackingTime"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Hora de seguimiento"
                        orientation="horizontal"
                        required
                      >
                        <TimePicker
                          readOnly={readOnly}
                          open={readOnly ? false : undefined}
                          ref={field.ref}
                          defaultValue={
                            field.value
                              ? formatDateToTimeString(field.value)
                              : ''
                          }
                          startHour={
                            startOfClass ? (startOfClass.getHours() as any) : 0
                          }
                          endHour={23}
                          onBlur={(e) => {
                            const parse = parseTime(e.target.value)
                            if (parse) field.onChange(parse)
                            else field.onChange(null)
                          }}
                          onTimeChange={(_, e) =>
                            e.selectedTime &&
                            field.onChange(parse(e.selectedTime))
                          }
                          freeform
                          placeholder="Seleccionar hora"
                        />
                      </Field>
                    )}
                  />
                  <Field label="Evaluador" orientation="horizontal" required>
                    <Input
                      disabled
                      contentBefore={
                        <Avatar
                          size={20}
                          image={{
                            src: authUser?.photoURL
                          }}
                          color="colorful"
                          name={authUser?.displayName}
                        />
                      }
                      readOnly
                      defaultValue={authUser?.displayName}
                    />
                  </Field>
                  <Controller
                    control={control}
                    rules={{ required: 'Requerido' }}
                    name="evaluationNumber"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Número de evaluación"
                        orientation="horizontal"
                        required
                      >
                        <Select {...field}>
                          <option disabled={readOnly} value="">
                            Seleccionar
                          </option>
                          <option disabled={readOnly} value="1">
                            Primera
                          </option>
                          <option disabled={readOnly} value="2">
                            Segunda
                          </option>
                        </Select>
                      </Field>
                    )}
                  />
                  <Divider className="py-2">Rúbricas de evaluaciones</Divider>
                  <FirstRubric
                    readOnly={readOnly}
                    firstER={firstER}
                    setFirstER={setFirstER}
                  />
                  <SecondRubric
                    readOnly={readOnly}
                    secondER={secondER}
                    secondGrade={secondGrade}
                    secondQualification={secondQualification}
                    secondTotal={secondTotal}
                    setSecondER={setSecondER}
                  />
                  <Divider className="py-2">Adicional</Divider>
                  <Controller
                    control={control}
                    name="aditional1"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        orientation="horizontal"
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Aspectos de mejora del docente y/o incidencias en el aula"
                      >
                        <Textarea
                          {...field}
                          placeholder="Aa"
                          readOnly={readOnly}
                        />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="aditional2"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        orientation="horizontal"
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Fortalezas"
                      >
                        <Textarea
                          {...field}
                          placeholder="Aa"
                          readOnly={readOnly}
                        />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="aditional3"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        orientation="horizontal"
                        validationState={error ? 'error' : 'none'}
                        validationMessage={error?.message}
                        label="Recomendaciones"
                      >
                        <Textarea
                          {...field}
                          placeholder="Aa"
                          readOnly={readOnly}
                        />
                      </Field>
                    )}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions className="pt-5">
              <Button
                disabled={creating}
                icon={creating ? <Spinner size="extra-tiny" /> : undefined}
                onClick={() => {
                  if (readOnly) setOpen(false)
                  else onSubmit()
                }}
                appearance="primary"
              >
                {onSubmitTitle}
              </Button>
              <Button onClick={() => setOpen(false)} appearance="outline">
                Cerrar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
