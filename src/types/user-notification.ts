import { User } from './user'

export class UserNotification {
  id: string
  description: string
  URL?: string
  read?: Date
  to?: User
  creator?: User
  created_at?: Date
  updated_at?: Date

  constructor(data: UserNotification) {
    this.id = data.id
    this.description = data.description
    this.URL = data.URL
    this.read = data.read
    this.to = data.to
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.to) this.to = new User(data.to)
    if (data.creator) this.creator = new User(data.creator)
  }
}
