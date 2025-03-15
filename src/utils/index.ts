/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERRORS } from '~/const/errors'
import { BIRTHDAY_MESSAGE } from '~/const/index'

import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parse } from '~/lib/dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleAuthError = (error: any) => {
  const message = ERRORS[error as keyof typeof ERRORS]
  return message || error
}

export const handleError = (error: any) => {
  const message = ERRORS[error as keyof typeof ERRORS]
  return message || (typeof error === 'string' ? error : JSON.stringify(error))
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

export const parseTime = (time: string): Date | null => {
  const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i
  const match = time.trim().match(timeRegex)

  if (!match) return null

  const [, hours, minutes, period] = match
  let parsedHours = parseInt(hours, 10)

  if (period.toUpperCase() === 'PM' && parsedHours !== 12) {
    parsedHours += 12
  } else if (period.toUpperCase() === 'AM' && parsedHours === 12) {
    parsedHours = 0
  }

  const date = new Date()

  date.setHours(parsedHours)
  date.setMinutes(parseInt(minutes, 10))
  date.setSeconds(0)
  date.setMilliseconds(0)

  return parse(date)
}
