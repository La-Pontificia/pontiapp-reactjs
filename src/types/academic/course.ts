import { User } from '../user'

export class Course {
  id: string
  code: string
  name: string
  teoricHours: number
  practiceHours: number
  credits: number
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Course) {
    this.id = data.id
    this.code = data.code
    this.name = data.name
    this.teoricHours = data.teoricHours
    this.practiceHours = data.practiceHours
    this.credits = data.credits
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
