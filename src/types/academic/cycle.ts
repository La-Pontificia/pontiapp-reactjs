import { User } from '../user'
import { Program } from './program'

export class Cycle {
  id: string
  code: string
  name: string
  program: Program
  created_at?: Date
  updated_at?: Date
  creator?: User
  updater?: User

  constructor(data: Cycle) {
    this.id = data.id
    this.code = data.code
    this.name = data.name
    this.program = data.program
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.creator = data.creator
    this.updater = data.updater

    if (data.program) this.program = new Program(data.program)

    if (data.creator) this.creator = new User(data.creator)

    if (data.updater) this.updater = new User(data.updater)
  }
}
