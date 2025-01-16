/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERRORS } from '~/const/errors'
import { BIRTHDAY_MESSAGE } from '~/const/index'

import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleAuthError = (error: any) => {
  const message = ERRORS[error as keyof typeof ERRORS]
  return message || error
}

export const handleError = (error: any) => {
  const message = ERRORS[error as keyof typeof ERRORS]
  return message || error
}

export const generateRandomPassword = () => {
  const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
  let pass = ''
  for (let x = 0; x < 8; x++) {
    const i = Math.floor(Math.random() * chars.length)
    pass += chars.charAt(i)
  }
  return pass
}

export const getRandomMessageBirthday = () => {
  const i = Math.floor(Math.random() * BIRTHDAY_MESSAGE.length)
  return BIRTHDAY_MESSAGE[i]
}

export const hashCode = (str: string): number => {
  return Array.from(str).reduce((hash, char) => {
    return hash * 31 + char.charCodeAt(0)
  }, 0)
}
