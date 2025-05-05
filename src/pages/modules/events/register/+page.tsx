import { toast } from 'anni'
import { useQrCodeReader } from '@/hooks/use-qr-reader'
import { api } from '@/lib/api'
import { BusinessUnit } from '@/types/business-unit'
import { Event } from '@/types/event'
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
  Field,
  Input,
  Option,
  Persona,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { format } from '@/lib/dayjs'
import {
  ClockRegular,
  CloudDatabaseRegular,
  MegaphoneRegular
} from '@fluentui/react-icons'
import { useAuth } from '@/store/auth'
import { Link } from 'react-router'
import { ExcelColored } from '@/icons'
import { Helmet } from 'react-helmet'

const SHEET_API_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3NJ2Sdi74uySfutPWUUnFBz-5pI57flWViZKplAo9IdlQ6k_J2KrIp3bcwSMx4OcNQHj1yMkre8pU/pub?output=csv'
const SHEET_PUBLIC_URL =
  'https://docs.google.com/spreadsheets/d/1x6XEqH58uLXxokXZBHlznhjczKBKGWrqCiQqqCk8c8U/edit?gid=0#gid=0'

export default function EventsRegister() {
  const { user: authUser } = useAuth()
  const [openReport, setOpenReport] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)
  const [openDataSource, setOpenDataSource] = React.useState(false)

  const [people, setPeople] = React.useState<
    Array<{
      names: string
      documentId: string
      career: string
    }>
  >([])

  React.useEffect(() => {
    const fetchData = async () => {
      const csv = await fetch(SHEET_API_URL)
      const text = await csv.text()
      const people = text
        .split('\n')
        .splice(1)
        .map((row) => {
          const columns = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
          const names = columns[0]?.replace(/"/g, '') || ''
          const documentId = columns[1] || ''
          const career = columns[4] || ''

          return { names, documentId, career }
        })
      console.log(JSON.stringify(people, null, 2))
      setPeople(people)
    }

    fetchData()
    const interval = setInterval(fetchData, 120000)
    return () => clearInterval(interval)
  }, [])

  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
  const [records, setRecords] = React.useState<
    Array<{
      names: string
      documentId: string
      career: string
      created_at: Date
    }>
  >([])
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    React.useState<BusinessUnit | null>(null)

  const { data: events, isLoading } = useQuery<Event[] | null>({
    queryKey: ['events/all'],
    queryFn: async () => {
      const res = await api.get<Event[]>('events/all')
      if (!res.ok) return null
      return res.data.map((event) => new Event(event))
    }
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

  const handleGetPerson = async (documentId: string) => {
    if (documentId.length !== 8)
      return toast.warning('Documento de identidad inválido')

    const resultPerson = people.find((p) => p.documentId === documentId)
    const person = resultPerson ?? {
      documentId,
      career: '',
      names: ''
    }

    if (!resultPerson) {
      toast(
        `El documento ${documentId} no se encuentra en la lista de asistentes`
      )
    }

    setRecords((prev) => [
      {
        names: person.names || person.documentId,
        career: person.career,
        documentId: person.documentId,
        created_at: new Date()
      },
      ...prev
    ])

    const res = await api.post('events/records', {
      data: JSON.stringify({
        documentId: person.documentId,
        firstNames: '',
        lastNames: '',
        fullName: person.names,
        period: '',
        email: '',
        gender: '',
        career: person.career,
        eventId: selectedEvent!.id,
        businessUnitId: selectedBusinessUnit!.id
      })
    })

    if (!res.ok) {
      toast('Error al registrar')
      setRecords((prev) =>
        prev.filter((r) => r.documentId !== person.documentId)
      )
    }
  }

  const { capturedText, inputRef, onChange, handleEnter } = useQrCodeReader({
    onEnter: (d) => handleGetPerson(d),
    disabled: !selectedEvent || !selectedBusinessUnit
  })

  // handle report

  const handleReport = async () => {
    setReporting(true)
    let uri = 'events/records/report?tm=true'
    if (selectedBusinessUnit)
      uri += `&businessUnitId=${selectedBusinessUnit.id}`
    if (selectedEvent) uri += `&eventId=${selectedEvent.id}`
    const res = await api.post(uri)
    if (!res.ok) {
      toast('Error al generar el reporte')
    } else {
      toast('Reporte en proceso de generación, te notificaremos.')
    }

    setOpenReport(false)
    setReporting(false)
  }

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <Helmet>
        <title>Eventos {'>'} Registrar asistentes | Pontiapp</title>
      </Helmet>
      <div className="w-full flex py-2 flex-col overflow-y-auto h-full flex-grow">
        <nav className="flex items-center gap-3 flex-wrap w-full px-3 max-lg:py-2">
          <h1 className="font-semibold flex-grow text-lg">
            Registrar asistentes
          </h1>
          <div className="flex items-center gap-4 w-full">
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              style={{
                borderRadius: 7
              }}
              disabled={isLoading}
              onOptionSelect={(_, data) => {
                const ev = events?.find((e) => e.id === data.optionValue)
                if (ev) setSelectedEvent(ev)
              }}
              value={selectedEvent?.name}
              placeholder="Selecciona un evento"
            >
              {events?.map((event) => (
                <Option key={event.id} text={event.name} value={event.id}>
                  {event.name}
                </Option>
              ))}
            </Combobox>
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              disabled={isLoadingBusinessUnits}
              onOptionSelect={(_, data) => {
                const b = businessUnits?.find((b) => b.id === data.optionValue)
                if (b) setSelectedBusinessUnit(b)
              }}
              style={{
                borderRadius: 7
              }}
              value={selectedBusinessUnit?.name}
              placeholder="Unidad de negocio"
            >
              {businessUnits?.map((business) => (
                <Option
                  key={business.id}
                  text={business.name}
                  value={business.id}
                >
                  <Persona
                    avatar={{
                      className: '!rounded-md',
                      image: {
                        src: business.logoURL
                      }
                    }}
                    primaryText={business.name}
                  />
                </Option>
              ))}
            </Combobox>
            <div className="flex ml-auto items-center gap-2">
              <Button
                appearance="transparent"
                onClick={() => setOpenDataSource(true)}
                icon={<CloudDatabaseRegular />}
              >
                Fuente de datos
              </Button>
            </div>
          </div>
        </nav>
        <div className="flex-grow h-full overflow-y-auto flex">
          {!selectedEvent || !selectedBusinessUnit ? (
            <div className="flex-grow h-full grid place-content-center">
              <p className="text-sm max-w-[30ch] text-center mx-auto opacity-70">
                Seleccione un evento y una unidad de negocio para comenzar.
              </p>
            </div>
          ) : (
            <div className="w-full px-3 overflow-y-auto flex flex-col">
              <div className="py-5">
                <div className="relative flex items-center gap-2">
                  <input
                    ref={inputRef}
                    onChange={onChange}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEnter()
                    }}
                    placeholder="DNI o código de barras"
                    className="dark:bg-blue-800 bg-blue-600 shadow-blue-800/20 dark:shadow-black/60 shadow-lg font-semibold outline-none min-w-[400px] text-sm text-white placeholder:text-blue-400 rounded-lg p-3"
                    value={capturedText}
                  />
                </div>
                <p className="text-xs px-1 pt-1 dark:text-neutral-400">
                  Escribe el DNI, o simplemente escanea el código de barras.
                </p>
              </div>
              {records.length > 0 && (
                <div className="flex pt-1 border-t border-stone-500/30 items-center justify-between">
                  <h1 className="px-1 font-medium">
                    Registros{' '}
                    <span className="text-xs opacity-70">
                      ({records.length})
                    </span>
                  </h1>
                  {authUser.hasPrivilege('events:records:report') && (
                    <div className="ml-auto">
                      <Button
                        disabled={isLoading || reporting}
                        onClick={() => setOpenReport(true)}
                        icon={<ExcelColored />}
                        appearance="subtle"
                      >
                        excel
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <div className="w-full overflow-y-auto flex-grow rounded-2xl">
                {records.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell className="w-[280px]">
                          Asistente
                        </TableHeaderCell>
                        <TableHeaderCell>Unidad</TableHeaderCell>
                        <TableHeaderCell>Evento</TableHeaderCell>
                        <TableHeaderCell>Hora ingreso</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records?.map((record) => (
                        <TableRow>
                          <TableCell>
                            <TableCellLayout
                              media={
                                <Avatar color="colorful" name={record.names} />
                              }
                            >
                              <p className="capitalize pt-1">
                                {record.names?.toLowerCase()}
                              </p>
                              <p className="text-xs capitalize text-blue-600 dark:text-blue-400">
                                {record.career?.toLowerCase()}
                              </p>
                            </TableCellLayout>
                          </TableCell>
                          <TableCell>
                            <TableCellLayout
                              media={
                                <Avatar
                                  color="colorful"
                                  className="!rounded-md"
                                  image={{
                                    src: selectedBusinessUnit.logoURL
                                  }}
                                />
                              }
                            >
                              <p className="capitalize pt-1">
                                {selectedBusinessUnit.name}
                              </p>
                            </TableCellLayout>
                          </TableCell>
                          <TableCell>
                            <p className="capitalize flex items-center gap-2">
                              <MegaphoneRegular fontSize={20} />
                              {selectedEvent.name}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="capitalize flex items-center gap-1">
                              <ClockRegular fontSize={20} />
                              {format(record.created_at, 'h:mm A')}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-full grid place-content-center text-sm font-medium">
                    <p>
                      Aún no hay registros de asistentes en este evento y
                      unidad.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* dialogs */}
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
                    to="/m/events/report-files"
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

        <Dialog
          open={openDataSource}
          onOpenChange={(_, e) => setOpenDataSource(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                Fuente de datos de los asistentes al evento.
              </DialogTitle>
              <DialogContent className="space-y-2">
                <p className="w-full pb-5">
                  La lista de asistentes al evento se encuentra en una hoja de
                  cálculo de Google Sheets, puedes verla en el siguiente enlace.
                </p>
                <Field label="Enlace de la hoja de cálculo">
                  <Input
                    contentAfter={
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(SHEET_PUBLIC_URL)
                          toast(
                            'Enlace de la hoja de cálculo copiado al portapapeles.'
                          )
                        }}
                        size="small"
                        appearance="subtle"
                      >
                        Copiar enlace
                      </Button>
                    }
                    readOnly
                    defaultValue={SHEET_PUBLIC_URL}
                  />
                </Field>
                <Field label="Enlace de descarga directa (API)">
                  <Input
                    readOnly
                    contentAfter={
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(SHEET_API_URL)
                          toast(
                            'Enlace de la hoja de cálculo copiado al portapapeles.'
                          )
                        }}
                        size="small"
                        appearance="subtle"
                      >
                        Copiar enlace
                      </Button>
                    }
                    defaultValue={SHEET_API_URL}
                    className="line-clamp-1"
                  />
                </Field>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Aceptar</Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </div>
  )
}
