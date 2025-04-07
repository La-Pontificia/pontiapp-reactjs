import { User } from '../user'
import { Pavilion } from './pavilion'

export class Classroom {
  id: string
  code: string
  type: string
  floor: number
  capacity: number
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
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

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
