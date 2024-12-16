import {
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tooltip
} from '@fluentui/react-components'
import { AlertRegular } from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'
import { timeAgoShort } from '~/lib/dayjs'
import { UserNotification } from '~/types/user-notification'

export default function UserNotifications() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Popover open={open} onOpenChange={(_, e) => setOpen(e.open)}>
        <PopoverTrigger disableButtonEnhancement>
          <Tooltip content="Tus notificaciones" relationship="label">
            <button>
              <AlertRegular fontSize={23} />
            </button>
          </Tooltip>
        </PopoverTrigger>
        <PopoverSurface
          tabIndex={-1}
          style={{
            padding: 0,
            borderRadius: '15px',
            overflow: 'hidden'
          }}
          className="min-w-[370px] max-w-[370px]"
        >
          <h1 className="p-3 pb-0 text-xl font-bold tracking-tight">
            Tus notificaciones
          </h1>
          {open && <NotificationsList />}
        </PopoverSurface>
      </Popover>
    </>
  )
}

export const NotificationsList = () => {
  const [notifications] = React.useState<UserNotification[]>([
    {
      id: '1',
      description:
        'El reporte de asistencias sin usuarios ya está disponible clickea aquí para verlo.',
      read: new Date(),
      URL: 'https://google.com',
      created_at: new Date('2024-09-01T00:00:00'),
      updated_at: new Date()
    },
    {
      id: '2',
      description: 'Tu contraseña ah sido restablecida.',
      URL: 'https://google.com',
      created_at: new Date('2024-12-01T00:00:00'),
      updated_at: new Date()
    }
  ])

  return (
    <div className="p-1 pt-0 max-h-[500px] divide-y divide-stone-500/20 overflow-auto">
      {notifications.map((notification) => {
        return (
          <div className="py-2" key={notification.id}>
            <Link
              to={notification.URL ?? '#'}
              className="p-3 hover:bg-stone-900 relative rounded-xl gap-3 flex"
            >
              <div>
                <p className="dark:text-stone-200 leading-5 line-clamp-3 [&>span]:text-white">
                  {/* <span className="font-semibold">{user.displayName}</span>{' '} */}
                  {notification.description}
                </p>
                <p className="text-[13px]">
                  <span className="dark:text-blue-500">
                    {' '}
                    {timeAgoShort(notification.created_at)}
                  </span>{' '}
                  · <span className="opacity-30">Daustinn</span>
                </p>
              </div>
              {!notification.read && (
                <div className="pointer-events-none right-0 flex items-center justify-center inset-y-0 px-4 absolute">
                  <span className="block w-3 rounded-full aspect-square dark:bg-blue-500" />
                </div>
              )}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
