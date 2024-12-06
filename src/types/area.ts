import { AREA_DEVELOPER_ID } from '@/const'
import { User } from './user'
import { Department } from './department'

export class Area {
  id: string
  codePrefix: string
  name: string
  departments: Department[]
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Area) {
    this.id = data.id
    this.codePrefix = data.codePrefix
    this.name = data.name
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
    this.departments = data.departments
    if (data.departments)
      this.departments = data.departments.map((d) => new Department(d))
  }

  get isDeveloper(): boolean {
    return this.id === AREA_DEVELOPER_ID
  }
}
