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
  const [people, setPeople] = React.useState<
    Array<{
      names: string
      documentId: string
      career: string
    }>
  >([])
  const SHEET_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3NJ2Sdi74uySfutPWUUnFBz-5pI57flWViZKplAo9IdlQ6k_J2KrIp3bcwSMx4OcNQHj1yMkre8pU/pub?output=csv'

  React.useEffect(() => {
    const fetchData = async () => {
      const csv = await fetch(SHEET_URL)
      const text = await csv.text()
      const people = text
        .split('\n')
        .splice(1)
        .map((row) => {
          const [, names, documentId, , , career] = row.split(',')
          return {
            names,
            documentId,
            career
          }
        })
      setPeople(people)
    }

    fetchData()
  }, [])

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

  const handleGetPerson = async (documentId: string) => {
    if (documentId.length < 8) return toast('Documento inválido')
    const person = people.find((p) => p.documentId === documentId) ?? {
      documentId,
      career: '',
      names: ''
    }

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

    if (res.ok) {
      toast(`${person.names} registrado`)
    } else {
      toast('Error al registrar')
    }
  }

  useQrCodeReader({
    onEnter: (d) => handleGetPerson(d),
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
            <Listeng
              grayScale={!selectedEvent || !selectedBusinessUnit}
              pulse={!!(selectedEvent && selectedBusinessUnit)}
              rotate={!!(selectedEvent && selectedBusinessUnit)}
            />
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
