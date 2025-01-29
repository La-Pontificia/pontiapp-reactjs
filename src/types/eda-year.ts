import { User } from './user'

export class EdaYear {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  creator: User
  updater: User

  constructor(data: EdaYear) {
    this.id = data.id
    this.name = data.name
    this.status = data.status
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
