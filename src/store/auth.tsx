/* eslint-disable react-hooks/exhaustive-deps */
import { api } from '@/lib/api'
import { User } from '@/types/user'
import React, { createContext } from 'react'
import { BusinessUnit } from '@/types/rm/business-unit'

interface AuthState {
  user: User
  businessUnit?: BusinessUnit
  businessUnits: BusinessUnit[]
  handleToggleBusinessUnit: (item: BusinessUnit) => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  privileges?: string[]
  loading?: boolean
  signOut?: () => void
  birthdayBoys: User[]
}

const AuthContext = createContext<AuthState>({} as AuthState)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({
  children,
  redirectWithoutSession
}: {
  children: React.ReactNode
  redirectWithoutSession?: boolean
}) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [birthdayBoys, setBirthdayBoys] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [businessUnit, setBusinessUnit] = React.useState<BusinessUnit>()
  const [businessUnits, setBusinessUnits] = React.useState<BusinessUnit[]>([])

  const fetchAuth = async () => {
    try {
      const res = await api.get<{
        authUser: User
        birthdayBoys: User[]
        businessUnits: BusinessUnit[]
      }>('auth/current?relationship=userRole,role', {
        redirectWithoutSession
      })

      if (!res.ok) throw new Error(res.error)

      // get business unit id by localsotrage
      const businessUnitInstance = res.data.businessUnits.find(
        (bu) => bu.id === localStorage.getItem('businessUnitId')
      )

      if (businessUnitInstance) {
        setBusinessUnit(businessUnitInstance)
      }

      setBusinessUnits(res.data.businessUnits.map((bu) => new BusinessUnit(bu)))
      setBirthdayBoys(res.data.birthdayBoys.map((user) => new User(user)))
      setUser(new User(res.data.authUser))
    } catch (err) {
      console.error(err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBusinessUnit = (item: BusinessUnit) => {
    localStorage.setItem('businessUnitId', item.id)
    setBusinessUnit(item)
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await api.post('auth/signout')
      setUser(null)
      window.location.href = `/login?redirectURL=${encodeURIComponent(
        window.location.href
      )}`
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
        handleToggleBusinessUnit,
        signOut,
        setUser,
        businessUnit,
        businessUnits,
        birthdayBoys
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
