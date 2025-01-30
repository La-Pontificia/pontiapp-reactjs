import { Avatar } from '@fluentui/react-components'
import { OpenRegular } from '@fluentui/react-icons'
import { Link, Outlet } from 'react-router'
import { Lp } from '~/icons'
import { useAuth } from '~/store/auth'
import DocsSidebar from './sidebar'
import Footer from '~/components/footer'

export default function DocsLayout() {
  const { user: authUser } = useAuth()
  return (
    <main className="min-h-svh overflow-y-auto bg-[#f7f9fb] flex flex-col dark:bg-[#12100d]">
      <header className="flex items-center px-4 border-b dark:border-stone-800 h-14 w-full">
        <div className="max-w-6xl flex gap-3 items-center px-1 mx-auto w-full">
          <nav className="flex-grow flex items-center">
            <Link
              to={`/docs`}
              className="flex font-medium gap-2 tracking-tight text-xl justify-center drop-shadow-[0_0_10px_rgba(0,0,0,.1)] dark:drop-shadow-[0_0_10px_rgba(0,0,0,.5)] items-center"
            >
              <Lp
                size={30}
                className="dark:text-violet-500 lg:block hidden text-violet-700"
              />
              <h1>PontiApp Docs</h1>
            </Link>
          </nav>
          <nav>
            <input
              className="bg-transparent bg-white outline-none rounded-full px-4 dark:bg-stone-700/50 w-[300px] dark:text-white placeholder:text-stone-500 p-2"
              placeholder="Buscar recursos..."
              type="text"
            />
          </nav>
          <nav>
            {authUser ? (
              <Link
                to={`/${authUser.username}`}
                className="flex items-center gap-4"
              >
                <Avatar
                  image={{
                    src: authUser.photoURL
                  }}
                  name={authUser.displayName}
                />
              </Link>
            ) : (
              <Link to="/login" className="font-medium text-sm">
                App <OpenRegular fontSize={20} className="opacity-60" />
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div className="px-4 flex-grow">
        <div className="flex max-w-6xl mx-auto w-full">
          <DocsSidebar />
          <div className="p-3 flex-grow">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
