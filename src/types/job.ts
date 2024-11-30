import { JOB_DEVELOPER_ID } from '@/const'
import { User } from './user'

export class Job {
  id: string
  level: number
  name: string
  code: string
  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Job) {
    this.id = data.id
    this.level = data.level
    this.name = data.name
    this.code = data.code
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }

  isDeveloper(): boolean {
    return this.id === JOB_DEVELOPER_ID
  }
}
