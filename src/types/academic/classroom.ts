import { User } from '../user'
import { ClassType } from './class-type'
import { Pavilion } from './pavilion'

export class Classroom {
  id: string
  code: string
  floor: number
  capacity: number
  pontisisCode?: string
  type?: ClassType
  pavilion: Pavilion
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Classroom) {
    this.id = data.id
    this.code = data.code
    this.type = data.type
    this.floor = data.floor
    this.capacity = data.capacity
    this.pavilion = data.pavilion
    this.pontisisCode = data.pontisisCode
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.type) {
      this.type = new ClassType(data.type)
    }

    if (data.pavilion) {
      this.pavilion = new Pavilion(data.pavilion)
    }

    if (data.creator) {
      this.creator = new User(data.creator)
    }

    if (data.updater) {
      this.updater = new User(data.updater)
    }
  }
}
