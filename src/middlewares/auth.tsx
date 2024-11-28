import RootLoading from '@/pages/+loading'
import { useAuth } from '@/store/auth'
import { Navigate } from 'react-router'

export default function AuthMiddleware({
  children
}: Readonly<{
  children?: React.ReactNode
}>): JSX.Element {
  const { loading, user } = useAuth()
  if (loading) return <RootLoading />
  if (!user && !loading) return <Navigate to="/login" />
  if (!user) return <Navigate to="/login" />
  return <>{children}</>
}
