import { toast } from 'anni'
import React from 'react'
import { api } from '@/lib/api'
import { User } from '@/types/user'
import { handleError } from '@/utils'

type Props = {
  onCompleted?: (url: string) => void
}
export const useUpdateProfile = (user: User, props: Props | undefined) => {
  const [updating, setUpdating] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { onCompleted } = props ?? {}

  const handeImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return null

    setUpdating(true)
    const form = new FormData()
    form.append('file', file)

    const res = await api.image<string>(
      `users/${user.username}/update-profile-photo`,
      {
        data: form
      }
    )

    if (!res.ok) {
      toast.success(handleError(res.error))
    } else {
      onCompleted?.(res.data)
    }

    setUpdating(false)
  }

  const handleOpenImageDialog = () => {
    if (inputRef) {
      inputRef.current?.click()
    }
  }

  return {
    handeImageChange,
    updating,
    handleOpenImageDialog,
    inputProps: {
      ref: inputRef,
      type: 'file',
      accept: 'image/*',
      style: { display: 'none' },
      onChange: handeImageChange
    }
  }
}
