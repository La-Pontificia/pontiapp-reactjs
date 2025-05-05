import {
  ClockRegular,
  DocumentFlowchartRegular,
  MegaphoneLoudRegular,
  MoreHorizontalRegular,
  PersonRegular,
  TabletSpeakerRegular
} from '@fluentui/react-icons'

import { Link } from 'react-router'
import { useAuth } from '@/store/auth'

export default function ModulePage() {
  const { user: authUser } = useAuth()
  const modules = {
    users: {
      enable: authUser.hasModule('users'),
      text: 'Usuarios',
      href: '/m/users',
      icon: PersonRegular
    },
    edas: {
      enable: authUser.hasModule('edas'),
      text: 'Edas',
      href: '/m/edas',
      icon: DocumentFlowchartRegular
    },
    assists: {
      enable: authUser.hasModule('assists'),
      text: 'Asistentencias',
      href: '/m/assists',
      icon: ClockRegular
    },
    events: {
      enable: authUser.hasModule('events'),
      text: 'Eventos',
      href: '/m/events',
      icon: MegaphoneLoudRegular
    },
    attentions: {
      enable: authUser.hasModule('attentions'),
      text: 'Atenciones',
      href: '/m/attentions',
      icon: TabletSpeakerRegular
    },
    follows: {
      enable: authUser.hasModule('others'),
      text: 'Otros',
      href: '/m/others',
      icon: MoreHorizontalRegular
    }
  }
  return (
    <div>
      <h2 className="p-5 pb-0 px-7 font-semibold text-xl text-left">Módulos</h2>
      <div className="p-7 grid grid-cols-3 max-[450px]:grid-cols-2 flex-wrap gap-7">
        {Object.entries(modules).map(([key, value]) => {
          if (!value.enable) return null
          return (
            <Link
              className="h-[110px] shadow-lg dark:shadow-black/50 rounded-xl bg-white dark:bg-stone-500/20 grid place-content-center font-semibold"
              to={value.href}
              key={key}
            >
              <value.icon fontSize={30} className="mx-auto opacity-80" />
              <p className="pt-1 font-bold">{value.text}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
