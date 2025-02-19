import {
  Avatar,
  Button,
  Combobox,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Option,
  OverlayDrawer
} from '@fluentui/react-components'
import {
  Broom20Filled,
  BuildingMultipleFilled,
  Dismiss24Regular
} from '@fluentui/react-icons'
import { FiltersValues } from './+page'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { useUI } from '~/providers/ui'
import { RmAcademicProgram } from '~/types/rm-academic-program'

export default function Filters({
  onOpenChange,
  open,
  setFilters,
  filters
}: {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  setFilters: React.Dispatch<React.SetStateAction<FiltersValues>>
  filters: FiltersValues
}) {
  const { contentRef } = useUI()

  const [academicProgram, setAcademicProgram] =
    React.useState<RmAcademicProgram | null>(filters.academicProgram)

  const { data: academicPrograms } = useQuery<RmAcademicProgram[] | null>({
    queryKey: ['rm/academic-programs'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<[]>('rm/academic-programs')
      if (!res.ok) return null
      return res.data.map((i) => new RmAcademicProgram(i))
    }
  })

  return (
    <OverlayDrawer
      position="start"
      mountNode={contentRef.current}
      className="xl:min-w-[30svw] z-[99] sm:min-w-[50svw] max-w-full min-w-full"
      open={open}
      onOpenChange={(_, { open }) => onOpenChange(open)}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => onOpenChange(false)}
            />
          }
        >
          Agrega filtros a tu búsqueda
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col">
        <div className="flex-grow">
          <Field label="Programa académico" orientation="horizontal">
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              onOptionSelect={async (_, option) => {
                const value = academicPrograms?.find(
                  (d) => d.id === option.optionValue
                )
                if (!value) setAcademicProgram(null)
                setAcademicProgram(value as RmAcademicProgram)
              }}
              defaultValue={academicProgram ? academicProgram.name : ''}
              defaultSelectedOptions={
                academicProgram ? [academicProgram.id] : undefined
              }
            >
              {academicPrograms?.map((d) => (
                <Option
                  text={d.name}
                  key={d.id}
                  value={d.id}
                  className="flex items-center gap-2"
                >
                  <Avatar color="steel" icon={<BuildingMultipleFilled />} />
                  <div>
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-xs opacity-60">{d.businessUnit.name}</p>
                  </div>
                </Option>
              ))}
            </Combobox>
          </Field>
        </div>
        <footer className="border-t py-4 flex gap-3 border-neutral-500">
          <Button
            onClick={() => {
              onOpenChange(false)
              setFilters((prev) => ({
                ...prev,
                academicProgram
              }))
            }}
            appearance="primary"
          >
            Aplicar
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              setFilters((prev) => ({
                ...prev,
                academicProgram: null
              }))
            }}
            icon={<Broom20Filled />}
          >
            Limpiar filtros
          </Button>
        </footer>
      </DrawerBody>
    </OverlayDrawer>
  )
}
