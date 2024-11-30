import { DEPARTMENT_DEVELOPER_ID } from '@/const'
import { Area } from './area'
import { User } from './user'

export class Department {
  id: string
  code: string
  name: string
  areaId: string
  area: Area
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Department) {
    this.id = data.id
    this.code = data.code
    this.name = data.name
    this.areaId = data.areaId
    this.area = data.area
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }
  isDeveloper(): boolean {
    return this.id === DEPARTMENT_DEVELOPER_ID
  }
}
