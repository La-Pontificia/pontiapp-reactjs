import { Avatar, Button, Spinner } from '@fluentui/react-components'
import {
  CopyRegular,
  FluentIcon,
  MailRegular,
  OpenRegular,
  PersonRegular
} from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '~/commons/hover-card'
import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { User } from '~/types/user'

export default function UserHoverInfo({
  children,
  slug
}: {
  children: React.ReactNode
  slug: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <HoverCard openDelay={300} open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="p-0">
        {open && <UserHoverInfoContent slug={slug} />}
      </HoverCardContent>
    </HoverCard>
  )
}

const UserHoverInfoContent = ({ slug }: { slug: string }) => {
  const { user: authUser } = useAuth()

  const {
    data: user,
    isLoading,
    refetch
  } = useQuery<User | null>({
    queryKey: ['users', slug],
    queryFn: async () => {
      const res = await api.get<User>(
        `users/${slug}?relationship=role,role.department.area,manager`
      )
      if (!res.ok) return null
      return new User(res.data)
    }
  })

  if (isLoading)
    return (
      <div className="min-w-[350px] grid place-content-center min-h-[200px]">
        <Spinner appearance="inverted" />
      </div>
    )

  if (!user)
    return (
      <div className="min-w-[350px] grid place-content-center min-h-[200px]">
        <h2 className="pb-2">User not found</h2>
        <Button onClick={() => void refetch()} size="small">
          Reload
        </Button>
      </div>
    )

  return (
    <div>
      <header className="flex p-3 items-center gap-2">
        <Avatar
          image={{
            src: user?.photoURL
          }}
          badge={{
            status: user?.status ? 'available' : 'blocked'
          }}
          size={64}
          color="colorful"
          name={user?.displayName}
        />
        <div className="">
          <h2 className="font-bold tracking-tight text-xl">
            {user?.displayName}
          </h2>
          <p className="pb-2">
            {user?.role?.name} • {user?.role?.department?.name}
          </p>
          <div className="space-x-1">
            <Button
              as="a"
              target="_blank"
              size="small"
              href={`/${user?.username}`}
            >
              <p className="pr-1"> Ir al perfil</p>
              <OpenRegular fontSize={14} />
            </Button>
            {authUser.hasPrivilege('users:edit') && (
              <Button
                target="_blank"
                as="a"
                href={`/m/users/edit/${user?.username}`}
                size="small"
              >
                Editar
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="border-t border-stone-500/20 p-2">
        <InfoItem
          children={
            <a href={`mailto:${user?.email}`} className="dark:text-blue-500">
              {user?.email}
            </a>
          }
          textValue={user?.email}
          icon={MailRegular}
          title="Correo electrónico"
        />
        <InfoItem
          children={<p>{user?.role?.name}</p>}
          textValue={user?.role?.name}
          icon={PersonRegular}
          title="Cargo"
        />
      </div>
      <div className="border-t border-stone-500/20 p-2">
        <h2 className="opacity-60 font-semibold text-xs">Reportando a</h2>
        <Link
          target="_blank"
          to={`/${user.manager?.username}`}
          className="flex p-1 mt-1 hover:underline text-left items-center gap-2"
        >
          <Avatar
            image={{
              src: user.manager?.photoURL
            }}
            badge={{
              status: user.manager?.status ? 'available' : 'blocked'
            }}
            size={36}
            color="colorful"
            name={user.manager?.displayName}
          />
          <div className="flex items-center gap-2">
            <h2 className="font-bold tracking-tight text-sm">
              {user.manager?.displayName}
            </h2>
            <OpenRegular fontSize={15} />
          </div>
        </Link>
      </div>
    </div>
  )
}

export const InfoItem = ({
  children,
  icon,
  textValue,
  title
}: {
  title: string
  textValue?: string
  children: React.ReactNode
  icon: FluentIcon
}) => {
  const Icon = icon

  const handleCopy = () => {
    navigator.clipboard.writeText(textValue || '')
    toast('Copiado al portapapeles')
  }
  return (
    <div className="flex rounded-lg group transition-colors hover:bg-stone-500/10 p-1 items-center gap-3">
      <Icon fontSize={20} className="opacity-60" />
      <div className="flex-grow">
        <p className="text-xs dark:text-neutral-400">{title}</p>
        {children}
      </div>
      <button
        onClick={handleCopy}
        className="h-full opacity-0 group-hover:opacity-100 hover:bg-stone-500/20 p-0.5 rounded-md"
      >
        <CopyRegular fontSize={20} className="dark:text-neutral-400" />
      </button>
    </div>
  )
}
