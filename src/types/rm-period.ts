import { RmAcademicProgram } from './rm-academic-program'
import { User } from './user'

export class RmPeriod {
  id: string
  name: string
  academicProgramId: string
  academicProgram: RmAcademicProgram
  creatorId: string
  creator: User
  created_at: Date
  updated_at: Date

  constructor(data: RmPeriod) {
    this.id = data.id
    this.name = data.name
    this.academicProgramId = data.academicProgramId
    this.academicProgram = data.academicProgram
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (this.academicProgram)
      this.academicProgram = new RmAcademicProgram(this.academicProgram)

    if (this.creator) this.creator = new User(this.creator)
  }
}
