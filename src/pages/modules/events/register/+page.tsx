import { toast } from 'anni'
import { useQrCodeReader } from '~/hooks/use-qr-reader'
import { api } from '~/lib/api'
import { BusinessUnit } from '~/types/business-unit'
import { Event } from '~/types/event'
import { Avatar, Combobox, Option } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { format } from '~/lib/dayjs'
import { BarcodeScannerFilled, GuestRegular } from '@fluentui/react-icons'

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

  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
  const [records, setRecords] = React.useState<
    Array<{
      names: string
      documentId: string
      career: string
      created_at: Date
    }>
  >([])
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

  const handleGetPerson = async (documentId: string) => {
    if (documentId.length !== 8) return toast('Documento inválido')

    const resultPerson = people.find((p) => p.documentId === documentId)
    const person = resultPerson ?? {
      documentId,
      career: '',
      names: ''
    }

    if (!resultPerson) {
      toast(
        `El documento ${documentId} no se encuentra en la lista de asistentes`
      )
    }

    setRecords((prev) => [
      {
        names: person.names || person.documentId,
        career: person.career,
        documentId: person.documentId,
        created_at: new Date()
      },
      ...prev
    ])

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

    if (!res.ok) {
      toast('Error al registrar')
      setRecords((prev) =>
        prev.filter((r) => r.documentId !== person.documentId)
      )
    }
  }

  const { capturedText, inputRef, onChange, handleEnter } = useQrCodeReader({
    onEnter: (d) => handleGetPerson(d),
    disabled: !selectedEvent || !selectedBusinessUnit
  })

  return (
    <div className="w-full flex py-2 flex-col overflow-y-auto h-full flex-grow">
      <div className="flex items-center gap-4 py-4 w-full">
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
            const b = businessUnits?.find((b) => b.id === data.optionValue)
            if (b) setSelectedBusinessUnit(b)
          }}
          style={{
            borderRadius: 7
          }}
          value={selectedBusinessUnit?.name}
          placeholder="Unidad de negocio"
        >
          {businessUnits?.map((business) => (
            <Option key={business.id} text={business.name} value={business.id}>
              {business.name}
            </Option>
          ))}
        </Combobox>
      </div>
      <div className="flex-grow h-full overflow-y-auto flex border-t border-stone-500/40">
        {!selectedEvent || !selectedBusinessUnit ? (
          <div className="flex-grow h-full grid place-content-center">
            <p className=" text-base max-w-[30ch] text-center mx-auto opacity-70">
              Seleccione un evento y una unidad de negocio para comenzar.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-y-auto flex flex-col">
            <div className="py-5 px-2">
              <div className="relative">
                <div className="absolute pointer-events-none inset-y-0 px-2 flex items-center">
                  <BarcodeScannerFilled fontSize={25} className="opacity-50" />
                </div>
                <input
                  ref={inputRef}
                  onChange={onChange}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEnter()
                  }}
                  placeholder="DNI o código de barras"
                  className="dark:bg-neutral-800 pl-10 font-semibold outline-2 w-[300px] focus:outline outline-blue-500 text-sm placeholder:text-neutral-400 rounded-lg p-3"
                  value={capturedText}
                />
              </div>
              <p className="text-xs pt-1 dark:text-yellow-400">
                Escribe el DNI, o simplemente escanea el código de barras.
              </p>
            </div>
            <div className="w-full overflow-y-auto">
              <table className="w-full relative">
                <thead>
                  <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
                    <td className="min-w-[300px]">Persona</td>
                    <td>Unidad</td>
                    <td>Evento</td>
                    <td>Ingresó</td>
                  </tr>
                </thead>
                <tbody>
                  {records?.map((record) => (
                    <tr className="relative bg-neutral-50/40 dark:bg-neutral-900 odd:bg-neutral-500/10 dark:even:bg-neutral-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar
                            color="royal-blue"
                            size={40}
                            icon={<GuestRegular fontSize={27} />}
                          />
                          <div>
                            <p className="line-clamp-3 capitalize">
                              {record.names}
                            </p>
                            <p className="text-sm capitalize opacity-70">
                              {record.career}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="capitalize opacity-70 text-nowrap">
                            {selectedBusinessUnit?.name}
                          </p>
                          <p className="text-xs dark:text-cyan-500 ">
                            {/* {item.period} */}-
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className="capitalize opacity-70 text-nowrap">
                          {selectedEvent.name}
                        </p>
                      </td>
                      <td>
                        <p className="capitalize opacity-70 text-nowrap">
                          {format(record.created_at, 'MMMM D, YYYY h:mm A')}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
