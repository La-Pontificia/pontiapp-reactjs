import { api } from '~/lib/api'
import { User } from '~/types/user'
import React, { createContext } from 'react'

interface AuthState {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  privileges?: string[]
  loading?: boolean
  signOut?: () => void
  birthdayBoys: User[]
}

const AuthContext = createContext<AuthState>({} as AuthState)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [birthdayBoys, setBirthdayBoys] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchAuth = async () => {
    try {
      const res = await api.get<{
        authUser: User
        birthdayBoys: User[]
      }>('auth/current?relationship=userRole,role')

      if (!res.ok) throw new Error(res.error)

      const userInstance = new User(res.data.authUser)
      const birthdayBoysInstances = res.data.birthdayBoys.map(
        (user) => new User(user)
      )
      setBirthdayBoys(birthdayBoysInstances)
      setUser(userInstance)
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
        user: user as User,
        loading,
        signOut,
        setUser,
        birthdayBoys
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
