import { User } from './user'

export class ContractType {
  id: string
  created_at?: Date
  updated_at?: Date
  name: string
  description?: null
  usersCount?: number
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: ContractType) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.usersCount = data.usersCount

    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }
}
