import dayjs from 'dayjs'
import 'dayjs/locale/es'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const format = (date: any, format: string): string => {
  const newDate = new Date(date)
  return dayjs(newDate).locale('es').format(format)
}
