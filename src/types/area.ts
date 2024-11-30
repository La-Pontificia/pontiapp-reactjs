import { AREA_DEVELOPER_ID } from '@/const'
import { User } from './user'

export class Area {
  id: string
  code: string
  name: string
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Area) {
    this.id = data.id
    this.code = data.code
    this.name = data.name
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }

  isDeveloper(): boolean {
    return this.id === AREA_DEVELOPER_ID
  }
}
