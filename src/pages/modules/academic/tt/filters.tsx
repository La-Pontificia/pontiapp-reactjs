/* eslint-disable react-hooks/rules-of-hooks */
import { api } from '@/lib/api'
import {
  Avatar,
  Button,
  Combobox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Option
} from '@fluentui/react-components'
import { Broom20Filled, Dismiss24Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Filter } from './+page'
import { RmData } from '@/types/RmData'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { localizedStrings } from '@/const'
import { format } from '@/lib/dayjs'

export default function TTFilters({
  sidebarIsOpen,
  setSidebarIsOpen,
  setFilters,
  filters
}: {
  sidebarIsOpen: boolean
  setSidebarIsOpen: (isOpen: boolean) => void
  setFilters: React.Dispatch<React.SetStateAction<Filter>>
  filters: Filter
}) {
  if (!sidebarIsOpen) return null
  const [section, setSection] = React.useState<string | null>(filters.section)
  const [period, setPeriod] = React.useState<string | null>(filters.period)
  const [startDate, setStartDate] = React.useState<Date | null>(
    filters.startDate
  )
  const [endDate, setEndDate] = React.useState<Date | null>(filters.endDate)
  const [academicProgram, setAcademicProgram] = React.useState<string | null>(
    filters.academicProgram
  )
  // const { data: sections, isLoading: isLoadingSections } = useQuery<RmData[]>({
  //   queryKey: ['sections', 'rm'],
  //   queryFn: async () => {
  //     const res = await api.get<RmData[]>(`rm/sections`)
  //     if (!res.ok) {
  //       return []
  //     }
  //     return res.data.map((data) => new RmData(data))
  //   }
  // })

  const { data: periods, isLoading: isLoadingPeriods } = useQuery<RmData[]>({
    queryKey: ['periods', 'rm'],
    enabled: sidebarIsOpen,
    queryFn: async () => {
      const res = await api.get<RmData[]>(`rm/periods`)
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new RmData(data))
    }
  })

  const { data: academicPrograms, isLoading: isLoadingAcademicPrograms } =
    useQuery<RmData[]>({
      queryKey: ['academic-programs', 'rm'],
      enabled: sidebarIsOpen,
      queryFn: async () => {
        const res = await api.get<RmData[]>(`rm/academic-programs`)
        if (!res.ok) {
          return []
        }
        return res.data.map((data) => new RmData(data))
      }
    })

  const handleApplyFilters = () => {
    setSidebarIsOpen(false)
    setFilters((prev) => ({
      ...prev,
      section,
      period,
      academicProgram,
      endDate,
      startDate
    }))
  }

  return (
    <Drawer
      position="end"
      separator
      className="xl:min-w-[35svw] sm:min-w-[50svw] max-w-full min-w-full"
      open={sidebarIsOpen}
      onOpenChange={(_, { open }) => setSidebarIsOpen(open)}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => setSidebarIsOpen(false)}
            />
          }
        >
          Agrega filtros a tu búsqueda
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col">
        <div className="flex-grow ">
          <div className="grid gap-4">
            <Field orientation="horizontal" label="Sección" className="w-full">
              <Input
                defaultValue={section || ''}
                onChange={(e) => setSection(e.target.value)}
                placeholder="Ejemplo: IET4B251T3"
              />
            </Field>
            <Field orientation="horizontal" label="Periodo" className="w-full">
              <Combobox
                onOptionSelect={(_, e) => {
                  if (e.optionValue) setPeriod(e.optionValue)
                  else setPeriod(null)
                }}
                input={{
                  autoComplete: 'off'
                }}
                defaultSelectedOptions={period ? [period] : undefined}
                value={period ?? ''}
                disabled={isLoadingPeriods}
                placeholder="Todos"
              >
                {periods?.map((a) => (
                  <Option text={a.name} key={a.name} value={a.name}>
                    <Avatar color="colorful" name={a.name} />
                    <p className="font-medium">{a.name}</p>
                  </Option>
                ))}
              </Combobox>
            </Field>
            <Field
              orientation="horizontal"
              label="Programa académico"
              className="w-full"
            >
              <Combobox
                onOptionSelect={(_, e) => {
                  if (e.optionValue) setAcademicProgram(e.optionValue)
                  else setAcademicProgram(null)
                }}
                input={{
                  autoComplete: 'off'
                }}
                defaultSelectedOptions={
                  academicProgram ? [academicProgram] : undefined
                }
                value={academicProgram ?? ''}
                disabled={isLoadingAcademicPrograms}
                placeholder="Todos"
              >
                {academicPrograms?.map((a) => (
                  <Option text={a.name} key={a.name} value={a.name}>
                    <Avatar color="colorful" name={a.name} />
                    <p className="font-medium">{a.name}</p>
                  </Option>
                ))}
              </Combobox>
            </Field>
            <Field
              orientation="horizontal"
              label="Rango de fechas"
              className="w-full"
            >
              <div className="grid grid-cols-2 gap-2">
                <DatePicker
                  value={startDate ? new Date(startDate) : null}
                  onSelectDate={(date) => {
                    setStartDate(date ? date : null)
                  }}
                  formatDate={(date) => format(date, 'DD MMM YYYY')}
                  strings={localizedStrings}
                  placeholder="Fecha inicio"
                />
                <DatePicker
                  value={endDate ? new Date(endDate) : null}
                  onSelectDate={(date) => {
                    setEndDate(date ? date : null)
                  }}
                  formatDate={(date) => format(date, 'DD MMM YYYY')}
                  strings={localizedStrings}
                  placeholder="Fecha fin"
                />
              </div>
            </Field>
          </div>
        </div>
        <footer className="border-t py-4 flex gap-3 border-neutral-500">
          <Button onClick={handleApplyFilters} appearance="primary">
            Aplicar
          </Button>
          <Button
            onClick={() => {
              setSidebarIsOpen(false)
              setFilters((prev) => ({
                ...prev,
                academicProgram: null,
                endDate: null,
                period: null,
                section: null,
                startDate: null
              }))
            }}
            icon={<Broom20Filled />}
          >
            Limpiar filtros
          </Button>
        </footer>
      </DrawerBody>
    </Drawer>
  )
}
