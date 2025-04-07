import { User } from '../user'

export class Area {
  id: string
  name: string
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Area) {
    this.id = data.id
    this.name = data.name
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.creator) this.creator = new User(data.creator)

    if (data.updater) this.updater = new User(data.updater)
  }
}
