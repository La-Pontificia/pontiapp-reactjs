import { AttentionService } from '~/types/attention-service'
import { Spinner } from '@fluentui/react-components'
export default function Selection({
  person,
  setSelectedService,
  selectedService,
  services,
  onSubmit,
  creating
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: any
  services: AttentionService[]
  selectedService: AttentionService | null
  setSelectedService: (service: AttentionService) => void
  onSubmit: () => void
  creating: boolean
}) {
  return (
    <div className="w-full max-w-2xl h-full px-3 flex pt-6 flex-col mx-auto">
      <h2 className="font-semibold text-lg tracking-tight pb-10">
        Hola{' '}
        <span className="dark:text-yellow-500 text-yellow-500">
          {person?.firstNames}
        </span>
        , ¿En que te ayudamos?
      </h2>
      <div className="flex-grow overflow-auto space-y-2 flex flex-col">
        {services.map((service) => {
          const selected = selectedService?.id === service.id
          return (
            <button
              onClick={() => setSelectedService(service)}
              data-selected={selected ? '' : undefined}
              key={service.id}
              className="p-3 text-base data-[selected]:bg-yellow-300 dark:data-[selected]:bg-yellow-500 data-[selected]:border-black data-[selected]:text-black data-[selected]:dark:border-black font-bold border-4 border-[#e8e8e8] dark:border-[#262626] rounded-2xl group"
            >
              <p>{service.name}</p>
            </button>
          )
        })}
      </div>
      <footer className="pt-4">
        {!selectedService && (
          <p className="pb-2 text-xs dark:text-yellow-400 text-left px-2">
            Selecciona un servicio para continuar
          </p>
        )}
        <button
          onClick={onSubmit}
          disabled={!selectedService || creating}
          className="bg-[#ff947f] h-14 disabled:grayscale disabled:opacity-70 dark:bg-[#ff5734] p-3 dark:text-black font-bold tracking-tight text-base w-full rounded-2xl border-4 border-black"
        >
          {creating ? (
            <Spinner size="small" appearance="inverted" />
          ) : (
            'Crear mi ticket'
          )}
        </button>
      </footer>
    </div>
  )
}
