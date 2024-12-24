import { Avatar, SearchBox, Spinner } from '@fluentui/react-components'
import {
  ClockBillRegular,
  DataHistogramRegular,
  MegaphoneLoudRegular,
  PeopleEditRegular,
  Search20Regular,
  TabletSpeakerRegular
} from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import { useNavigate } from 'react-router'
import { useDebounced } from '~/hooks/use-debounced'
import { ExcelColored } from '~/icons'
import { api } from '~/lib/api'
import { timeAgo } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { Report } from '~/types/report'
import { User } from '~/types/user'

export default function RootSearch() {
  const { user: authUser } = useAuth()
  const modules = [
    {
      text: 'Usuarios',
      icon: PeopleEditRegular,
      href: '/m/users',
      className:
        'group-hover:dark:text-violet-500 group-hover:dark:hover:text-violet-400',
      disabled: !authUser?.hasModule('users')
    },
    {
      text: 'Edas',
      icon: DataHistogramRegular,
      href: '/m/edas',
      className:
        'group-hover:dark:text-green-500 group-hover:dark:hover:text-green-400',
      disabled: !authUser?.hasModule('edas')
    },
    {
      text: 'Asistencias',
      icon: ClockBillRegular,
      href: '/m/assists',
      className:
        'group-hover:dark:text-blue-500 group-hover:dark:text-blue-400',
      disabled: !authUser?.hasModule('assists')
    },
    {
      text: 'Eventos',
      icon: MegaphoneLoudRegular,
      href: '/m/events',
      className:
        'group-hover:dark:text-yellow-500 group-hover:dark:text-yellow-400',
      disabled: !authUser?.hasModule('events')
    },
    {
      text: 'Atención',
      icon: TabletSpeakerRegular,
      href: '/m/attentions',
      className: 'group-hover:dark:text-red-500 group-hover:dark:text-red-400',
      disabled: !authUser?.hasModule('attentions')
    }
  ]

  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState<string | null>(null)
  const navigate = useNavigate()
  const { data: items, isLoading } = useQuery<{
    users: User[]
    modules: typeof modules
    files: Report[]
  }>({
    queryKey: ['global', 'search', q],
    queryFn: async () => {
      const res = await api.get<{
        users: User[]
        files: Report[]
      }>(`global/search?q=${q ? q : ''}`)

      const modulesFiltered = q
        ? modules.filter(
            (module) =>
              module.text.toLowerCase().includes(q.toLowerCase()) &&
              !module.disabled
          )
        : modules

      if (!res.ok)
        return {
          files: [],
          modules: modulesFiltered,
          users: []
        }
      return {
        files: res.data.files.map((file) => new Report(file)),
        modules: modulesFiltered,
        users: res.data.users.map((user) => new User(user))
      }
    }
  })

  const { value, handleChange } = useDebounced({
    onCompleted: (v: string) => setQ(v)
  })

  const isEmpty =
    items?.modules &&
    items.modules.length < 1 &&
    items?.users &&
    items?.users.length < 1 &&
    items?.files &&
    items?.files.length < 1 &&
    !isLoading

  return (
    <div className="hidden dark:text-neutral-300 lg:block">
      <div
        onClick={() => setOpen(false)}
        data-open={open ? '' : undefined}
        className="data-[open]:opacity-100 pointer-events-none data-[open]:pointer-events-auto transition-all fixed opacity-0 z-[99] dark:bg-neutral-950/90 inset-0"
      />
      <div className="z-[99] relative flex flex-col">
        <SearchBox
          input={{
            onFocus: () => setOpen(true),
            autoComplete: 'off'
          }}
          value={value}
          onChange={(_, e) => {
            handleChange(e.value)
            if (!e.value) setQ(null)
          }}
          dismiss={{
            onClick: () => {
              setQ(null)
            }
          }}
          appearance="filled-lighter-shadow"
          type="search"
          autoComplete="off"
          placeholder="Buscar"
          className="w-[500px]"
          style={{
            borderRadius: '7px',
            height: '35px'
          }}
          contentBefore={<Search20Regular className="text-blue-500" />}
          size="medium"
        />
        {open && (
          <div className="dark:bg-[#202020] w-full rounded-lg top-10 absolute">
            {items?.modules && items.modules.length > 0 && (
              <>
                <h2 className="p-2 px-3 tracking-tight flex items-center gap-1">
                  Modulos
                </h2>
                {/* modules */}
                <div className="flex justify-between py-2 items-center gap-4 px-7">
                  {items?.modules.map((module) => (
                    <button
                      onClick={() => {
                        navigate(module.href)
                        setOpen(false)
                      }}
                      key={module.href}
                      className="group text-center"
                    >
                      <div className="aspect-square mx-auto w-[60px] grid place-content-center rounded-2xl border-2 group-hover:border-neutral-500/50 border-neutral-500/20">
                        <module.icon
                          fontSize={25}
                          className={module.className}
                        />
                      </div>
                      <span className="text-xs opacity-80">{module.text}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {items?.users && items.users.length > 0 && (
              <>
                <h2 className="p-2 px-3 tracking-tight flex items-center gap-1">
                  Personas
                </h2>
                <div className="flex flex-col">
                  {items?.users.map((user) => {
                    return (
                      <button
                        onClick={() => {
                          navigate(`/${user.username}`)
                          setOpen(false)
                        }}
                        className="flex p-2 gap-2 hover:bg-neutral-500/10 items-center text-left"
                      >
                        <Avatar
                          size={36}
                          image={{
                            src: user.photoURL
                          }}
                          color="colorful"
                          name={user.displayName}
                        />
                        <div>
                          <h1 className="font-medium">{user.displayName}</h1>
                          <p className="text-xs opacity-70 line-clamp-1">
                            {user.role?.name}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {items?.files && items.files.length > 0 && (
              <>
                <h2 className="p-2 px-3 tracking-tight flex items-center gap-1">
                  Archivos
                </h2>
                <div className="py-2 items-center">
                  {items?.files.map((file) => {
                    return (
                      <a
                        href={file.downloadLink}
                        target="_blank"
                        className="flex p-2 gap-2 hover:bg-neutral-500/10 items-center text-left"
                      >
                        <ExcelColored size={30} />
                        <div>
                          <h1 className="font-medium line-clamp-1">
                            {file.title}
                          </h1>
                          <p className="text-xs opacity-80 line-clamp-1">
                            Generado por <b>{file.user.displayName}</b>{' '}
                            {timeAgo(file.created_at)}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </>
            )}

            {isEmpty && (
              <div className="p-20 dark:text-blue-500 text-center">
                <p>
                  No se encontraron resultados para la busqueda <b>"{q}"</b>
                </p>
              </div>
            )}

            {isLoading && (
              <div className="py-10">
                <Spinner />
              </div>
            )}

            <div className="py-2">
              <p className="px-2 text-xs opacity-50">
                Busqueda indexada de PontiApp
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
