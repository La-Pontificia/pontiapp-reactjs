import { Button, Combobox, Field, Option } from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import React from 'react'
import { localizedStrings } from '~/const'
import { AssistTerminal } from '~/types/assist-terminal'
import { Filter } from './+page'
import { format } from '~/lib/dayjs'

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
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [endDate, setEndDate] = React.useState<Date | null>(null)

  const [selectedTerminal, setSelectedTerminal] =
    React.useState<AssistTerminal>()

  return (
    <>
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-end gap-4">
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
        <Combobox
          disabled={isTerminalLoading || isLoading}
          style={{
            minWidth: '50px'
          }}
          input={{
            style: {
              width: '100px'
            }
          }}
          selectedOptions={selectedTerminal ? [selectedTerminal.id] : []}
          placeholder="Terminal"
          value={selectedTerminal?.name}
          onOptionSelect={(_, event) => {
            setSelectedTerminal(
              terminals!.find((t) => t.id === event.optionValue)!
            )
          }}
        >
          {terminals?.map((terminal) => (
            <Option text={terminal.name} key={terminal.id} value={terminal.id}>
              <div className="block">
                <p>{terminal.name}</p>
                <p className="text-xs opacity-50">{terminal.database}</p>
              </div>
            </Option>
          ))}
        </Combobox>
        <Button
          appearance="secondary"
          style={{}}
          disabled={isLoading || !endDate || !startDate || !selectedTerminal}
          onClick={() => {
            onAplyFilters({
              startDate,
              endDate,
              terminalId: selectedTerminal!.id
            })
          }}
        >
          Filtrar
        </Button>
      </nav>
    </>
  )
}
