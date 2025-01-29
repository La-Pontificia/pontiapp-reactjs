import { Navigate } from 'react-router'
import { useAuth } from '~/store/auth'

export default function MyEdas() {
  const { user: authUser } = useAuth()
  return <Navigate to={`/m/edas/${authUser.username}`} />
}
