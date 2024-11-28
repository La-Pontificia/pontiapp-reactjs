import { useAuth } from '@/store/auth'
import {
  Avatar,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SearchBox,
  Tooltip,
  Text
} from '@fluentui/react-components'
import {
  GridDots20Regular,
  Person20Regular,
  Person48Regular,
  PersonFeedback20Regular,
  Search20Regular,
  Settings20Regular
} from '@fluentui/react-icons'
import { Link } from 'react-router'

const AppPopover = () => {
  return (
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <button>
          <GridDots20Regular />
        </button>
      </PopoverTrigger>
      <PopoverSurface
        tabIndex={-1}
        style={{
          padding: 0
        }}
      >
        <div className="p-5 w-[300px]"></div>
      </PopoverSurface>
    </Popover>
  )
}

export default function RootHeader() {
  const { user, signOut } = useAuth()
  return (
    <header className="h-14 shadow-md shadow-black/10 dark:bg-neutral-900 justify-between bg-[#f5f0f0] text-blue-600 w-full z-10 flex items-center gap-4 px-4">
      <nav className="flex gap-4 flex-grow items-center basis-0">
        <AppPopover />
        <Link to="/" className="flex items-center gap-1">
          <img src="/_lp-only-logo.webp" className="" width={25} alt="" />
          <img
            src="/_lp_only-letters.webp"
            className="dark:invert grayscale"
            width={70}
            alt='Logo Lettras "La Pontificia"'
          />
        </Link>
        <h1 className="text-blue-700 font-semibold text-base hidden md:block">
          Ponti App
        </h1>
      </nav>
      <nav className="relative">
        <div className="hidden lg:block">
          <SearchBox
            appearance="filled-lighter-shadow"
            placeholder="Buscar"
            className="w-[500px]"
            style={{
              borderRadius: '7px',
              height: '35px'
            }}
            contentBefore={<Search20Regular className="text-blue-500" />}
            size="medium"
          />
        </div>
      </nav>
      <nav className="flex flex-grow basis-0 gap-5 justify-end">
        <Tooltip content="Buscar" relationship="label">
          <button className="block lg:hidden">
            <Search20Regular
              style={{
                width: '22px',
                height: '22px'
              }}
            />
          </button>
        </Tooltip>
        <Tooltip content="Ajustes" relationship="label">
          <button>
            <Settings20Regular
              style={{
                width: '22px',
                height: '22px'
              }}
            />
          </button>
        </Tooltip>
        <Tooltip content="Envia un error o sugerencia" relationship="label">
          <button>
            <PersonFeedback20Regular
              style={{
                width: '23px',
                height: '23px'
              }}
            />
          </button>
        </Tooltip>
        <Popover>
          <PopoverTrigger disableButtonEnhancement>
            <Tooltip content="David Bendezu" relationship="label">
              <button>
                <Avatar
                  icon={<Person20Regular />}
                  image={{
                    src: user.profile
                  }}
                  size={36}
                />
              </button>
            </Tooltip>
          </PopoverTrigger>
          <PopoverSurface
            tabIndex={-1}
            style={{
              padding: 0
            }}
          >
            <div className="overflow-hidden min-w-[360px]">
              <header className="flex justify-between items-center">
                <Text as="h2" size={300} className="text-center px-3">
                  Ponti App
                </Text>
                <button
                  onClick={signOut}
                  className="hover:bg-stone-500/10 px-5 h-full p-3"
                >
                  Salir
                </button>
              </header>
              <div className="flex p-4 gap-3 ">
                <Avatar
                  icon={<Person48Regular />}
                  image={{
                    src: user.profile
                  }}
                  size={96}
                />
                <div className="">
                  <h1 className="font-bold text-lg line-clamp-1">
                    {user.displayName()}
                  </h1>
                  <p className="text-ellipsis dark:text-neutral-300">
                    {user.email}
                  </p>
                  <Link to="/me" className="text-blue-500 hover:underline">
                    Ver perfil
                  </Link>
                </div>
              </div>
            </div>
          </PopoverSurface>
        </Popover>
      </nav>
    </header>
  )
}
