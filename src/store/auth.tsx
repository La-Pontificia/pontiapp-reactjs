import { api } from '~/lib/api'
import { User } from '~/types/user'
import React, { createContext } from 'react'

interface AuthState {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  privileges?: string[]
  loading?: boolean
  signOut?: () => void
}

const AuthContext = createContext<AuthState>({} as AuthState)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [privileges, setPrivileges] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchAuth = async () => {
    try {
      const res = await api.get<User>('auth/current?relationship=userRole,role')
      if (!res.ok) throw new Error(res.error)

      const userInstance = new User(res.data)
      setUser(userInstance)
      setPrivileges(userInstance.userRole.privileges || [])
    } catch (err) {
      console.error(err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await api.post('auth/signout')
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  React.useEffect(() => {
    void fetchAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        privileges,
        user: user as User,
        loading,
        signOut,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
