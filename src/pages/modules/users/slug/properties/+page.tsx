import { Avatar } from '@fluentui/react-components'
import {
  Copy20Regular,
  Mail20Regular,
  Phone20Regular
} from '@fluentui/react-icons'
import { toast } from '~/commons/toast'
import { format, timeAgo } from '~/lib/dayjs'
import { useSlugUser } from '../+layout'
import { useQuery } from '@tanstack/react-query'
import { User } from '~/types/user'
import { api } from '~/lib/api'
import { Link, useParams } from 'react-router'
import { Helmet } from 'react-helmet'

export default function UsersPropertiesSlugPage() {
  const params = useParams<{
    slug: string
  }>()

  const { user, isLoading, rootURL } = useSlugUser()
  const slug = params.slug

  const { data: properties, isLoading: aditionalIsLoading } =
    useQuery<User | null>({
      queryKey: ['slugAditionUserInfo', slug],
      queryFn: async () => {
        const res = await api.get<User>('users/' + slug + '/getProperties')
        if (!res.ok) return null
        return new User(res.data)
      },
      gcTime: 1000 * 60 * 60 * 5
    })

  const onCopy = (value?: string) => {
    if (!value) return
    navigator.clipboard.writeText(value)
    toast('Copiado al portapapeles')
  }

  const Lazy = ({
    children,
    loading,
    title
  }: {
    title: string
    loading: boolean
    children: React.ReactNode
  }) => {
    return (
      <div className="flex items-center gap-4">
        <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
          {title}
        </p>
        {loading ? (
          <div className="h-4 w-16 rounded-full bg-neutral-500/30 animate-pulse" />
        ) : (
          <div>{children || '-'}</div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl px-4 mx-auto w-full">
      <Helmet>
        <title>
          {user ? user.displayName + ' -' : ''} Propiedades | Ponti App
        </title>
      </Helmet>
      <p className="pt-4 opacity-70">
        Información detallada de {user?.displayName}
      </p>
      <div className="space-y-4 py-5">
        <h2 className="font-semibold">Básicos</h2>
        <Lazy
          title="Correo"
          loading={isLoading}
          children={
            <>
              {user?.email}{' '}
              <button onClick={() => onCopy(user?.email)}>
                <Copy20Regular className="text-blue-500" />
              </button>
            </>
          }
        />
        <Lazy
          title="Username"
          loading={isLoading}
          children={
            <Link
              className="hover:underline dark:text-blue-500 text-blue-700"
              to={`${rootURL}/${user?.username}`}
            >
              @{user?.username}{' '}
            </Link>
          }
        />
        <Lazy
          title="Display Name"
          loading={isLoading}
          children={user?.displayName}
        />
        <Lazy
          title="Rol"
          loading={aditionalIsLoading}
          children={properties?.userRole?.title}
        />
        <Lazy
          title="Jefe (Manager)"
          loading={aditionalIsLoading}
          children={
            properties?.manager && (
              <Link
                className="hover:underline dark:text-blue-500 text-blue-700"
                to={`${rootURL}/${properties?.manager.username}`}
              >
                {properties?.manager.displayName}
              </Link>
            )
          }
        />
        <Lazy
          title="Privilegios adicionales"
          loading={isLoading}
          children={user?.customPrivileges?.length || '0 Pivilegios'}
        />
        <h2 className="font-semibold">Propiedades</h2>
        <div className="flex items-center gap-4">
          <Avatar
            size={56}
            color="colorful"
            name={user?.displayName}
            image={{
              src: user?.photoURL,
              alt: 'Foto del colaborador'
            }}
          />
        </div>
        <Lazy
          title="Documento"
          loading={aditionalIsLoading}
          children={properties?.documentId}
        />
        <Lazy title="Nombres" loading={isLoading} children={user?.firstNames} />
        <Lazy
          title="Apellidos"
          loading={isLoading}
          children={user?.lastNames}
        />
        <Lazy
          title="Fecha de nacimiento"
          loading={aditionalIsLoading}
          children={
            properties?.birthdate
              ? format(properties?.birthdate, 'DD/MM/YYYY')
              : '-'
          }
        />
        <Lazy
          title="Contactos"
          loading={isLoading}
          children={
            user?.contacts?.length && (
              <div className="px-2 space-y-3">
                {user?.contacts?.map((contact) => {
                  const Icon =
                    contact.type === 'email' ? Mail20Regular : Phone20Regular
                  return (
                    <div
                      key={contact.value}
                      className="flex items-center gap-4"
                    >
                      <Icon className="text-blue-500" />
                      <p className="text-sm">{contact.value}</p>
                    </div>
                  )
                })}
              </div>
            )
          }
        />
        <h2 className="font-semibold">Organización</h2>
        <Lazy
          title="Puesto de trabajo"
          loading={isLoading}
          children={user?.role.job?.name}
        />
        <Lazy title="Cargo" loading={isLoading} children={user?.role?.name} />
        <Lazy
          title="Departamento"
          loading={isLoading}
          children={user?.role?.department.name}
        />
        <Lazy
          title="Area"
          loading={isLoading}
          children={user?.role?.department.area.name}
        />
        <Lazy
          title="Fecha de ingreso"
          loading={aditionalIsLoading}
          children={
            properties?.entryDate && format(properties.entryDate, 'DD/MM/YYYY')
          }
        />
        <Lazy title="ID" loading={isLoading} children={user?.id} />
        <Lazy
          title="Actualización"
          loading={isLoading}
          children={user && timeAgo(user?.updated_at)}
        />
        <Lazy
          title="Creación"
          loading={isLoading}
          children={user && timeAgo(user?.created_at)}
        />
      </div>
    </div>
  )
}
