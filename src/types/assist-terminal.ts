import { User } from './user'

export class AssistTerminal {
  id: string
  name: string
  databaseName: string
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: AssistTerminal) {
    this.id = data.id
    this.name = data.name
    this.databaseName = data.databaseName
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }
}
