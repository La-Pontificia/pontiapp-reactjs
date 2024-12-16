import { useAuth } from '~/store/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export default function Protected({
  children,
  has,
  navigate: navigateProp
}: {
  children: React.ReactNode
  navigate: string
  has: string
}) {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!authUser || !authUser.hasPrivilege(has)) {
      navigate(navigateProp)
    } else {
      setIsChecking(false)
    }
  }, [authUser, has, navigate, navigateProp])

  if (isChecking) return null

  return <>{children}</>
}
