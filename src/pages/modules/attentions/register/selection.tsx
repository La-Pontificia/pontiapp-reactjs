import { AttentionService } from '~/types/attention-service'
import { Button, Spinner } from '@fluentui/react-components'
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
    <div className="w-full max-w-lg px-3 mx-auto">
      <h2 className="font-semibold text-2xl tracking-tight pb-5 opacity-60">
        Hola {person?.firstNames}, ¿En que te ayudamos?
      </h2>
      <div className="max-h-[60vh] overflow-auto space-y-2 flex flex-col">
        {services.map((service) => {
          const selected = selectedService?.id === service.id
          return (
            <button
              onClick={() => setSelectedService(service)}
              data-selected={selected ? '' : undefined}
              key={service.id}
              className="p-0.5 text-base transition-all rounded-xl group data-[selected]:bg-gradient-to-tl data-[selected]:from-blue-600 data-[selected]:via-violet-600 data-[selected]:to-lime-600"
            >
              <div className="dark:bg-neutral-800 rounded-[11px]">
                <div className="p-4 flex justify-start font-medium">
                  <p>{service.name}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      <footer className="pt-5">
        <Button
          onClick={onSubmit}
          appearance="primary"
          disabled={!selectedService || creating}
          style={{
            width: '100%',
            borderRadius: 10,
            padding: '1rem'
          }}
          icon={creating ? <Spinner size="tiny" /> : null}
        >
          Crear mi ticket
        </Button>
      </footer>
    </div>
  )
}
