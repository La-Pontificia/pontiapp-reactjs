import { format, timeAgo } from '~/lib/dayjs'
import { useSlugUser } from '../+layout'
import { useAuth } from '~/store/auth'

export default function QuickSessions() {
  const { user } = useSlugUser()
  const { user: authUser } = useAuth()

  if (
    !authUser.hasPrivilege('users:sessions') &&
    authUser.username !== user?.username
  ) {
    return null
  }

  if (user?.sessions?.length === 0) return null

  return (
    <div className="flex flex-col pb-5 border-t overflow-auto border-neutral-500/30">
      <h2 className="dark:dark:text-neutral-400 font-semibold py-5 pb-2 text-sm">
        Últimas Sesiones
      </h2>
      <div>
        {user?.sessions?.map((session, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1 px-4 border-b border-neutral-500/30 last:border-b-0"
          >
            <div className="flex items-center space-x-2">
              <session.BrowserIcon
                fontSize={25}
                className="text-stone-700 dark:text-stone-400"
              />
              <div className="text-neutral-900 dark:text-neutral-200">
                <div>{session.browserName}</div>
                <div>{session.ip}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 max-lg:hidden">
              <session.Device
                fontSize={28}
                className="text-black dark:text-neutral-400"
              />
              <div>
                <div>{session.deviceName}</div>
                <div>{session.platformName}</div>
              </div>
            </div>
            <div>
              <div>{timeAgo(session.created_at)}, </div>
              <div className="opacity-70">
                {format(session.created_at, 'DD MMM YYYY HH:mm A')}
              </div>
            </div>
            <div className="text-neutral-900 dark:text-neutral-200">
              {session.locationName}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
