/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERRORS } from '@/const/errors'
import { BIRTHDAY_MESSAGE, days } from '@/const/index'

import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parse } from '@/lib/dayjs'
import { VITE_DOWNLOAD_HOST } from '@/config/env'

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
  // const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)$/i
  const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(?:[AaPp]\.?[Mm]\.?)$/
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

export function capitalizeText(text: string) {
  if (text.split(' ').length === 1) return text
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const linkDownloadReport = (id: string) => {
  return `${VITE_DOWNLOAD_HOST}/reports/${id}`
}

export const getDaysShort = (array: string[] = []) =>
  array!
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((d) => days[d as keyof typeof days].short)
    .join(', ')

export const getDays = (array: string[] = []) =>
  array!
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((d) => days[d as keyof typeof days].label)
    .join(', ')
