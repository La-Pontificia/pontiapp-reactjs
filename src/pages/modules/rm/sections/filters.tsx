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
import { BusinessUnit } from '~/types/business-unit'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { useUI } from '~/providers/ui'

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

  const [businessUnit, setBusinessUnit] = React.useState<BusinessUnit | null>(
    filters.businessUnit
  )

  const { data: businessUnits } = useQuery<BusinessUnit[] | null>({
    queryKey: ['partials/businessUnits/all'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<[]>('partials/businessUnits/all')
      if (!res.ok) return null
      return res.data.map((i) => new BusinessUnit(i))
    }
  })

  return (
    <OverlayDrawer
      position="start"
      mountNode={contentRef.current}
      className="xl:min-w-[35svw] z-[99] sm:min-w-[50svw] max-w-full min-w-full"
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
          <Field label="Unidad" orientation="horizontal">
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              onOptionSelect={async (_, option) => {
                const value = businessUnits?.find(
                  (d) => d.id === option.optionValue
                )
                if (!value) setBusinessUnit(null)
                setBusinessUnit(value as BusinessUnit)
              }}
              defaultValue={businessUnit ? businessUnit.name : ''}
              defaultSelectedOptions={
                businessUnit ? [businessUnit.id] : undefined
              }
            >
              {businessUnits?.map((d) => (
                <Option
                  text={d.name}
                  key={d.id}
                  value={d.id}
                  className="flex items-center gap-2"
                >
                  <Avatar color="steel" icon={<BuildingMultipleFilled />} />
                  <div>
                    <p className="font-semibold">{d.acronym}</p>
                    <p className="text-xs opacity-60">{d.name}</p>
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
                businessUnit: businessUnit
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
                businessUnit: null
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
