import { useAuth } from '@/store/auth'
import { Helmet } from 'react-helmet'
import { Navigate } from 'react-router'

export default function HomePage() {
  const { user } = useAuth()

  return <Navigate to={`/${user.username}`} />

  const now = new Date()
  const hours = now.getHours()

  const greeting =
    hours < 12 ? 'Buenos días' : hours < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="rounded-2xl w-full h-full flex-grow flex">
      <Helmet>
        <title>Ponti App</title>
      </Helmet>
      <header className="py-4 w-full">
        <h1 className="text-center w-full font-semibold tracking-tight text-2xl py-4">
          Hola {user.firstNames}, {greeting}
        </h1>
      </header>
    </div>
  )
}
