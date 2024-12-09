import { User } from './user'

export class Event {
  id: string
  name: string
  description: string
  date: Date
  recordsCount: number
  created_at: Date
  updated_at: Date
  creator: User
  updater: User
  constructor(data: Event) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.date = data.date
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater
    this.recordsCount = data.recordsCount

    if (data.creator) this.creator = new User(data.creator)
    if (data.updater) this.updater = new User(data.updater)
  }
}
