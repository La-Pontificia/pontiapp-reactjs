import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Persona
} from '@fluentui/react-components'
import { useAuth } from '@/store/auth'

export default function BusinessUnitVerify() {
  const { businessUnit, businessUnits, user, handleToggleBusinessUnit } =
    useAuth()
  if (businessUnit) return null
  return (
    <Dialog open>
      <DialogSurface className="w-[500px] !p-3">
        <DialogBody>
          <DialogTitle>Selecciona una unidad de negocio</DialogTitle>
          <DialogContent>
            <p className="pb-1">Hola, {user.displayName}.</p>
            <p className="text-xs opacity-70">
              Algunos modulos requieren una unidad de negocio por defecto para
              filtrar y una mejor experiencia en la aplicación, por favor
              selecciona una para continuar.
            </p>
            <div className="flex flex-col  py-4">
              {businessUnits.map((item) => (
                <button
                  onClick={() => handleToggleBusinessUnit(item)}
                  key={item.id}
                  className="w-full hover:bg-stone-500/20 p-2 rounded-xl flex gap-3 items-center text-left"
                >
                  <div className="border rounded-full w-5 aspect-square border-stone-500/50"></div>
                  <Persona
                    size="extra-large"
                    avatar={{
                      className: '!rounded-lg',
                      image: {
                        className: 'p-1.5',
                        src: item.logoURLSquare
                      }
                    }}
                    name={item.acronym}
                    secondaryText={item.name}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs opacity-70">
              Si no encuentras la unidad de negocio que buscas, por favor
              contacta al administrador del sistema.
            </p>
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
