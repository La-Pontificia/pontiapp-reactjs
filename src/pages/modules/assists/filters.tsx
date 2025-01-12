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
  Option,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SearchBox,
  Spinner
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { CalendarRtlRegular, DockRegular } from '@fluentui/react-icons'
import React from 'react'
import { localizedStrings } from '~/const'
import { Filter } from './+page'
import { format } from '~/lib/dayjs'
import { Link } from 'react-router'
import { api } from '~/lib/api'
import { toast } from '~/commons/toast'
import { Job } from '~/types/job'
import { Area } from '~/types/area'
import { useAuth } from '~/store/auth'

export default function AssistFilters({
  onAplyFilters,
  isLoading,
  areas,
  isAreasLoading,
  // isJobsLoading,
  jobs
}: {
  onAplyFilters: (filters: Filter) => void
  isLoading: boolean
  areas: Area[]
  isAreasLoading: boolean
  jobs: Job[]
  isJobsLoading: boolean
}) {
  const { user: authUser } = useAuth()
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)
  const [q, setQ] = React.useState<string | null>(null)
  const [openReport, setOpenReport] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)

  const [job, setJob] = React.useState<Job | null>(null)
  const [area, setArea] = React.useState<Area | null>(null)

  const handleReport = async () => {
    setReporting(true)
    let uri = 'assists/report?advanced=true'
    if (startDate) uri += `&startDate=${format(startDate, 'YYYY-MM-DD')}`
    if (endDate) uri += `&endDate=${format(endDate, 'YYYY-MM-DD')}`
    if (q) uri += `&q=${q}`
    if (area) uri += `&areaId=${area.id}`
    if (job) uri += `&jobId=${job.id}`

    const res = await api.get(uri)

    if (!res.ok) {
      toast('Error al generar el reporte')
    } else {
      toast('Reporte en proceso de generación, te notificaremos.')
    }

    setOpenReport(false)
    setReporting(false)
  }

  return (
    <>
      <nav className="flex items-end gap-2">
        <SearchBox
          value={q || ''}
          dismiss={{
            onClick: () => {
              setQ(null)
            }
          }}
          disabled={isLoading}
          onChange={(_, e) => {
            if (e.value === '') setQ(null)
            setQ(e.value)
          }}
          placeholder="Buscar asistencias"
        />
        <Popover withArrow>
          <PopoverTrigger disableButtonEnhancement>
            <Button
              disabled={isLoading}
              icon={
                <CalendarRtlRegular
                  data-active={startDate || endDate ? '' : undefined}
                  className="text-nowrap font-normal dark:data-[active]:text-blue-600"
                />
              }
              appearance="secondary"
              style={{}}
            />
          </PopoverTrigger>
          <PopoverSurface
            tabIndex={-1}
            style={{
              padding: 0,
              borderRadius: '15px'
            }}
          >
            <div className="p-3 min-w-[250px]">
              <div className="grid gap-2">
                <Field label="Desde">
                  <DatePicker
                    disabled={isLoading}
                    value={startDate ? new Date(startDate) : null}
                    onSelectDate={(date) => {
                      setStartDate(date ? date : null)
                    }}
                    formatDate={(date) => format(date, 'DD-MM-YYYY')}
                    strings={localizedStrings}
                    placeholder="Seleccionar fecha"
                  />
                </Field>
                <Field label="Hasta">
                  <DatePicker
                    value={endDate ? new Date(endDate) : null}
                    onSelectDate={(date) => {
                      setEndDate(date ? date : null)
                    }}
                    disabled={isLoading}
                    formatDate={(date) => format(date, 'DD-MM-YYYY')}
                    strings={localizedStrings}
                    placeholder="Seleccionar fecha"
                  />
                </Field>
              </div>
            </div>
          </PopoverSurface>
        </Popover>
        <Combobox
          disabled={isAreasLoading || isLoading}
          style={{
            minWidth: '50px'
          }}
          input={{
            style: {
              width: '100px'
            }
          }}
          selectedOptions={[job?.id ?? '']}
          placeholder="Puesto"
          onOptionSelect={(_, event) => {
            const selected = jobs.find((t) => t.id === event.optionValue)
            setJob(selected ?? null)
          }}
          value={job?.name ?? ''}
        >
          {jobs?.map((job) => (
            <Option text={job.name} key={job.id} value={job.id}>
              {job.name}
            </Option>
          ))}
        </Combobox>
        <Combobox
          disabled={isAreasLoading || isLoading}
          style={{
            minWidth: '50px'
          }}
          input={{
            style: {
              width: '150px'
            }
          }}
          selectedOptions={[area?.id ?? '']}
          placeholder="Área"
          onOptionSelect={(_, event) => {
            const selected = areas.find((t) => t.id === event.optionValue)
            setArea(selected ?? null)
          }}
          value={area?.name ?? ''}
        >
          {areas?.map((area) => (
            <Option text={area.name} key={area.id} value={area.id}>
              {area.name}
            </Option>
          ))}
        </Combobox>
        <Button
          appearance="secondary"
          style={{}}
          disabled={isLoading || !endDate || !startDate}
          onClick={() => {
            onAplyFilters({
              startDate,
              endDate,
              q,
              areaId: area?.id ?? null,
              jobId: job?.id ?? null
            })
          }}
        >
          Filtrar
        </Button>
        {authUser.hasPrivilege('assists:report') && (
          <div className="ml-auto">
            <Button
              disabled={
                isLoading || !endDate || !startDate
                // || !selectedTerminals.length
              }
              icon={<DockRegular />}
              appearance="secondary"
              onClick={() => setOpenReport(true)}
              style={{}}
            >
              <span className="hidden xl:block">Generar reporte</span>
            </Button>
          </div>
        )}
      </nav>
      {openReport && (
        <Dialog
          open={openReport}
          onOpenChange={(_, e) => setOpenReport(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                Verifica los filtros seleccionados antes de generar el reporte.
              </DialogTitle>
              <DialogContent>
                <p className="w-full">
                  Puedes seguir usando el sistema mientras se genera el reporte.
                  enviaremos un correo cuando esté listo o puedes descargarlo
                  desde la sección de{' '}
                  <Link
                    to="/m/assists/report-files"
                    target="_blank"
                    className="underline"
                  >
                    archivo de reportes
                  </Link>{' '}
                  del módulo.
                </p>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
                <Button
                  onClick={handleReport}
                  disabled={reporting}
                  icon={reporting ? <Spinner size="tiny" /> : undefined}
                  appearance="primary"
                >
                  Generar reporte
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  )
}
