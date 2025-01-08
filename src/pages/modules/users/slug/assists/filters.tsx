import { Button, Field } from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import React from 'react'
import { localizedStrings } from '~/const'
import { ExcelColored } from '~/icons'
import { format } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { Filter } from './+page'

export default function UserSlugAssistsFilter({
  isLoading,
  onAplyFilters
}: {
  isLoading: boolean
  onAplyFilters: (filters: Filter) => void
}) {
  const { user: authUser } = useAuth()
  const [startDate, setStartDate] = React.useState<Date | null>(
    new Date(new Date().setDate(1))
  )
  const [endDate, setEndDate] = React.useState<Date | null>(new Date())

  return (
    <nav className="flex items-end py-2 gap-2">
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
      <Button
        appearance="secondary"
        disabled={isLoading || !endDate || !startDate}
        onClick={() => {
          onAplyFilters({
            startDate,
            endDate
          })
        }}
      >
        Filtrar
      </Button>
      {authUser.hasPrivilege('assists:report') && (
        <div className="ml-auto">
          <Button
            disabled
            // disabled={isLoading || !endDate || !startDate}
            icon={<ExcelColored size={20} />}
            appearance="secondary"
            // onClick={() => setOpenReport(true)}
            style={{}}
          >
            <span className="hidden xl:block">Excel</span>
          </Button>
        </div>
      )}
    </nav>
  )
}
