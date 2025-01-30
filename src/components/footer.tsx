import { businesses } from '~/const'
import { Lp } from '~/icons'

export default function Footer() {
  return (
    <footer className="py-5 px-10 relative border-t dark:border-stone-700">
      <div className="flex max-w-6xl justify-between mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="px-5">
            <Lp size={30} className="text-cyan-600 dark:text-cyan-500" />
          </div>
          <div>
            <p className="pb-1 font-bold">La Pontificia</p>
            <p className="text-xs">
              {new Date().getFullYear()} ©{' '}
              <a
                href="https://lp.com.pe"
                target="_blank"
                className="border-b border-gray-500 border-dotted"
              >
                La Pontificia.
              </a>{' '}
              Todos los derechos reservados.
            </p>
          </div>
        </div>
        <p className="text-xs">
          Desarrollado por{' '}
          <a
            href="https://daustinn.com"
            className="font-medium hover:underline"
            target="_blank"
          >
            Daustinn
          </a>
        </p>
      </div>
      <ul className="pt-3 flex max-w-6xl mx-auto gap-6 flex-wrap border-t border-stone-300 dark:border-stone-700 mt-6">
        {Object.entries({
          ...businesses,
          'https://ci.ilp.edu.pe': {
            name: 'Centro de Información'
          },
          'https://app.lapontificia.edu.pe': {
            name: 'PontiApp'
          }
        }).map(([key, value]) => (
          <li key={key} className="text-xs py-1">
            <a href={key} target="_blank" className="hover:underline">
              {value.name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
