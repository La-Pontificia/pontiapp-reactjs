import { useSlugUser } from '../+layout'
import { timeAgo } from '@/lib/dayjs'

export default function QuickInfo() {
  const { user } = useSlugUser()
  return (
    <div className="flex flex-col pb-5 border-t overflow-auto border-neutral-500/30">
      <h2 className="text-neutral-400 py-2 text-lg">Metadata</h2>
      <footer className="text-neutral-500 font-semibold text-xs">
        {user?.id && <p>ID: {user?.id}</p>}
        {user?.username && <p>Username: {user?.username}</p>}
        {user?.updated_at && <p>Actualizado {timeAgo(user?.updated_at)}</p>}
        {user?.created_at && <p>Miembro desde {timeAgo(user?.created_at)}</p>}
      </footer>
    </div>
  )
}
