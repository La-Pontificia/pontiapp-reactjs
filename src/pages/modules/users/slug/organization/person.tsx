import { User } from '@/types/user'
import { Avatar } from '@fluentui/react-components'
import { ArrowRightRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router'
import { useSlugUser } from '../+layout'
import UserHoverInfo from '@/components/user-hover-info'

export const PersonItem = ({
  person,
  setSlug,
  index,
  single = false
}: {
  person?: User | null
  setSlug?: (slug: string) => void
  index: number
  single?: boolean
}) => {
  const navigate = useNavigate()
  const { rootURL, user: slugUser } = useSlugUser()
  if (!person) return null

  const handleSlug = () => {
    if (!single && index === 1) return navigate(`${rootURL}/${person.username}`)
    setSlug?.(person.username)
  }

  return (
    <>
      {!single && person.manager && (
        <PersonItem
          index={index + 1}
          person={person.manager}
          setSlug={setSlug}
        />
      )}
      {!single && person.manager && (
        <div className="h-[20px] mx-auto w-[1px] dark:bg-neutral-500/20"></div>
      )}
      <UserHoverInfo slug={person.username}>
        <button
          onClick={handleSlug}
          data-current={person.id === slugUser?.id ? '' : undefined}
          data-single={single ? '' : undefined}
          className="flex data-[current]:outline-1 outline outline-transparent data-[current]:outline-blue-600 mx-auto border border-neutral-500/30 data-[single]:w-full w-[320px] rounded-md px-3 gap-3 text-left dark:text-neutral-300 hover:bg-neutral-500/10  py-3 items-center p-2"
        >
          <Avatar
            size={48}
            color="colorful"
            name={person.displayName}
            image={{
              src: person.photoURL
            }}
          />
          <div className="text-xs flex-grow space-y-1">
            <h2 className="font-semibold text-sm dark:text-white">
              {person.displayName}
            </h2>
            <p className="opacity-80 line-clamp-1">{person.role?.name}</p>
          </div>
          {!single && index === 1 && (
            <div className="w-6">
              <ArrowRightRegular className="dark:text-blue-400" fontSize={20} />
            </div>
          )}
        </button>
      </UserHoverInfo>
    </>
  )
}
