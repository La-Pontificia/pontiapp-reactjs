import { AttentionPosition } from '~/types/attention-position'

export default function Selection({
  person,
  positions,
  onSubmit
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person: any
  positions: AttentionPosition[]
  onSubmit: ({ position }: { position: AttentionPosition }) => void
}) {
  return (
    <div className="w-full h-full max-w-4xl mx-auto px-3 flex pt-4 flex-col">
      <h2 className="font-semibold text-2xl tracking-tight">
        Hola{' '}
        <span className="dark:text-violet-500 text-violet-500">
          {person?.firstNames} 🙂
        </span>
      </h2>
      <p className="pt-3 text-xs opacity-80 text-center px-2">
        Por favor selecciona una opción
      </p>
      <div className="flex-grow overflow-auto p-10">
        <div className="overflow-auto gap-5 grid grid-cols-3">
          {positions.map((position) => {
            return (
              <button
                onClick={() => onSubmit({ position })}
                key={position.id}
                className="rounded-2xl border-2 border-stone-300 dark:border-stone-700 dark:text-white group font-semibold tracking-tight text-base"
              >
                <p className="p-12">{position.name}</p>
                <p
                  style={{
                    color: position.background
                  }}
                  className="dark:opacity-50 text-xs pb-2"
                >
                  {position.business.acronym}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
