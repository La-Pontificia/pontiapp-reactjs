import { Toaster } from '@/commons/toast'

export default function UiProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster timeDuration={7000} />
      {children}
    </>
  )
}
