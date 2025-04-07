/* eslint-disable @typescript-eslint/no-explicit-any */
import { Time } from '~/types'
import relativeTime from 'dayjs/plugin/relativeTime'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export { dayjs }
export const parse = (date: any, format?: string): Date => {
  return dayjs(date, format).toDate()
}

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

export const countRangeMinutes = (start: any, end: any): string => {
  const startDate = new Date(start)
  const endDate = new Date(end)

  startDate.setDate(new Date('01-01-2000').getDate())
  endDate.setDate(new Date('01-01-2000').getDate())

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

export function timeAgoShort(d: any): string {
  const date = new Date(d)
  const now = dayjs()
  const targetDate = dayjs(date)
  const diffInSeconds = now.diff(targetDate, 'second')

  if (diffInSeconds < 60)
    return `${diffInSeconds} segundo${diffInSeconds > 1 ? 's' : ''}`
  const diffInMinutes = now.diff(targetDate, 'minute')
  if (diffInMinutes < 60)
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  const diffInHours = now.diff(targetDate, 'hour')
  if (diffInHours < 24)
    return `${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  const diffInDays = now.diff(targetDate, 'day')
  if (diffInDays < 7) return `${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  const diffInWeeks = now.diff(targetDate, 'week')
  if (diffInWeeks < 4)
    return `${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`
  const diffInMonths = now.diff(targetDate, 'month')
  if (diffInMonths < 12)
    return `${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`
  const diffInYears = now.diff(targetDate, 'year')
  return `${diffInYears} año${diffInYears > 1 ? 's' : ''}`
}

export const concatDateWithTime = (date: Date, time: Date): Date => {
  const d = parse(date)
  const t = parse(time)
  d.setHours(t.getHours())
  d.setMinutes(t.getMinutes())
  d.setSeconds(t.getSeconds())
  return d
}

export const getDays = (daysOfWeek: string[]): string => {
  const daysMap: Record<string, string> = {
    '1': 'Lunes',
    '2': 'Martes',
    '3': 'Miércoles',
    '4': 'Jueves',
    '5': 'Viernes',
    '6': 'Sábado',
    '7': 'Domingo'
  }

  return daysOfWeek
    .map((day) => daysMap[day])
    .filter((day): day is string => Boolean(day))
    .join(', ')
}
