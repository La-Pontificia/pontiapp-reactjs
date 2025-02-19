import { BusinessUnit } from './business-unit'
import { RmBusinessUnit } from './rm-business-unit'
import { User } from './user'

export class RmAcademicProgram {
  id: string
  name: string
  businessUnitId: string
  businessUnit: RmBusinessUnit
  creatorId: string
  creator: User
  created_at: Date
  updated_at: Date

  constructor(data: RmAcademicProgram) {
    this.id = data.id
    this.name = data.name
    this.businessUnitId = data.businessUnitId
    this.businessUnit = data.businessUnit
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (this.businessUnit)
      this.businessUnit = new BusinessUnit(this.businessUnit)

    if (this.creator) this.creator = new User(this.creator)
  }
}
