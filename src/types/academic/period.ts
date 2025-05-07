import { User } from '../user'
import { Program } from './program'

export class Period {
  id: string
  name: string
  startDate: Date
  endDate: Date
  programId: string
  program: Program
  creatorId: string
  creator: User
  created_at: Date
  updated_at: Date

  constructor(data: Period) {
    this.id = data.id
    this.name = data.name
    this.startDate = data.startDate
    this.endDate = data.endDate
    this.programId = data.programId
    this.program = data.program
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (this.program) this.program = new Program(this.program)
    if (this.creator) this.creator = new User(this.creator)
  }
}
