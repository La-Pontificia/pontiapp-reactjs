import { User } from './user'

export class RmBranch {
  id: string
  name: string
  address: string | null
  created_at: Date
  updated_at: Date
  creator: User
  updater: User

  constructor(d: RmBranch) {
    this.id = d.id
    this.name = d.name
    this.address = d.address
    this.created_at = d.created_at
    this.updated_at = d.updated_at
    this.creator = d.creator
    this.updater = d.updater
    if (d.creator) this.creator = new User(d.creator)
    if (d.updater) this.updater = new User(d.updater)
  }
}
