import { localizedStrings } from '@/const'
import {
  Button,
  Field,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SearchBox
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { CalendarRtlRegular, DockRegular } from '@fluentui/react-icons'
import AssistsGrid from './grid'

export default function AssistsPage() {
  return (
    <div className="w-full flex overflow-auto flex-col flex-grow h-full p-3">
      <nav className="pb-2">
        <p className="text-xs dark:text-blue-600">
          En este apartado podrás visualizar los asistencias de los
          colaboradores calculados con sus horarios respectivos.
        </p>
      </nav>
      <nav className="flex items-end gap-4">
        <Field label="Busqueda">
          <SearchBox
            appearance="filled-lighter-shadow"
            placeholder="Buscar asistencias"
          />
        </Field>
        <Popover withArrow>
          <PopoverTrigger disableButtonEnhancement>
            <Button
              icon={<CalendarRtlRegular />}
              appearance="secondary"
              style={{
                border: 0
              }}
            >
              Rango de fecha
            </Button>
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
                    appearance="filled-darker"
                    strings={localizedStrings}
                    placeholder="Seleccionar fecha"
                  />
                </Field>
                <Field label="Hasta">
                  <DatePicker
                    appearance="filled-darker"
                    strings={localizedStrings}
                    placeholder="Seleccionar fecha"
                  />
                </Field>
              </div>
            </div>
          </PopoverSurface>
        </Popover>
        <Button
          appearance="secondary"
          style={{
            border: 0
          }}
        >
          Filtrar
        </Button>
        <div className="ml-auto">
          <Button
            icon={<DockRegular />}
            appearance="secondary"
            style={{
              border: 0
            }}
          >
            <span className="hidden xl:block">Generar reporte</span>
          </Button>
        </div>
      </nav>
      <div className="overflow-auto pt-3 flex-grow h-full">
        <AssistsGrid />
      </div>
    </div>
  )
}
