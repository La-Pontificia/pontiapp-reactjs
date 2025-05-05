/* eslint-disable react-refresh/only-export-components */
import { Spinner, Tab, TabList, Tooltip } from '@fluentui/react-components'
import { useSlugUser } from '../+layout'
import React from 'react'
import { PersonFeedbackRegular } from '@fluentui/react-icons'
import { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import FormUser from './form'

const TABS: Record<
  'all' | 'account' | 'organization' | 'properties' | 'schedules',
  {
    label: string
    badge?: string
    fromBadge?: Date
  }
> = {
  all: {
    label: 'Todos'
  },
  account: {
    label: 'Cuenta'
  },
  organization: {
    label: 'Organización'
  },
  properties: {
    label: 'Propiedades'
  },
  schedules: {
    label: 'Horarios'
  }
}

type StateUserEdit = {
  user: User
  refetch: () => void
  page: keyof typeof TABS
}
const ContextUserEdit = React.createContext<StateUserEdit>({} as StateUserEdit)
export const useUserEdit = () => React.useContext(ContextUserEdit)
export default function UserdSlugEditPage() {
  const { user: slugUser } = useSlugUser()
  const [page, setPage] = React.useState<keyof typeof TABS>('all')

  const {
    data: user,
    isLoading,
    refetch
  } = useQuery<User | null>({
    queryKey: ['userEdit', slugUser?.id, 'get'],
    enabled: !!slugUser,
    queryFn: async () => {
      const res = await api.get<User>(`users/${slugUser?.username}/edit`)
      if (!res.ok) return null
      return new User(res.data)
    }
  })
  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    )

  if (!user) return <div>Usuario no encontrado</div>

  return (
    <ContextUserEdit.Provider
      value={{
        page,
        refetch,
        user
      }}
    >
      <div className="w-full flex lg:overflow-auto flex-col flex-grow">
        <nav className="border-b max-w-7xl mx-auto w-full pb-1 dark:border-black">
          <TabList
            selectedValue={page}
            appearance="subtle"
            onTabSelect={(_, _d) => {
              setPage(_d.value as keyof typeof TABS)
            }}
            className="overflow-x-auto"
          >
            {Object.entries(TABS).map(([key, value]) => (
              <Tab key={key} value={key}>
                {value.label}
              </Tab>
            ))}
            <Tooltip content="Envia un error o sugerencia" relationship="label">
              <button className="ml-auto dark:text-[#eaa8ff] text-[#0e37cd] flex items-center gap-1 font-semibold">
                <PersonFeedbackRegular fontSize={23} />
                <p>Feedback</p>
              </button>
            </Tooltip>
          </TabList>
        </nav>
        <FormUser />
      </div>
    </ContextUserEdit.Provider>
  )
}
