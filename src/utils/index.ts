import { ERRORS } from '@/const/errors'

import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAuthError = (error: any) => {
  return ERRORS[error as keyof typeof ERRORS]
}
