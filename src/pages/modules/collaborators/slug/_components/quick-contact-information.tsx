import {
  BuildingMultipleFilled,
  BuildingRegular,
  CopyRegular,
  FluentIcon,
  MailRegular,
  PersonRegular
} from '@fluentui/react-icons'
import { useSlugUser } from '../+layout'
import { Link } from 'react-router'
import { toast } from '@/commons/toast'

export default function QuickContactInformation() {
  const { user, isLoading, rootURL } = useSlugUser()

  return (
    <div className="flex flex-col">
      <h2 className="text-neutral-400 pb-2 text-lg">Información de contacto</h2>
      <div className="grid grid-cols-2 gap-x-10 gap-y-3">
        {isLoading ? (
          <>
            <div className="w-full h-[20px] mx-2 my-5 bg-stone-500/20 animate-pulse rounded-full"></div>
            <div className="w-full h-[20px] mx-2 my-5 bg-stone-500/20 animate-pulse rounded-full"></div>
            <div className="w-full h-[20px] mx-2 my-5 bg-stone-500/20 animate-pulse rounded-full"></div>
            <div className="w-full h-[20px] mx-2 my-5 bg-stone-500/20 animate-pulse rounded-full"></div>
          </>
        ) : (
          <>
            <InfoItem
              children={
                <a
                  href={`mailto:${user?.email}`}
                  className="dark:text-blue-500"
                >
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
            <InfoItem
              children={<p>{user?.role?.department.name}</p>}
              textValue={user?.role?.department.name}
              icon={BuildingRegular}
              title="Departamento"
            />
            <InfoItem
              children={<p>{user?.role?.department?.area?.name}</p>}
              textValue={user?.role?.department?.area?.name}
              icon={BuildingMultipleFilled}
              title="Area"
            />
          </>
        )}
      </div>
      <div className="flex justify-start mt-2">
        <Link
          to={`${rootURL}/${user?.username}/contact`}
          className="text-blue-500 hover:underline"
        >
          Ver más información
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
    <div className="flex rounded-lg group transition-colors hover:bg-stone-500/10 p-1.5 items-center gap-4">
      <Icon fontSize={22} className="opacity-60" />
      <div className="flex-grow">
        <p className="text-xs dark:text-neutral-400">{title}</p>
        {children}
      </div>
      <button
        onClick={handleCopy}
        className="h-full opacity-0 group-hover:opacity-100 hover:bg-stone-500/20 p-2.5 rounded-md"
      >
        <CopyRegular fontSize={20} className="dark:text-neutral-400" />
      </button>
    </div>
  )
}
