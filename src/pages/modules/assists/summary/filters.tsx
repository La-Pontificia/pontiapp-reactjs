import {
  Avatar,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerList,
  TagPickerOption,
  Tooltip
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import React from 'react'
import { localizedStrings } from '@/const'
import { AssistTerminal } from '@/types/assist-terminal'
import { Filter } from './+page'
import { format } from '@/lib/dayjs'
import { UIContext } from '@/providers/ui'
import { Dismiss24Regular, FilterAddFilled } from '@fluentui/react-icons'

export default function AssistSummaryFilters({
  isTerminalLoading,
  terminals,
  onAplyFilters,
  isLoading
}: {
  terminals: AssistTerminal[]
  isTerminalLoading: boolean
  onAplyFilters: (filters: Filter) => void
  isLoading: boolean
}) {
  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(new Date().setDate(1))
  )
  const [endDate, setEndDate] = React.useState<Date | null>(new Date())
  const [openFilters, setOpenFilters] = React.useState(false)

  const [selectedTerminal, setSelectedTerminal] =
    React.useState<AssistTerminal | null>(terminals ? terminals[0] : null)

  const ctxui = React.useContext(UIContext)

  React.useEffect(() => {
    if (!selectedTerminal && terminals.length > 0) {
      setSelectedTerminal(terminals[0] ? terminals[0] : null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminals])

  React.useEffect(() => {
    onAplyFilters({
      startDate,
      endDate,
      terminalId: selectedTerminal?.id ?? null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <nav className="w-full space-y-2 py-3 border-b border-stone-500/30">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow flex items-center gap-2">
            <h2 className="font-semibold text-xl pr-2">
              Resumen único de asistencias
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
          </div>
        </div>
        <div className="px-1 border-t border-stone-500/20 pt-2 flex gap-4 flex-wrap">
          <Field size="small" label="Terminales biométricos">
            <div className="flex gap-2 flex-wrap">
              {selectedTerminal ? (
                <Badge
                  color="brand"
                  style={{
                    padding: '0.7rem 0.3rem'
                  }}
                  shape="circular"
                  icon={
                    <Avatar
                      size={20}
                      aria-hidden
                      name={selectedTerminal.name}
                      color="colorful"
                    />
                  }
                >
                  {selectedTerminal.name}
                </Badge>
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
              <Field
                label="Terminal biométrico"
                required
                validationMessage="Seleciona un terminal"
                validationState={selectedTerminal ? 'none' : 'error'}
              >
                <TagPicker
                  disabled={isTerminalLoading || isLoading}
                  onOptionSelect={(_, data) => {
                    setSelectedTerminal(
                      terminals.find((t) => t.id === data.value)!
                    )
                  }}
                  selectedOptions={
                    selectedTerminal ? [selectedTerminal.id] : []
                  }
                >
                  <TagPickerControl
                    style={{
                      gap: 4,
                      padding: selectedTerminal ? 5 : undefined
                    }}
                  >
                    {selectedTerminal && (
                      <Tag
                        disabled={isTerminalLoading || isLoading}
                        shape="circular"
                        media={
                          <Avatar
                            aria-hidden
                            name={selectedTerminal.name}
                            color="colorful"
                          />
                        }
                        value={selectedTerminal.id}
                      >
                        {selectedTerminal.name}
                      </Tag>
                    )}
                  </TagPickerControl>
                  <TagPickerList>
                    {terminals.length > 0 ? (
                      terminals
                        .filter((t) => t.id !== selectedTerminal?.id)
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
                isLoading || !endDate || !startDate || !selectedTerminal
              }
              onClick={() => {
                setOpenFilters(false)
                onAplyFilters({
                  startDate,
                  endDate,
                  terminalId: selectedTerminal ? selectedTerminal.id : null
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
    </>
  )
}
