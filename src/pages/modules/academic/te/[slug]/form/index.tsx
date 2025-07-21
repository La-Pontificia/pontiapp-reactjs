import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Select,
  Divider,
  Input,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useForm } from './use'
import { format, getDays } from '@/lib/dayjs'
import { Controller } from 'react-hook-form'
import React from 'react'
import Survey from './survey'

type Props = {
  open: boolean
  setOpen: (_: boolean) => void
  refetch: () => void
}

export default function Form({ open, setOpen, refetch }: Props) {
  const [openSurvey, setOpenSurvey] = React.useState(false)
  const {
    control,
    period,
    program,
    branches,
    periods,
    programs,
    schedule,
    schedules,
    section,
    sectionCourse,
    sectionCourses,
    sections,
    setValue,
    answers,
    onSubmit,
    isPending
  } = useForm({
    open,
    refetch,
    setOpen
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
              Registrar nueva evaluación
            </DialogTitle>
            <DialogContent className="space-y-2">
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
                      <option value="">Seleccionar programa</option>
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
                      <option value="">Seleccionar periodo académico</option>
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
                        <option value="">Seleccionar sección</option>
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
                        <option value="">Seleccionar curso</option>
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
                        <option value="">Seleccione un horario de clase</option>
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
                <>
                  <Divider className="py-2">Sede, fecha</Divider>
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
                          <option value="">Seleccionar sede</option>
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
                    rules={{
                      required: 'Requerido',
                      pattern: {
                        value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                        message: 'Ingrese la hora en formato HH:mm y 24 horas'
                      }
                    }}
                    name="trackingTime"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        orientation="horizontal"
                        validationState={error ? 'error' : 'none'}
                        validationMessage={
                          error?.message ??
                          'Ingrese la hora en formato HH:mm y 24 horas'
                        }
                        label="Hora de seguimiento:"
                      >
                        <Input {...field} placeholder="HH:mm" />
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
                          <option value="">Seleccionar</option>
                          <option value="1">Primera</option>
                          <option value="2">Segunda</option>
                        </Select>
                      </Field>
                    )}
                  />
                </>
              )}
              {schedule && (
                <>
                  <Divider className="py-2">Encuesta</Divider>
                  <Field label="Encuesta:" required orientation="horizontal">
                    <Button onClick={() => setOpenSurvey(true)}>
                      Abrir encuesta
                    </Button>
                  </Field>
                </>
              )}
              {schedule && (
                <div className="border-t flex gap-2 justify-end items-center dark:border-stone-500/20 pt-3">
                  <Button onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button
                    icon={isPending ? <Spinner size="extra-tiny" /> : undefined}
                    onClick={onSubmit}
                    disabled={answers.length === 0 || isPending}
                    appearance="primary"
                  >
                    Registrar evaluación
                  </Button>
                </div>
              )}
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Survey
        open={openSurvey}
        sectionCourse={sectionCourse}
        setOpen={setOpenSurvey}
        setValue={setValue}
        answers={answers}
      />
    </>
  )
}
