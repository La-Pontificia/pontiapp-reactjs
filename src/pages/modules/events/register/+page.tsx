import { toast } from '~/commons/toast'
import { Listeng } from '~/components/listeng'
import { useQrCodeReader } from '~/hooks/use-qr-reader'
import { api } from '~/lib/api'
import { useUi } from '~/store/ui'
import { BusinessUnit } from '~/types/business-unit'
import { Event } from '~/types/event'
import { Combobox, Option, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function EventsRegister() {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const isOpenSidebar = useUi((s) => s.isSidebarOpen)
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)
  const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)

  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
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

  React.useEffect(() => {
    if (selectedEvent && selectedBusinessUnit) {
      if (isOpenSidebar) toggleSidebar()
      if (!isModuleMaximized) toggleModuleMaximized()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent, selectedBusinessUnit])

  useQrCodeReader({
    onEnter: (t) => t && toast(t),
    disabled: !selectedEvent || !selectedBusinessUnit
  })

  return (
    <div className="w-full h-full flex-grow">
      {isLoading || isLoadingBusinessUnits ? (
        <div className="h-full w-full grid place-content-center">
          <Spinner size="huge" />
        </div>
      ) : (
        <div className="h-full flex flex-col w-full">
          <div className="text-center flex-grow flex-col items-center flex justify-center">
            <Listeng />
            <p className="pt-10 opacity-70">
              {selectedBusinessUnit && selectedEvent
                ? 'Escuchando el lector de barras...'
                : 'Selecciona un evento y una unidad de negocio para comenzar'}
            </p>
          </div>
          <div className="pb-5 max-w-xl mx-auto">
            <div className="dark:bg-neutral-800 gap-2 flex p-1 shadow-md shadow-black/40 border rounded-xl border-neutral-500/10">
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
                  const b = businessUnits?.find(
                    (b) => b.id === data.optionValue
                  )
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
                    {business.name}
                  </Option>
                ))}
              </Combobox>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
