import { toast } from 'anni'
import { Listeng } from '~/components/listeng'
import { useQrCodeReader } from '~/hooks/use-qr-reader'
import { api } from '~/lib/api'
import { useUi } from '~/store/ui'
import { BusinessUnit } from '~/types/business-unit'
import { Combobox, Option, Spinner, Tooltip } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Selection from './selection'
import { AddRegular } from '@fluentui/react-icons'
import { getPersonByDocumentId } from '~/utils/fetch'
import { createTicket } from '~/services/tickets'
import { handleError } from '~/utils'
import { Helmet } from 'react-helmet'
import { AttentionPosition } from '~/types/attention-position'

type Person = {
  documentId: string
  firstNames: string
  lastNames: string
  email: string | null
  career: string | null
  gender: string | null
  periodName: string | null
  business: string | null
}

export default function AttentionsRegisterPage() {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const toggleHeader = useUi((s) => s.toggleHeader)
  const isOpenSidebar = useUi((s) => s.isSidebarOpen)
  const isHeaderOpen = useUi((s) => s.isHeaderOpen)
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)
  const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)

  const [wainting, setWainting] = React.useState(false)
  const [positions, setPositions] = React.useState<AttentionPosition[]>([])
  const [person, setPerson] = React.useState<Person | null>(null)
  const [success, setSuccess] = React.useState(false)

  const [selectedBusinessUnits, setSelectedBusinessUnits] = React.useState<
    BusinessUnit[]
  >([])

  const [creating, setCreating] = React.useState(false)

  const { data: businessUnits, isLoading: isLoadingBusinessUnits } = useQuery<
    BusinessUnit[] | null
  >({
    queryKey: ['attentions/businessUnits'],
    queryFn: async () => {
      const res = await api.get<[]>(
        'attentions/businessUnits?onlyAttentions=true'
      )
      if (!res.ok) return null
      return res.data.map((event) => new BusinessUnit(event))
    }
  })

  const handleSearchPerson = async (documentId: string) => {
    try {
      setWainting(true)
      const res = await api.get<AttentionPosition[]>(
        `attentions/positions/all?businessIds=${selectedBusinessUnits
          .map((e) => e.id)
          .join(',')}&state=available`
      )

      console.log(res)
      if (res.ok) {
        setPositions(res.data.map((i) => new AttentionPosition(i)))
      } else {
        throw new Error('No se pudo obtener los puestos de atención')
      }

      const person = await getPersonByDocumentId(documentId, false)

      if (!person) {
        throw new Error('No se encontró la persona')
      }

      setPerson({
        documentId: person.documentId,
        firstNames: person.firstNames,
        lastNames: person.lastNames,
        business: null,
        career: null,
        email: null,
        gender: null,
        periodName: null
      })
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
    disabled: selectedBusinessUnits.length < 1 || !!person
  })

  const handleHidden = () => {
    if (isOpenSidebar) toggleSidebar()
    if (!isModuleMaximized) toggleModuleMaximized()
    if (isHeaderOpen) toggleHeader()
  }

  const onSubmit = async ({ position }: { position: AttentionPosition }) => {
    try {
      setCreating(true)
      if (!person || !position) {
        return toast('Error al generar el ticket')
      }
      const ok = await createTicket({
        personDocumentId: person.documentId,
        personFirstNames: person.firstNames,
        personLastNames: person.lastNames,

        personBusiness: person?.business ?? null,
        personCareer: person?.career ?? null,
        personEmail: person?.email ?? null,
        personGender: person?.gender ?? null,
        personPeriodName: person?.periodName ?? null,

        attentionPositionBusinessId: position.business.id,
        attentionPositionBusinessName: position.business.name,
        attentionPositionId: position.id,
        attentionPositionName: position.name,
        attentionPositionShortName: position.shortName ?? null
      })

      if (!ok) {
        throw new Error('No se pudo generar el ticket')
      }
    } catch (error) {
      console.error(error)
      toast('Ops! Algo salió mal', {
        description: handleError(error)
      })
    } finally {
      setCreating(false)
      setSuccess(true)
      setPerson(null)
      setPositions([])
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
    }
  }

  return (
    <div className="w-full h-full flex-grow">
      <Helmet>
        <title>Registro rápido de tickets | PontiApp</title>
      </Helmet>
      {isLoadingBusinessUnits ? (
        <div className="h-full w-full grid place-content-center">
          <Spinner size="huge" />
        </div>
      ) : creating ? (
        <div className="flex-grow h-full grid place-content-center">
          <Spinner size="huge" />
        </div>
      ) : success ? (
        <div className="flex-grow  h-full grid place-content-center">
          <svg
            width={60}
            height={60}
            className="checkmark dark:text-[#1f1e1d]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      ) : (
        <div className="h-full overflow-hidden flex flex-col relative w-full">
          <div className="text-center py-10 w-full pb-3 items-center h-full mx-auto flex">
            {!person && (
              <div className="flex relative flex-col items-center w-full">
                <Listeng
                  rotate={wainting}
                  pulse={wainting}
                  grayScale={!wainting}
                  className="mx-auto"
                />
                <div className="absolute -bottom-9">
                  {selectedBusinessUnits.length < 1 ? (
                    <p className="pt-10 text-xs opacity-70">
                      Selecciona al menos una unidad de negocio para comenzar
                    </p>
                  ) : (
                    !wainting && (
                      <div className="">
                        <p className="font-semibold text-sm tracking-tight opacity-70">
                          Escanea tu Carnet o DNI.
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {person && (
              <Selection
                onSubmit={onSubmit}
                positions={positions}
                person={person}
              />
            )}
          </div>
          <div
            style={{
              display: isHeaderOpen ? 'flex' : 'none'
            }}
            className="p-3 justify-center"
          >
            <div className="dark:bg-neutral-800 bg-white flex gap-1.5 p-1 shadow-md dark:shadow-black/40 border rounded-xl border-neutral-500/10">
              <Combobox
                input={{
                  autoComplete: 'off',
                  style: {
                    width: 500
                  }
                }}
                multiple={true}
                disabled={isLoadingBusinessUnits}
                onOptionSelect={(_, data) => {
                  const b = businessUnits?.find(
                    (b) => b.id === data.optionValue
                  )
                  if (!b) return
                  setSelectedBusinessUnits((prev) => {
                    const index = prev.findIndex((e) => e.id === b.id)
                    if (index === -1) return [...prev, b]
                    return prev.filter((e) => e.id !== b.id)
                  })
                }}
                style={{
                  borderRadius: 7
                }}
                selectedOptions={selectedBusinessUnits.map((b) => b.id) || []}
                value={
                  selectedBusinessUnits.length > 0
                    ? selectedBusinessUnits.map((b) => b.name).join(', ')
                    : ''
                }
                placeholder="Selecciona una o más unidades de negocio"
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
                  className="px-2 leading-4 flex items-center hover:bg-neutral-500/20 rounded-lg"
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
