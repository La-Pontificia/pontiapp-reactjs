/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Avatar,
  Button,
  Combobox,
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
  Option,
  Persona,
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
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { localizedStrings } from '~/const'
import { api } from '~/lib/api'
import { format, parse } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { BusinessUnit } from '~/types/business-unit'
import { User } from '~/types/user'
import { parseTime } from '~/utils'
import { useER } from './state'
import PeriodForm from './period'
import CycleForm from './cycle'
// import SectionForm from './section'
// import ClassRoomForm from './rooms'
import BranchForm from './branch'
import AreaForm from './area'
import AcademicProgramForm from './academic-program'
import FirstRubric from './first-rubric'
import SecondRubric from './second-rubric'
import { toast } from 'anni'
import { getPersonByDocumentId } from '~/utils/fetch'

type Props = {
  title?: string
  defaultValues?: FormValues
  defaultFirstProp?: object
  defaultSecondProp?: object
  onSubmitTitle?: string
  open: boolean
  setOpen: (open: boolean) => void
  readOnly?: boolean
  refetch?: () => void
}

export type FormValues = {
  id: string
  teacherDocumentId: string
  teacherFullName: string
  period: string
  cycle: string
  section: string
  classRoom: string
  branch: string
  businessUnit: string
  area: string
  academicProgram: string
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

  const { user: authUser } = useAuth()
  const [searching, setSearching] = React.useState(false)

  const { control, handleSubmit, setValue, watch, reset } = useForm<FormValues>(
    {
      defaultValues: defaultValues ?? {
        evaluator: authUser,
        teacherDocumentId: '',
        teacherFullName: ''
      },
      reValidateMode: 'onChange'
    }
  )

  const { startOfClass } = watch()

  const getPerson = async (documentId: string) => {
    setSearching(true)
    const res = await api.get<User[]>(`users/search?q=${documentId}`)
    if (res.ok) {
      setValue(
        'teacherFullName',
        `${res.data[0].lastNames} ${res.data[0].firstNames}`
      )
    } else {
      const person = await getPersonByDocumentId(documentId)
      if (person) setValue('teacherFullName', person.fullName)
    }
    setSearching(false)
  }

  const { data: businessUnits } = useQuery<BusinessUnit[] | null>({
    queryKey: ['partials/businessUnits/all'],
    queryFn: async () => {
      const res = await api.get<[]>('partials/businessUnits/all')
      if (!res.ok) return null
      return res.data.map((event) => new BusinessUnit(event))
    }
  })

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

  const onSubmit = handleSubmit((values) => {
    create({
      values: {
        teacherDocumentId: Number(values.teacherDocumentId),
        teacherFullName: values.teacherFullName,
        period: values.period,
        cycle: values.cycle,
        section: values.section,
        classRoom: values.classRoom,
        branchId: values.branch,
        businessUnitId: values.businessUnit,
        area: values.area,
        academicProgram: values.academicProgram,
        course: values.course,
        date: format(values.date, 'YYYY-MM-DD'),
        evaluatorId: values.evaluator.id,
        evaluationNumber: Number(values.evaluationNumber),
        startOfClass: format(values.startOfClass, 'YYYY-MM-DD HH:mm:ss'),
        endOfClass: format(values.endOfClass, 'YYYY-MM-DD HH:mm:ss'),
        trackingTime: format(values.trackingTime, 'YYYY-MM-DD HH:mm:ss'),
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

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: ({ values, id }: { values: any; id?: string }) =>
      api.post(id ? `rm/tt/${id}/update` : 'rm/tt/store', {
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

  return (
    <>
      <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DialogSurface className="min-w-[700px]">
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
            <DialogContent className="space-y-1">
              <Divider className="py-2">Docente</Divider>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="teacherDocumentId"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Documento de identidad"
                    required
                  >
                    <Input
                      contentAfter={
                        searching ? <Spinner size="extra-tiny" /> : undefined
                      }
                      type="number"
                      {...field}
                      onChange={(e) => {
                        if (e.target.value.length === 8) {
                          getPerson(e.target.value)
                        }
                        field.onChange(e.target.value)
                      }}
                      readOnly={readOnly}
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="teacherFullName"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Nombres"
                    required
                  >
                    <Input
                      disabled={searching}
                      {...field}
                      placeholder="Apellidos, Nombres"
                      readOnly={readOnly}
                    />
                  </Field>
                )}
              />
              <Divider className="py-2">Periodo, ciclo, sección y aula</Divider>
              <PeriodForm
                readOnly={readOnly}
                setValue={setValue}
                control={control}
              />
              <CycleForm
                readOnly={readOnly}
                setValue={setValue}
                control={control}
              />
              {/* <SectionForm
                readOnly={readOnly}
                setValue={setValue}
                control={control}
              /> */}
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="section"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Sección"
                    orientation="horizontal"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="classRoom"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Aula"
                    orientation="horizontal"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
                  </Field>
                )}
              />
              <BranchForm
                readOnly={readOnly}
                setValue={setValue}
                control={control}
              />
              <Divider className="py-2">
                Unidad de negocio, área, programa y curso
              </Divider>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="businessUnit"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Unidad de negocio"
                    orientation="horizontal"
                    required
                  >
                    <Combobox
                      input={{
                        autoComplete: 'off'
                      }}
                      open={readOnly ? false : undefined}
                      onOptionSelect={async (_, option) => {
                        const period = businessUnits?.find(
                          (d) => d.id === option.optionValue
                        )
                        if (!period) field.onChange(null)
                        field.onChange(period?.id)
                      }}
                      defaultValue={
                        field.value
                          ? businessUnits?.find((e) => e.id === field.value)
                              ?.name
                          : ''
                      }
                      defaultSelectedOptions={
                        field.value ? [field.value] : undefined
                      }
                    >
                      {businessUnits?.map((d) => (
                        <Option
                          disabled={readOnly}
                          text={d.name}
                          key={d.id}
                          value={d.id}
                        >
                          <Persona
                            avatar={{
                              name: d.name,
                              color: 'colorful'
                            }}
                            secondaryText={d.name}
                            name={d.acronym}
                          />
                        </Option>
                      ))}
                    </Combobox>
                  </Field>
                )}
              />
              <AreaForm
                readOnly={readOnly}
                setValue={setValue}
                control={control}
              />
              <AcademicProgramForm
                readOnly={readOnly}
                setValue={setValue}
                control={control}
              />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="course"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Nombre del curso"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
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
                name="evaluator"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Evaluador"
                    orientation="horizontal"
                    required
                  >
                    <Input
                      contentBefore={
                        <Avatar
                          size={20}
                          image={{
                            src: field.value?.photoURL
                          }}
                          color="colorful"
                          name={field.value?.displayName}
                        />
                      }
                      readOnly
                      value={field.value?.displayName}
                    />
                  </Field>
                )}
              />
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
              <Divider className="py-2">
                Horas de inicio, fin y seguimiento
              </Divider>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="startOfClass"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Inicio de clase"
                    orientation="horizontal"
                    required
                  >
                    <TimePicker
                      readOnly={readOnly}
                      open={readOnly ? false : undefined}
                      ref={field.ref}
                      defaultValue={
                        field.value ? formatDateToTimeString(field.value) : ''
                      }
                      startHour={6}
                      endHour={23}
                      onBlur={(e) => {
                        const parse = parseTime(e.target.value)
                        if (parse) field.onChange(parse)
                        else field.onChange(null)
                      }}
                      onTimeChange={(_, e) =>
                        e.selectedTime && field.onChange(parse(e.selectedTime))
                      }
                      freeform
                      placeholder="Seleccionar hora"
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="endOfClass"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Fin de clase"
                    required
                    orientation="horizontal"
                  >
                    <TimePicker
                      readOnly={readOnly}
                      open={readOnly ? false : undefined}
                      ref={field.ref}
                      defaultValue={
                        field.value ? formatDateToTimeString(field.value) : ''
                      }
                      startHour={
                        startOfClass ? (startOfClass?.getHours() as any) : 0
                      }
                      endHour={23}
                      onBlur={(e) => {
                        const parse = parseTime(e.target.value)
                        if (parse) field.onChange(parse)
                        else field.onChange(null)
                      }}
                      onTimeChange={(_, e) =>
                        e.selectedTime && field.onChange(parse(e.selectedTime))
                      }
                      freeform
                      placeholder="Seleccionar hora"
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
                        field.value ? formatDateToTimeString(field.value) : ''
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
                        e.selectedTime && field.onChange(parse(e.selectedTime))
                      }
                      freeform
                      placeholder="Seleccionar hora"
                    />
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
                    <Textarea {...field} placeholder="Aa" readOnly={readOnly} />
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
                    <Textarea {...field} placeholder="Aa" readOnly={readOnly} />
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
                    <Textarea {...field} placeholder="Aa" readOnly={readOnly} />
                  </Field>
                )}
              />
            </DialogContent>
            <DialogActions className="pt-5">
              <Button
                disabled={creating}
                icon={creating ? <Spinner size="extra-tiny" /> : undefined}
                onClick={() => {
                  if (readOnly) {
                    setOpen(false)
                  } else {
                    onSubmit()
                  }
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
