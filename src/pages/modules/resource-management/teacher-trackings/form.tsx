/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  InfoLabel,
  Input,
  Select
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { AddFilled, Dismiss24Regular } from '@fluentui/react-icons'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { localizedStrings } from '~/const'
import { api } from '~/lib/api'
import { format, parse } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { BusinessUnit } from '~/types/business-unit'
import { User } from '~/types/user'
import { parseTime } from '~/utils'
import { modalities, scales, useER } from './state'

type Props = {
  title?: string
  onSubmitTitle?: string
}

type FormValues = {
  teacherDocument: string
  teacherFullName: string
  semester: string
  cycle: string
  section: string
  classRoom: string
  headquarter: string
  businessUnitId: string
  area: string
  program: string
  course: string
  date: string
  evaluator: User
  evaluationNumber: string

  startOfClass: Date | null
  endOfClass: Date | null
  trackingTime: Date | null
}

export default function TeacherTrackingForm(props?: Props) {
  const { title = 'Registrar nuevo seguimiento', onSubmitTitle = 'Registrar' } =
    props || {}

  const [openDrawer, setOpenDrawer] = React.useState(false)
  const { user: authUser } = useAuth()

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      evaluator: authUser
    }
  })

  const { startOfClass } = watch()

  const onSubmit = handleSubmit((values) => {
    console.log(values)
  })

  const { data: businessUnits, isLoading: isLoadingBusinessUnits } = useQuery<
    BusinessUnit[] | null
  >({
    queryKey: ['partials/businessUnits/all'],
    queryFn: async () => {
      const res = await api.get<[]>('partials/businessUnits/all')
      if (!res.ok) return null
      return res.data.map((event) => new BusinessUnit(event))
    }
  })

  const {
    firstER,
    setFirstER,
    secondER,
    setSecondER,
    firstGrade,
    firstQualification,
    firstTotal
  } = useER()

  return (
    <>
      <Button
        appearance="primary"
        onClick={() => setOpenDrawer(true)}
        style={{
          borderRadius: '1rem'
        }}
        className="flex font-semibold max-lg:hidden items-center gap-1 rounded-md hover:bg-neutral-500/20 p-1.5"
      >
        <AddFilled fontSize={20} />
      </Button>
      <Drawer
        position="end"
        separator
        className="xl:min-w-[65svw] lg:min-w-[80svw] max-w-full min-w-full"
        open={openDrawer}
        onOpenChange={(_, { open }) => setOpenDrawer(open)}
      >
        <DrawerHeader className="border-b border-stone-500/40">
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={() => setOpenDrawer(false)}
              />
            }
          >
            {title}
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody className="flex flex-col overflow-y-auto">
          <div className="grid py-4">
            <h1 className="py-2 text-sm dark:text-yellow-500 font-semibold text-yellow-700">
              Información requerida del seguimiento
            </h1>
            <div className="grid gap-4">
              <div className="grid lg:grid-cols-2 items-start xl:grid-cols-3 gap-4">
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="teacherDocument"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      className="lg:col-span-1"
                      label="Documento de identidad"
                      required
                    >
                      <Input type="number" {...field} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="teacherFullName"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      className="lg:col-span-2"
                      label="Apellidos y nombres"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
              </div>
              <div className="grid lg:grid-cols-4 items-start xl:grid-cols-5 gap-4">
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="semester"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Semestre"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="cycle"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Ciclo"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
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
                    >
                      <Input {...field} />
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
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="headquarter"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Sede"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
              </div>
            </div>
            <h1 className="py-2 pt-10 text-sm dark:text-yellow-500 font-semibold text-yellow-700">
              Unidad de negocio, área, programa y curso
            </h1>
            <div className="grid gap-4">
              <div className="grid lg:grid-cols-3 items-start xl:grid-cols-4 gap-4">
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="businessUnitId"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Unidad de negocio"
                      required
                    >
                      <Select {...field} disabled={isLoadingBusinessUnits}>
                        <option value="">
                          {isLoadingBusinessUnits
                            ? 'Cargando...'
                            : 'Seleccionar'}
                        </option>
                        {businessUnits?.map((business) => (
                          <option key={business.id} value={business.id}>
                            {business.acronym} - {business.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="area"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Área"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="program"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Programa de estudio"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="course"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Nombre del curso"
                      required
                    >
                      <Input {...field} />
                    </Field>
                  )}
                />
              </div>
            </div>
            <h1 className="py-2 pt-10 text-sm dark:text-yellow-500 font-semibold text-yellow-700">
              Fecha, evaluador y número de evaluación
            </h1>
            <div className="grid gap-4">
              <div className="grid items-start xl:grid-cols-3 gap-4">
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="date"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Fecha de evaluación"
                      required
                    >
                      <DatePicker
                        disabled={field.disabled}
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
                      required
                    >
                      <Input
                        contentBefore={
                          <Avatar
                            size={20}
                            image={{
                              src: field.value.photoURL
                            }}
                            color="colorful"
                            name={field.value.displayName}
                          />
                        }
                        readOnly
                        value={field.value.displayName}
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
                      required
                    >
                      <Select {...field}>
                        <option value="">Seleccionar</option>
                        <option value="1">Primera</option>
                        <option value="2">Segunda</option>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            </div>
            <h1 className="py-2 pt-10 text-sm dark:text-yellow-500 font-semibold text-yellow-700">
              Horas de inicio, fin y seguimiento
            </h1>
            <div className="grid gap-4">
              <div className="grid items-start xl:grid-cols-3 gap-4">
                <Controller
                  control={control}
                  rules={{ required: 'Requerido' }}
                  name="startOfClass"
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationState={error ? 'error' : 'none'}
                      validationMessage={error?.message}
                      label="Inicio de clase"
                      required
                    >
                      <TimePicker
                        disabled={field.disabled}
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
                          e.selectedTime &&
                          field.onChange(parse(e.selectedTime))
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
                    >
                      <TimePicker
                        disabled={field.disabled}
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
                          e.selectedTime &&
                          field.onChange(parse(e.selectedTime))
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
                      required
                    >
                      <TimePicker
                        disabled={field.disabled}
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
                          e.selectedTime &&
                          field.onChange(parse(e.selectedTime))
                        }
                        freeform
                        placeholder="Seleccionar hora"
                      />
                    </Field>
                  )}
                />
              </div>
            </div>
            <h1 className="py-2 pt-10 text-sm dark:text-yellow-500 font-semibold text-yellow-700">
              Rúbrica de evaluación 01
            </h1>
            <div className="">
              <table className="w-full border-stone-500/70">
                <thead className="">
                  <tr className="[&>th]:px-3 [&>th]:uppercase [&>th]:py-2">
                    <th>Competencia</th>
                    <th>Aspectos a observar</th>
                    <th>Modalidad</th>
                    <th className="text-center">Escala</th>
                    <th>Obtenido</th>
                  </tr>
                </thead>
                <tbody className="[&>tr>td]:p-2 [&>tr]:divide-x border-t border-stone-500/70 [&>tr]:dark:divide-stone-500/70 [&>tr]:divide-stone-300 [&>tr]:">
                  <tr>
                    <td
                      className="border-x border-b border-stone-500/70"
                      rowSpan={3}
                    >
                      {firstER.title}
                    </td>
                  </tr>
                  <tr className="border-b border-stone-500/70">
                    <td>{firstER.a.description}</td>
                    <td>
                      <select
                        onChange={(e) => {
                          setFirstER((prev) => ({
                            ...prev,
                            a: {
                              ...prev.a,
                              modality: e.target.value
                            }
                          }))
                        }}
                        className="bg-transparent dark:bg-[#2f2e2b]"
                        value={firstER.a.modality}
                      >
                        {modalities.map((modality) => (
                          <option key={modality} value={modality}>
                            {modality}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            setFirstER((prev) => ({
                              ...prev,
                              a: {
                                ...prev.a,
                                scale: !prev.a.scale,
                                obtained: prev.a.scale ? 0 : 50
                              }
                            }))
                          }}
                          checked={firstER.a.scale}
                        />
                        <InfoLabel
                          info={
                            <p className="text-left">
                              ✅ Cumple <br />❌ No cumple
                            </p>
                          }
                        ></InfoLabel>
                      </div>
                    </td>
                    <td className="text-center">{firstER.a.obtained}%</td>
                  </tr>
                  <tr className="border-b border-stone-500/70">
                    <td>{firstER.b.description}</td>
                    <td>
                      <select
                        onChange={(e) => {
                          setFirstER((prev) => ({
                            ...prev,
                            b: {
                              ...prev.b,
                              modality: e.target.value
                            }
                          }))
                        }}
                        className="bg-transparent dark:bg-[#2f2e2b]"
                        value={firstER.b.modality}
                      >
                        {modalities.map((modality) => (
                          <option key={modality} value={modality}>
                            {modality}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          onChange={() => {
                            setFirstER((prev) => ({
                              ...prev,
                              b: {
                                ...prev.b,
                                scale: !prev.b.scale,
                                obtained: prev.b.scale ? 0 : 50
                              }
                            }))
                          }}
                          checked={firstER.b.scale}
                        />
                        <InfoLabel
                          info={
                            <p className="text-left">
                              ✅ Cumple <br />❌ No cumple
                            </p>
                          }
                        ></InfoLabel>
                      </div>
                    </td>
                    <td className="text-center">{firstER.b.obtained}%</td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="border-b border-stone-500/70">Total:</td>
                    <td className="text-center border-b border-stone-500/70">
                      {firstER.a.obtained + firstER.b.obtained}%
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className=""></td>
                    <td className="border-b border-stone-500/70">Nota:</td>
                    <td className="text-center border-b border-stone-500/70">
                      {((firstER.a.obtained + firstER.b.obtained) / 100) * 20}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                    <td className="border-b border-stone-500/70">
                      Clasificación:
                    </td>
                    <td
                      data-approved={
                        firstER.a.obtained + firstER.b.obtained >= 50
                          ? ''
                          : undefined
                      }
                      className="font-semibold border-b border-stone-500/70 dark:text-red-400 text-red-700 data-[approved]:dark:text-green-400 data-[approved]:text-green-700 text-center"
                    >
                      {firstER.a.obtained + firstER.b.obtained >= 50
                        ? 'Aprobado'
                        : 'Desaprobado'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h1 className="py-2 pt-10 text-sm dark:text-yellow-500 font-semibold text-yellow-700">
              Rúbrica de evaluación 02
            </h1>
            <div className="">
              <table className="w-full">
                <thead>
                  <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:uppercase">
                    <th>Competencias</th>
                    <th>Indicador</th>
                    <th>Modalidad</th>
                    <th>Aspectos a observar</th>
                    <th>
                      Escala
                      <InfoLabel
                        info={
                          <>
                            <p>
                              <b>(No logrado)</b>: Nunca o casi nunca realiza la
                              acción.
                              <br />
                              <b>(Proceso)</b>: Algunas veces realiza la acción.
                              <br />
                              <b>(Logrado)</b>: Casi siempre realiza la acción.
                              <br />
                              <b>(Destacado)</b>: Siempre realiza la acción.
                            </p>
                          </>
                        }
                      ></InfoLabel>
                    </th>
                    <th>PESP</th>
                    <th className="text-nowrap">Obtenido (%)</th>
                  </tr>
                </thead>
                <tbody className="">
                  {Object.entries(secondER).map(([ak, a]) =>
                    Object.entries(a.indicators).map(([bk, b]) =>
                      Object.entries(b.aspects).map(([ck, c]) => {
                        return (
                          <React.Fragment key={ck}>
                            <tr className="border [&>td]:p-2 [&>td]:px-2">
                              {ak === bk && bk === ck && (
                                <td
                                  className="border text-center font-semibold border-stone-500/70"
                                  rowSpan={8}
                                >
                                  {a.title}
                                </td>
                              )}
                              {bk === ck && (
                                <td
                                  className="border text-center font-semibold border-stone-500/70"
                                  rowSpan={Object.entries(b.aspects).length}
                                >
                                  {b.title}
                                </td>
                              )}
                              <td className="border border-stone-500/70">
                                <select
                                  className="bg-transparent dark:bg-[#2f2e2b]"
                                  value={c.modality}
                                  onChange={(e) => {
                                    setSecondER((prev) => ({
                                      ...prev,
                                      [ak]: {
                                        ...prev[ak],
                                        indicators: {
                                          ...prev[ak].indicators,
                                          [bk]: {
                                            ...prev[ak].indicators[bk],
                                            aspects: {
                                              ...prev[ak].indicators[bk]
                                                .aspects,
                                              [ck]: {
                                                ...prev[ak].indicators[bk]
                                                  .aspects[ck],
                                                modality: e.target.value
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }))
                                  }}
                                >
                                  {modalities.map((modality) => (
                                    <option key={modality} value={modality}>
                                      {modality}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="border border-stone-500/70">
                                {c.title}
                              </td>
                              <td className="border border-stone-500/70">
                                <select
                                  className="bg-transparent dark:bg-[#2f2e2b]"
                                  value={c.scale}
                                  onChange={(e) => {
                                    setSecondER((prev) => ({
                                      ...prev,
                                      [ak]: {
                                        ...(prev[ak] as any),
                                        indicators: {
                                          ...prev[ak].indicators,
                                          [bk]: {
                                            ...prev[ak].indicators[bk],
                                            obtained: Object.entries(
                                              b.aspects
                                            ).reduce((acc, [,]) => {
                                              return (
                                                acc +
                                                (parseInt(e.target.value) *
                                                  a.pespVariable) /
                                                  Object.entries(scales).length
                                              )
                                            }, 0),
                                            aspects: {
                                              ...prev[ak].indicators[bk]
                                                .aspects,
                                              [ck]: {
                                                ...prev[ak].indicators[bk]
                                                  .aspects[ck],
                                                pesp:
                                                  (parseInt(e.target.value) *
                                                    a.pespVariable) /
                                                  Object.entries(scales).length,
                                                scale: parseInt(e.target.value)
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }))
                                  }}
                                >
                                  {Object.entries(scales).map(
                                    ([scale, value]) => (
                                      <option key={scale} value={scale}>
                                        {value}
                                      </option>
                                    )
                                  )}
                                </select>
                              </td>
                              <td className="border text-center border-stone-500/70">
                                {c.pesp}%
                              </td>
                              {bk === ck && (
                                <td
                                  className="border text-center border-stone-500/70"
                                  rowSpan={Object.entries(b.aspects).length}
                                >
                                  {b.obtained}%
                                </td>
                              )}
                            </tr>
                          </React.Fragment>
                        )
                      })
                    )
                  )}
                  <tr className="[&>td]:p-2 [&>td]:px-2">
                    <td colSpan={4}></td>
                    <td
                      colSpan={2}
                      className="font-semibold text-white bg-blue-800 text-nowrap"
                    >
                      % TOTAL:
                    </td>
                    <td className="border text-center font-semibold border-stone-500/70">
                      {firstTotal}%
                    </td>
                  </tr>
                  <tr className=" [&>td]:p-2 [&>td]:px-2">
                    <td colSpan={4}></td>
                    <td
                      colSpan={2}
                      className="font-semibold text-white bg-blue-800 text-nowrap"
                    >
                      NOTA:
                    </td>
                    <td className="border text-center font-semibold border-stone-500/70">
                      {firstGrade}
                    </td>
                  </tr>
                  <tr className="[&>td]:p-2 [&>td]:px-2">
                    <td colSpan={4}></td>
                    <td
                      colSpan={2}
                      className="font-semibold text-white bg-blue-800 text-nowrap"
                    >
                      CLASIFICACIÓN:
                    </td>
                    <td className="border text-center font-semibold border-stone-500/70">
                      {firstQualification}
                    </td>
                  </tr>
                  {/* <tr class="nota-row">
                    <td colspan="6">NOTA</td>
                    <td>20</td>
                    <td colspan="2"></td>
                  </tr>
                  <tr class="clasificacion-row">
                    <td colspan="6">CLASIFICACIÓN</td>
                    <td colspan="3">DESTACADO</td>
                  </tr> */}
                </tbody>
              </table>
              {/* <table className="w-full border-stone-500/70">
                <thead className="">
                  <tr className="[&>th]:font-semibold dark:bg-stone-500/30 bg-stone-200 divide-x border-stone-500/70 dark:divide-stone-600 divide-stone-300 [&>th]:p-2 text-left">
                    <th>Competencia</th>
                    <th>
                      <tr>
                        <th>Indicador</th>
                        <th>Aspectos a observar</th>
                      </tr>
                    </th>
                    <th>Aspectos a observar</th>
                    <th>Modalidad</th>
                    <th className="text-center">Escala</th>
                    <th className="text-center">PESP</th>
                    <th>Obtenido</th>
                  </tr>
                </thead>
                <tbody className="[&>tr>td]:p-2 [&>tr]:divide-x [&>tr]:dark:divide-stone-500/70 [&>tr]:divide-stone-300 ">
                  {Object.entries(secondER).map(([key, a]) => {
                    return (
                      <React.Fragment key={key}>
                        <tr>
                          <td>{a.title}</td>
                          <td>
                            {Object.entries(a.indicators).map(([key, b]) => {
                              return (
                                <React.Fragment key={key}>
                                  <tr>
                                    <td>{b.title}</td>
                                    <td>
                                      {Object.entries(b.aspects).map(
                                        ([key, c]) => {
                                          return (
                                            <React.Fragment key={key}>
                                              <tr>
                                                <td>{c.title}</td>
                                              </tr>
                                            </React.Fragment>
                                          )
                                        }
                                      )}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              )
                            })}
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table> */}
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter className="border-t flex gap-3 mt-auto dark:border-neutral-500">
          <Button onClick={onSubmit} appearance="primary">
            {onSubmitTitle}
          </Button>
          <Button onClick={() => setOpenDrawer(false)} appearance="outline">
            Cerrar
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}
