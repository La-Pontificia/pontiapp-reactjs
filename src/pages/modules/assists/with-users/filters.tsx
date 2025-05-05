import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Select,
  Spinner,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerList,
  TagPickerOption,
  Tooltip
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { Dismiss24Regular, FilterAddFilled } from '@fluentui/react-icons'
import React from 'react'
import { localizedStrings } from '@/const'
import { AssistTerminal } from '@/types/assist-terminal'
import { Filter } from './+page'
import { format } from '@/lib/dayjs'
import { Link } from 'react-router'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { Job } from '@/types/job'
import { Area } from '@/types/area'
import { useAuth } from '@/store/auth'
import SearchBox from '@/commons/search-box'
import { UIContext } from '@/providers/ui'
import { ExcelColored } from '@/icons'
import { useDebounced } from '@/hooks/use-debounced'

export default function AssistFilters({
  isTerminalsLoading,
  terminals,
  onAplyFilters,
  isLoading,
  areas,
  isAreasLoading,
  isJobsLoading,
  jobs
}: {
  terminals: AssistTerminal[]
  isTerminalsLoading: boolean
  onAplyFilters: (filters: Filter) => void
  isLoading: boolean
  areas: Area[]
  isAreasLoading: boolean
  jobs: Job[]
  isJobsLoading: boolean
}) {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date())
  const [endDate, setEndDate] = React.useState<Date | null>(new Date())
  const [openReport, setOpenReport] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)
  const [openFilters, setOpenFilters] = React.useState(false)
  const { user: authUser } = useAuth()

  const [selectedTerminals, setSelectedTerminals] = React.useState<
    AssistTerminal[]
  >(terminals[0] ? [terminals[0]] : [])

  const [job, setJob] = React.useState<Job | null>(null)
  const [area, setArea] = React.useState<Area | null>(null)

  const onTagClick = (id: string) => {
    setSelectedTerminals(selectedTerminals.filter((o) => o.id !== id))
  }

  const ctxui = React.useContext(UIContext)

  React.useEffect(() => {
    if (selectedTerminals.length === 0 && terminals.length > 0) {
      setSelectedTerminals(terminals[0] ? [terminals[0]] : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminals])

  const {
    onChange,
    value: searchValue,
    handleChange
  } = useDebounced({
    onCompleted: (e) => {
      onAplyFilters({
        startDate,
        endDate,
        q: e,
        terminalsIds: selectedTerminals.map((o) => o.id),
        areaId: area?.id ?? null,
        jobId: job?.id ?? null
      })
    }
  })

  const handleReport = async () => {
    setReporting(true)
    let uri = 'assists/withUsers/report?tm=true'
    if (startDate) uri += `&startDate=${format(startDate, 'YYYY-MM-DD')}`
    if (endDate) uri += `&endDate=${format(endDate, 'YYYY-MM-DD')}`
    if (searchValue.length > 0) uri += `&q=${searchValue}`
    if (selectedTerminals.length > 0)
      uri += `&assistTerminals=${selectedTerminals.map((e) => e.id).join(',')}`
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

  React.useEffect(() => {
    onAplyFilters({
      startDate,
      endDate,
      q: searchValue,
      terminalsIds: selectedTerminals.map((o) => o.id),
      areaId: area?.id ?? null,
      jobId: job?.id ?? null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <nav className="w-full space-y-2 py-3 border-b border-stone-500/30">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow flex items-center gap-2">
            <h2 className="font-semibold text-xl pr-2">
              Asistencias con usuarios del sistema
            </h2>
          </div>
          <div className="flex gap-2 items-center">
            <Tooltip content="Mas filtros" relationship="description">
              <button
                onClick={() => setOpenFilters(true)}
                className="flex items-center gap-1 dark:text-[#eaa8ff] font-medium px-2"
              >
                <FilterAddFilled fontSize={25} />
                Filtros
              </button>
            </Tooltip>
            <SearchBox
              className="min-w-[250px]"
              value={searchValue}
              dismiss={() => {
                onAplyFilters({
                  startDate,
                  endDate,
                  q: null,
                  terminalsIds: selectedTerminals.map((o) => o.id),
                  areaId: area?.id ?? null,
                  jobId: job?.id ?? null
                })
                handleChange('')
              }}
              disabled={isLoading}
              onChange={(e) => {
                if (e.target.value === '')
                  onAplyFilters({
                    startDate,
                    endDate,
                    q: null,
                    terminalsIds: selectedTerminals.map((o) => o.id),
                    areaId: area?.id ?? null,
                    jobId: job?.id ?? null
                  })
                onChange(e)
              }}
              placeholder="Filtrar por dni, nombres o apellidos"
            />
            {authUser.hasPrivilege('assists:report') && (
              <div className="ml-auto">
                <Button
                  disabled={
                    isLoading ||
                    !endDate ||
                    !startDate ||
                    !selectedTerminals.length
                  }
                  icon={<ExcelColored />}
                  appearance="subtle"
                  onClick={() => setOpenReport(true)}
                  style={{}}
                >
                  Excel
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="px-1 border-t border-stone-500/20 pt-2 flex gap-4 flex-wrap">
          <Field size="small" label="Terminales biométricos">
            <div className="flex gap-2 flex-wrap">
              {selectedTerminals.length > 0 ? (
                selectedTerminals.map((terminal) => (
                  <Badge
                    key={terminal.id}
                    color="brand"
                    style={{
                      padding: '0.7rem 0.3rem'
                    }}
                    shape="circular"
                    icon={
                      <Avatar
                        size={20}
                        aria-hidden
                        name={terminal.name}
                        color="colorful"
                      />
                    }
                  >
                    {terminal.name}
                  </Badge>
                ))
              ) : (
                <p className="opacity-70 font-medium">
                  Sin biométricos seleccionados
                </p>
              )}
            </div>
          </Field>
          <Field size="small" label="Rango de fechas">
            <p className="text-xs font-medium">
              {startDate ? format(startDate, 'DD-MM-YYYY') : 'Sin seleccionar'}{' '}
              - {endDate ? format(endDate, 'DD-MM-YYYY') : 'Sin seleccionar'}
            </p>
          </Field>
        </div>
      </nav>

      {openFilters && (
        <Drawer
          mountNode={ctxui?.contentRef.current}
          position="start"
          separator
          className="min-w-[400px] z-[9999] max-w-full"
          open={openFilters}
          onOpenChange={(_, { open }) => setOpenFilters(open)}
        >
          <DrawerHeader className="border-b border-stone-500/30">
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => setOpenFilters(false)}
                />
              }
            >
              Filtros
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col overflow-y-auto">
            <div className="py-5 grid gap-3">
              <Field label="Puesto de trabajo">
                <Select
                  disabled={isJobsLoading || isLoading}
                  value={job?.id ?? ''}
                  onChange={(e) => {
                    const selected = jobs.find((t) => t.id === e.target.value)
                    setJob(selected ?? null)
                  }}
                >
                  <option value="">
                    {isJobsLoading ? 'Cargando...' : 'Todos'}
                  </option>
                  {jobs?.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Área">
                <Select
                  disabled={isAreasLoading || isLoading}
                  value={area?.id ?? ''}
                  onChange={(e) => {
                    const selected = areas.find((t) => t.id === e.target.value)
                    setArea(selected ?? null)
                  }}
                >
                  <option value="">
                    {isJobsLoading ? 'Cargando...' : 'Todos'}
                  </option>
                  {areas?.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="border-t border-stone-500/40 mt-4"></div>
              <Field
                label="Terminales biométricos"
                required
                validationMessage="Selecione al menos un terminal"
                validationState={
                  selectedTerminals.length > 0 ? 'none' : 'error'
                }
              >
                <TagPicker
                  disabled={isTerminalsLoading || isLoading}
                  onOptionSelect={(_, data) => {
                    const selected = selectedTerminals.find(
                      (t) => t.id === data.value
                    )
                    setSelectedTerminals((prev) =>
                      selected
                        ? prev.filter((t) => t.id !== data.value)
                        : [
                          ...prev,
                          terminals!.find((t) => t.id === data.value)!
                        ]
                    )
                  }}
                  selectedOptions={selectedTerminals.map((o) => o.id)}
                >
                  <TagPickerControl
                    style={{
                      gap: 4,
                      padding: selectedTerminals.length > 0 ? 5 : undefined
                    }}
                  >
                    {selectedTerminals.map((terminal) => (
                      <Tag
                        disabled={isTerminalsLoading || isLoading}
                        key={terminal.id}
                        shape="circular"
                        dismissible
                        onClick={() => onTagClick(terminal.id)}
                        media={
                          <Avatar
                            aria-hidden
                            name={terminal.name}
                            color="colorful"
                          />
                        }
                        value={terminal.id}
                      >
                        {terminal.name}
                      </Tag>
                    ))}
                  </TagPickerControl>
                  <TagPickerList>
                    {terminals.length > 0 ? (
                      terminals
                        .filter((t) =>
                          selectedTerminals.every((st) => st.id !== t.id)
                        )
                        .map((terminal) => (
                          <TagPickerOption
                            media={
                              <Avatar
                                shape="square"
                                aria-hidden
                                name={terminal.name}
                                color="colorful"
                              />
                            }
                            value={terminal.id}
                            key={terminal.id}
                          >
                            {terminal.name}
                          </TagPickerOption>
                        ))
                    ) : (
                      <TagPickerOption value="no-options">
                        No hay opciones
                      </TagPickerOption>
                    )}
                  </TagPickerList>
                </TagPicker>
              </Field>

              <Field
                label="Desde"
                required
                validationMessage="Selecione una fecha"
                validationState={startDate ? 'none' : 'error'}
              >
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
              <Field
                label="Hasta"
                required
                validationMessage="Selecione una fecha"
                validationState={endDate ? 'none' : 'error'}
              >
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
          </DrawerBody>
          <DrawerFooter className="w-full border-t border-stone-500/30">
            <Button
              disabled={
                isLoading || !endDate || !startDate || !selectedTerminals.length
              }
              onClick={() => {
                setOpenFilters(false)
                onAplyFilters({
                  startDate,
                  endDate,
                  q: searchValue,
                  terminalsIds: selectedTerminals.map((o) => o.id),
                  areaId: area?.id ?? null,
                  jobId: job?.id ?? null
                })
              }}
              appearance="primary"
            >
              Aplicar filtros
            </Button>
            <Button onClick={() => setOpenFilters(false)} appearance="outline">
              Cerrar
            </Button>
          </DrawerFooter>
        </Drawer>
      )}

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
    </>
  )
}
