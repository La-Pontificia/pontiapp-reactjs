import { DEPARTMENT_DEVELOPER_ID } from '@/const'
import { Area } from './area'
import { User } from './user'
import { Role } from './role'

export class Department {
  id: string
  codePrefix: string
  name: string
  areaId: string
  area: Area
  roles: Role[]
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Department) {
    this.id = data.id
    this.codePrefix = data.codePrefix
    this.name = data.name
    this.areaId = data.areaId
    this.area = data.area
    this.roles = data.roles
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser

    if (data.area) this.area = new Area(data.area)
    if (data.roles) this.roles = data.roles.map((r) => new Role(r))
  }
  get isDeveloper(): boolean {
    return this.id === DEPARTMENT_DEVELOPER_ID
  }
}
