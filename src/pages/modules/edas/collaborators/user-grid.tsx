// import { toast } from 'anni'
// import { api } from '@/lib/api'
// import { useAuth } from '@/store/auth'
// import { handleAuthError } from '@/utils'
import {
  Avatar,
  Button,
  Spinner,
  TableCell,
  TableRow,
  TableSelectionCell
} from '@fluentui/react-components'
import { MailArrowUpRegular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import React from 'react'
import { Link } from 'react-router'
import UserHoverInfo from '@/components/user-hover-info'
import { api } from '@/lib/api'
import { timeAgo } from '@/lib/dayjs'
import { Collaborator } from '@/types/collaborator'

export default function UserGrid({
  user: userProp,
  refetch
}: {
  user: Collaborator
  refetch: () => void
}) {
  const [user, setUser] = React.useState(new Collaborator(userProp))
  const { mutate: invite, isPending: invitating } = useMutation({
    mutationFn: () => api.post(`edas/collaborators/${user.username}/invite`),
    onError: () => {
      toast.error('No se pudo enviar la invitación 📨')
    },
    onSuccess: () => {
      toast.success('Invitación enviada 📨')
      refetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUser(new Collaborator({ ...user, edaInvitedAt: new Date() } as any))
    }
  })
  return (
    <TableRow>
      <TableSelectionCell type="radio" />
      <TableCell>
        <UserHoverInfo slug={user.username}>
          <div className="flex items-center gap-2">
            <Avatar
              size={32}
              color="colorful"
              name={user.displayName}
              aria-label={user.displayName}
              image={{
                src: user.photoURL
              }}
            />
            <Link
              className="hover:underline font-semibold relative"
              to={`/m/edas/${user.username}`}
            >
              {user.displayName}
            </Link>
          </div>
        </UserHoverInfo>
      </TableCell>
      <TableCell>
        <div className="max-w-[30ch] opacity-70 text-ellipsis overflow-hidden">
          {user.role?.name}
        </div>
      </TableCell>
      <TableCell className="max-xl:!hidden">
        <div className="max-w-[30ch] opacity-90 text-ellipsis overflow-hidden">
          {user.role?.department.area.name}
        </div>
      </TableCell>
      <TableCell>
        <p className="font-medium opacity-70">
          {user.edasCount} {user.edasCount === 1 ? 'Eda' : 'Edas'}
        </p>
      </TableCell>
      <TableCell className="max-xl:!hidden">
        {user.manager?.displayName ? (
          <p className="dark:text-blue-500 text-blue-600 font-medium">
            {user.manager?.displayName}
          </p>
        ) : (
          <p>Sin jefe</p>
        )}
      </TableCell>
      <TableCell>
        <div>
          <Button
            disabled={invitating}
            size="small"
            icon={
              invitating ? (
                <Spinner size="extra-tiny" />
              ) : (
                <MailArrowUpRegular />
              )
            }
            onClick={() => invite()}
          >
            Invitar
          </Button>
          {user.edaInvitedAt && (
            <p className="text-xs opacity-70">
              Enviado {timeAgo(user.edaInvitedAt)}
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
