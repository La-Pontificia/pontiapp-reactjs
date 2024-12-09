/* eslint-disable @typescript-eslint/no-explicit-any */
import { Time } from '@/types'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.extend(relativeTime)

export const format = (date: any, format?: string): string => {
  if (!format) {
    return dayjs(date).locale('es').format()
  }
  return dayjs(date).locale('es').format(format)
}

export const timeAgo = (date: any): string => {
  const newDate = new Date(date)
  return dayjs(newDate).locale('es').fromNow()
}

export const formatTime = (time: any, format?: string): string => {
  const newDate = new Date()
  const [hours, minutes] = time.split(':')

  newDate.setHours(hours)
  newDate.setMinutes(minutes)

  if (!format) {
    return dayjs(newDate).locale('es').format()
  }
  return dayjs(newDate).locale('es').format(format)
}

export const countRangeMinutes = (start: Time, end: Time): string => {
  const startDate = new Date()
  const endDate = new Date()
  const [startHours, startMinutes] = start.split(':')
  const [endHours, endMinutes] = end.split(':')

  startDate.setHours(Number(startHours), Number(startMinutes), 0, 0)
  endDate.setHours(Number(endHours), Number(endMinutes), 0, 0)

  const diff = endDate.getTime() - startDate.getTime()

  if (diff < 0) {
    return 'El rango no es válido'
  }

  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  const hoursText =
    hours > 0 ? `${hours} ${hours === 1 ? 'hora' : 'horas'}` : ''
  const minutesText =
    remainingMinutes > 0
      ? `${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`
      : ''

  return [hoursText, minutesText].filter(Boolean).join(' y ')
}

export const createDateByTime = (time: Time): Date => {
  const newDate = new Date()
  const [hours, minutes, seconds] = time.split(':')

  newDate.setHours(Number(hours))
  newDate.setMinutes(Number(minutes))
  newDate.setSeconds(Number(seconds))

  return newDate
}
