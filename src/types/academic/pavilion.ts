import { User } from '../user'

export class Pavilion {
  id: string
  name: string
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Pavilion) {
    this.id = data.id
    this.name = data.name
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.creator) {
      this.creator = new User(data.creator)
    }

    if (data.updater) {
      this.updater = new User(data.updater)
    }
  }
}
