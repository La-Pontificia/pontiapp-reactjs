import { User } from '../user'

export class ClassType {
  id: string
  name: string
  pontisisCode?: string
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: ClassType) {
    this.id = data.id
    this.name = data.name
    this.pontisisCode = data.pontisisCode
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
