import { ROLE_DEVELOPER_ID } from '@/const'
import { Department } from './department'
import { Job } from './job'
import { User } from './user'

export class Role {
  id: string
  name: string
  jobId: string
  departmentId: string
  code: string
  job: Job
  department: Department

  created_at?: Date
  updated_at?: Date
  createdBy?: string
  updatedBy?: string
  createdUser?: User
  updatedUser?: User

  constructor(data: Role) {
    this.id = data.id
    this.name = data.name
    this.jobId = data.jobId
    this.departmentId = data.departmentId
    this.code = data.code
    this.job = data.job
    this.department = data.department

    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.createdBy = data.createdBy
    this.updatedBy = data.updatedBy
    this.createdUser = data.createdUser
    this.updatedUser = data.updatedUser
  }

  isDeveloper(): boolean {
    return this.id === ROLE_DEVELOPER_ID
  }
}
