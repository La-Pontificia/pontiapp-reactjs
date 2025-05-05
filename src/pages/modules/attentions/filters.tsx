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
  Option,
  SearchBox,
  Spinner
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import React from 'react'
import { localizedStrings } from '@/const'
import { Filter } from './+page'
import { format } from '@/lib/dayjs'
import { Link } from 'react-router'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { useAuth } from '@/store/auth'
import { BusinessUnit } from '@/types/business-unit'
import { AttentionPosition } from '@/types/attention-position'
import { useQuery } from '@tanstack/react-query'
import { ExcelColored } from '@/icons'

export default function AttentionsFilters({
  onAplyFilters,
  isLoading
}: {
  onAplyFilters: (filters: Filter) => void
  isLoading: boolean
}) {
  const { user: authUser } = useAuth()
  const [startDate, setStartDate] = React.useState<Date | null>(new Date())
  const [endDate, setEndDate] = React.useState<Date | null>(new Date())
  const [q, setQ] = React.useState<string | null>(null)
  const [openReport, setOpenReport] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)

  const [businessUnit, setBusinessUnit] = React.useState<BusinessUnit | null>(
    null
  )
  const [position, setPosition] = React.useState<AttentionPosition | null>(null)

  const handleReport = async () => {
    setReporting(true)
    let uri = 'attentions/report?advanced=true'
    if (startDate) uri += `&startDate=${format(startDate, 'YYYY-MM-DD')}`
    if (endDate) uri += `&endDate=${format(endDate, 'YYYY-MM-DD')}`
    if (q) uri += `&q=${q}`
    if (businessUnit) uri += `&businessUnitId=${businessUnit.id}`
    if (position) uri += `&attentionPositionId=${position.id}`

    const res = await api.get(uri)

    if (!res.ok) {
      toast('Error al generar el reporte')
    } else {
      toast('Reporte en proceso de generación, te notificaremos.')
    }

    setOpenReport(false)
    setReporting(false)
  }

  const { data: businessUnits, isLoading: isLoadingBusinessUnits } = useQuery<
    BusinessUnit[] | null
  >({
    queryKey: ['attentions/businessUnits'],
    queryFn: async () => {
      const res = await api.get<[]>(
        'attentions/businessUnits?onlyAttentions=true'
      )
      if (!res.ok) return null
      return res.data.map((event) => new BusinessUnit(event))
    }
  })

  const { data: attentionPositions, isLoading: isAttentionPositionsLoading } =
    useQuery<AttentionPosition[]>({
      queryKey: ['attentions/positions/all/relationship'],
      queryFn: async () => {
        const res = await api.get<AttentionPosition[]>(
          'attentions/positions/all?relationship=business,current'
        )
        if (!res.ok) return []
        return res.data
      }
    })

  return (
    <>
      <nav className="flex gap-3 pt-4 pb-3 w-full">
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
          placeholder="Filtrar atenciones"
        />
        <Combobox
          disabled={isLoadingBusinessUnits || isLoading}
          style={{
            minWidth: '50px'
          }}
          input={{
            style: {
              width: '170px'
            }
          }}
          selectedOptions={[businessUnit?.id ?? '']}
          placeholder="Unidad de negocio"
          onOptionSelect={(_, event) => {
            const selected = businessUnits?.find(
              (t) => t.id === event.optionValue
            )
            setBusinessUnit(selected ?? null)
          }}
          value={businessUnit?.name ?? ''}
        >
          {businessUnits?.map((a) => (
            <Option text={a.name} key={a.id} value={a.id}>
              {a.name}
            </Option>
          ))}
        </Combobox>

        <Combobox
          disabled={isAttentionPositionsLoading || isLoading}
          style={{
            minWidth: '50px'
          }}
          input={{
            style: {
              width: '170px'
            }
          }}
          selectedOptions={[position?.id ?? '']}
          placeholder="Puesto de atención"
          onOptionSelect={(_, event) => {
            const selected = attentionPositions?.find(
              (t) => t.id === event.optionValue
            )
            setPosition(selected ?? null)
          }}
          value={position?.name ?? ''}
        >
          {attentionPositions?.map((a) => (
            <Option text={a.name} key={a.id} value={a.id}>
              {a.name}
            </Option>
          ))}
        </Combobox>
      </nav>
      <nav className="flex items-end w-full pb-4 gap-2">
        <div className="flex  flex-grow items-end gap-2">
          <DatePicker
            input={{
              style: {
                width: 100
              }
            }}
            disabled={isLoading}
            value={startDate ? new Date(startDate) : null}
            onSelectDate={(date) => {
              setStartDate(date ? date : null)
            }}
            formatDate={(date) => format(date, 'DD-MM-YYYY')}
            strings={localizedStrings}
            placeholder="Desde"
          />
          <DatePicker
            input={{
              style: {
                width: 100
              }
            }}
            value={endDate ? new Date(endDate) : null}
            onSelectDate={(date) => {
              setEndDate(date ? date : null)
            }}
            disabled={isLoading}
            formatDate={(date) => format(date, 'DD-MM-YYYY')}
            strings={localizedStrings}
            placeholder="Hasta"
          />

          <Button
            appearance="secondary"
            style={{}}
            disabled={isLoading || !endDate || !startDate}
            onClick={() => {
              onAplyFilters({
                startDate: startDate ? format(startDate, 'YYYY-MM-DD') : null,
                endDate: endDate ? format(endDate, 'YYYY-MM-DD') : null,
                q,
                businessId: businessUnit?.id ?? null,
                positionId: position?.id ?? null
              })
            }}
          >
            Filtrar
          </Button>
        </div>

        {authUser.hasPrivilege('attentions:report') && (
          <div className="ml-auto">
            <Button
              disabled={isLoading || !endDate || !startDate}
              icon={<ExcelColored />}
              appearance="secondary"
              onClick={() => setOpenReport(true)}
              style={{}}
            >
              <span className="hidden xl:block">Excel</span>
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
                    to="/m/attentions/report-files"
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
