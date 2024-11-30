import { PRIVILEGE_DEVELOPER } from '@/const'
import { User } from './user'

export class UserRole {
  id: string
  privileges?: string[] | null
  title: string
  status?: boolean
  level: number

  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: UserRole) {
    this.id = data.id
    this.privileges = data.privileges
    this.title = data.title
    this.status = data.status
    this.level = data.level
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }

  isDeveloper(): boolean {
    return this.privileges?.includes(PRIVILEGE_DEVELOPER) ?? false
  }
}
