import {
  BuildingMultipleFilled,
  BuildingRegular,
  CopyRegular,
  FluentIcon,
  LocationRegular,
  MailRegular,
  PersonRegular
} from '@fluentui/react-icons'
import { useSlugUser } from '../+layout'
// import { Link } from 'react-router'
import { toast } from 'anni'

export default function QuickContactInformation() {
  const { user, isLoading } = useSlugUser()

  return (
    <div className="flex flex-col">
      <h2 className="font-semibold py-2 text-sm">Información de contacto</h2>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-x-10 gap-y-3">
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
                  className="dark:text-blue-500 text-blue-700"
                >
                  {user?.email}
                </a>
              }
              textValue={user?.email}
              icon={MailRegular}
              title="Correo electrónico"
            />
            {user?.role && (
              <>
                <InfoItem
                  children={<p>{user.role.name}</p>}
                  textValue={user.role.name}
                  icon={PersonRegular}
                  title="Cargo"
                />
                <InfoItem
                  children={<p>{user.role.department.name}</p>}
                  textValue={user.role.department.name}
                  icon={BuildingRegular}
                  title="Departamento"
                />
                <InfoItem
                  children={<p>{user.role.department?.area?.name}</p>}
                  textValue={user.role.department?.area?.name}
                  icon={BuildingMultipleFilled}
                  title="Area"
                />
              </>
            )}

            {user?.branch && (
              <InfoItem
                children={<p>{user.branch.name}</p>}
                textValue={user.branch.name}
                icon={LocationRegular}
                title="Sede"
              />
            )}
          </>
        )}
      </div>
      {/* <div className="flex justify-start mt-2">
        <Link
          to={`${rootURL}/${user?.username}/contact`}
          className="text-blue-500 hover:underline"
        >
          Ver más información
        </Link>
      </div> */}
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
    toast('Copiado al portapapeles', {
      media: '📋'
    })
  }
  return (
    <div className="flex rounded-md group hover:bg-stone-500/10 p-1.5 items-center gap-4">
      <Icon
        fontSize={22}
        style={{
          minWidth: '22px'
        }}
        className="opacity-90"
      />
      <div className="flex-grow">
        <p className="text-xs dark:text-neutral-300">{title}</p>
        {children}
      </div>
      <button
        onClick={handleCopy}
        className="h-full opacity-0 max-lg:opacity-100 group-hover:opacity-100 hover:bg-stone-500/20 p-2.5 rounded-md"
      >
        <CopyRegular fontSize={20} className="dark:text-neutral-400" />
      </button>
    </div>
  )
}
