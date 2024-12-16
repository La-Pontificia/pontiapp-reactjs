import { toast } from '~/commons/toast'
import { Listeng } from '~/components/listeng'
import { useQrCodeReader } from '~/hooks/use-qr-reader'
import { api } from '~/lib/api'
import { useUi } from '~/store/ui'
import { AttentionService } from '~/types/attention-service'
import { BusinessUnit } from '~/types/business-unit'
import { Combobox, Option, Spinner, Tooltip } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Selection from './selection'
import { AddRegular } from '@fluentui/react-icons'

const personMockup = {
  documentId: '72377685',
  firstNames: 'liz Anali',
  lastNames: 'Araujo Quispw',
  email: '71636724@elp.edu.pe',
  career: 'Contabilidad',
  gender: 'F',
  periodName: '2025-II',
  business: 'Escuela Superior La Pontificia'
}

export default function AttentionsRegisterPage() {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const toggleHeader = useUi((s) => s.toggleHeader)
  const isOpenSidebar = useUi((s) => s.isSidebarOpen)
  const isHeaderOpen = useUi((s) => s.isHeaderOpen)
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)
  const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)

  const [wainting, setWainting] = React.useState(false)
  const [services, setServices] = React.useState<AttentionService[]>([])
  const [selectedService, setSelectedService] =
    React.useState<AttentionService | null>(null)
  const [person, setPerson] = React.useState<typeof personMockup | null>(null)
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    React.useState<BusinessUnit | null>(null)

  const [creating, setCreating] = React.useState(false)

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
    if (selectedBusinessUnit) {
      if (isOpenSidebar) toggleSidebar()
      if (!isModuleMaximized) toggleModuleMaximized()
      if (isHeaderOpen) toggleHeader()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit])

  const handleServices = async () => {
    const res = await api.get<AttentionService[]>(
      `attentions/services/business/${selectedBusinessUnit?.id}`
    )

    if (res.ok) {
      setServices(res.data.map((service) => new AttentionService(service)))
    } else {
      toast('No se encontraron servicios disponibles')
    }
  }

  const handleSearchPerson = async (documentId: string) => {
    try {
      setWainting(true)
      await handleServices()

      // simulate 2s of waiting
      await new Promise((resolve) => setTimeout(resolve, 2000))
      if (documentId !== personMockup.documentId)
        throw new Error('Lo siento, no pudimos encontrarte.')

      setPerson(personMockup)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        toast(error.message)
      } else {
        toast('Ops! Algo salió mal')
      }
    } finally {
      setWainting(false)
    }
  }

  useQrCodeReader({
    onEnter: async (t) => {
      if (!t) return
      handleSearchPerson(t)
    },
    disabled: !selectedBusinessUnit
  })

  const handleHidden = () => {
    if (isOpenSidebar) toggleSidebar()
    if (!isModuleMaximized) toggleModuleMaximized()
    if (isHeaderOpen) toggleHeader()
  }

  const onSubmit = async () => {
    setCreating(true)
    const res = await api.post('attentions/tickets', {
      data: JSON.stringify({
        personDocumentId: person?.documentId,
        personEmail: person?.email,
        personFirstNames: person?.firstNames,
        personLastNames: person?.lastNames,
        personCareer: person?.career,
        personGender: person?.gender,
        personPeriodName: person?.periodName,
        attentionServiceId: selectedService?.id
      })
    })

    if (!res.ok) {
      toast('No se pudo registrar la atención')
    } else {
      toast('Ticket generado correctamente')
    }

    setCreating(false)
    setPerson(null)
    setServices([])
    setSelectedService(null)
  }

  return (
    <div className="w-full h-full flex-grow">
      {isLoadingBusinessUnits ? (
        <div className="h-full w-full grid place-content-center">
          <Spinner size="huge" />
        </div>
      ) : (
        <div className="h-full overflow-hidden relative w-full">
          <div className="text-center py-10 items-center h-full mx-auto flex">
            {!person && (
              <div className="flex relative flex-col items-center w-full">
                <Listeng
                  rotate={wainting}
                  pulse={wainting}
                  grayScale={!wainting}
                  className="mx-auto"
                />
                <div className="absolute -bottom-10">
                  {!selectedBusinessUnit ? (
                    <p className="pt-10 opacity-70">
                      Selecciona una unidad de negocio para comenzar
                    </p>
                  ) : (
                    !wainting && (
                      <p className="pt-10 font-semibold text-base tracking-tight opacity-70">
                        Escanea tu Carnet o DNI.
                      </p>
                    )
                  )}
                </div>
              </div>
            )}
            {person && (
              <Selection
                onSubmit={onSubmit}
                services={services}
                setSelectedService={setSelectedService}
                selectedService={selectedService}
                person={person}
                creating={creating}
              />
            )}
          </div>
          <div
            style={{
              marginBottom: isHeaderOpen ? '20px' : '-100px'
            }}
            className="transition-all absolute bottom-0 inset-x-0 flex justify-center"
          >
            <div className="dark:bg-stone-800 gap-1.5 flex p-1 shadow-md shadow-black/40 border rounded-xl border-stone-500/10">
              <Combobox
                input={{
                  autoComplete: 'off'
                }}
                appearance="filled-darker"
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
              <Tooltip
                content="Ocultar distracciones"
                relationship="description"
              >
                <button
                  onClick={handleHidden}
                  className="px-2 leading-4 flex items-center hover:bg-stone-500/20 rounded-lg"
                >
                  <AddRegular className="rotate-45" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
