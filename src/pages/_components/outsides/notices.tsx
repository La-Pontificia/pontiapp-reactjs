/* eslint-disable react-hooks/exhaustive-deps */
import {
  Toast,
  ToastBody,
  Toaster,
  ToastFooter,
  ToastTitle,
  Link as FluentLink,
  ToastTrigger,
  useId,
  useToastController
} from '@fluentui/react-components'
import React from 'react'
import { Link } from 'react-router'
import echo from '@/lib/echo'
import { useAuth } from '@/store/auth'

type UserNotice = {
  title: string
  description: string
  actions: { [key: string]: string }
}

export default function UserNotices() {
  const { user } = useAuth()
  const toasterId = useId('toaster-user-notice')
  const { dispatchToast } = useToastController(toasterId)

  React.useEffect(() => {
    echo.channel(`auth.${user.id}`).listen('.notice', (data: UserNotice) => {
      notify(data)
    })
  }, [])

  const notify = (notice: UserNotice) =>
    dispatchToast(
      <Toast>
        <ToastTitle
          action={
            <ToastTrigger>
              <FluentLink>Cerrar</FluentLink>
            </ToastTrigger>
          }
        >
          {notice.title}
        </ToastTitle>
        <ToastBody subtitle={`Para ${user.displayName}`}>
          {notice.description}
        </ToastBody>
        <ToastFooter>
          {Object.entries(notice.actions).map(([key, path]) => (
            <ToastTrigger key={key}>
              <Link
                className="dark:text-blue-500 hover:underline"
                to={path}
                target={path.startsWith('http') ? '_blank' : ''}
              >
                {key}
              </Link>
            </ToastTrigger>
          ))}
        </ToastFooter>
      </Toast>,
      { intent: 'success' }
    )
  return (
    <>
      <Toaster toasterId={toasterId} />
    </>
  )
}
